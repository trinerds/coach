import { randomBytes, randomUUID } from 'node:crypto'
import { createError } from 'h3'
import type { H3Event } from 'h3'
import { prisma } from './db'

export const APP_WEB_HANDOFF_TTL_SECONDS = 60
const IDENTIFIER_PREFIX = 'app-web-handoff:'

/** Accept only same-origin relative paths: `/…`, no schemes, `//`, or `..`. */
export function sanitizeReturnTo(returnTo: unknown, fallback = '/'): string {
  if (typeof returnTo !== 'string' || !returnTo) return fallback
  const trimmed = returnTo.trim()
  if (!trimmed.startsWith('/')) return fallback
  if (trimmed.startsWith('//')) return fallback
  if (trimmed.includes('://')) return fallback
  if (trimmed.split('/').some((segment) => segment === '..')) return fallback
  return trimmed
}

export function handoffIdentifier(userId: string): string {
  return `${IDENTIFIER_PREFIX}${userId}`
}

export function mintHandoffCode(): string {
  return randomBytes(32).toString('base64url')
}

export async function createAppWebHandoff(userId: string): Promise<{
  code: string
  expiresIn: number
}> {
  const identifier = handoffIdentifier(userId)
  const code = mintHandoffCode()
  const expires = new Date(Date.now() + APP_WEB_HANDOFF_TTL_SECONDS * 1000)

  // One outstanding handoff per user — clear prior unused codes.
  await prisma.verificationToken.deleteMany({ where: { identifier } })
  await prisma.verificationToken.create({
    data: { identifier, token: code, expires }
  })

  return { code, expiresIn: APP_WEB_HANDOFF_TTL_SECONDS }
}

export async function consumeAppWebHandoff(code: string): Promise<string> {
  if (!code || typeof code !== 'string') {
    throw createError({ statusCode: 400, message: 'Missing handoff code' })
  }

  const row = await prisma.verificationToken.findFirst({
    where: { token: code, identifier: { startsWith: IDENTIFIER_PREFIX } }
  })

  if (!row) {
    throw createError({ statusCode: 401, message: 'Invalid or expired handoff code' })
  }

  // Delete-then-use so replay fails even if two requests race.
  const deleted = await prisma.verificationToken.deleteMany({
    where: { identifier: row.identifier, token: row.token }
  })
  if (deleted.count === 0) {
    throw createError({ statusCode: 401, message: 'Invalid or expired handoff code' })
  }

  if (row.expires.getTime() < Date.now()) {
    throw createError({ statusCode: 401, message: 'Invalid or expired handoff code' })
  }

  const userId = row.identifier.slice(IDENTIFIER_PREFIX.length)
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Invalid or expired handoff code' })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, deactivatedAt: true }
  })
  if (!user || user.deactivatedAt) {
    throw createError({ statusCode: 401, message: 'Invalid or expired handoff code' })
  }

  return user.id
}

export async function createWebSessionForUser(userId: string): Promise<{
  sessionToken: string
  expires: Date
}> {
  const sessionToken = randomUUID()
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires
    }
  })

  return { sessionToken, expires }
}

export function isHttpsRequest(event: H3Event): boolean {
  const proto = String(event.node.req.headers['x-forwarded-proto'] || getRequestURL(event).protocol)
  return proto.includes('https')
}

export function sessionCookieName(secure: boolean): string {
  return secure ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
}

export function siteOriginForEvent(event: H3Event): string {
  const config = useRuntimeConfig()
  const configured = String(config.public.siteUrl || '').replace(/\/$/, '')
  if (configured) return configured
  const requestUrl = getRequestURL(event)
  return `${requestUrl.protocol}//${requestUrl.host}`
}
