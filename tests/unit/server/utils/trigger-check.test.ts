import { describe, expect, it } from 'vitest'

import { STALE_TRIGGER_RUN_MS, isRunFresh } from '../../../../server/utils/trigger-check'

describe('trigger-check isRunFresh', () => {
  it('treats runs without timestamps as fresh', () => {
    expect(isRunFresh({})).toBe(true)
  })

  it('treats recent runs as fresh', () => {
    const now = Date.now()
    expect(isRunFresh({ startedAt: new Date(now - 5 * 60 * 1000).toISOString() }, now)).toBe(true)
  })

  it('treats runs older than the stale threshold as not fresh', () => {
    const now = Date.now()
    expect(
      isRunFresh({ createdAt: new Date(now - STALE_TRIGGER_RUN_MS - 1000).toISOString() }, now)
    ).toBe(false)
  })
})
