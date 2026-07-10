import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getServerSession } from '../../../../../../server/utils/session'
import { prisma } from '../../../../../../server/utils/db'
import { sportSettingsRepository } from '../../../../../../server/utils/repositories/sportSettingsRepository'
import { writeCanonicalPlannedWorkoutStructure } from '../../../../../../server/utils/canonical-planned-workout-write'
import { enqueuePlannedWorkoutStructureGeneration } from '../../../../../../server/utils/planned-workout-structure-trigger'

vi.stubGlobal('defineEventHandler', (fn: any) => fn)
vi.stubGlobal('getRouterParam', (_event: any, name: string) => (_event.params || {})[name])
vi.stubGlobal('readBody', async (event: any) => event.body)
vi.stubGlobal('createError', (err: any) => {
  const error = new Error(err.message)
  ;(error as any).statusCode = err.statusCode
  return error
})

vi.mock('../../../../../../server/utils/session', () => ({
  getServerSession: vi.fn()
}))

vi.mock('../../../../../../server/utils/db', () => ({
  prisma: {
    plannedWorkout: {
      findFirst: vi.fn(),
      update: vi.fn()
    }
  }
}))

vi.mock('../../../../../../server/utils/planned-workout-structure-trigger', () => ({
  enqueuePlannedWorkoutStructureGeneration: vi.fn()
}))

vi.mock('../../../../../../server/utils/repositories/sportSettingsRepository', () => ({
  sportSettingsRepository: {
    getForActivityType: vi.fn()
  }
}))

vi.mock('../../../../../../server/utils/canonical-planned-workout-write', () => ({
  writeCanonicalPlannedWorkoutStructure: vi.fn()
}))

const getHandler = async () =>
  (await import('../../../../../../server/api/workouts/planned/[id]/conflict.post')).default

describe('planned workout conflict resolution', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'user-1' } } as any)
    vi.mocked(sportSettingsRepository.getForActivityType).mockResolvedValue({
      ftp: 250,
      lthr: 170,
      thresholdPace: 2.75,
      targetPolicy: { fallbackOrder: ['pace', 'heartRate', 'power', 'rpe'] }
    } as any)
  })

  it('accepts remote through the canonical write service', async () => {
    const handler = await getHandler()
    vi.mocked(prisma.plannedWorkout.findFirst).mockResolvedValue({
      id: 'pw-1',
      userId: 'user-1',
      type: 'Run',
      durationSec: 3600,
      syncConflict: true,
      pendingRemoteStructuredWorkout: {
        schemaVersion: 1,
        steps: [
          {
            duration: 3600,
            pace: { metric: 'pace', kind: 'zone', zone: 2, rangeMps: { min: 2.2, max: 2.4 } }
          }
        ],
        zoneProfileSnapshot: {
          pace: { unit: 'm/s', ranges: [{ min: 2.2, max: 2.4, name: 'Z2' }], thresholdMps: 2.75 }
        }
      },
      rawJson: {},
      lastRemoteStructureSeenAt: new Date('2026-07-10T12:00:00Z')
    } as any)
    vi.mocked(writeCanonicalPlannedWorkoutStructure).mockResolvedValue({
      workout: { id: 'pw-1' },
      stale: false,
      canonical: {},
      metrics: {}
    } as any)

    const response = await handler({
      params: { id: 'pw-1' },
      body: { resolution: 'accept_remote' }
    })

    expect(writeCanonicalPlannedWorkoutStructure).toHaveBeenCalledWith(
      expect.objectContaining({
        plannedWorkoutId: 'pw-1',
        source: 'INTERVALS_IMPORT'
      })
    )
    expect(response).toMatchObject({ success: true, resolution: 'accept_remote' })
  })

  it('queues regeneration without clearing conflict metadata prematurely', async () => {
    const handler = await getHandler()
    vi.mocked(prisma.plannedWorkout.findFirst).mockResolvedValue({
      id: 'pw-1',
      userId: 'user-1',
      syncConflict: true
    } as any)
    vi.mocked(enqueuePlannedWorkoutStructureGeneration).mockResolvedValue({
      status: 'queued'
    } as any)

    const response = await handler({
      params: { id: 'pw-1' },
      body: { resolution: 'regenerate' }
    })

    expect(enqueuePlannedWorkoutStructureGeneration).toHaveBeenCalled()
    expect(response).toMatchObject({ success: true, resolution: 'regenerate' })
  })

  it('marks keep-local as pending sync and clears pending remote payload', async () => {
    const handler = await getHandler()
    vi.mocked(prisma.plannedWorkout.findFirst).mockResolvedValue({
      id: 'pw-1',
      userId: 'user-1',
      syncConflict: true
    } as any)
    vi.mocked(prisma.plannedWorkout.update).mockResolvedValue({
      id: 'pw-1',
      syncConflict: false
    } as any)

    await handler({
      params: { id: 'pw-1' },
      body: { resolution: 'keep_local' }
    })

    expect(prisma.plannedWorkout.update).toHaveBeenCalledWith({
      where: { id: 'pw-1' },
      data: expect.objectContaining({
        syncConflict: false,
        syncStatus: 'PENDING',
        structureRevision: { increment: 1 }
      })
    })
  })
})
