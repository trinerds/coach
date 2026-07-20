import { prisma } from '../../../../utils/db'
import { requireAuth } from '../../../../utils/auth-guard'
import { getUserNutritionSettings } from '../../../../utils/nutrition/settings'
import { calculateFuelingStrategy } from '../../../../utils/nutrition-domain'
import { buildZonedDateTimeFromUtcDate, getUserTimezone } from '../../../../utils/date'
import { bodyMetricResolver } from '../../../../utils/services/bodyMetricResolver'

defineRouteMeta({
  openAPI: {
    tags: ['Planned Workouts'],
    summary: 'Get planned workout fueling prep',
    description: 'Returns a fueling plan for a planned workout. Bearer `nutrition:read`.',
    security: [{ bearerAuth: [] }]
  }
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event, ['nutrition:read'])

  const workoutId = getRouterParam(event, 'id')
  if (!workoutId) {
    throw createError({ statusCode: 400, message: 'Workout ID is required' })
  }

  const userId = user.id
  const workout = await prisma.plannedWorkout.findFirst({
    where: {
      id: workoutId,
      userId
    }
  })

  if (!workout) {
    throw createError({ statusCode: 404, message: 'Planned workout not found' })
  }

  const [dbUser, timezone] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { weight: true, weightSourceMode: true, ftp: true, nutritionTrackingEnabled: true }
    }),
    getUserTimezone(userId)
  ])

  if ((dbUser?.nutritionTrackingEnabled ?? true) === false) {
    return {
      workoutId,
      fuelingPlan: null
    }
  }
  const settings = await getUserNutritionSettings(userId)
  const effectiveWeight = await bodyMetricResolver.resolveEffectiveWeight(userId, {
    weight: dbUser?.weight,
    weightSourceMode: dbUser?.weightSourceMode
  })

  const profile = {
    weight: effectiveWeight.value || 75,
    ftp: dbUser?.ftp || 250,
    currentCarbMax: settings.currentCarbMax,
    sodiumTarget: settings.sodiumTarget,
    sweatRate: settings.sweatRate ?? undefined,
    preWorkoutWindow: settings.preWorkoutWindow,
    postWorkoutWindow: settings.postWorkoutWindow,
    fuelingSensitivity: settings.fuelingSensitivity,
    fuelState1Trigger: settings.fuelState1Trigger,
    fuelState1Min: settings.fuelState1Min,
    fuelState1Max: settings.fuelState1Max,
    fuelState2Trigger: settings.fuelState2Trigger,
    fuelState2Min: settings.fuelState2Min,
    fuelState2Max: settings.fuelState2Max,
    fuelState3Min: settings.fuelState3Min,
    fuelState3Max: settings.fuelState3Max,
    bmr: settings.bmr ?? 1600,
    activityLevel: settings.activityLevel || 'ACTIVE',
    baseCaloriesMode: (settings.baseCaloriesMode === 'MANUAL_NON_EXERCISE'
      ? 'MANUAL_NON_EXERCISE'
      : 'AUTO') as 'AUTO' | 'MANUAL_NON_EXERCISE',
    nonExerciseBaseCalories: settings.nonExerciseBaseCalories ?? undefined,
    targetAdjustmentPercent: settings.targetAdjustmentPercent ?? 0
  }

  let startTimeDate: Date | null = null
  if (
    workout.startTime &&
    typeof workout.startTime === 'string' &&
    workout.startTime.includes(':')
  ) {
    startTimeDate = buildZonedDateTimeFromUtcDate(workout.date, workout.startTime, timezone, 10, 0)
  }

  const context = {
    ...workout,
    startTime: startTimeDate,
    durationHours: (workout.durationSec || 0) / 3600,
    intensity: workout.workIntensity || 0.5,
    strategyOverride: workout.fuelingStrategy || undefined
  }

  const fuelingPlan = calculateFuelingStrategy(profile, context as any)

  return {
    workoutId,
    fuelingPlan
  }
})
