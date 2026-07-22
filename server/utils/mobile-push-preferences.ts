import { prisma } from './db'

/** Public API / mobile Settings keys — match ExpoPushEventType. */
export type MobilePushPreferences = {
  RECOMMENDATION_READY: boolean
  WORKOUT_ANALYSIS_READY: boolean
  SYNC_COMPLETED: boolean
  COACH_MESSAGE: boolean
}

export type MobilePushPreferenceKey = keyof MobilePushPreferences

/**
 * Server defaults for new rows.
 * SYNC_COMPLETED is policy-off (issue 367); other types opt-in by default.
 */
export const DEFAULT_MOBILE_PUSH_PREFERENCES: MobilePushPreferences = {
  RECOMMENDATION_READY: true,
  WORKOUT_ANALYSIS_READY: true,
  SYNC_COMPLETED: false,
  COACH_MESSAGE: true
}

type PreferenceRow = {
  recommendationReady: boolean
  workoutAnalysisReady: boolean
  syncCompleted: boolean
  coachMessage: boolean
}

export function toPublicMobilePushPreferences(row: PreferenceRow): MobilePushPreferences {
  return {
    RECOMMENDATION_READY: row.recommendationReady,
    WORKOUT_ANALYSIS_READY: row.workoutAnalysisReady,
    SYNC_COMPLETED: row.syncCompleted,
    COACH_MESSAGE: row.coachMessage
  }
}

function toDbFields(prefs: Partial<MobilePushPreferences>): Partial<PreferenceRow> {
  const data: Partial<PreferenceRow> = {}
  if (prefs.RECOMMENDATION_READY !== undefined) {
    data.recommendationReady = prefs.RECOMMENDATION_READY
  }
  if (prefs.WORKOUT_ANALYSIS_READY !== undefined) {
    data.workoutAnalysisReady = prefs.WORKOUT_ANALYSIS_READY
  }
  if (prefs.SYNC_COMPLETED !== undefined) {
    data.syncCompleted = prefs.SYNC_COMPLETED
  }
  if (prefs.COACH_MESSAGE !== undefined) {
    data.coachMessage = prefs.COACH_MESSAGE
  }
  return data
}

export async function getOrCreateMobilePushPreferences(
  userId: string
): Promise<MobilePushPreferences> {
  const row = await prisma.mobilePushPreference.upsert({
    where: { userId },
    create: { userId },
    update: {}
  })
  return toPublicMobilePushPreferences(row)
}

export async function updateMobilePushPreferences(
  userId: string,
  prefs: Partial<MobilePushPreferences>
): Promise<MobilePushPreferences> {
  const data = toDbFields(prefs)
  const row = await prisma.mobilePushPreference.upsert({
    where: { userId },
    create: {
      userId,
      recommendationReady:
        prefs.RECOMMENDATION_READY ?? DEFAULT_MOBILE_PUSH_PREFERENCES.RECOMMENDATION_READY,
      workoutAnalysisReady:
        prefs.WORKOUT_ANALYSIS_READY ?? DEFAULT_MOBILE_PUSH_PREFERENCES.WORKOUT_ANALYSIS_READY,
      syncCompleted: prefs.SYNC_COMPLETED ?? DEFAULT_MOBILE_PUSH_PREFERENCES.SYNC_COMPLETED,
      coachMessage: prefs.COACH_MESSAGE ?? DEFAULT_MOBILE_PUSH_PREFERENCES.COACH_MESSAGE
    },
    update: data
  })
  return toPublicMobilePushPreferences(row)
}

export async function isMobilePushTypeEnabled(
  userId: string,
  type: MobilePushPreferenceKey
): Promise<boolean> {
  const prefs = await getOrCreateMobilePushPreferences(userId)
  return prefs[type] === true
}
