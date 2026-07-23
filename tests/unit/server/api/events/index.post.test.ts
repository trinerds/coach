import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.stubGlobal('defineEventHandler', (fn: any) => fn)
vi.stubGlobal('defineRouteMeta', () => undefined)
vi.stubGlobal('createError', (err: any) => {
  const error = new Error(err.message || err.statusMessage)
  ;(error as any).statusCode = err.statusCode
  ;(error as any).data = err.data
  return error
})

const readBody = vi.fn()
vi.stubGlobal('readBody', readBody)

const requireAuth = vi.fn()
const create = vi.fn()
const update = vi.fn()
const findFirst = vi.fn()
const syncEventToIntervals = vi.fn()

vi.mock('../../../../../server/utils/auth-guard', () => ({
  requireAuth
}))

vi.mock('../../../../../server/utils/repositories/eventRepository', () => ({
  eventRepository: {
    create,
    update
  }
}))

vi.mock('../../../../../server/utils/intervals-sync', () => ({
  syncEventToIntervals
}))

vi.mock('../../../../../server/utils/db', () => ({
  prisma: {
    integration: {
      findFirst
    }
  }
}))

describe('POST /api/events', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    requireAuth.mockResolvedValue({ id: 'user-1' })
    findFirst.mockResolvedValue(null)
    create.mockResolvedValue({
      id: 'ev-1',
      title: 'Autumn fondo',
      date: new Date('2026-10-15T12:00:00.000Z'),
      syncStatus: 'LOCAL_ONLY'
    })
  })

  it('creates an event with goal:write auth', async () => {
    readBody.mockResolvedValue({
      title: 'Autumn fondo',
      date: '2026-10-15T12:00:00.000Z',
      type: 'Ride',
      priority: 'A'
    })

    const mod = await import('../../../../../server/api/events/index.post')
    const result = await mod.default({} as any)

    expect(requireAuth).toHaveBeenCalledWith(expect.anything(), ['goal:write'])
    expect(create).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        title: 'Autumn fondo',
        type: 'Ride',
        priority: 'A',
        syncStatus: 'LOCAL_ONLY'
      })
    )
    expect(result).toMatchObject({ success: true, event: { id: 'ev-1' } })
  })

  it('rejects invalid input', async () => {
    readBody.mockResolvedValue({ title: '' })

    const mod = await import('../../../../../server/api/events/index.post')
    await expect(mod.default({} as any)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Invalid input'
    })
    expect(create).not.toHaveBeenCalled()
  })
})
