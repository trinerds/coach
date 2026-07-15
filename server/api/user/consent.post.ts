import { prisma } from '../../utils/db'
import { requireAuth } from '../../utils/auth-guard'
import { triggerDeferredProviderIngests } from '../../utils/deferred-provider-ingest'
import { PRIVACY_POLICY_VERSION, TERMS_OF_SERVICE_VERSION } from '../../../shared/policy-versions'

export default defineEventHandler(async (event) => {
  const sessionUser = await requireAuth(event)

  const body = await readBody(event)
  const { termsVersion, privacyPolicyVersion, healthConsentAccepted } = body

  if (!termsVersion || !privacyPolicyVersion) {
    throw createError({ statusCode: 400, message: 'Missing version information' })
  }

  if (
    termsVersion !== TERMS_OF_SERVICE_VERSION ||
    privacyPolicyVersion !== PRIVACY_POLICY_VERSION
  ) {
    throw createError({ statusCode: 400, message: 'Outdated policy version' })
  }

  if (healthConsentAccepted !== true) {
    throw createError({ statusCode: 400, message: 'Health consent is required' })
  }

  const user = await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      termsAcceptedAt: new Date(),
      healthConsentAcceptedAt: new Date(),
      termsVersion,
      privacyPolicyVersion
    }
  })

  try {
    await triggerDeferredProviderIngests(user.id)
  } catch (error) {
    console.error('[Consent] Failed to trigger deferred provider ingest:', error)
  }

  return { success: true, termsAcceptedAt: user.termsAcceptedAt }
})
