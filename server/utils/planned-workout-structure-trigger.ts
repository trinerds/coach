import { generateStructuredWorkoutTask } from '../../trigger/generate-structured-workout'
import { publishTaskRunStartedEvent } from './task-run-events'
import { structureGenerationRunTags, type StructureRunSource } from './trigger-run-tags'
import type { WorkoutTargetingOverride } from '../../trigger/utils/workout-targeting'
import { prisma } from './db'

export type StructureGenerationStatus = 'queued' | 'skipped' | 'failed' | 'exists'

export type StructureEnqueueResult =
  { status: 'queued'; runId: string } | { status: 'failed'; error: string }

function formatTriggerError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return 'Failed to start structure generation'
}

export async function enqueuePlannedWorkoutStructureGeneration(options: {
  userId: string
  plannedWorkoutId: string
  targetingOverride?: WorkoutTargetingOverride | null
  source?: StructureRunSource
}): Promise<StructureEnqueueResult> {
  const { userId, plannedWorkoutId, targetingOverride = null, source = 'chat' } = options

  try {
    const workout = await prisma.plannedWorkout.update({
      where: { id: plannedWorkoutId },
      data: { generationRevision: { increment: 1 } },
      select: { generationRevision: true }
    })
    const tags = structureGenerationRunTags({
      userId,
      plannedWorkoutId,
      source
    })
    const handle = await generateStructuredWorkoutTask.trigger(
      {
        plannedWorkoutId,
        targetingOverride,
        generationRevision: workout.generationRevision
      },
      {
        tags,
        concurrencyKey: userId
      }
    )
    await publishTaskRunStartedEvent(userId, 'generate-structured-workout', handle, { tags })
    return { status: 'queued', runId: handle.id }
  } catch (error) {
    console.error('Failed to trigger structured workout generation:', error)
    return { status: 'failed', error: formatTriggerError(error) }
  }
}

export function buildStructureGenerationMessage(options: {
  outcome: 'created' | 'already_exists'
  requested: boolean
  status: StructureGenerationStatus
}): string {
  const { outcome, requested, status } = options

  if (!requested) {
    return outcome === 'created' ? 'Planned workout created.' : 'Planned workout already exists.'
  }

  if (status === 'queued') {
    return outcome === 'created'
      ? 'Planned workout created and structured generation started.'
      : 'Planned workout already exists; structure generation started.'
  }

  if (status === 'exists') {
    return outcome === 'created'
      ? 'Planned workout created with existing structure.'
      : 'Planned workout already exists with structure.'
  }

  if (status === 'failed') {
    return outcome === 'created'
      ? 'Planned workout created, but structure generation failed to start.'
      : 'Planned workout already exists, but structure generation failed to start.'
  }

  return outcome === 'created' ? 'Planned workout created.' : 'Planned workout already exists.'
}
