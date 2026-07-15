import { describe, expect, it } from 'vitest'
import { buildConsentGateRedirect } from '../../../shared/consent-redirect'

describe('buildConsentGateRedirect', () => {
  it('preserves deep links for consent resume', () => {
    expect(buildConsentGateRedirect('/coach/acme/start?resume=1')).toBe(
      '/coach/acme/start?resume=1'
    )
    expect(buildConsentGateRedirect('/dashboard')).toBe('/dashboard')
  })

  it('skips redirect targets that are part of the consent gate itself', () => {
    expect(buildConsentGateRedirect('/onboarding')).toBeUndefined()
    expect(buildConsentGateRedirect('/onboarding?redirect=%2Fdashboard')).toBeUndefined()
    expect(buildConsentGateRedirect('/terms')).toBeUndefined()
    expect(buildConsentGateRedirect('/privacy')).toBeUndefined()
    expect(buildConsentGateRedirect('/join')).toBeUndefined()
    expect(buildConsentGateRedirect('/join?callbackUrl=%2Fdashboard')).toBeUndefined()
    expect(buildConsentGateRedirect('/login?callbackUrl=%2Fdashboard')).toBeUndefined()
  })
})
