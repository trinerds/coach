import { describe, expect, it } from 'vitest'
import {
  buildOnboardingSteps,
  deriveCurrentStep,
  deriveSignupMethod,
  resolveOnboardingPresentation
} from '../../../shared/onboarding-status'

describe('deriveSignupMethod', () => {
  it('uses the first training signup provider on the account', () => {
    expect(deriveSignupMethod(['google'])).toBe('google')
    expect(deriveSignupMethod(['strava'])).toBe('strava')
    expect(deriveSignupMethod(['intervals', 'google'])).toBe('intervals')
  })
})

describe('buildOnboardingSteps', () => {
  it('activates import after a provider connects', () => {
    const steps = buildOnboardingSteps({
      hasIntegration: true,
      hasUsableData: false,
      hasFirstInsight: false,
      activationComplete: false,
      importState: 'importing'
    })

    expect(steps.find((step) => step.id === 'connect_data')?.status).toBe('complete')
    expect(steps.find((step) => step.id === 'import_data')?.status).toBe('active')
    expect(deriveCurrentStep(steps)).toBe('import_data')
  })

  it('marks all steps complete after activation', () => {
    const steps = buildOnboardingSteps({
      hasIntegration: true,
      hasUsableData: true,
      hasFirstInsight: true,
      activationComplete: true,
      importState: 'ready'
    })

    expect(steps.every((step) => step.status === 'complete')).toBe(true)
  })
})

describe('resolveOnboardingPresentation', () => {
  it('shows the full setup hub only before any connection or data exists', () => {
    expect(
      resolveOnboardingPresentation({
        activationComplete: false,
        hasIntegration: false,
        hasAnyData: false,
        connectLater: false
      })
    ).toEqual({
      activationComplete: false,
      showFullSetupHub: true,
      showCompactSetupCard: false
    })
  })

  it('switches to the compact card after connect later', () => {
    expect(
      resolveOnboardingPresentation({
        activationComplete: false,
        hasIntegration: false,
        hasAnyData: false,
        connectLater: true
      }).showFullSetupHub
    ).toBe(false)
  })
})
