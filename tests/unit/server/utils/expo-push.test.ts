import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sendExpoPushToUser } from '../../../../server/utils/expo-push'

const { findMany, deleteMany, isMobilePushTypeEnabled } = vi.hoisted(() => ({
  findMany: vi.fn(),
  deleteMany: vi.fn(),
  isMobilePushTypeEnabled: vi.fn()
}))

vi.mock('../../../../server/utils/db', () => ({
  prisma: {
    mobilePushDevice: { findMany, deleteMany }
  }
}))

vi.mock('../../../../server/utils/mobile-push-preferences', () => ({
  isMobilePushTypeEnabled
}))

describe('sendExpoPushToUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('skips send when preference is disabled', async () => {
    isMobilePushTypeEnabled.mockResolvedValue(false)

    await sendExpoPushToUser('user-1', {
      title: 'Ready',
      body: 'Go',
      type: 'RECOMMENDATION_READY',
      path: '/today'
    })

    expect(findMany).not.toHaveBeenCalled()
    expect(fetch).not.toHaveBeenCalled()
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('preference disabled'),
      expect.objectContaining({ type: 'RECOMMENDATION_READY', reason: 'preference_disabled' })
    )
  })

  it('sends to registered devices when preference is enabled', async () => {
    isMobilePushTypeEnabled.mockResolvedValue(true)
    findMany.mockResolvedValue([{ id: 'd1', token: 'ExponentPushToken[abc]' }])
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ status: 'ok' }] })
    } as Response)

    await sendExpoPushToUser('user-1', {
      title: 'Ready',
      body: 'Go',
      type: 'RECOMMENDATION_READY',
      path: '/today',
      notificationId: 'n1'
    })

    expect(fetch).toHaveBeenCalledWith(
      'https://exp.host/--/api/v2/push/send',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify([
          {
            to: 'ExponentPushToken[abc]',
            sound: 'default',
            title: 'Ready',
            body: 'Go',
            data: {
              type: 'RECOMMENDATION_READY',
              path: '/today',
              notificationId: 'n1'
            }
          }
        ])
      })
    )
  })

  it('prunes DeviceNotRegistered tokens', async () => {
    isMobilePushTypeEnabled.mockResolvedValue(true)
    findMany.mockResolvedValue([
      { id: 'd1', token: 'token-stale' },
      { id: 'd2', token: 'token-ok' }
    ])
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ status: 'error', details: { error: 'DeviceNotRegistered' } }, { status: 'ok' }]
      })
    } as Response)

    await sendExpoPushToUser('user-1', {
      title: 'Ready',
      body: 'Go',
      type: 'COACH_MESSAGE'
    })

    expect(deleteMany).toHaveBeenCalledWith({
      where: { token: { in: ['token-stale'] } }
    })
  })
})
