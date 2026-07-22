import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.stubGlobal('defineEventHandler', (fn: any) => fn)
vi.stubGlobal('createError', (err: any) => {
  const error = new Error(err.message || err.statusMessage)
  ;(error as any).statusCode = err.statusCode
  return error
})

const readBody = vi.fn()
vi.stubGlobal('readBody', readBody)

const requireAuth = vi.fn()
const getOrCreateMobilePushPreferences = vi.fn()
const updateMobilePushPreferences = vi.fn()

vi.mock('../../../../../server/utils/auth-guard', () => ({
  requireAuth
}))

vi.mock('../../../../../server/utils/mobile-push-preferences', () => ({
  getOrCreateMobilePushPreferences,
  updateMobilePushPreferences
}))

describe('GET/PUT /api/mobile/devices/preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    requireAuth.mockResolvedValue({ id: 'user-1' })
    getOrCreateMobilePushPreferences.mockResolvedValue({
      RECOMMENDATION_READY: true,
      WORKOUT_ANALYSIS_READY: true,
      SYNC_COMPLETED: false,
      COACH_MESSAGE: true
    })
    updateMobilePushPreferences.mockResolvedValue({
      RECOMMENDATION_READY: false,
      WORKOUT_ANALYSIS_READY: true,
      SYNC_COMPLETED: false,
      COACH_MESSAGE: true
    })
  })

  it('GET returns preferences for the authenticated user', async () => {
    const mod = await import('../../../../../server/api/mobile/devices/preferences.get')
    const result = await mod.default({} as any)

    expect(requireAuth).toHaveBeenCalledWith(expect.anything(), ['profile:read'])
    expect(getOrCreateMobilePushPreferences).toHaveBeenCalledWith('user-1')
    expect(result.RECOMMENDATION_READY).toBe(true)
    expect(result.SYNC_COMPLETED).toBe(false)
  })

  it('PUT accepts nested preferences body from mobile', async () => {
    readBody.mockResolvedValue({
      preferences: { RECOMMENDATION_READY: false }
    })

    const mod = await import('../../../../../server/api/mobile/devices/preferences.put')
    const result = await mod.default({} as any)

    expect(requireAuth).toHaveBeenCalledWith(expect.anything(), ['profile:write'])
    expect(updateMobilePushPreferences).toHaveBeenCalledWith('user-1', {
      RECOMMENDATION_READY: false
    })
    expect(result.RECOMMENDATION_READY).toBe(false)
  })

  it('PUT accepts flat preferences body', async () => {
    readBody.mockResolvedValue({ COACH_MESSAGE: false })

    const mod = await import('../../../../../server/api/mobile/devices/preferences.put')
    await mod.default({} as any)

    expect(updateMobilePushPreferences).toHaveBeenCalledWith('user-1', {
      COACH_MESSAGE: false
    })
  })
})
