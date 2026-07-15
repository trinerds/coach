import { auditLogRepository } from './repositories/auditLogRepository'
import { prisma } from './db'

export type OnboardingRestartMode = 'auto' | 'full'

export async function restartOnboarding(userId: string, mode: OnboardingRestartMode = 'auto') {
  await prisma.auditLog.deleteMany({
    where: {
      userId,
      action: 'FIRST_VALUE_VIEWED'
    }
  })

  await auditLogRepository.log({
    userId,
    action: 'ONBOARDING_RESTARTED',
    metadata: {
      mode,
      source: 'restart_url'
    }
  })

  return { success: true as const, mode }
}

export async function getActiveOnboardingRestart(userId: string) {
  return prisma.auditLog.findFirst({
    where: {
      userId,
      action: 'ONBOARDING_RESTARTED'
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      metadata: true
    }
  })
}

export async function hasFirstValueViewedSinceRestart(
  userId: string,
  restartCreatedAt: Date | null | undefined
) {
  const firstValueLog = await prisma.auditLog.findFirst({
    where: {
      userId,
      action: 'FIRST_VALUE_VIEWED',
      ...(restartCreatedAt ? { createdAt: { gt: restartCreatedAt } } : {})
    },
    select: { id: true }
  })

  return Boolean(firstValueLog)
}
