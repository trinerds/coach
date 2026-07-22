# 358 — Email preference keys exist without senders (settings overpromise)

**Priority:** Medium  
**Type:** Gap / UX trust  
**Status:** Open  
**Area:** `email, settings`

## Summary

`EmailPreference` / registry typing includes `planUpdates`, `productUpdates`, `billing`, and `marketing`, and Communication settings can imply those channels. No registered templates currently use those preference keys as senders (`marketing` defaults false and has no blast path). Users may believe they opted into silent channels.

## Evidence

- `server/utils/email-template-registry.ts` — `EmailPreferenceKey` union
- Communication settings UI (`app/components/profile/CommunicationSettings.vue`)
- Live registry senders only use onboarding, workoutAnalysis, thresholdUpdates, dailyCoach, retentionNudges (plus TRANSACTIONAL null)

## Suggested Fix

Either:

1. Hide/disable unused toggles until a sender exists, **or**
2. Ship minimal senders (start with `productUpdates` / `marketing` per product roadmap) and document each toggle.

Coordinate marketing broadcasts with watts-marketing (`knowledge/email/` em-007) before enabling a real `marketing` sender.

## Acceptance Criteria

- [ ] Every visible Communication toggle maps to a real sender **or** is hidden/disabled with clear copy
- [ ] Feature doc lists pref → template mapping
- [ ] No marketing send without opt-in enforcement
