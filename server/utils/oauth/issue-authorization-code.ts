import type { OAuthApp } from '@prisma/client'
import { createError } from 'h3'
import { oauthRepository } from '../repositories/oauthRepository'
import { parseScopeString, validateMcpOAuthScopes, validateRestOAuthScopes } from './scopes'
import { assertMcpResource, isMcpResourceRequest } from './resource'

export type IssueAuthorizationCodeInput = {
  app: Pick<OAuthApp, 'id'>
  userId: string
  redirectUri: string
  scope?: string
  state?: string
  resource?: string
  codeChallenge?: string
  codeChallengeMethod?: string
  siteUrl: string
}

/**
 * Validate scopes/resource, create an auth code, and return the success redirect URL.
 */
export async function issueAuthorizationCodeRedirect(
  input: IssueAuthorizationCodeInput
): Promise<string> {
  const isMcpFlow = isMcpResourceRequest(input.resource, input.siteUrl)

  if (isMcpFlow) {
    if (!input.codeChallenge) {
      throw createError({
        statusCode: 400,
        message: 'PKCE code_challenge is required for MCP authorization.'
      })
    }
    if (input.codeChallengeMethod && input.codeChallengeMethod !== 'S256') {
      throw createError({
        statusCode: 400,
        message: 'Only S256 PKCE is supported for MCP authorization.'
      })
    }
  }

  const requestedScopes = parseScopeString(input.scope)
  const scopes = requestedScopes.length > 0 ? requestedScopes : isMcpFlow ? [] : ['profile:read']

  try {
    if (isMcpFlow) {
      validateMcpOAuthScopes(scopes)
    } else {
      validateRestOAuthScopes(scopes)
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Invalid scopes'
    })
  }

  const normalizedResource = isMcpFlow
    ? assertMcpResource(input.resource, input.siteUrl)
    : undefined

  const authCode = await oauthRepository.createAuthCode({
    appId: input.app.id,
    userId: input.userId,
    redirectUri: input.redirectUri,
    scopes,
    resource: normalizedResource,
    codeChallenge: input.codeChallenge,
    codeChallengeMethod: isMcpFlow ? 'S256' : input.codeChallengeMethod
  })

  const successUrl = new URL(input.redirectUri)
  successUrl.searchParams.set('code', authCode.code)
  if (input.state) successUrl.searchParams.set('state', input.state)

  return successUrl.toString()
}
