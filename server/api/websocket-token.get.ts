import { requireAuth } from '../utils/auth-guard'
import { generateWsToken } from '../utils/ws-auth'

/**
 * Mint a short-lived WebSocket auth token.
 *
 * Supports cookie sessions (web) and OAuth Bearer / API keys (mobile companion)
 * via requireAuth. The returned token is the same HMAC token verifyWsToken accepts
 * on `/api/websocket`.
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const token = generateWsToken(user.id)
  return { token }
})
