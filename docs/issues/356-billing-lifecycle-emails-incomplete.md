# 356 — Billing lifecycle emails incomplete beyond SubscriptionStarted

**Priority:** High  
**Type:** Feature / Gap  
**Status:** Open  
**Area:** `email, billing`

## Summary

Only `SubscriptionStarted` is implemented for subscription mail. Payment failed, renewal, and cancellation follow-up emails from the email platform plan are missing. Users may miss critical billing events.

## Evidence

- Registry: `SubscriptionStarted` only (TRANSACTIONAL)
- Stripe webhook path sets subscription started; no matching failed/canceled mail templates
- `plans/email-communication-platform-plan.md` — subscription lifecycle scope
- Pref key `billing` exists without a sender

## Suggested Fix

Add TRANSACTIONAL templates for payment failed / renew / cancel (policy per message). Wire Stripe webhook (or billing service) events through `send-email`. Decide whether optional “we miss you” cancel nurture is ENGAGEMENT + `billing`/`retentionNudges` instead of TRANSACTIONAL.

## Acceptance Criteria

- [ ] Critical billing failure notice ships as TRANSACTIONAL
- [ ] Cancel / renew coverage matches product policy and is documented
- [ ] Pref key `billing` either used or removed from UI (see also 358)
- [ ] Feature doc lists live billing templates
