import { z } from 'zod/v3'
import { requireAuth } from '../../utils/auth-guard'
import { prisma } from '../../utils/db'

/**
 * Unregister an Expo push token for the signed-in user.
 *
 * Body: { token: string }
 *
 * Idempotent: returns success even if the token was already gone or owned by
 * another user (no leak of existence beyond the caller's own rows).
 */
const bodySchema = z.object({
  token: z.string().trim().min(1).max(512)
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event, ['profile:write'])
  const body = bodySchema.parse(await readBody(event))

  await prisma.mobilePushDevice.deleteMany({
    where: {
      userId: user.id,
      token: body.token
    }
  })

  return { success: true }
})
