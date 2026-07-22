# 353 — Welcome email is ENGAGEMENT and can be suppressed by global unsubscribe

**Priority:** High  
**Type:** Gap / Product decision  
**Status:** Open  
**Area:** `email, onboarding`

## Summary

Product `Welcome` is registered as `audience: ENGAGEMENT` with `preferenceKey: 'onboarding'`. Global unsubscribe (and opting out of onboarding) can suppress the only system onboarding email. New users may never receive account/onboarding mail after signup.

Marketing overlap with founder Himalaya welcome is tracked in `watts-marketing/knowledge/email/` (tasks em-001/em-002). This issue is the product classification / delivery guarantee.

## Evidence

- `server/utils/email-template-registry.ts` — `Welcome` → ENGAGEMENT / onboarding
- `server/api/auth/[...].ts` — triggers Welcome on `createUser`
- `trigger/send-email.ts` — global unsub / pref gates apply to ENGAGEMENT
- TRANSACTIONAL templates (e.g. SubscriptionStarted) bypass those gates

## Suggested Fix

Pick one (product decision):

1. Reclassify Welcome (or a thinner “account created” mail) as TRANSACTIONAL with minimal optional CTAs, **or**
2. Keep ENGAGEMENT but ensure a hard TRANSACTIONAL signup receipt always sends, and document Welcome as optional nurture.

Coordinate copy/CTA roles with watts-marketing after the founder-welcome overlap policy is decided.

## Acceptance Criteria

- [ ] Documented product decision on Welcome vs transactional signup receipt
- [ ] Users who globally unsubscribe still receive any mail classified as required account notice (if that is the chosen policy)
- [ ] Registry + feature doc updated to match
- [ ] watts-marketing `knowledge/email/inventory.md` updated when shipped
