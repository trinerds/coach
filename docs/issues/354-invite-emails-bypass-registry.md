# 354 — Team and coach invite emails bypass registry and send-email orchestrator

**Priority:** High  
**Type:** Gap / Tech debt  
**Status:** Open  
**Area:** `email, coaching`

## Summary

Coach→athlete and team invite emails call Resend via direct `sendEmail()` with inline HTML. They skip the template registry, preference/suppression gates, EmailDelivery orchestrator path used by `send-email`, UTM injection, and signed unsubscribe footers. Branding and deliverability observability diverge from the eight registry templates.

Related (fixed): [333](./333-team-invites-never-send-email.md) ensured team invites can send; this issue is about unifying the send path.

## Evidence

- `server/utils/coach-athlete-invite-email.ts`
- `server/utils/team-invite-email.ts`
- Contrast: `trigger/send-email.ts` + `server/utils/email-template-registry.ts`

## Suggested Fix

Register invite templates (Vue Email), queue via `send-email` / `queueEmail` with appropriate audience (likely TRANSACTIONAL or a dedicated invite policy), log EmailDelivery, and use branded layout + consistent From.

## Acceptance Criteria

- [ ] Invite emails use registry templates and the standard orchestrator
- [ ] Delivery appears in EmailDelivery / admin email UI
- [ ] Branding matches other product emails
- [ ] Failure handling is consistent with other registry sends
