import { describe, expect, it } from 'vitest'
import {
  isProviderSubscriptionEntitled,
  pickStripeSubscriptionId,
  projectProviderSubscriptions,
  providerSubscriptionExternalId
} from '../../../shared/provider-subscriptions'

const now = new Date('2026-07-22T12:00:00Z')

describe('provider subscription projection', () => {
  it('keeps canceled, grace, and billing-retry subscriptions through entitlement end', () => {
    for (const status of ['CANCELED', 'GRACE_PERIOD', 'BILLING_RETRY'] as const) {
      expect(
        isProviderSubscriptionEntitled(
          {
            provider: 'APPLE',
            tier: 'SUPPORTER',
            status,
            entitlementEnd: new Date('2026-07-23T12:00:00Z')
          },
          now
        )
      ).toBe(true)
    }
  })

  it('denies expired and revoked subscriptions', () => {
    expect(
      isProviderSubscriptionEntitled(
        {
          provider: 'GOOGLE',
          tier: 'PRO',
          status: 'EXPIRED',
          entitlementEnd: new Date('2026-08-01')
        },
        now
      )
    ).toBe(false)
    expect(
      isProviderSubscriptionEntitled(
        {
          provider: 'APPLE',
          tier: 'PRO',
          status: 'REVOKED',
          entitlementEnd: null
        },
        now
      )
    ).toBe(false)
  })

  it('grants the highest valid tier and reports provider collision', () => {
    const result = projectProviderSubscriptions(
      [
        { provider: 'STRIPE', tier: 'SUPPORTER', status: 'ACTIVE', entitlementEnd: null },
        { provider: 'APPLE', tier: 'PRO', status: 'ACTIVE', entitlementEnd: new Date('2026-08-01') }
      ],
      now
    )
    expect(result.tier).toBe('PRO')
    expect(result.hasCollision).toBe(true)
  })
})

describe('provider subscription external ids', () => {
  it('prefers Stripe subscription ids over composite RevenueCat keys', () => {
    expect(pickStripeSubscriptionId('txn_1', 'sub_123', 'user:STRIPE:prod')).toBe('sub_123')
    expect(
      providerSubscriptionExternalId({
        userId: 'user-1',
        provider: 'STRIPE',
        productId: 'prod_supporter',
        storeTransactionId: 'sub_abc',
        stripeSubscriptionId: 'sub_legacy'
      })
    ).toBe('sub_abc')
    expect(
      providerSubscriptionExternalId({
        userId: 'user-1',
        provider: 'STRIPE',
        productId: 'prod_supporter',
        stripeSubscriptionId: 'sub_legacy'
      })
    ).toBe('sub_legacy')
  })

  it('falls back to composite ids for Apple/Google and unknown Stripe ids', () => {
    expect(
      providerSubscriptionExternalId({
        userId: 'user-1',
        provider: 'APPLE',
        productId: 'cw_pro_monthly'
      })
    ).toBe('user-1:APPLE:cw_pro_monthly')
    expect(
      providerSubscriptionExternalId({
        userId: 'user-1',
        provider: 'STRIPE',
        productId: 'prod_supporter',
        storeTransactionId: 'in_123'
      })
    ).toBe('user-1:STRIPE:prod_supporter')
  })
})
