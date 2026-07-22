# 363 — Email feature doc vs platform plan drift (auto-dispatch and backlog)

**Priority:** Low  
**Type:** Maintenance / Docs  
**Status:** Open  
**Area:** `email, docs`

## Summary

`docs/02-features/email-communication.md` describes automatic Resend dispatch as the default with optional `DISABLE_EMAILS` approval gate. Older `plans/email-communication-platform-plan.md` still reads like earlier phases (manual review as the main path, some items still “pending”) even where the platform has shipped. Agents and contributors get conflicting mental models.

## Evidence

- `docs/02-features/email-communication.md` — Automated Dispatch (Default)
- `plans/email-communication-platform-plan.md` — Target architecture still frames manual review as Phase 2–4 primary path in places
- Planned items (drip, billing) are correctly open; status of shipped platform is unclear in the plan

## Suggested Fix

Add a “Current state (as of DATE)” section to the plan that marks orchestrator/auto-dispatch/prefs/unsub as shipped, and keep only true backlog items (link issues 353–362). Alternatively archive superseded plan sections and point to the feature doc + issue tracker.

## Acceptance Criteria

- [ ] One clear “what’s live” source for email platform status
- [ ] Plan backlog links to open issue IDs where applicable
- [ ] No contradiction on auto-dispatch vs manual approval default
