import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.stubGlobal('defineEventHandler', (fn: any) => fn)
vi.stubGlobal('createError', (err: any) => {
  const error = new Error(err.message || err.statusMessage)
  ;(error as any).statusCode = err.statusCode
  return error
})

const readBody = vi.fn()
vi.stubGlobal('readBody', readBody)

const requireAuth = vi.fn()
const userUpdate = vi.fn()
const triggerDeferredProviderIngests = vi.fn()

vi.mock('../../../../../server/utils/auth-guard', () => ({
  requireAuth
}))

vi.mock('../../../../../server/utils/deferred-provider-ingest', () => ({
  triggerDeferredProviderIngests
}))

vi.mock('../../../../../server/utils/db', () => ({
  prisma: {
    user: { update: userUpdate }
  }
}))

describe('POST /api/user/consent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    requireAuth.mockResolvedValue({ id: 'user-1' })
    userUpdate.mockResolvedValue({
      id: 'user-1',
      termsAcceptedAt: new Date('2026-07-08T00:00:00Z')
    })
    triggerDeferredProviderIngests.mockResolvedValue(undefined)
  })

  it('rejects requests without explicit health consent', async () => {
    readBody.mockResolvedValue({
      termsVersion: '1.0',
      privacyPolicyVersion: '1.0'
    })

    const mod = await import('../../../../../server/api/user/consent.post')
    const handler = mod.default

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Health consent is required'
    })
    expect(userUpdate).not.toHaveBeenCalled()
    expect(triggerDeferredProviderIngests).not.toHaveBeenCalled()
  })

  it('rejects outdated policy versions', async () => {
    readBody.mockResolvedValue({
      termsVersion: '0.9',
      privacyPolicyVersion: '1.0',
      healthConsentAccepted: true
    })

    const mod = await import('../../../../../server/api/user/consent.post')
    const handler = mod.default

    await expect(handler({} as any)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Outdated policy version'
    })
    expect(userUpdate).not.toHaveBeenCalled()
    expect(triggerDeferredProviderIngests).not.toHaveBeenCalled()
  })

  it('accepts consent when healthConsentAccepted is true and triggers deferred ingest', async () => {
    readBody.mockResolvedValue({
      termsVersion: '1.0',
      privacyPolicyVersion: '1.0',
      healthConsentAccepted: true
    })

    const mod = await import('../../../../../server/api/user/consent.post')
    const handler = mod.default
    const result = await handler({} as any)

    expect(userUpdate).toHaveBeenCalled()
    expect(triggerDeferredProviderIngests).toHaveBeenCalledWith('user-1')
    expect(result).toMatchObject({ success: true })
  })
})
