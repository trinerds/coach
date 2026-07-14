import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../../../../server/utils/db'
import { checkQuota, recordQuotaDenial } from '../../../../server/utils/quotas/engine'

vi.mock('../../../../server/utils/db', () => ({
  prisma: {
    user: { findUnique: vi.fn(), create: vi.fn() },
    quotaDenial: { create: vi.fn() },
    $queryRaw: vi.fn()
  }
}))

vi.mock('../../../../server/utils/date', () => ({
  getUserTimezone: vi.fn(),
  getStartOfDayUTC: vi.fn(() => new Date('2026-03-08T00:00:00.000Z')),
  getEndOfDayUTC: vi.fn(() => new Date('2026-03-08T23:59:59.999Z'))
}))

describe('quota engine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws an H3-style 429 error when a strict quota is exceeded', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      subscriptionTier: 'FREE',
      trialEndsAt: null,
      timezone: 'UTC'
    } as any)

    vi.mocked(prisma.$queryRaw).mockResolvedValue([
      {
        count: 3,
        firstUsedAt: new Date('2026-03-01T00:00:00.000Z')
      }
    ] as any)

    vi.mocked(prisma.quotaDenial.create).mockResolvedValue({} as any)

    await expect(checkQuota('user-123', 'wellness_analysis')).rejects.toMatchObject({
      statusCode: 429,
      statusMessage: 'Quota exceeded for wellness_analysis. Upgrade your plan for higher limits.',
      data: {
        operation: 'wellness_analysis',
        quotaExceeded: true
      },
      quotaExceeded: true
    })

    await vi.waitFor(() => {
      expect(prisma.quotaDenial.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          operation: 'wellness_analysis',
          tier: 'FREE',
          limit: 3,
          used: 3
        }
      })
    })
  })

  it('records quota denial without throwing when persistence fails', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      subscriptionTier: 'FREE',
      trialEndsAt: null
    } as any)
    vi.mocked(prisma.quotaDenial.create).mockRejectedValue(new Error('db down'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(
      recordQuotaDenial('user-123', 'daily_checkin', { used: 1, limit: 1 })
    ).resolves.toBeUndefined()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('maps trial users to SUPPORTER tier when recording denials', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      subscriptionTier: 'FREE',
      trialEndsAt: new Date('2099-01-01T00:00:00.000Z')
    } as any)
    vi.mocked(prisma.quotaDenial.create).mockResolvedValue({} as any)

    await recordQuotaDenial('user-123', 'daily_checkin', { used: 2, limit: 2 })

    expect(prisma.quotaDenial.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tier: 'SUPPORTER'
      })
    })
  })
})
