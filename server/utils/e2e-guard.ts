import { createError } from 'h3'

/** Throws 404 unless the process is running with E2E_MODE=true. */
export function assertE2eMode() {
  if (process.env.E2E_MODE !== 'true') {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }
}
