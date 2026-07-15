import { requireAuth } from '../../../utils/auth-guard'
import { claimAccountCreatedForClient } from '../../../utils/product-analytics'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  return await claimAccountCreatedForClient(user.id)
})
