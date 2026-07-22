import { requireAuth } from '../../utils/auth-guard'
import { reconcileRevenueCatSubscriber } from '../../utils/revenuecat'
import { subscriptionSummary } from '../../utils/provider-subscriptions'
import { auditLogRepository } from '../../utils/repositories/auditLogRepository'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event, ['profile:write'])
  await reconcileRevenueCatSubscriber(user.id)
  await auditLogRepository.log({
    userId: user.id,
    action: 'SUBSCRIPTION_FOREGROUND_RECONCILED',
    resourceType: 'SUBSCRIPTION'
  })
  return subscriptionSummary(user.id)
})
