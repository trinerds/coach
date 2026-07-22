# 365 — Expo push send ignores preference gates

**Priority:** High  
**Type:** Gap / Privacy  
**Status:** Fixed  
**Area:** `mobile, notifications, push`

## Summary

`sendExpoPushToUser` loaded all `MobilePushDevice` rows for a user and sent
without checking any preference. Even after 364, send sites must consult prefs
(or the helper must).

## Fix

- `sendExpoPushToUser` calls `isMobilePushTypeEnabled` before loading devices
- Skip logs: `preference_disabled` with event type
- Depends on 364 (`MobilePushPreference`)

Also shipped with this batch: mobile-safe inbox / Expo paths
(`link` + `path` → `/today`, `/activities/:id`) plus web compat middleware
`app/middleware/inbox-link-compat.global.ts` (`/today` → dashboard,
`/activities/:id` → `/workouts/:id`).

## Acceptance Criteria

- [x] Disabled type never receives Expo push
- [x] Skip is observable in logs (and optionally metrics)
- [x] Daily recommendation path verified with prefs on/off (unit tests)
- [x] Depends on 364
