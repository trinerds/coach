# 359 — AccountDeletionScheduled bypasses full send-email orchestrator

**Priority:** Low  
**Type:** Tech debt  
**Status:** Open  
**Area:** `email, account`

## Summary

Account deletion notice renders/dispatches via EmailDelivery paths outside the standard `send-email` orchestrator used by registry mail. That weakens consistency for UTM injection, signed unsubscribe handling, and shared gates/logging conventions even though the mail is TRANSACTIONAL.

## Evidence

- `trigger/delete-user-account.ts` (custom send path)
- `app/emails/AccountDeletionScheduled.vue` registered but not always going through full orchestrator
- Contrast: `trigger/send-email.ts`

## Suggested Fix

Queue AccountDeletionScheduled through `send-email` / `queueEmail` with TRANSACTIONAL audience, or extract shared helpers so deletion uses the same render → delivery → Resend pipeline and metadata conventions.

## Acceptance Criteria

- [ ] Deletion notice uses the same delivery pipeline conventions as other registry TRANSACTIONAL mail
- [ ] Delivery visible/consistent in admin email tooling
- [ ] No regression in deletion scheduling UX
