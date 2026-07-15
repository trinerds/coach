# Sentry Issue Tracking

Live tracker for **coach-watts** ([Sentry dashboard](https://newpush-y4.sentry.io/issues/?project=coach-watts&query=is%3Aunresolved)). Last synced from Sentry: **2026-07-15**.

Related docs:

- [conductor/sentry-issues-resolution-plan.md](./conductor/sentry-issues-resolution-plan.md) — April 2026 batch plan (mostly completed; kept for history)
- [docs/issues/062-chat-planned-workout-pollstartedat-crash.md](./docs/issues/062-chat-planned-workout-pollstartedat-crash.md) — COACH-WATTS-1D6 / 1D8
- [docs/issues/196-sentry-no-cefsharp-scanner-filter.md](./docs/issues/196-sentry-no-cefsharp-scanner-filter.md) — COACH-WATTS-117 noise filter

## Active — Unresolved in Sentry

Sorted by recency. These still need a fix, deploy verification, or ongoing monitoring.

| Issue ID                                                               | Description                                               | Users | Events | Last seen | Culprit                     | Notes                                                                                  |
| ---------------------------------------------------------------------- | --------------------------------------------------------- | ----- | ------ | --------- | --------------------------- | -------------------------------------------------------------------------------------- |
| [COACH-WATTS-1EA](https://newpush-y4.sentry.io/issues/COACH-WATTS-1EA) | `Failed to retrieve active runs`                          | 2     | 354    | ~1d ago   | `GET /api/runs/active`      | **Escalating** — `runs.list()` failing in `active.get.ts`; investigate Trigger.dev API |
| [COACH-WATTS-5A](https://newpush-y4.sentry.io/issues/COACH-WATTS-5A)   | `Failed to retrieve active runs`                          | 1     | 863    | ~1d ago   | `GET /api/runs/active`      | Duplicate cluster of 1EA                                                               |
| [COACH-WATTS-1E5](https://newpush-y4.sentry.io/issues/COACH-WATTS-1E5) | `Page not found`                                          | 1     | 3      | ~1d ago   | `/documentation/:slug(.*)*` | **Open** — bad or missing content slug                                                 |
| [COACH-WATTS-1E7](https://newpush-y4.sentry.io/issues/COACH-WATTS-1E7) | `undefined is not an object (evaluating 't.listened')`    | 1     | 1      | ~3d ago   | `/workouts/:id()`           | **Open** — minified teardown race; investigate chart/route unmount                     |
| [COACH-WATTS-1CN](https://newpush-y4.sentry.io/issues/COACH-WATTS-1CN) | `Cannot read properties of undefined (reading 'default')` | 3     | 9      | ~3d ago   | `/settings/developer`       | **Open** — developer settings module load                                              |
| [COACH-WATTS-1DM](https://newpush-y4.sentry.io/issues/COACH-WATTS-1DM) | `Cannot access 'e' before initialization`                 | 2     | 2      | ~2d ago   | `/recovery`                 | **Open** — head/translation init ordering (related to #282)                            |
| [COACH-WATTS-1DN](https://newpush-y4.sentry.io/issues/COACH-WATTS-1DN) | `Cannot read properties of undefined (reading 'dispose')` | 2     | 2      | ~2d ago   | `/fitness`                  | **Open** — Unhead disposal on route leave                                              |

[View all unresolved issues in Sentry →](https://newpush-y4.sentry.io/issues/?project=coach-watts&query=is%3Aunresolved)

## Fix Committed — Pending Deploy Verification

Move to **Recently Resolved** and **resolve in Sentry** once deployed and quiet for 24–48h.

| Issue ID                                      | Local fix                                                 | Doc                                                                                                                                  |
| --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| COACH-WATTS-66                                | Bounded `flattenWorkoutSteps` (depth/reps/step caps)      | `app/utils/workout-analytics.ts`, `MiniWorkoutChart.vue`                                                                             |
| COACH-WATTS-1CG                               | Empty stream label guards                                 | `BaseStreamChart.vue`, `map.vue`                                                                                                     |
| COACH-WATTS-1D9                               | MDC render error fallback                                 | `ChatMdcContent.vue`                                                                                                                 |
| COACH-WATTS-1DA–1DD                           | Chat teardown lifecycle guards                            | `chat.vue`, `ChatPlannedWorkoutCard.vue`, `ChatMessageList.vue`                                                                      |
| COACH-WATTS-1D6 / 1D8                         | `pollStartedAt` ref added in `ChatPlannedWorkoutCard.vue` | [#062](./docs/issues/062-chat-planned-workout-pollstartedat-crash.md)                                                                |
| COACH-WATTS-1E2 / 1E0 / 1DS / 1DR / 1DP / 1DY | `DataCloneError` on profile save / dashboard settings     | `BasicSettings.vue` (`pickBasicProfilePayload` + `toRaw`), `profile/settings.vue` (`snapshotState`), `user.ts` (`cloneSerializable`) |
| COACH-WATTS-1E1                               | `deviation.toLowerCase()` on undefined                    | `PlanAdherence.vue` — filter invalid deviations + safe helper                                                                        |
| COACH-WATTS-1DT / 1DV / 1E3 / 1E6             | Chart.js annotation plugin init race on workout charts    | `app/utils/chartjs-annotation.ts`, `app/plugins/chartjs.client.ts`, `ChartRenderer.vue`, `BaseWidget.vue`                            |
| COACH-WATTS-1DX / 1DW                         | Deprecated `gemini-3-pro-preview` + undefined `usage`     | `ai-config.ts` (model alias), `gemini.ts` (`resolveModelId`, `logUsage` guard)                                                       |
| COACH-WATTS-1DJ                               | `reasoningText` passed to Prisma instead of `reasoning`   | `activityRecommendationRepository.createProcessingPlaceholder`, `today.post.ts`                                                      |
| COACH-WATTS-16B / YD / 6Z                     | Token refresh spamming Sentry on revoked/outage tokens    | `integration-errors.ts`, `ultrahuman.ts` / `whoop.ts` / `withings.ts`, ingest tasks, `trigger/init.ts`                               |

## Known Noise / Handled

| Issue ID                                                               | Description                                         | Handling                                                                                                                                         |
| ---------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [COACH-WATTS-117](https://newpush-y4.sentry.io/issues/COACH-WATTS-117) | `Object Not Found Matching Id:*, MethodName:update` | Filtered via `ignoreErrors` in `sentry.client.config.ts` ([#196](./docs/issues/196-sentry-no-cefsharp-scanner-filter.md)); **ignored in Sentry** |
| COACH-WATTS-D / 9 / C / 57 / 1E9                                       | Chunk / dynamic import / generic fetch failures     | `app/plugins/chunk-error.client.ts` auto-reload; deployment / network blips                                                                      |
| COACH-WATTS-23 / 1AA / 1B9 / 1DF / 1C4 / 1E8 / 50                      | Auth session / dev.json fetch failures (incl. 404)  | Dev server restarts / deploy; not app bugs                                                                                                       |
| COACH-WATTS-1EC / 1EG                                                  | `/api/profile/quotas` fetch 401 / no response       | Dev session blips during local work                                                                                                              |
| [COACH-WATTS-1E4](https://newpush-y4.sentry.io/issues/COACH-WATTS-1E4) | `no such table: _content_content`                   | Nuxt Content DB not initialized in dev; filtered in `sentry.server.config.ts` `beforeSend`                                                       |
| COACH-WATTS-1EB / 1DG / 1DH / 1DE                                      | Vite `?macro=true` syntax errors                    | Transient dev HMR / in-progress edits                                                                                                            |
| [COACH-WATTS-MP](https://newpush-y4.sentry.io/issues/COACH-WATTS-MP)   | `runtime.sendMessage(). Tab not found`              | Browser extension noise                                                                                                                          |

## Recently Resolved

| Issue ID                                                               | Description                                    | Resolution                                                                                                                              |
| ---------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [COACH-WATTS-1EF](https://newpush-y4.sentry.io/issues/COACH-WATTS-1EF) | `$setup.t.value is not a function`             | `accountMenuAriaLabel` computed in `MobileSidebarFooter.vue` ([#303](./docs/issues/303-mobile-sidebar-footer-aria-label-regression.md)) |
| [COACH-WATTS-1EE](https://newpush-y4.sentry.io/issues/COACH-WATTS-1EE) | `Cannot access 'tr' before initialization`     | Recovery `useHead`/`tr` ordering ([#282](./docs/issues/282-recovery-head-unmount-breaks-navigation.md))                                 |
| [COACH-WATTS-1ED](https://newpush-y4.sentry.io/issues/COACH-WATTS-1ED) | `dispose` on Recovery unmount                  | Same as 1EE                                                                                                                             |
| [COACH-WATTS-1DA](https://newpush-y4.sentry.io/issues/COACH-WATTS-1DA) | `parentNode` null on dashboard                 | Cascade from 1EF during mobile validation                                                                                               |
| [COACH-WATTS-1EC](https://newpush-y4.sentry.io/issues/COACH-WATTS-1EC) | Quotas fetch no response                       | Dev noise                                                                                                                               |
| [COACH-WATTS-1EG](https://newpush-y4.sentry.io/issues/COACH-WATTS-1EG) | Quotas fetch 401                               | Dev noise                                                                                                                               |
| [COACH-WATTS-3J](https://newpush-y4.sentry.io/issues/COACH-WATTS-3J)   | Promise rejection `undefined` on `/activities` | Safe task callbacks + workout page lifecycle guards                                                                                     |
| [COACH-WATTS-15P](https://newpush-y4.sentry.io/issues/COACH-WATTS-15P) | `addColorStop` invalid rgba                    | `withOpacity` helper in `ChartRenderer.vue` / `BaseWidget.vue`                                                                          |
| [COACH-WATTS-15E](https://newpush-y4.sentry.io/issues/COACH-WATTS-15E) | Prisma `featureFlags` unknown field            | `npx prisma generate`                                                                                                                   |
| [COACH-WATTS-12T](https://newpush-y4.sentry.io/issues/COACH-WATTS-12T) | Destructure `bum` from null                    | Unregister `useAnalyticsBus` listeners on unmount                                                                                       |
| [COACH-WATTS-1P](https://newpush-y4.sentry.io/issues/COACH-WATTS-1P)   | `parentNode` null                              | Fixed listener leaks in `workout-explorer.vue` / `ChartRenderer.vue`                                                                    |
| [COACH-WATTS-ZT](https://newpush-y4.sentry.io/issues/COACH-WATTS-ZT)   | Undefined `.p` in chat                         | Defensive checks in `ChatMessageContent.vue`                                                                                            |
| [COACH-WATTS-7A](https://newpush-y4.sentry.io/issues/COACH-WATTS-7A)   | `session is not defined`                       | Use `event.context.session` from `requireAuth`                                                                                          |
| [COACH-WATTS-130](https://newpush-y4.sentry.io/issues/COACH-WATTS-130) | `activities.value.filter is not a function`    | `Array.isArray` guard in `activities.vue`                                                                                               |
| [COACH-WATTS-ZH](https://newpush-y4.sentry.io/issues/COACH-WATTS-ZH)   | `timezone is not defined`                      | Renamed to `userTimezone` in `trigger/daily-checkin.ts`                                                                                 |
| [COACH-WATTS-10W](https://newpush-y4.sentry.io/issues/COACH-WATTS-10W) | `i is not a function` on workout detail        | Guard translation fn in `getWorkoutSourceLabel`                                                                                         |
| [COACH-WATTS-5X](https://newpush-y4.sentry.io/issues/COACH-WATTS-5X)   | `WorkoutAnalysisReady` not found               | Import alignment + `recommendationHighlights` guards                                                                                    |
| [COACH-WATTS-Z7](https://newpush-y4.sentry.io/issues/COACH-WATTS-Z7)   | `absPower is not defined`                      | Removed by refactor                                                                                                                     |
| [COACH-WATTS-18B](https://newpush-y4.sentry.io/issues/COACH-WATTS-18B) | `decoupling.toFixed` on null                   | Null checks in `AdvancedWorkoutMetrics.vue`                                                                                             |

_Batch resolved 2026-07-15: auth/chunk/dev-noise cluster (23, 1AA, 1B9, 1C4, 50, 1E8, 1DF, D, 9, C, 57, 1E9, 1E4, 1DE, 1EB, 1DG, 1DH), fix-committed cluster (66, 1CG, 3J, 1DB–1DD, 1D6, 1D8, 1D9, 1DQ, 1E0–1E3, 1E6, 1DR–1DY, 1DT, 1DV, 1DJ, 1DX, 1DW, 1DK, 16B, YD, 6Z)._

## Local development

Sentry is **off by default** during `pnpm dev` (`sentry.enabled: false` in `nuxt.config.ts`). This keeps HMR, Vite syntax errors, and missing Trigger.dev credentials out of the dashboard.

To test Sentry locally (e.g. `/debug/sentry`):

```bash
SENTRY_ENABLED=true pnpm dev
```

Requires `SENTRY_DSN` in `.env`. Production builds always enable Sentry when `NODE_ENV=production`.

## Maintenance Guidelines

1. **Sync from Sentry** — Run `/seer` or ask the agent to refresh unresolved issues; update the **Active** table above.
2. **New critical issues** — Add a row to **Active** and, if actionable, a matching `docs/issues/NNN-*.md` entry.
3. **When an issue is handled, close it in Sentry** — This is mandatory, not optional:
   - **Code fix shipped** and quiet for 24–48h → **Resolve** in Sentry with a short comment (commit, doc link, or root cause).
   - **Confirmed noise** (deploy blips, scanner traffic, extension errors) → **Resolve** or **Ignore** in Sentry; add `ignoreErrors` / `beforeSend` filters only when appropriate.
   - **Dev-only / transient HMR** → **Resolve** once source is valid and events have stopped.
   - Then move the row from **Active** or **Fix committed** to **Recently Resolved** in this file.
4. **Agents and developers** — After triaging or fixing a Sentry issue, always update Sentry status in the same session. Do not leave handled issues unresolved in the dashboard.
5. **Noise** — Add `ignoreErrors` patterns in `sentry.client.config.ts` only for confirmed third-party / scanner noise; document in `docs/issues/`.
6. **Batch plans** — Use `conductor/sentry-issues-resolution-plan.md` for multi-issue sprints; archive when complete.
