import { z } from 'zod/v3'
import { requireAuth } from '../../../utils/auth-guard'
import { updateMobilePushPreferences } from '../../../utils/mobile-push-preferences'

/**
 * PUT /api/mobile/devices/preferences
 *
 * Body (watts-mobile): { preferences: { RECOMMENDATION_READY, ... } }
 * Also accepts a flat preferences object for convenience.
 */
const prefsSchema = z.object({
  RECOMMENDATION_READY: z.boolean().optional(),
  WORKOUT_ANALYSIS_READY: z.boolean().optional(),
  SYNC_COMPLETED: z.boolean().optional(),
  COACH_MESSAGE: z.boolean().optional()
})

const bodySchema = z.union([z.object({ preferences: prefsSchema }), prefsSchema])

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event, ['profile:write'])
  const body = bodySchema.parse(await readBody(event))
  const prefs = 'preferences' in body ? body.preferences : body
  return updateMobilePushPreferences(user.id, prefs)
})
