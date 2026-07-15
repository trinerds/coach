import { requireAuth } from '../../utils/auth-guard'
import { resolveOnboardingStatus } from '../../utils/onboarding-status'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = getQuery(event)
  const connectLater = query.connectLater === '1' || query.connectLater === 'true'

  return await resolveOnboardingStatus(user.id, { connectLater })
})
