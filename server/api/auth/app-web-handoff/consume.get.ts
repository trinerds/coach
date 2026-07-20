import { setCookie, sendRedirect } from 'h3'
import {
  consumeAppWebHandoff,
  createWebSessionForUser,
  isHttpsRequest,
  sanitizeReturnTo,
  sessionCookieName,
  siteOriginForEvent
} from '../../../utils/app-web-handoff'

defineRouteMeta({
  openAPI: {
    tags: ['Auth'],
    summary: 'Consume app→web session handoff',
    description:
      'Validates a one-time handoff code, creates an Auth.js session cookie, and redirects to returnTo.',
    responses: {
      302: {
        description: 'Redirect to returnTo with session cookie, or to login on invalid/expired code'
      }
    }
  }
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = typeof query.code === 'string' ? query.code : ''
  const returnTo = sanitizeReturnTo(query.returnTo)
  const origin = siteOriginForEvent(event)
  const loginUrl = `${origin}/login?callbackUrl=${encodeURIComponent(returnTo)}`

  try {
    const userId = await consumeAppWebHandoff(code)
    const { sessionToken, expires } = await createWebSessionForUser(userId)
    const secure = isHttpsRequest(event)
    const cookieName = sessionCookieName(secure)

    setCookie(event, cookieName, sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure,
      expires
    })

    return sendRedirect(event, `${origin}${returnTo}`, 302)
  } catch {
    return sendRedirect(event, loginUrl, 302)
  }
})
