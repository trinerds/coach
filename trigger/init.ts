import { tasks } from '@trigger.dev/sdk/v3'
import * as Sentry from '@sentry/node'
import { failStructureGenerationTaskFromPayload } from '../server/utils/structure-generation-run-lifecycle'
import { shouldReportIntegrationErrorToSentry } from '../server/utils/integration-errors'

const sentryEnabled = process.env.NODE_ENV === 'production' || process.env.SENTRY_ENABLED === 'true'

if (sentryEnabled && process.env.SENTRY_DSN) {
  Sentry.init({
    defaultIntegrations: false,
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  })
}

// Register a global onFailure hook to capture errors
tasks.onFailure(async ({ payload, error, ctx }) => {
  await failStructureGenerationTaskFromPayload(payload, error)

  if (!shouldReportIntegrationErrorToSentry(error, ctx.attempt?.number, ctx.run.maxAttempts)) {
    return
  }

  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'IntegrationAuthError'
  ) {
    return
  }

  if (!sentryEnabled || !process.env.SENTRY_DSN) {
    return
  }

  Sentry.captureException(error, {
    extra: {
      payload,
      ctx
    }
  })
})
