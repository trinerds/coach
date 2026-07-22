# 361 — Vue email templates hardcode https://coachwatts.com

**Priority:** Low  
**Type:** Tech debt  
**Status:** Open  
**Area:** `email`

## Summary

Product Vue email templates hardcode `https://coachwatts.com` (and logo URLs) instead of consistently using `NUXT_PUBLIC_SITE_URL` / runtime site config. Staging, preview, and alternate environments render production links; local QA is harder.

## Evidence

- `app/emails/*.vue` — e.g. `const siteUrl = 'https://coachwatts.com'`
- Orchestrator already uses env for some unsubscribe/base URL construction

## Suggested Fix

Inject `siteUrl` (and logo URL) via render props from the orchestrator / render API using `NUXT_PUBLIC_SITE_URL` with production default. Keep absolute HTTPS URLs in final HTML.

## Acceptance Criteria

- [ ] Templates do not hardcode production origin for primary links
- [ ] Staging/preview sends use the environment site URL
- [ ] Production links remain correct
