import { z } from 'zod/v3'
import { requireAuth } from '../../utils/auth-guard'
import { prisma } from '../../utils/db'
import { updateMobilePushPreferences } from '../../utils/mobile-push-preferences'

/**
 * Register or refresh an Expo push token for the signed-in user.
 *
 * Body:
 *   {
 *     token: string                 // Expo push token (ExponentPushToken[...])
 *     platform: 'ios' | 'android'
 *     appVersion?: string
 *     preferences?: { RECOMMENDATION_READY?, ... }  // optional; also via GET/PUT preferences
 *   }
 *
 * Idempotent upsert on `token`. If the token was previously owned by another
 * user (reinstall / account switch), ownership moves to the current user.
 */
const preferencesSchema = z
  .object({
    RECOMMENDATION_READY: z.boolean().optional(),
    WORKOUT_ANALYSIS_READY: z.boolean().optional(),
    SYNC_COMPLETED: z.boolean().optional(),
    COACH_MESSAGE: z.boolean().optional()
  })
  .optional()

const bodySchema = z.object({
  token: z.string().trim().min(1).max(512),
  platform: z.enum(['ios', 'android']),
  appVersion: z.string().trim().max(64).optional(),
  preferences: preferencesSchema
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event, ['profile:write'])
  const body = bodySchema.parse(await readBody(event))

  const device = await prisma.mobilePushDevice.upsert({
    where: { token: body.token },
    create: {
      userId: user.id,
      token: body.token,
      platform: body.platform,
      appVersion: body.appVersion
    },
    update: {
      userId: user.id,
      platform: body.platform,
      appVersion: body.appVersion ?? null
    }
  })

  if (body.preferences) {
    await updateMobilePushPreferences(user.id, body.preferences)
  }

  return {
    id: device.id,
    token: device.token,
    platform: device.platform,
    appVersion: device.appVersion,
    updatedAt: device.updatedAt.toISOString()
  }
})
