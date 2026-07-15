import { requireAuth } from '../../../utils/auth-guard'
import { restartOnboarding, type OnboardingRestartMode } from '../../../utils/onboarding-restart'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = getQuery(event)
  const mode: OnboardingRestartMode = query.full === '1' || query.full === 'true' ? 'full' : 'auto'

  return await restartOnboarding(user.id, mode)
})
