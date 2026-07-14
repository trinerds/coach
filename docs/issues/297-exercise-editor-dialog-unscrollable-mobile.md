# 297 — Exercise editor dialog is unscrollable on mobile

**Priority:** High  
**Type:** UI / UX  
**Status:** Fixed  
**Fixed:** 2026-07-14 — Exercise editor modal constrained to `100dvh` with scrollable body, sticky action row, and responsive set table (`min-w-0` on mobile).
**Area:** `library, exercises, overlays, mobile`

## Summary

The Create/Edit Exercise dialog clips a long form inside a non-scrollable mobile overlay, making its lower fields and primary actions unreachable.

## Steps to Reproduce

1. Open `/library/exercises` at 390×844.
2. Tap **New Exercise**.
3. Try to scroll to Video URL, Notes, Cancel, and Create Exercise.

## Actual Behavior

The dialog measures 358×812 px but contains 1,293 px of content. Both dialog axes use hidden overflow, wheel/touch scrolling does not move the dialog or page, and the action row begins around 1,261 px. The 520 px minimum-width set table also expands the inner content to 542 px and is clipped horizontally.

## Affected Files

- `app/pages/library/exercises/index.vue` (exercise editor modal, lines 562–877)
- `app/pages/library/exercises/index.vue` (520 px minimum-width set table, lines 662–714)

## Suggested Fix

Use a full-screen editor or mobile sheet, or constrain the modal to `100dvh` with a vertically scrollable, `min-w-0` body. Keep the action row visible or sticky and make the set editor responsive instead of relying on clipped minimum width.

## Acceptance Criteria

- [x] At 360×800 and 390×844, every field and action is reachable by touch scrolling.
- [x] The dialog has no unintended horizontal clipping.
- [x] Cancel and Create/Save remain reachable with the virtual keyboard open.
- [x] Focused fields scroll into view and focus remains trapped within the dialog.
