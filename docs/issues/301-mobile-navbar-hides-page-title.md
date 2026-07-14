# 301 — Mobile navbar hides page title leaving empty header space

**Priority:** Medium  
**Type:** UI / UX  
**Status:** Fixed  
**Found:** 2026-07-14 (post-patch validation at 390×844)  
**Fixed:** 2026-07-14 — Restored visible truncated navbar titles on phones via `app.config.ts` `dashboardNavbar.title` slot.  
**Area:** `navigation, dashboard, mobile, app.config`

## Summary

After the mobile navbar overflow patch (#276), phones still showed a large empty band between the sidebar control and header actions. The page title existed in the DOM but was hidden by global Nuxt UI theming.

## Steps to Reproduce

1. Open `/dashboard` at 390×844.
2. Inspect the top navbar between the hamburger and Sync/Chat/More actions.

## Actual Behavior

- `UDashboardNavbar` renders an `<h1>` with the page title, but `app.config.ts` applied `hidden sm:flex` to the title slot.
- Below 640px the title is not visible, leaving ~300px of unused header space.
- Users lose page context while scrolling; the layout looks broken compared to the pre-overflow navbar.

## Root Cause

`app/app.config.ts` configured:

```ts
dashboardNavbar: {
  slots: {
    title: 'hidden sm:flex items-center gap-1.5 font-semibold text-highlighted truncate'
  }
}
```

This predates the mobile overflow work and conflicts with showing a readable page name on phones.

## Suggested Fix

Show a truncated title on all breakpoints (`flex min-w-0 truncate text-sm sm:text-base`) and keep icon-only actions in the overflow menu.

## Acceptance Criteria

- [x] Page title is visible at 360×800 and 390×844.
- [x] Title truncates instead of pushing actions off-screen.
- [x] Overflow menu and primary actions remain usable.

## Validation

Verified on `http://localhost:3099/dashboard` at 500×844 after fix: title displays as “Dashboard”, sidebar toggle is 44×44px.
