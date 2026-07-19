import { describe, expect, it } from 'vitest'
import { normalizeTargetPolicy } from './workout-target-policy'

describe('normalizeTargetPolicy', () => {
  it('defaults strictPrimary to true when not provided', () => {
    const policy = normalizeTargetPolicy({}, 'HR_PACE_POWER')

    expect(policy.strictPrimary).toBe(true)
    expect(policy.primaryMetric).toBe('heartRate')
    expect(policy.fallbackOrder[0]).toBe('heartRate')
  })

  it('defaults to HR-first when load preference is missing', () => {
    const policy = normalizeTargetPolicy({}, null)

    expect(policy.primaryMetric).toBe('heartRate')
    expect(policy.fallbackOrder.slice(0, 3)).toEqual(['heartRate', 'pace', 'power'])
  })

  it('still honors an explicit power-first load preference', () => {
    const policy = normalizeTargetPolicy({}, 'POWER_HR_PACE')

    expect(policy.primaryMetric).toBe('power')
    expect(policy.fallbackOrder[0]).toBe('power')
  })

  it('respects explicit strictPrimary false', () => {
    const policy = normalizeTargetPolicy(
      {
        strictPrimary: false,
        primaryMetric: 'heartRate',
        fallbackOrder: ['heartRate', 'pace', 'power']
      },
      'HR_PACE_POWER'
    )

    expect(policy.strictPrimary).toBe(false)
    expect(policy.primaryMetric).toBe('heartRate')
    expect(policy.fallbackOrder[0]).toBe('heartRate')
  })
})
