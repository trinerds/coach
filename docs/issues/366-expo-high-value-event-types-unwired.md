# 366 — High-value Expo event types unused (analysis, coaching)

**Priority:** Medium  
**Type:** Feature / Gap  
**Status:** Open  
**Area:** `mobile, notifications, push`

## Summary

`ExpoPushEventType` includes `WORKOUT_ANALYSIS_READY` and `COACH_MESSAGE`, but
only `RECOMMENDATION_READY` is sent. Workout analysis and coaching
request/approve/decline already create in-app notifications; athletes away from
the app get silence. Marketing policy allowlist (watts-marketing
`knowledge/push/`) recommends wiring these next after prefs.

## Evidence

- `server/utils/expo-push.ts` — type union
- `trigger/analyze-workout.ts` — inbox via `createUserNotification`, no Expo
- Coaching approve/decline/request paths — inbox only (see also fixed 338 for inbox)
- `trigger/recommend-today-activity.ts` — sole Expo caller

## Suggested Fix

After 364/365: call `sendExpoPushToUser` with correct `type`, `path`, and copy.
Policy (2026-07-22): analysis Expo is primary; skip analysis ENGAGEMENT email when
push pref on + ≥1 device — see watts-marketing `knowledge/push/channel-matrix-pu-001.md` §B.
Coaching lifecycle after analysis; do not conflate with chat `COACH_MESSAGE` spam.
from analysis-ready and coaching lifecycle events. Coordinate with email so
analysis does not always dual-send email + push (channel matrix in marketing
repo).

## Acceptance Criteria

- [ ] Analysis ready can Expo-notify opted-in users with deep link to activity
- [ ] Coaching request/approve/decline can Expo-notify opted-in users
- [ ] Pref gates respected
- [ ] watts-mobile deep-link map updated if paths change
