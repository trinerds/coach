# 302 — Mobile sidebar slideover ignores UDashboardSidebar title props

**Priority:** Medium  
**Type:** Accessibility / i18n  
**Status:** Fixed  
**Found:** 2026-07-14 (post-patch validation)  
**Fixed:** 2026-07-14 — Pass localized strings through the `:menu` prop so they override Nuxt UI defaults.  
**Related:** #289  
**Area:** `navigation, sidebar, mobile, nuxt-ui`

## Summary

`UDashboardSidebar` accepts `:title` and `:description`, but the mobile slideover/dialog uses hard-coded Nuxt UI locale keys (`dashboardSidebar.title`, `dashboardSidebar.description`). When those keys are missing from the active locale bundle, screen readers announce the raw key names.

## Steps to Reproduce

1. Open any authenticated route at 390×844.
2. Open the mobile sidebar.
3. Inspect the dialog accessible name in DevTools or VoiceOver.

## Actual Behavior

- Dialog accessible title reads `dashboardSidebar.title`.
- Dialog description reads `dashboardSidebar.description`.
- Passing `:title="navLabel('navigation_sidebar_title', 'Navigation')"` on `UDashboardSidebar` does not affect the slideover because `@nuxt/ui` sets `:title="t('dashboardSidebar.title')"` on the internal `Menu` before merging other props; only `:menu="{ title, description }"` overrides it.

## Affected Files

- `app/layouts/default.vue` (`UDashboardSidebar` props)
- `@nuxt/ui` `DashboardSidebar.vue` (hard-coded locale keys on mobile menu)

## Suggested Fix

Provide localized strings via the `:menu` prop:

```vue
:menu="{ title: navLabel('navigation_sidebar_title', 'Navigation'), description:
navLabel('navigation_sidebar_description', 'Browse Coach Watts destinations') }"
```

Alternatively add `dashboardSidebar.title` / `dashboardSidebar.description` to every locale file.

## Acceptance Criteria

- [x] Mobile sidebar dialog announces a readable title and description.
- [x] No `dashboardSidebar.*` raw keys are exposed to assistive tech.
- [x] Desktop sidebar behavior unchanged.

## Validation

Verified after fix: dialog accessible name is “Navigation” at 500×844.
