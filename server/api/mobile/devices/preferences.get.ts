import { requireAuth } from '../../../utils/auth-guard'
import { getOrCreateMobilePushPreferences } from '../../../utils/mobile-push-preferences'

/**
 * GET /api/mobile/devices/preferences
 *
 * Returns Expo push toggles for the signed-in user (creates defaults if missing).
 * Response shape matches watts-mobile NotificationPreferences.
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event, ['profile:read'])
  return getOrCreateMobilePushPreferences(user.id)
})
