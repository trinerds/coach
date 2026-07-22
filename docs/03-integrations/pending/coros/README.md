# COROS API — integration brief

**Status:** not in Coach Watts codebase (2026-07-22). No `coros` provider.
**Goal:** Direct COROS activity ingest; explore planned-workout delivery if API allows.
**Agent credentials session:** [agent-session.md](./agent-session.md)

## Why

COROS has a large endurance audience that often skips Garmin/Suunto. Direct connect
removes the “export to Strava first” friction. Access is **application-reviewed**
and **not guaranteed**.

## Partner access model

| Item                      | Detail                                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public docs               | **None** until approved — API documentation is private                                                                                               |
| Apply                     | [Submit an API Application](https://support.coros.com/hc/en-us/articles/17085887816340-Submit-an-API-Application) (follow “click here” on that page) |
| Fallback support          | [COROS support request](https://support.coros.com/hc/en-us/requests/new) → topic **API Access and Integration**                                      |
| Sales / partner inquiries | `sales@coros.com` (use only if form path stalls)                                                                                                     |
| Review criteria (stated)  | Market size, how data will be used, other factors                                                                                                    |
| Auth (post-approval)      | OAuth 2.0 expected (third-party integrators document OAuth; scopes not public)                                                                       |
| Sandbox                   | COROS maintains a separate sandbox/test environment after access (per public integrator notes)                                                       |

Until COROS shares docs, treat endpoint lists and scopes as **TBD — fill after approval**.

## What we believe we need (hypothesis)

Based on Coach Watts needs and how peers integrate COROS (not official COROS docs):

| Capability                      | Priority       | Notes                                    |
| ------------------------------- | -------------- | ---------------------------------------- |
| OAuth connect + refresh         | Required       | Store like Garmin/ROUVY                  |
| Activity / workout history pull | Required (MVP) | Prefer FIT or structured samples         |
| Webhooks or change feed         | Nice           | Else poll                                |
| Planned workout push to watch   | Desired        | Confirm in private docs before promising |
| Sleep / recovery metrics        | Optional       | Only if documented                       |

## Coach Watts product scope (proposed)

### Phase A — after credentials + private docs arrive

1. Read private OpenAPI / PDF from COROS; snapshot under `tmp/coros-api/` (do not
   commit if license forbids; otherwise OK like `tmp/rouvy-api/`).
2. Implement `provider: coros` OAuth + activity ingest.
3. Wire Settings UI, sync guards, Sync All.

### Phase B

4. Planned workout delivery if API supports it.
5. Production app listing in COROS “3rd Party Apps” if they offer one.

### Non-goals until docs confirm

- Claiming COROS support in athlete marketing
- Building against unofficial reverse-engineered APIs

## Application package (prepare before browser session)

Have these ready to paste into the COROS form:

| Field                          | Suggested content                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Company                        | Watt Mind Kft.                                                                                                      |
| Product                        | Coach Watts — https://coachwatts.com                                                                                |
| Contact                        | László Rácz — `laszlo.racz@coachwatts.com`                                                                          |
| Category                       | AI endurance coaching / training platform                                                                           |
| Users / market                 | Growing international endurance base; cite current registered-user count from prod if asked (verify before stating) |
| Data use                       | Athlete-consented activity import for coaching recommendations; no resale of data; least-privilege scopes           |
| Redirect URIs                  | `http://localhost:3099/api/integrations/coros/callback`, `https://coachwatts.com/api/integrations/coros/callback`   |
| Privacy / Terms                | https://coachwatts.com/privacy , https://coachwatts.com/terms                                                       |
| Logo                           | https://coachwatts.com/media/logo-240.png                                                                           |
| Existing integrations evidence | Garmin, Strava, WHOOP, ROUVY, Ultrahuman, etc. already in production                                                |

**Tone:** Narrow, athlete-consent-first. Do not oversell market size. Emphasize
compliance experience with Garmin/Strava reviews.

## Env keys (placeholders until COROS issues real ones)

```bash
COROS_CLIENT_ID=
COROS_CLIENT_SECRET=
# Optional if they issue separate sandbox apps:
COROS_SANDBOX_CLIENT_ID=
COROS_SANDBOX_CLIENT_SECRET=
COROS_API_BASE_URL=          # fill from private docs
COROS_AUTH_BASE_URL=         # fill from private docs
```

## Implementation sketch (after docs)

| Piece              | Suggested path                               |
| ------------------ | -------------------------------------------- |
| Client             | `server/utils/coros.ts`                      |
| OAuth routes       | `server/api/integrations/coros/*`            |
| Ingest             | `trigger/ingest-coros.ts`                    |
| UI                 | `ConnectedApps.vue`                          |
| Local API snapshot | `tmp/coros-api/` (if redistribution allowed) |

## Open questions for credentials / docs session

- [ ] Application submitted? Ticket / confirmation ID?
- [ ] Approved / rejected / more info requested?
- [ ] Sandbox vs production client IDs?
- [ ] Scopes list?
- [ ] Activity pull format (FIT / JSON / both)?
- [ ] Workout push supported?
- [ ] Webhooks?
- [ ] Rate limits?
- [ ] Branding / directory listing requirements?

## References

- API application article: https://support.coros.com/hc/en-us/articles/17085887816340-Submit-an-API-Application
- Supported 3rd party apps (context): https://support.coros.com/hc/en-us/articles/360040256531-Supported-3rd-Party-Apps
- Support portal: https://support.coros.com/hc/en-us/requests/new
- Public integrator note (unofficial): https://docs.nango.dev/integrations/all/coros
