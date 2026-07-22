# Hammerhead Karoo API — integration brief

**Status:** not in Coach Watts codebase (2026-07-22). No `hammerhead` / `karoo` provider.
**Goal:** Pull Karoo activities (FIT) and push structured workouts (FIT/ZWO) for cyclists.
**Agent credentials session:** [agent-session.md](./agent-session.md)

## Why

Karoo is a cycling computer with a **public developer API** (self-serve). This is
usually faster than Suunto/COROS partner review and complements ROUVY/Wahoo for
outdoor ride execution.

## Partner access model

| Item                     | Detail                                                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Platform page            | [Hammerhead Developer Platform](https://www.hammerhead.io/pages/developer-platform)                                         |
| Create account           | [Creating a Developer Account](https://support.hammerhead.io/hc/en-us/articles/43558376710683-Creating-a-Developer-Account) |
| API docs (interactive)   | https://api.hammerhead.io/v1/docs                                                                                           |
| OpenAPI                  | https://api.hammerhead.io/v1/docs/openapi.yml                                                                               |
| Licence                  | [API Licence Document](https://support.hammerhead.io/hc/en-us/articles/42738760915099-API-Licence-Document)                 |
| Licence questions        | `hammerhead.integrations@sram.com`                                                                                          |
| Support                  | `support@hammerhead.io` / https://support.hammerhead.io/                                                                    |
| Official partner listing | Separate “official partner” path on the developer platform (optional; public API works without it)                          |

## Auth

OAuth 2.0 authorization code + refresh.

| Step        | URL                                                   |
| ----------- | ----------------------------------------------------- |
| Authorize   | `https://api.hammerhead.io/v1/auth/oauth/authorize`   |
| Token       | `https://api.hammerhead.io/v1/auth/oauth/token`       |
| Deauthorize | `https://api.hammerhead.io/v1/auth/oauth/deauthorize` |
| API base    | `https://api.hammerhead.io/v1/api/`                   |

### Scopes (space-delimited)

| Scope                        | Purpose                                         | Coach Watts MVP       |
| ---------------------------- | ----------------------------------------------- | --------------------- |
| `activity:read`              | List/get activities + FIT + activity webhooks   | **Required**          |
| `workout:write`              | Create/update/delete workouts (`.fit` / `.zwo`) | **Required** for push |
| `route:read` / `route:write` | Routes                                          | Optional later        |
| `metrics:write`              | Push FTP / zones / weight                       | Optional later        |

Users may grant a **subset** of requested scopes on the consent screen — handle
partial grants.

### Dashboard app fields (after enabling developer settings)

- App name, description, SVG logo
- Client ID, Client secret
- Redirect URLs
- Webhook secret, Webhook URLs
- Accept API Licensing agreement

## API surface we care about

| Method | Path                    | Scope                   | Use                                                                         |
| ------ | ----------------------- | ----------------------- | --------------------------------------------------------------------------- |
| GET    | `/activities`           | `activity:read`         | Paginated activity summaries (`page`, `perPage`, `startDate`)               |
| GET    | `/activities/{id}`      | `activity:read`         | Detail                                                                      |
| GET    | `/activities/{id}/file` | `activity:read`         | FIT binary (`application/vnd.ant.fit`)                                      |
| POST   | `/workouts/file`        | `workout:write`         | Multipart workout file (`.fit` / `.zwo`); optional `plannedDate=YYYY-MM-DD` |
| PUT    | `/workouts/{id}/file`   | `workout:write`         | Update                                                                      |
| DELETE | `/workouts/{id}`        | `workout:write`         | Delete (only workouts created by our client)                                |
| POST   | webhook                 | HMAC `X-Hmac-Signature` | Activity sync notifications (`activityId`, `userId`)                        |

Token response includes `access_token`, `refresh_token`, `expires_in`, `user_id`.

## Coach Watts product scope (proposed)

### Phase A — MVP

1. OAuth connect (`provider: hammerhead` or `karoo` — pick one ID and stick to it;
   recommend `hammerhead`).
2. Activity ingest via list + FIT file (reuse FIT pipeline).
3. Activity webhook with HMAC verification using dashboard webhook secret.
4. Settings card + sync wiring.

### Phase B

5. Publish planned workouts as ZWO or FIT (`workout:write`), similar to ROUVY ZWO push.
6. Optional metrics push (`metrics:write`) for FTP/zones if product wants Karoo zones synced.

### Non-goals for v1

- Karoo **device extensions** / on-device apps (separate from Cloud API).
- Official partner store listing (can follow after MVP works).

## Env keys

```bash
HAMMERHEAD_CLIENT_ID=
HAMMERHEAD_CLIENT_SECRET=
HAMMERHEAD_WEBHOOK_SECRET=
```

## Implementation sketch

| Piece            | Suggested path                                                         |
| ---------------- | ---------------------------------------------------------------------- |
| Client           | `server/utils/hammerhead.ts`                                           |
| OAuth            | `server/api/integrations/hammerhead/{authorize,callback,disconnect}.*` |
| Webhook          | `server/api/integrations/hammerhead/webhook.post.ts`                   |
| Ingest           | `trigger/ingest-hammerhead.ts`                                         |
| Publish          | extend planned-workout publish (like `rouvy-workout-publisher.ts`)     |
| OpenAPI snapshot | `tmp/hammerhead-api/openapi.yml` (download from public URL)            |
| UI               | `ConnectedApps.vue`                                                    |

Pattern references: ROUVY OAuth + FIT ingest + workout publish.

## Redirect / webhook URLs to register

| Env   | Redirect                                                      | Webhook                                                      |
| ----- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| Local | `http://localhost:3099/api/integrations/hammerhead/callback`  | ngrok/public tunnel only if testing webhooks locally         |
| Prod  | `https://coachwatts.com/api/integrations/hammerhead/callback` | `https://coachwatts.com/api/integrations/hammerhead/webhook` |

## Open questions for credentials session

- [ ] Developer account created with which email?
- [ ] API licence accepted?
- [ ] Client ID/secret + webhook secret captured?
- [ ] Redirect URLs saved?
- [ ] SVG logo uploaded (use Coach Watts logo SVG if required)?
- [ ] Smoke: authorize → list activities → download one FIT?

## Ecosystem peers seen on Karoo “Connect” (2026-07-22)

These are **other apps** that already connect to Hammerhead — useful as Coach Watts
integration prospects, not as steps inside the Hammerhead credential session.
Tracked in watts-marketing `knowledge/distribution/integrations/contacts.md`.

| App           | Karoo promise                  | Coach Watts take                                              |
| ------------- | ------------------------------ | ------------------------------------------------------------- |
| Ride with GPS | Sync rides + pinned routes     | **Best next:** public OAuth API                               |
| Nolio         | Sync rides + upcoming workouts | Open API after form; coaching overlap — careful positioning   |
| Komoot        | Sync rides + planned routes    | Partner-only API; low odds for a coaching app                 |
| Sentiero      | Sync rides                     | Nutrition/metabolic tool; overlap + no public API → pause     |
| Xert          | Sync rides                     | Adaptive training competitor; API uses password grant → pause |

## References

- Developer platform: https://www.hammerhead.io/pages/developer-platform
- Create developer account: https://support.hammerhead.io/hc/en-us/articles/43558376710683-Creating-a-Developer-Account
- API docs: https://api.hammerhead.io/v1/docs
- OpenAPI: https://api.hammerhead.io/v1/docs/openapi.yml
- API licence: https://support.hammerhead.io/hc/en-us/articles/42738760915099-API-Licence-Document
