import type { SubscriptionTier } from '@prisma/client'

export type ProviderSubscriptionState = {
  provider: 'STRIPE' | 'APPLE' | 'GOOGLE'
  tier: SubscriptionTier
  status:
    | 'ACTIVE'
    | 'CANCELED'
    | 'GRACE_PERIOD'
    | 'BILLING_RETRY'
    | 'PAST_DUE'
    | 'PAUSED'
    | 'PENDING'
    | 'EXPIRED'
    | 'REVOKED'
    | 'UNKNOWN'
  entitlementEnd: Date | null
}

const rank: Record<SubscriptionTier, number> = { FREE: 0, SUPPORTER: 1, PRO: 2 }

/** Prefer the Stripe subscription id so Stripe webhooks and RevenueCat share one row. */
export function pickStripeSubscriptionId(
  ...candidates: Array<string | null | undefined>
): string | null {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.startsWith('sub_')) return candidate
  }
  return null
}

export function providerSubscriptionExternalId(input: {
  userId: string
  provider: 'STRIPE' | 'APPLE' | 'GOOGLE'
  productId: string
  storeTransactionId?: string | null
  stripeSubscriptionId?: string | null
  originalTransactionId?: string | null
  transactionId?: string | null
}): string {
  if (input.provider === 'STRIPE') {
    const stripeId = pickStripeSubscriptionId(
      input.storeTransactionId,
      input.stripeSubscriptionId,
      input.originalTransactionId,
      input.transactionId
    )
    if (stripeId) return stripeId
  }
  return `${input.userId}:${input.provider}:${input.productId}`
}

export function isProviderSubscriptionEntitled(
  subscription: ProviderSubscriptionState,
  now = new Date()
): boolean {
  if (subscription.status === 'REVOKED' || subscription.status === 'EXPIRED') return false
  if (subscription.status === 'ACTIVE' && !subscription.entitlementEnd) return true
  return Boolean(subscription.entitlementEnd && new Date(subscription.entitlementEnd) > now)
}

export function projectProviderSubscriptions(
  subscriptions: ProviderSubscriptionState[],
  now = new Date()
) {
  const valid = subscriptions.filter((item) => isProviderSubscriptionEntitled(item, now))
  const tier = valid.reduce<SubscriptionTier>(
    (highest, item) => (rank[item.tier] > rank[highest] ? item.tier : highest),
    'FREE'
  )
  return {
    tier,
    valid,
    hasCollision: new Set(valid.map((item) => item.provider)).size > 1
  }
}
