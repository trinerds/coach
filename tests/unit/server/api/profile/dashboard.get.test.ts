import { beforeEach, describe, expect, it, vi } from 'vitest'

import { requireAuth } from '../../../../../server/utils/auth-guard'
import { prisma } from '../../../../../server/utils/db'
import { nutritionRepository } from '../../../../../server/utils/repositories/nutritionRepository'
import { sportSettingsRepository } from '../../../../../server/utils/repositories/sportSettingsRepository'
import { wellnessRepository } from '../../../../../server/utils/repositories/wellnessRepository'
import { workoutRepository } from '../../../../../server/utils/repositories/workoutRepository'
import { bodyMetricResolver } from '../../../../../server/utils/services/bodyMetricResolver'

vi.stubGlobal('defineEventHandler', (fn: any) => fn)
vi.stubGlobal('createError', (error: any) => error)

vi.mock('../../../../../server/utils/auth-guard', () => ({
  requireAuth: vi.fn()
}))

vi.mock('../../../../../server/utils/db', () => ({
  prisma: {
    wellness: { findFirst: vi.fn() },
    dailyMetric: { findFirst: vi.fn() },
    report: { count: vi.fn() },
    integration: { findMany: vi.fn() },
    oAuthConsent: { findMany: vi.fn() },
    workout: { findFirst: vi.fn() }
  }
}))

vi.mock('../../../../../server/utils/repositories/sportSettingsRepository', () => ({
  sportSettingsRepository: { getByUserId: vi.fn() }
}))

vi.mock('../../../../../server/utils/repositories/wellnessRepository', () => ({
  wellnessRepository: { getForUser: vi.fn(), count: vi.fn() }
}))

vi.mock('../../../../../server/utils/repositories/nutritionRepository', () => ({
  nutritionRepository: { count: vi.fn() }
}))

vi.mock('../../../../../server/utils/repositories/workoutRepository', () => ({
  workoutRepository: { count: vi.fn() }
}))

vi.mock('../../../../../server/utils/services/bodyMetricResolver', () => ({
  bodyMetricResolver: { resolveEffectiveWeight: vi.fn() }
}))

vi.mock('../../../../../server/utils/date', () => ({
  formatDateUTC: (date: Date, format: string) => {
    if (format === 'yyyy-MM-dd') return date.toISOString().slice(0, 10)
    return date.toISOString()
  },
  getEndOfDayUTC: vi.fn(() => new Date('2026-07-21T23:59:59.999Z')),
  getUserLocalDate: vi.fn(() => new Date('2026-07-21T00:00:00.000Z')),
  getUserTimezone: vi.fn(async () => 'America/New_York')
}))

vi.mock('../../../../../server/utils/wellness', () => ({
  normalizeStressScore: (value: number | null) => value
}))

const getHandler = async () => {
  const module = await import('../../../../../server/api/profile/dashboard.get')
  return module.default
}

describe('GET /api/profile/dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(requireAuth).mockResolvedValue({
      id: 'athlete-1',
      name: 'Test Athlete',
      country: 'US',
      dob: null,
      weight: 78.2,
      weightUnits: 'Kilograms',
      weightSourceMode: 'AUTO',
      height: null,
      heightUnits: 'Centimeters',
      ftp: 200,
      restingHr: 60,
      maxHr: 190,
      lthr: 170,
      nutritionTrackingEnabled: true,
      language: 'en',
      profileLastUpdated: null
    } as any)
    vi.mocked(sportSettingsRepository.getByUserId).mockResolvedValue([] as any)
    vi.mocked(bodyMetricResolver.resolveEffectiveWeight).mockResolvedValue({
      value: 78.2,
      profileWeight: 78.2,
      latestWellnessWeight: null,
      weightSourceMode: 'AUTO',
      source: { type: 'profile', source: 'profile', label: 'Profile', date: null }
    } as any)
    vi.mocked(wellnessRepository.getForUser).mockResolvedValue([] as any)
    vi.mocked(wellnessRepository.count).mockResolvedValue(2)
    vi.mocked(workoutRepository.count).mockResolvedValue(0)
    vi.mocked(nutritionRepository.count).mockResolvedValue(0)
    vi.mocked(prisma.report.count).mockResolvedValue(0)
    vi.mocked(prisma.integration.findMany).mockResolvedValue([] as any)
    vi.mocked(prisma.oAuthConsent.findMany).mockResolvedValue([] as any)
    vi.mocked(prisma.workout.findFirst).mockResolvedValue(null)
  })

  it('keeps the newest readiness while falling back to the latest sleep-bearing record', async () => {
    const currentWellness = {
      date: new Date('2026-07-21T00:00:00.000Z'),
      restingHr: null,
      hrv: null,
      weight: null,
      bodyFat: null,
      readiness: 9,
      sleepHours: null,
      sleepSecs: null,
      recoveryScore: 90,
      spO2: null,
      respiration: null,
      skinTemp: null,
      vo2max: null,
      sleepDeepSecs: null,
      sleepRemSecs: null,
      sleepLightSecs: null,
      sleepAwakeSecs: null,
      systolic: null,
      diastolic: null,
      fatigue: null,
      stress: null,
      mood: null,
      lastSource: 'intervals'
    }
    const previousSleep = {
      date: new Date('2026-07-20T00:00:00.000Z'),
      sleepHours: 8.4,
      sleepSecs: 30150,
      sleepDeepSecs: 5400,
      sleepRemSecs: 6000,
      sleepLightSecs: 18000,
      sleepAwakeSecs: 750
    }

    vi.mocked(prisma.wellness.findFirst)
      .mockResolvedValueOnce(currentWellness as any)
      .mockResolvedValueOnce(previousSleep as any)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
    vi.mocked(prisma.dailyMetric.findFirst).mockResolvedValueOnce(null).mockResolvedValueOnce(null)

    const handler = await getHandler()
    const result = await handler({} as any)

    expect(result.profile).toEqual(
      expect.objectContaining({
        recentReadiness: 9,
        recentRecoveryScore: 90,
        latestWellnessDate: '2026-07-21T00:00:00.000Z',
        recentSleep: 8.4,
        recentSleepDate: '2026-07-20T00:00:00.000Z',
        recentSleepDeep: 5400,
        recentSleepRem: 6000,
        recentSleepLight: 18000,
        recentSleepAwake: 750
      })
    )
  })
})
