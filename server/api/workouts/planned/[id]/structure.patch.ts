import { getServerSession } from '../../../../utils/session'
import { prisma } from '../../../../utils/db'
import { WorkoutParser } from '../../../../utils/workout-parser'
import { syncPlannedWorkoutToIntervals } from '../../../../utils/intervals-sync'
import { sportSettingsRepository } from '../../../../utils/repositories/sportSettingsRepository'
import { resolveWorkoutTargeting } from '../../../../../trigger/utils/workout-targeting'
import { normalizeStructuredWorkoutForPersistence } from '../../../../utils/structured-workout-persistence'
import { buildStructurePublishFields } from '../../../../utils/planned-workout-structure-sync'
import { normalizeStructuredStrengthWorkout } from '../../../../utils/strength-exercise-library'
import {
  adaptStructuredWorkout,
  createZoneProfileSnapshot,
  validateStructuredWorkoutLimits
} from '../../../../../shared/structured-workout-contract'
import { serializeCanonicalForIntervals } from '../../../../utils/canonical-workout-serializer'
import { writeCanonicalPlannedWorkoutStructure } from '../../../../utils/canonical-planned-workout-write'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const userId = session.user.id

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Workout ID is required' })
  }

  const body = await readBody(event)
  const {
    text,
    steps: providedSteps,
    exercises: providedExercises,
    blocks: providedBlocks,
    durationSec: providedDurationSec
  } = body

  if (
    typeof text !== 'string' &&
    !Array.isArray(providedSteps) &&
    !Array.isArray(providedExercises) &&
    !Array.isArray(providedBlocks)
  ) {
    throw createError({
      statusCode: 400,
      message: 'Structure text, steps array, exercises array, or blocks array is required'
    })
  }

  // 1. Verify ownership
  const workout = await prisma.plannedWorkout.findUnique({
    where: { id },
    include: {
      user: {
        select: { ftp: true }
      }
    }
  })

  if (!workout) {
    throw createError({ statusCode: 404, message: 'Planned workout not found' })
  }

  if (workout.userId !== userId) {
    throw createError({ statusCode: 403, message: 'Access denied' })
  }

  // 2. Parse text to JSON or use provided steps
  const steps = Array.isArray(providedSteps)
    ? providedSteps
    : typeof text === 'string'
      ? WorkoutParser.parseIntervalsICU(text, { workoutType: workout.type || '' })
      : []
  const rawStrengthStructure =
    Array.isArray(providedExercises) || Array.isArray(providedBlocks)
      ? {
          ...((workout.structuredWorkout as any) || {}),
          ...(Array.isArray(providedBlocks) ? { blocks: providedBlocks } : {}),
          ...(Array.isArray(providedExercises) ? { exercises: providedExercises } : {})
        }
      : null

  const incomingStructure = rawStrengthStructure || { steps }
  const incomingLimitIssues = validateStructuredWorkoutLimits(incomingStructure)
  if (incomingLimitIssues.length > 0) {
    throw createError({
      statusCode: 400,
      message: incomingLimitIssues[0]!.message,
      data: { issues: incomingLimitIssues }
    })
  }

  let normalizedStrengthStructure: any = null
  if (rawStrengthStructure) {
    try {
      normalizedStrengthStructure = normalizeStructuredStrengthWorkout(rawStrengthStructure)
    } catch (error: any) {
      throw createError({
        statusCode: 400,
        message: error?.message || 'Invalid strength exercise payload'
      })
    }
  }

  console.log('[StructurePatch] Received structure payload:', {
    steps: steps.length,
    exercises: Array.isArray(normalizedStrengthStructure?.exercises)
      ? normalizedStrengthStructure.exercises.length
      : 0
  })
  if (steps.length > 0) {
    console.log('[StructurePatch] Sample step metrics:', {
      power: steps[0].power,
      heartRate: steps[0].heartRate,
      pace: steps[0].pace,
      primaryTarget: steps[0].primaryTarget
    })
  }

  const structuredWorkout = {
    ...((workout.structuredWorkout as any) || {}),
    ...(Array.isArray(providedSteps) || typeof text === 'string' ? { steps } : {}),
    ...(normalizedStrengthStructure || {})
  }
  const sportSettings = await sportSettingsRepository.getForActivityType(userId, workout.type || '')
  const { targetPolicy, targetFormatPolicy } = resolveWorkoutTargeting(sportSettings)
  const refs = {
    ftp: Number((workout.user as any)?.ftp || sportSettings?.ftp || 250),
    lthr: Number(sportSettings?.lthr || 0),
    maxHr: Number(sportSettings?.maxHr || 0),
    thresholdPace: Number(sportSettings?.thresholdPace || 0),
    hrZones: Array.isArray(sportSettings?.hrZones) ? sportSettings.hrZones : [],
    powerZones: Array.isArray(sportSettings?.powerZones) ? sportSettings.powerZones : [],
    paceZones: Array.isArray(sportSettings?.paceZones) ? sportSettings.paceZones : []
  }
  const normalized = normalizeStructuredWorkoutForPersistence(structuredWorkout, {
    refs,
    targetPolicy,
    targetFormatPolicy,
    workoutType: workout.type || ''
  })
  const canonical = adaptStructuredWorkout(normalized, {
    source: 'MANUAL_EDIT',
    zoneProfileSnapshot:
      (workout.structuredWorkout as any)?.zoneProfileSnapshot ||
      createZoneProfileSnapshot(sportSettings)
  })
  if (!canonical || canonical.diagnostics?.length) {
    throw createError({
      statusCode: 422,
      message: 'Structure has unresolved targets. Declare target units before saving.',
      data: { diagnostics: canonical?.diagnostics || [] }
    })
  }
  const normalizedLimitIssues = validateStructuredWorkoutLimits(canonical)
  if (normalizedLimitIssues.length > 0) {
    throw createError({
      statusCode: 400,
      message: normalizedLimitIssues[0]!.message,
      data: { issues: normalizedLimitIssues }
    })
  }

  if ((normalized.steps?.length ?? 0) > 0) {
    console.log('[StructurePatch] Normalized sample step metrics:', {
      power: normalized.steps[0].power,
      heartRate: normalized.steps[0].heartRate,
      pace: normalized.steps[0].pace,
      primaryTarget: normalized.steps[0].primaryTarget
    })
  }

  // Publish the same normalized representation we persist. Sending raw editor text
  // here allowed Intervals to execute a different workout from the local renderer.
  const syncText = serializeCanonicalForIntervals({
    title: workout.title,
    description: workout.description || '',
    type: workout.type,
    ftp: (workout.user as any)?.ftp || 250,
    structure: canonical,
    zoneProfileSnapshot: canonical.zoneProfileSnapshot
  })

  // 3. Update DB
  const persisted = await writeCanonicalPlannedWorkoutStructure({
    plannedWorkoutId: id,
    source: 'MANUAL_EDIT',
    structure: canonical,
    zoneProfileSnapshot: canonical.zoneProfileSnapshot,
    syncStatus: workout.syncStatus,
    refs,
    fallbackOrder: targetPolicy.fallbackOrder as Array<'power' | 'heartRate' | 'pace' | 'rpe'>,
    preservePlannedDuration:
      Number.isFinite(Number(providedDurationSec)) && Number(providedDurationSec) > 0
        ? Math.round(Number(providedDurationSec))
        : workout.durationSec
  })
  const updatedWorkout = persisted.workout!

  // 4. If already synced to Intervals, push update
  if (workout.syncStatus === 'SYNCED') {
    // Convert structure back to text to ensure it's clean (or just send the raw text from user)
    // Sending the raw text from user is better as it preserves comments/formatting Intervals might like.
    const syncResult = await syncPlannedWorkoutToIntervals(
      'UPDATE',
      {
        ...updatedWorkout,
        workout_doc: syncText // Preserving user's text exactly for Intervals
      },
      userId
    )

    if (syncResult.synced) {
      await prisma.plannedWorkout.update({
        where: { id },
        data: {
          ...buildStructurePublishFields(updatedWorkout.structuredWorkout),
          syncStatus: 'SYNCED',
          lastSyncedAt: new Date(),
          syncError: null
        }
      })
    }
  }

  return {
    success: true,
    workout: updatedWorkout
  }
})
