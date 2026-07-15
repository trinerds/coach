import { beforeEach, describe, expect, it, vi } from 'vitest'

const auditLogDeleteMany = vi.fn()
const auditLogFindFirst = vi.fn()
const auditLogCreate = vi.fn()

vi.mock('../../../../server/utils/db', () => ({
  prisma: {
    auditLog: {
      deleteMany: auditLogDeleteMany,
      findFirst: auditLogFindFirst
    }
  }
}))

vi.mock('../../../../server/utils/repositories/auditLogRepository', () => ({
  auditLogRepository: {
    log: auditLogCreate
  }
}))

describe('restartOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auditLogDeleteMany.mockResolvedValue({ count: 1 })
    auditLogCreate.mockResolvedValue({ id: 'log-restart' })
  })

  it('clears first-value completion and records a restart marker', async () => {
    const { restartOnboarding } = await import('../../../../server/utils/onboarding-restart')

    await restartOnboarding('user-1', 'auto')

    expect(auditLogDeleteMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        action: 'FIRST_VALUE_VIEWED'
      }
    })
    expect(auditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        action: 'ONBOARDING_RESTARTED',
        metadata: expect.objectContaining({ mode: 'auto' })
      })
    )
  })
})

describe('hasFirstValueViewedSinceRestart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ignores first-value logs that predate the latest restart', async () => {
    auditLogFindFirst.mockResolvedValue(null)

    const { hasFirstValueViewedSinceRestart } =
      await import('../../../../server/utils/onboarding-restart')

    const result = await hasFirstValueViewedSinceRestart('user-1', new Date('2026-07-15T08:00:00Z'))

    expect(result).toBe(false)
    expect(auditLogFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-1',
          action: 'FIRST_VALUE_VIEWED',
          createdAt: { gt: new Date('2026-07-15T08:00:00Z') }
        })
      })
    )
  })
})
