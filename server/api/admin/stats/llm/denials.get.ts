import { defineEventHandler, createError } from 'h3'
import { getServerSession } from '../../../../utils/session'
import { prisma } from '../../../../utils/db'
import { getStartOfDaysAgoUTC } from '../../../../utils/date'
import type { SubscriptionTier } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user?.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const thirtyDaysAgo = getStartOfDaysAgoUTC('UTC', 30)

  const dailyDenialsRaw = await prisma.$queryRaw<
    {
      date: Date
      operation: string
      tier: SubscriptionTier
      count: bigint
    }[]
  >`
    SELECT
      DATE("createdAt") as date,
      operation,
      tier,
      COUNT(*) as count
    FROM "QuotaDenial"
    WHERE "createdAt" >= ${thirtyDaysAgo}
    GROUP BY DATE("createdAt"), operation, tier
    ORDER BY date ASC, operation ASC, tier ASC
  `

  const summaryRaw = await prisma.$queryRaw<
    {
      operation: string
      tier: SubscriptionTier
      total: bigint
      unique_users: bigint
    }[]
  >`
    SELECT
      operation,
      tier,
      COUNT(*) as total,
      COUNT(DISTINCT "userId") as unique_users
    FROM "QuotaDenial"
    WHERE "createdAt" >= ${thirtyDaysAgo}
    GROUP BY operation, tier
    ORDER BY total DESC
  `

  const dailyDenials = dailyDenialsRaw.map((row) => ({
    date: new Date(row.date).toISOString().split('T')[0],
    operation: row.operation,
    tier: row.tier,
    count: Number(row.count)
  }))

  const summary = summaryRaw.map((row) => ({
    operation: row.operation,
    tier: row.tier,
    total: Number(row.total),
    uniqueUsers: Number(row.unique_users)
  }))

  return {
    periodDays: 30,
    summary,
    dailyDenials
  }
})
