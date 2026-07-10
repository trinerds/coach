/**
 * @deprecated Use `coach backfill strava-streams` instead.
 *
 * Inline batch backfill with per-user Strava rate limiting — no Trigger.dev jobs.
 */

import { config } from 'dotenv'

config()

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not defined.')
    process.exit(1)
  }

  process.env.DATABASE_URL = connectionString

  const { PrismaClient } = await import('@prisma/client')
  const { PrismaPg } = await import('@prisma/adapter-pg')
  const pg = await import('pg')

  const pool = new pg.default.Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })
  globalThis.prismaGlobalV2 = prisma

  const { runStravaStreamBackfill } = await import('./lib/backfill-strava-streams')

  console.log('Running inline Strava stream backfill (deprecated script wrapper)\n')
  console.log('Prefer: coach backfill strava-streams [--prod] [--dry-run] [--last-days 30]\n')

  const result = await runStravaStreamBackfill(prisma, {
    skipStressRecalc: true,
    onProgress: (event) => {
      if (event.phase === 'scan') {
        console.log(event.message || `Found ${event.total} workouts`)
      }
    }
  })

  console.log('\nSummary:', result)

  await prisma.$disconnect()
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
