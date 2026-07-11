import { describe, it, expect } from 'vitest'
import { profileUpdateSchema } from '../../../../../server/utils/schemas/profile'

describe('profileUpdateSchema basic settings save payload', () => {
  const typicalProfileFromApi = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    language: 'English',
    uiLanguage: 'en',
    weight: 70,
    weightUnits: 'Kilograms',
    weightSourceMode: 'AUTO',
    effectiveWeight: 70,
    effectiveWeightSource: { label: 'Profile', date: '2026-01-01' },
    height: 180,
    heightUnits: 'cm',
    distanceUnits: 'Kilometers',
    temperatureUnits: 'Celsius',
    visibility: 'Private',
    sex: 'Male',
    dob: '1990-01-01',
    city: 'Berlin',
    state: '',
    country: 'DE',
    timezone: 'Europe/Berlin',
    publicWebsiteUrl: '',
    publicSocialLinks: [],
    accounts: [],
    integrations: [],
    sportSettings: [{ types: ['Ride'], ftp: 250, isDefault: true }],
    personalBests: []
  }

  it('accepts typical BasicSettings payload when publicWebsiteUrl is empty', () => {
    const result = profileUpdateSchema.safeParse(typicalProfileFromApi)
    expect(result.success).toBe(true)
  })

  it('normalizes empty name and NaN weight', () => {
    const result = profileUpdateSchema.safeParse({
      name: '',
      weight: Number.NaN,
      weightUnits: 'Kilograms'
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBeNull()
      expect(result.data.weight).toBeNull()
    }
  })
})
