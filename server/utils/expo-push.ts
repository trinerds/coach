import { prisma } from './db'
import { isMobilePushTypeEnabled } from './mobile-push-preferences'

export type ExpoPushEventType =
  'RECOMMENDATION_READY' | 'WORKOUT_ANALYSIS_READY' | 'SYNC_COMPLETED' | 'COACH_MESSAGE'

export type ExpoPushPayload = {
  title: string
  body: string
  type: ExpoPushEventType
  path?: string
  notificationId?: string
  extra?: Record<string, string | number | boolean | null>
}

type ExpoPushTicket = {
  status: 'ok' | 'error'
  id?: string
  message?: string
  details?: { error?: string }
}

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

/**
 * Send an Expo push to all registered devices for a user.
 * Honors server push preferences (issue 365). Best-effort: never throws to
 * callers; logs skips / failures and prunes DeviceNotRegistered tokens.
 */
export async function sendExpoPushToUser(userId: string, payload: ExpoPushPayload): Promise<void> {
  try {
    const enabled = await isMobilePushTypeEnabled(userId, payload.type)
    if (!enabled) {
      console.info(`Expo push skipped for user ${userId}: preference disabled`, {
        type: payload.type,
        reason: 'preference_disabled'
      })
      return
    }

    const devices = await prisma.mobilePushDevice.findMany({
      where: { userId },
      select: { id: true, token: true }
    })

    if (devices.length === 0) {
      return
    }

    const messages = devices.map((device) => ({
      to: device.token,
      sound: 'default' as const,
      title: payload.title,
      body: payload.body,
      data: {
        type: payload.type,
        ...(payload.path ? { path: payload.path } : {}),
        ...(payload.notificationId ? { notificationId: payload.notificationId } : {}),
        ...(payload.extra ?? {})
      }
    }))

    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messages)
    })

    if (!response.ok) {
      console.warn(`Expo push send failed for user ${userId}: HTTP ${response.status}`)
      return
    }

    const json = (await response.json()) as { data?: ExpoPushTicket[] }
    const tickets = json.data ?? []
    const staleTokens: string[] = []

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i]
      if (ticket?.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
        const token = devices[i]?.token
        if (token) staleTokens.push(token)
      }
    }

    if (staleTokens.length > 0) {
      await prisma.mobilePushDevice.deleteMany({
        where: { token: { in: staleTokens } }
      })
    }
  } catch (error) {
    console.warn(`Expo push send failed for user ${userId}:`, error)
  }
}
