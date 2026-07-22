import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_MOBILE_PUSH_PREFERENCES,
  getOrCreateMobilePushPreferences,
  isMobilePushTypeEnabled,
  toPublicMobilePushPreferences,
  updateMobilePushPreferences
} from '../../../../server/utils/mobile-push-preferences'

const { upsert } = vi.hoisted(() => ({
  upsert: vi.fn()
}))

vi.mock('../../../../server/utils/db', () => ({
  prisma: {
    mobilePushPreference: { upsert }
  }
}))

describe('mobile-push-preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps DB columns to Expo event keys', () => {
    expect(
      toPublicMobilePushPreferences({
        recommendationReady: true,
        workoutAnalysisReady: false,
        syncCompleted: false,
        coachMessage: true
      })
    ).toEqual({
      RECOMMENDATION_READY: true,
      WORKOUT_ANALYSIS_READY: false,
      SYNC_COMPLETED: false,
      COACH_MESSAGE: true
    })
  })

  it('getOrCreate returns public prefs and defaults SYNC_COMPLETED false', async () => {
    upsert.mockResolvedValue({
      userId: 'user-1',
      recommendationReady: true,
      workoutAnalysisReady: true,
      syncCompleted: false,
      coachMessage: true
    })

    const prefs = await getOrCreateMobilePushPreferences('user-1')
    expect(prefs).toEqual(DEFAULT_MOBILE_PUSH_PREFERENCES)
    expect(upsert).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      create: { userId: 'user-1' },
      update: {}
    })
  })

  it('updateMobilePushPreferences patches provided keys', async () => {
    upsert.mockResolvedValue({
      recommendationReady: false,
      workoutAnalysisReady: true,
      syncCompleted: false,
      coachMessage: true
    })

    const prefs = await updateMobilePushPreferences('user-1', {
      RECOMMENDATION_READY: false
    })

    expect(prefs.RECOMMENDATION_READY).toBe(false)
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
        update: { recommendationReady: false }
      })
    )
  })

  it('isMobilePushTypeEnabled reflects stored toggles', async () => {
    upsert.mockResolvedValue({
      recommendationReady: false,
      workoutAnalysisReady: true,
      syncCompleted: false,
      coachMessage: true
    })

    await expect(isMobilePushTypeEnabled('user-1', 'RECOMMENDATION_READY')).resolves.toBe(false)
    await expect(isMobilePushTypeEnabled('user-1', 'WORKOUT_ANALYSIS_READY')).resolves.toBe(true)
  })
})
