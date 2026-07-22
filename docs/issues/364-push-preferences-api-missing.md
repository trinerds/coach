# 364 — Server push preferences API missing

**Priority:** High  
**Type:** Gap / UX trust  
**Status:** Fixed  
**Area:** `mobile, notifications, push`

## Summary

The watts-mobile notifications settings UI exposes per-type push toggles and calls
`/api/mobile/devices/preferences`, but coach-wattz had no such handlers. Prefs
fell back to device SecureStore only. Server could not enforce opt-out.

## Fix

- Prisma `MobilePushPreference` (one row per user; keys map to `ExpoPushEventType`)
- `GET /api/mobile/devices/preferences` (`profile:read`) — creates defaults if missing
- `PUT /api/mobile/devices/preferences` (`profile:write`) — nested `{ preferences }` or flat body
- Optional `preferences` on `POST /api/mobile/devices` also persisted
- Defaults: all on except `SYNC_COMPLETED` (policy-off, issue 367)
- Helpers: `server/utils/mobile-push-preferences.ts`
- Plan: `docs/06-plans/mobile-companion-app.md` §8.1

## Acceptance Criteria

- [x] Mobile prefs round-trip to server and survive reinstall/new device
- [x] Visible toggles match persisted keys
- [x] Feature/plan docs describe the contract
