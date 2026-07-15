import * as Sentry from '@sentry/nuxt'

const config = useRuntimeConfig()

if (!config.public.sentryEnabled || !config.public.sentryDsn) {
  // Sentry is disabled in local dev unless SENTRY_ENABLED=true.
} else {
  Sentry.init({
    dsn: config.public.sentryDsn as string,
    release: config.public.sentryRelease as string,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] })],
    enableLogs: true,
    sendDefaultPii: true,
    debug: false,
    environment: process.env.NODE_ENV || 'development',
    beforeSend(event, hint) {
      const error = hint.originalException

      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'IntegrationAuthError'
      ) {
        return null
      }

      const message = event.exception?.values?.[0]?.value || event.message || ''
      if (typeof message === 'string') {
        if (message.includes('no such table: _content_content')) {
          return null
        }

        if (/Failed to refresh (Ultrahuman|Whoop|Withings) token/i.test(message)) {
          return null
        }
      }

      return event
    }
  })
}
