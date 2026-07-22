# 367 — SYNC_COMPLETED Expo type has no send policy

**Priority:** Low  
**Type:** Product decision / Gap  
**Status:** Open (policy decided — eng cleanup remaining)  
**Area:** `mobile, notifications, push`

## Summary

`SYNC_COMPLETED` is part of `ExpoPushEventType` and listed in the mobile
companion plan, but nothing sends it. Wiring naively on every provider sync
would spam athletes.

## Policy decision (2026-07-22)

**No OS push for `SYNC_COMPLETED`.** Documented in
`~/Develop/watts-marketing/knowledge/push/channel-matrix-pu-001.md` §F and
push inventory allowlist. If activation ever needs “first data landed,” use a
**new** event name — do not reuse this type for per-sync fires.

## Evidence

- `server/utils/expo-push.ts` — type exists
- No callers of `type: 'SYNC_COMPLETED'`
- Ingest/sync pipelines do not call Expo today

## Suggested Fix

Keep type as unused stub or remove in a cleanup PR; hide/disable the mobile
Settings toggle. Do not implement a sender.

## Acceptance Criteria

- [x] Written decision in watts-marketing push inventory + channel-matrix-pu-001
- [ ] Type removed **or** explicitly left as unused stub with no sender + mobile toggle hidden/disabled
- [x] No per-sync OS notification spam in production (no sender)
