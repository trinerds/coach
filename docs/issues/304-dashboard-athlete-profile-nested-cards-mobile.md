# 304 — Dashboard Athlete Profile double-cards mobile content

**Priority:** Medium  
**Type:** UI / UX  
**Status:** Fixed  
**Found:** 2026-07-14 (live review at 390×844)  
**Fixed:** 2026-07-14  
**Area:** `dashboard, athlete-profile, cards, mobile`

## Summary

The Dashboard renders the Athlete Profile as a large card containing four more bordered, rounded cards. On mobile, the outer card contributes no useful grouping beyond its header but consumes width and creates a visually heavy “card inside card” stack.

## Steps to Reproduce

1. Open `/dashboard` at 390×844.
2. Inspect Athlete Profile, Training Load & Form, Core Performance, and Recent Wellness.
3. Compare their available width with the Activity Highlights cards on `/performance`.

## Actual Behavior

The outer `UCard` occupies the page width and adds its own body padding. Each interactive metric module then adds another border, radius, and 16 px padding. The inner cards render approximately 326 px wide on a 390 px viewport, and their three-column metrics must fit inside roughly 294 px of content width. Labels, units, and trends become cramped while repeated borders dominate the hierarchy.

## Affected Files

- `app/components/dashboard/AthleteProfileCard.vue` (outer `UCard` and nested profile/metric surfaces, lines 1–360)
- `app/pages/dashboard.vue` (Athlete Profile placement, lines 209–240)

## Fix Applied

On mobile, the outer Athlete Profile card keeps a single bordered surface with zero body padding; internal modules render as divider-separated flat sections (borderless below `sm`). Desktop retains nested rounded module cards. Information-heavy metric grids use `grid-cols-2 sm:grid-cols-3` for readability at 360 px.

## Acceptance Criteria

- [x] At 360×800 and 390×844, the Athlete Profile area has only one bordered/elevated containment layer.
- [x] Metric modules use the normal 16 px page gutter without an additional outer-card inset.
- [x] Three-column labels, values, units, and trends remain readable without collisions or unintended wrapping.
- [x] Edit, settings, Sync, chevrons, and module navigation retain clear grouping and touch targets.
- [x] Desktop hierarchy and all loading/empty states remain visually coherent.
