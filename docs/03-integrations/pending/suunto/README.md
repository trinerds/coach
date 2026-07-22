# Suunto Cloud API — integration brief

**Status:** not in Coach Watts codebase (2026-07-22). No `suunto` provider.
**Goal:** Direct OAuth so Suunto athletes do not need Strava/Garmin/Intervals as a bridge.
**Agent credentials session:** [agent-session.md](./agent-session.md)

## Why

Suunto watches sync to Suunto App. A first-party connect reduces drop-off for
athletes who never export elsewhere and unlocks partner directory / co-marketing
on Suunto.com after production approval.

## Partner access model

| Item              | Detail                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Programme         | [Suunto Partner Network](https://www.suunto.com/welcomepartners) / [Welcome partners](https://www.suunto.com/partners/welcome-partners/) |
| Apply form        | [Become a Suunto Partner](https://survey.alchemer.eu/s3/90553908/PARTNER-Become-a-Suunto-Partner)                                        |
| Contact           | `partners@suunto.com`                                                                                                                    |
| Developer portal  | [API Zone](https://apizone.suunto.com/) (Azure API Management)                                                                           |
| Review            | Weekly review; up to **two weeks**; **not for personal/hobby** apps — commercial/org tools only                                          |
| Cost              | No API fee stated                                                                                                                        |
| Docs after accept | [How to start](https://apizone.suunto.com/how-to-start), [APIs](https://apizone.suunto.com/apis), [FAQ](https://apizone.suunto.com/faq)  |

## What the API offers (publicly documented)

| Direction | Capability                                       | Notes                                                         |
| --------- | ------------------------------------------------ | ------------------------------------------------------------- |
| Pull      | Workouts as FIT (preferred for full samples/GPS) | Summary + samples (HR, RR, power, altitude, temp, GPS)        |
| Pull      | Workout list / JSON summaries                    | Use list, then FIT per workout                                |
| Pull      | Daily activity (steps, calories)                 | No sleep, weight, HR zones, or POIs yet                       |
| Push      | Workouts as FIT                                  | Appear like device-tracked sessions in Suunto App             |
| Push      | Routes as GPX                                    | Navigation on watch via Suunto App                            |
| Notify    | Workout webhooks                                 | POST with `username` + `workoutid`; no daily-activity webhook |

**Sleep / body metrics:** not available on Cloud API yet — do not promise them in
marketing until Suunto publishes them.

## Auth & keys (after acceptance)

| Secret                        | Where it comes from                                    | Used for                                                    |
| ----------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| `SUUNTO_CLIENT_ID`            | API Zone profile → OAuth app settings (auto-generated) | OAuth authorize + token                                     |
| `SUUNTO_CLIENT_SECRET`        | Same (you set/generate)                                | Token exchange (HTTP Basic `client_id:client_secret`)       |
| `SUUNTO_SUBSCRIPTION_KEY`     | Profile → subscriptions (dev then production)          | Header `Ocp-Apim-Subscription-Key` on `cloudapi.suunto.com` |
| Per-user access JWT + refresh | OAuth code flow                                        | Header `Authorization: Bearer <jwt>`                        |
| Webhook URL                   | App OAuth settings                                     | New workout notifications                                   |

### OAuth endpoints

| Step      | URL                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------- |
| Authorize | `https://cloudapi-oauth.suunto.com/oauth/authorize?response_type=code&client_id=<ID>&redirect_uri=<URI>` |
| Token     | `POST https://cloudapi-oauth.suunto.com/oauth/token` with Basic auth + `grant_type=authorization_code`   |
| API base  | `https://cloudapi.suunto.com` (e.g. `GET /v2/workouts`)                                                  |

Token response includes `access_token` (JWT), `refresh_token`, `expires_in` (~86400),
`scope` (e.g. `workout`). JWT custom claim `user` = Suunto App username (needed to
map webhook notifications).

**Environments:** One API Zone account = one app. Use separate partner accounts /
emails for staging vs production if both must be registered.

## Coach Watts product scope (proposed)

### Phase A — MVP (read)

1. OAuth connect in Settings → Apps (`provider: suunto`).
2. Ingest workout history via list + FIT download (mirror ROUVY/Garmin FIT path).
3. Manual sync + Sync All wiring; webhook optional but preferred.
4. Deduplicate against Strava/Garmin when the same ride arrives twice.

### Phase B — write (optional)

5. Push planned workouts as FIT (confirm watch delivery semantics before marketing).
6. Routes push only if product needs navigation export.

### Non-goals for v1

- Sleep / wellness (unavailable).
- Movescount API (legacy; Suunto says use Cloud API).
- China (`Suunto ZH`) endpoints — contact Suunto after Western production works.

## Implementation sketch (after credentials)

Mirror ROUVY:

| Piece                             | Suggested path                                                        |
| --------------------------------- | --------------------------------------------------------------------- |
| Client                            | `server/utils/suunto.ts`                                              |
| Authorize / callback / disconnect | `server/api/integrations/suunto/*`                                    |
| Webhook                           | `server/api/integrations/suunto/webhook.post.ts`                      |
| Ingest                            | `trigger/ingest-suunto.ts` (+ FIT parser reuse)                       |
| UI                                | `ConnectedApps.vue` card                                              |
| Env                               | `SUUNTO_CLIENT_ID`, `SUUNTO_CLIENT_SECRET`, `SUUNTO_SUBSCRIPTION_KEY` |

## Partner application talking points

- Entity: Watt Mind Kft. / Coach Watts
- Audience: endurance athletes already on Suunto watches
- Data use: athlete-consented workout import for AI coaching; least privilege
- Marketing: interested in partner directory listing after production readiness
- Developers to invite to API Zone: list `laszlo.racz@coachwatts.com` (+ any other
  engineer emails that need portal access)

## Open questions to resolve in credentials session

- [ ] Application accepted? API Zone invite received?
- [ ] Dev subscription key issued?
- [ ] OAuth redirect URIs registered (local + prod)?
- [ ] Webhook URL set (prod HTTPS only)?
- [ ] Confirmed whether workout **push** FIT is in the same subscription as pull?
- [ ] Staging vs prod: second email/account created if needed?

## References

- Partner welcome: https://www.suunto.com/welcomepartners
- Apply: https://survey.alchemer.eu/s3/90553908/PARTNER-Become-a-Suunto-Partner
- Content submit (later): https://survey.alchemer.eu/s3/90553909/Suunto-Content-submit-for-Partners
- API Zone: https://apizone.suunto.com/
- How to start: https://apizone.suunto.com/how-to-start
- FAQ: https://apizone.suunto.com/faq
