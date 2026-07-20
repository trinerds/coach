import { describe, expect, it } from 'vitest'
import { sanitizeReturnTo, sessionCookieName } from '../../../../server/utils/app-web-handoff'

describe('app-web-handoff helpers', () => {
  describe('sanitizeReturnTo', () => {
    it('accepts relative paths', () => {
      expect(sanitizeReturnTo('/')).toBe('/')
      expect(sanitizeReturnTo('/nutrition')).toBe('/nutrition')
      expect(sanitizeReturnTo('/workouts/abc')).toBe('/workouts/abc')
    })

    it('rejects schemes, protocol-relative, and .. segments', () => {
      expect(sanitizeReturnTo('https://evil.example/')).toBe('/')
      expect(sanitizeReturnTo('//evil.example')).toBe('/')
      expect(sanitizeReturnTo('/foo/../bar')).toBe('/')
      expect(sanitizeReturnTo('calendar')).toBe('/')
      expect(sanitizeReturnTo(null)).toBe('/')
    })

    it('honors fallback', () => {
      expect(sanitizeReturnTo('bad', '/settings')).toBe('/settings')
    })
  })

  describe('sessionCookieName', () => {
    it('uses __Secure- prefix on https', () => {
      expect(sessionCookieName(true)).toBe('__Secure-next-auth.session-token')
      expect(sessionCookieName(false)).toBe('next-auth.session-token')
    })
  })
})
