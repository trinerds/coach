import { requireAuth } from '../../utils/auth-guard'
import { subscriptionSummary } from '../../utils/provider-subscriptions'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event, ['profile:read'])
  return subscriptionSummary(user.id)
})
