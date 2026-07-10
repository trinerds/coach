import { Command } from 'commander'
import chalk from 'chalk'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const backfillStravaStreamsCommand = new Command('strava-streams')

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function parseDateStartUtc(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${value} (expected YYYY-MM-DD)`)
  return date
}

function parseDateEndUtc(value: string): Date {
  const date = new Date(`${value}T23:59:59.999Z`)
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${value} (expected YYYY-MM-DD)`)
  return date
}

backfillStravaStreamsCommand
  .description('Backfill missing Strava activity streams inline (no Trigger.dev jobs)')
  .option('--prod', 'Use production database')
  .option('--dry-run', 'Scan and report only; do not call Strava or write streams', false)
  .option('--user <emailOrId>', 'Filter by user email or UUID')
  .option('--from <date>', 'Start date (YYYY-MM-DD, inclusive)')
  .option('--to <date>', 'End date (YYYY-MM-DD, inclusive)')
  .option('--last-days <number>', 'Look back this many days (mutually exclusive with --from/--to)')
  .option('--limit <number>', 'Max workouts to process')
  .option('--require-hr', 'Only workouts with HR/power summary or has_heartrate flag', false)
  .option('--with-stress-recalc', 'Run TSS/stress recalc after each ingest (slower)', false)
  .option(
    '--requests-per-window <number>',
    'Max Strava stream API calls per user per window (default 90)',
    '90'
  )
  .option('--window-minutes <number>', 'Rate limit window in minutes (default 15)', '15')
  .option('--delay-ms <number>', 'Optional delay between workouts (default 0)', '0')
  .action(async (options) => {
    const isProd = !!options.prod
    const isDryRun = !!options.dryRun
    const requestsPerWindow = Number.parseInt(options.requestsPerWindow, 10)
    const windowMinutes = Number.parseInt(options.windowMinutes, 10)
    const delayMs = Number.parseInt(options.delayMs, 10)
    const limit = options.limit ? Number.parseInt(options.limit, 10) : undefined

    if (!Number.isFinite(requestsPerWindow) || requestsPerWindow <= 0) {
      console.error(chalk.red('Invalid --requests-per-window value.'))
      process.exit(1)
    }

    if (!Number.isFinite(windowMinutes) || windowMinutes <= 0) {
      console.error(chalk.red('Invalid --window-minutes value.'))
      process.exit(1)
    }

    if (!Number.isFinite(delayMs) || delayMs < 0) {
      console.error(chalk.red('Invalid --delay-ms value.'))
      process.exit(1)
    }

    if (options.limit && (!Number.isFinite(limit!) || limit! <= 0)) {
      console.error(chalk.red('Invalid --limit value.'))
      process.exit(1)
    }

    if (options.lastDays && (options.from || options.to)) {
      console.error(chalk.red('Use either --last-days or --from/--to, not both.'))
      process.exit(1)
    }

    const connectionString = isProd ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL
    if (!connectionString) {
      console.error(
        chalk.red(isProd ? 'DATABASE_URL_PROD is not defined.' : 'DATABASE_URL is not defined.')
      )
      process.exit(1)
    }

    if (isProd) {
      console.log(chalk.yellow('⚠️  Using PRODUCTION database.'))
    } else {
      console.log(chalk.blue('Using DEVELOPMENT database.'))
    }

    if (isDryRun) {
      console.log(chalk.cyan('🔍 DRY RUN mode enabled. No Strava calls or DB writes.'))
    }

    process.env.DATABASE_URL = connectionString

    const pool = new pg.Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })
    globalThis.prismaGlobalV2 = prisma

    try {
      let fromDate: Date | undefined
      let toDate: Date | undefined

      if (options.lastDays) {
        const days = Number.parseInt(options.lastDays, 10)
        if (!Number.isFinite(days) || days <= 0) {
          console.error(chalk.red('Invalid --last-days value.'))
          process.exit(1)
        }
        toDate = new Date()
        fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      } else {
        if (options.from) fromDate = parseDateStartUtc(options.from)
        if (options.to) toDate = parseDateEndUtc(options.to)
      }

      if (fromDate && toDate && fromDate > toDate) {
        console.error(chalk.red('--from cannot be after --to.'))
        process.exit(1)
      }

      let userId: string | undefined
      if (options.user) {
        const user = isUuid(options.user)
          ? await prisma.user.findUnique({
              where: { id: options.user },
              select: { id: true, email: true }
            })
          : await prisma.user.findUnique({
              where: { email: options.user },
              select: { id: true, email: true }
            })

        if (!user) {
          console.error(chalk.red(`User not found: ${options.user}`))
          process.exit(1)
        }

        userId = user.id
        console.log(chalk.gray(`User filter: ${user.email} (${user.id})`))
      }

      const { runStravaStreamBackfill } = await import('../../scripts/lib/backfill-strava-streams')

      const startedAt = Date.now()
      const result = await runStravaStreamBackfill(prisma, {
        dryRun: isDryRun,
        limit,
        lastDays: options.lastDays ? Number.parseInt(options.lastDays, 10) : undefined,
        from: fromDate,
        to: toDate,
        userId,
        requireHrSignal: !!options.requireHr,
        skipStressRecalc: !options.withStressRecalc,
        requestsPerWindow,
        windowMs: windowMinutes * 60 * 1000,
        delayMs,
        onProgress: (event) => {
          if (event.phase === 'scan') {
            console.log(chalk.bold(event.message || `Found ${event.total} workouts`))
            return
          }

          if (event.total > 0 && event.processed % 25 === 0) {
            const pct = Math.round((event.processed / event.total) * 100)
            console.log(chalk.gray(`Progress: ${event.processed}/${event.total} (${pct}%)`))
          }
        }
      })

      const elapsedMin = ((Date.now() - startedAt) / 1000 / 60).toFixed(1)

      console.log(chalk.bold('\nSummary:'))
      console.log(`Scanned: ${result.scanned}`)
      console.log(`Processed: ${result.processed}`)
      console.log(`Ingested: ${chalk.green(result.ingested)}`)
      console.log(`Unavailable (404): ${result.unavailable}`)
      console.log(`Skipped (invalid Strava ID): ${result.skippedInvalidId}`)
      console.log(`Skipped (no Strava integration): ${result.skippedNoIntegration}`)
      console.log(`Failed: ${result.failed > 0 ? chalk.red(result.failed) : result.failed}`)
      console.log(`Elapsed: ${elapsedMin} min`)

      if (result.errors.length > 0) {
        console.log(chalk.yellow('\nErrors (first 10):'))
        for (const error of result.errors.slice(0, 10)) {
          console.log(`- ${error.workoutId} | ${error.title}`)
          console.log(chalk.gray(`  ${error.error}`))
        }
      }

      if (isDryRun && result.scanned > 0) {
        console.log(
          chalk.cyan(
            `\nDry run complete. Re-run without --dry-run to ingest${limit ? ` up to ${limit}` : ''} workouts.`
          )
        )
      }
    } catch (error: any) {
      console.error(chalk.red('Error:'), error?.message || error)
      process.exit(1)
    } finally {
      await prisma.$disconnect()
      await pool.end()
    }
  })

export default backfillStravaStreamsCommand
