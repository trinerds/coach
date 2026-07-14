# 306 — Recovery page triple-frames empty context on mobile

**Priority:** Medium  
**Type:** UI / UX  
**Status:** Fixed  
**Found:** 2026-07-14 (live review at 390×844)  
**Fixed:** 2026-07-14  
**Area:** `recovery, empty-state, filters, cards, mobile`

## Summary

Recovery History uses redundant bordered surfaces around its most common empty state and filter controls. The Recovery Context card contains a second raised panel, which contains a third dashed empty-state card.

## Steps to Reproduce

1. Open `/recovery` at 390×844 for an account with no active recovery context.
2. Inspect the Recovery Context section and its “No recovery context active yet” message.
3. Continue to the Source/Type filter section.

## Actual Behavior

The empty-state message is inset by the page/card body, an inner rounded panel, and another rounded dashed container. The repeated borders and padding shorten every line and make the section significantly taller. A separate full bordered filter card then stacks two selectors and a reset action, reinforcing the same heavy framing rather than presenting compact page controls.

## Affected Files

- `app/components/recovery/RecoveryContextStrip.vue` (outer card, inner surface, and nested empty state, lines 1–83)
- `app/pages/recovery/index.vue` (mobile section composition and filter card, lines 20–120)

## Fix Applied

Recovery Context is the sole bordered surface; active chips and the empty-state message render directly in its body with a subtle divider and tonal background (no inner dashed card). On mobile, Source/Type/Reset appear as a compact flat filter group with a 2-column select row and full-width reset; desktop retains the bordered filter card. Active chips use `min-h-11` for touch targets.

## Acceptance Criteria

- [x] The empty Recovery Context state uses only one bordered/elevated containment layer on mobile.
- [x] Empty-state copy receives materially more horizontal space without touching the viewport edge.
- [x] Source, Type, and Reset remain easy to discover and operate without a redundant full card shell.
- [x] Active recovery chips remain distinguishable and tappable when data exists.
- [x] Timeline cards retain meaningful separation from filters and context.
- [x] Desktop styling remains coherent.
