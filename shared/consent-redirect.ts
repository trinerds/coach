const CONSENT_GATE_EXEMPT_PATHS = ['/onboarding', '/terms', '/privacy', '/join', '/login'] as const

export function buildConsentGateRedirect(targetFullPath: string): string | undefined {
  if (!targetFullPath || targetFullPath.startsWith('/onboarding')) {
    return undefined
  }

  const path = targetFullPath.split('?')[0] ?? targetFullPath
  const isExempt = CONSENT_GATE_EXEMPT_PATHS.some(
    (exempt) => path === exempt || path.startsWith(`${exempt}/`)
  )

  if (isExempt) {
    return undefined
  }

  return targetFullPath
}
