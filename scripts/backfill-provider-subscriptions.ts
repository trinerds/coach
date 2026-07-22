import 'dotenv/config'
import { prisma } from '../server/utils/db'
import { ensureLegacyStripeSubscription } from '../server/utils/provider-subscriptions'

async function main() {
  const users = await prisma.user.findMany({
    where: { stripeSubscriptionId: { not: null } },
    select: { id: true }
  })
  for (const user of users) await ensureLegacyStripeSubscription(user.id)
  console.log(`Backfilled ${users.length} Stripe subscription owner(s).`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
