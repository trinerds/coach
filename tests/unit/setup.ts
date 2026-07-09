import { vi } from 'vitest'

class MockPool {
  query = vi.fn().mockResolvedValue({ rows: [] })
  connect = vi.fn().mockResolvedValue({ release: vi.fn() })
  end = vi.fn().mockResolvedValue(undefined)
  on = vi.fn().mockReturnThis()
}

class MockClient {
  query = vi.fn().mockResolvedValue({ rows: [] })
  connect = vi.fn().mockResolvedValue(undefined)
  end = vi.fn().mockResolvedValue(undefined)
  on = vi.fn().mockReturnThis()
}

function MockPrismaPg(_pool: unknown) {}

function MockPrismaClient(_options?: unknown) {}

vi.mock('pg', () => ({
  default: { Pool: MockPool, Client: MockClient },
  Pool: MockPool,
  Client: MockClient
}))

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: MockPrismaPg
}))

vi.mock('@prisma/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@prisma/client')>()
  return {
    ...actual,
    PrismaClient: MockPrismaClient
  }
})
