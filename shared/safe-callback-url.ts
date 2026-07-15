function normalizeCallbackParam(
  callbackUrl: string | string[] | undefined | null
): string | undefined | null {
  if (Array.isArray(callbackUrl)) {
    return callbackUrl[0]
  }

  return callbackUrl
}

export function sanitizeCallbackUrl(
  callbackUrl: string | string[] | undefined | null,
  fallback = '/dashboard'
): string {
  const raw = normalizeCallbackParam(callbackUrl)
  if (!raw) return fallback

  const trimmed = raw.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return fallback
  }

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
    return fallback
  }

  if (trimmed.includes('\\')) {
    return fallback
  }

  return trimmed
}
