# 303 — Mobile sidebar footer aria-label shows raw key or crashes SSR

**Priority:** Medium  
**Type:** Accessibility / Bug  
**Status:** Fixed  
**Found:** 2026-07-14 (post-patch validation)  
**Fixed:** 2026-07-14 — Use a computed label with English fallback; avoid `t.value()` in templates.  
**Related:** #277, #291  
**Area:** `sidebar, mobile, accessibility`

## Summary

The compact mobile sidebar account control exposed `sidebar_account_menu` as its accessible name when Tolgee returned the key unchanged. An attempted fix using `t.value()` in the template caused a 500 error because refs are auto-unwrapped in templates.

## Steps to Reproduce

1. Open the mobile sidebar at 390×844.
2. Inspect the account row at the bottom (avatar + chevron).
3. Check the button’s accessible name.

## Actual Behavior

- Accessible name was the raw key `sidebar_account_menu` instead of “Account menu”.
- Using `:aria-label="ready ? t.value('sidebar_account_menu') : 'Account menu'"` in the template threw `$setup.t.value is not a function` during SSR/render.

## Root Cause

- Tolgee may return the key string when the translation is not yet loaded.
- In Vue templates, `useTranslate().t` is auto-unwrapped; calling `.value` on it is invalid.

## Suggested Fix

Resolve the label in script with the same fallback pattern as `navLabel()`:

```ts
const accountMenuAriaLabel = computed(() => {
  if (typeof t.value !== 'function') return 'Account menu'
  const translated = t.value('sidebar_account_menu')
  return !translated || translated === 'sidebar_account_menu' ? 'Account menu' : translated
})
```

## Acceptance Criteria

- [x] Account menu button has readable accessible name on mobile.
- [x] No server/runtime errors from the footer component.
- [x] English fallback used when translation equals the key.
