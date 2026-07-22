# 360 — POSTMARK_API_KEY env stub unused (Resend-only email)

**Priority:** Low  
**Type:** Maintenance  
**Status:** Open  
**Area:** `email, ops`

## Summary

`POSTMARK_API_KEY` appears in env examples / env files but is not referenced in TypeScript. Outbound product email is Resend-only. The stub creates ops noise and false expectations of a Postmark integration.

## Evidence

- `.env.example` / env references to `POSTMARK_API_KEY`
- No TS usage of Postmark client
- Active path: `server/utils/email.ts` → Resend

## Suggested Fix

Remove Postmark from env examples and docs, **or** clearly mark as deprecated/unused. Keep Resend vars as the canonical provider config.

## Acceptance Criteria

- [ ] Env examples and feature docs do not imply Postmark is live
- [ ] No broken references for new contributors setting up email
