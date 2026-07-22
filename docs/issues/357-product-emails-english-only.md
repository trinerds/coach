# 357 — Product emails ignore uiLanguage (English-only templates)

**Priority:** Medium  
**Type:** Gap / i18n  
**Status:** Open  
**Area:** `email, i18n`

## Summary

Vue email templates and registry default subjects are English-only (`lang="en"`, hardcoded copy). Settings Communication UI is localized, but outbound product mail does not use `uiLanguage`. Localized founder outreach (e.g. Hungarian) can clash with English system mail for the same user.

## Evidence

- `app/emails/*.vue` — English copy, hardcoded site strings
- `server/utils/email-template-registry.ts` — English `defaultSubject`
- User `uiLanguage` used elsewhere in product i18n

## Suggested Fix

Resolve locale from user `uiLanguage` (fallback en) for subjects and template strings; keep claim-safe translations aligned with product i18n files. Prefer shared message catalogs over duplicated hardcoding.

## Acceptance Criteria

- [ ] Subjects and body copy respect `uiLanguage` for supported locales
- [ ] Fallback to English when locale missing/unsupported
- [ ] At least one non-English locale verified end-to-end via CLI/admin preview
