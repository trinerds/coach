# 305 — Profile pages stack mobile gutters and card padding

**Priority:** Medium  
**Type:** UI / UX  
**Status:** Fixed  
**Found:** 2026-07-14 (live review at 390×844)  
**Fixed:** 2026-07-14  
**Area:** `profile, settings, forms, cards, mobile`

## Summary

Profile Settings and the generated Athlete Profile apply desktop-oriented page padding in addition to card padding. Form controls and long-form analysis cards lose too much horizontal space on phones.

## Steps to Reproduce

1. Open `/profile/settings` at 390×844.
2. Inspect the Personal Information and Body Metrics fields.
3. Open `/profile/athlete` and inspect Profile Overview and the following analysis cards.

## Actual Behavior

Profile Settings applies 16 px panel-body padding, then each `UCard` applies another 16 px. Inputs begin about 48 px from the viewport edge and are approximately 294 px wide—over 24% of the viewport is unavailable before the input's own internal padding. The Athlete Profile uses unconditional `p-6`, leaving roughly 40 px side gutters and about 310 px for long-form cards.

## Affected Files

- `app/pages/profile/settings.vue` (panel body and content wrapper, lines 20–24)
- `app/components/profile/BasicSettings.vue` (stacked settings cards, lines 1–170)
- `app/pages/profile/athlete.vue` (unconditional `p-6` body wrapper and analysis cards, lines 75–220)
- Other Profile Settings tab components that use the same `UCard` pattern

## Fix Applied

Introduced shared `profileSettingsCardUi` and `athleteProfileCardUi` in `app/utils/mobile-surface-ui.ts`. Profile Settings uses a single `px-4 sm:px-0` page gutter with cards that drop horizontal body/header padding on mobile. Athlete Profile wrapper uses `px-4 py-4 sm:p-6`; analysis cards keep comfortable internal text padding via responsive card body classes. All Profile Settings tabs updated consistently.

## Acceptance Criteria

- [x] At 360×800 and 390×844, form fields and analysis cards use no more than the standard 16 px page gutter.
- [x] Settings fields gain width without touching the physical screen edge.
- [x] Long analysis text has comfortable internal padding and a readable line length.
- [x] Section boundaries remain clear without relying on two stacked padding layers.
- [x] Every Profile Settings tab follows the same mobile containment rule.
- [x] Desktop widths and centered maximum-width layouts remain unchanged.
