# 355 — Onboarding Day 2 / Day 7 drip emails not implemented

**Priority:** Medium  
**Type:** Feature / Gap  
**Status:** Open  
**Area:** `email, onboarding`

## Summary

Product docs and the email platform plan describe Day 2 (integration check) and Day 7 (trial review) drip emails via Trigger.dev delays or a dedicated campaign task. Only immediate Welcome exists. No templates, registry keys, or delayed triggers.

Coordinate cadence with founder Himalaya follow-up in watts-marketing so users are not triple-messaged (`knowledge/email/sequences/`).

## Evidence

- `docs/02-features/email-communication.md` — Drip (Planned)
- `plans/email-communication-platform-plan.md` — Day 2 / Day 7 examples
- Registry has Welcome only for onboarding

## Suggested Fix

Add templates + registry entries; trigger delayed/conditional sends from signup (skip Day 2 if integrations already connected). Prefer evaluating conditions at fire time (`wait.for` campaign task) over blind delays.

## Acceptance Criteria

- [ ] Day 2 and Day 7 templates registered and documented
- [ ] Conditional skip logic at send time
- [ ] Pref / unsub / UTM follow existing orchestrator rules
- [ ] Marketing sequence map updated when live
