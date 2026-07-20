import { expect, test } from '@playwright/test'
import { mintE2eAccessToken } from '../helpers/token.ts'
import { E2E_MOBILE_CLIENT_ID } from '../seed.ts'

test.describe('E2E API (Bearer / companion)', () => {
  test('mints a Bearer token and returns today recommendation', async ({ request }) => {
    const tokenResponse = await request.post('/api/__e2e/token', {
      data: {
        email: process.env.E2E_TEST_USER_EMAIL,
        clientId: E2E_MOBILE_CLIENT_ID
      }
    })

    expect(tokenResponse.ok()).toBeTruthy()
    const tokenBody = await tokenResponse.json()
    expect(tokenBody.token_type).toBe('Bearer')
    expect(tokenBody.access_token).toBeTruthy()
    expect(tokenBody.clientId).toBe(E2E_MOBILE_CLIENT_ID)
    expect(tokenBody.email).toBe(process.env.E2E_TEST_USER_EMAIL)

    const today = await request.get('/api/recommendations/today', {
      headers: {
        Authorization: `Bearer ${tokenBody.access_token}`
      }
    })

    expect(today.ok()).toBeTruthy()
    const recommendation = await today.json()
    expect(recommendation).toBeTruthy()
    expect(recommendation.recommendation).toBe('proceed')
    expect(recommendation.status).toBe('COMPLETED')
  })

  test('helper mintE2eAccessToken works against the stack', async () => {
    const token = await mintE2eAccessToken()
    expect(token.access_token.length).toBeGreaterThan(20)
    expect(token.clientId).toBe(E2E_MOBILE_CLIENT_ID)
  })
})
