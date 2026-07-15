import { describe, expect, it } from 'vitest'
import { sanitizeCallbackUrl } from '../../../shared/safe-callback-url'

describe('sanitizeCallbackUrl', () => {
  it('uses the first value when redirect is repeated in the query string', () => {
    expect(sanitizeCallbackUrl(['/dashboard', '/settings'])).toBe('/dashboard')
  })

  it('falls back when the callback is missing or unsafe', () => {
    expect(sanitizeCallbackUrl(undefined)).toBe('/dashboard')
    expect(sanitizeCallbackUrl('https://evil.test')).toBe('/dashboard')
  })
})
