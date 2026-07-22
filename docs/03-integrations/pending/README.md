# Pending device / platform integrations

Engineering briefs for integrations that are **not yet live** in Coach Watts.
Each folder is designed so a **new agent chat** can run a browser-assisted
registration session, capture credentials into gitignored `.secrets/`, then
implement against the Coach Watts integration patterns used by Garmin / ROUVY /
Strava.

| Provider                                     | Brief                                             | Access model                         | Phase 0 (credentials)       | Phase 1 (product)                    |
| -------------------------------------------- | ------------------------------------------------- | ------------------------------------ | --------------------------- | ------------------------------------ |
| [Suunto](./suunto/README.md)                 | Partner review → API Zone                         | OAuth2 + Azure APIM subscription key | Apply + configure OAuth app | Workout FIT ingest (+ optional push) |
| [COROS](./coros/README.md)                   | Application-reviewed; docs private until approved | OAuth2 (details after approval)      | Submit API application      | Activity ingest ± planned workouts   |
| [Hammerhead / Karoo](./hammerhead/README.md) | Self-serve developer account                      | Public OAuth2 API                    | Create dashboard app        | Activity FIT ingest + workout push   |

## How to run a credentials session

1. Open a **new chat** scoped to one provider (e.g. “Suunto credentials session”).
2. Point the agent at that provider’s `agent-session.md`.
3. Agent uses the browser to complete forms, then writes values into
   `.secrets/<provider>.md` (gitignored) and proposes `.env` keys (never commit
   secrets).
4. Human reviews secrets, copies into local `.env` / prod secret store.
5. Start a second chat for implementation, using the same folder’s `README.md`
   plus existing patterns (`server/api/integrations/rouvy/*`,
   `server/utils/rouvy.ts`, `trigger/ingest-rouvy.ts`).

## Secrets rules

- **Never** commit client secrets, subscription keys, webhook secrets, or tokens.
- Capture working copies only under `.secrets/` (see root `.gitignore`).
- Prefer business email `laszlo.racz@coachwatts.com` for partner applications
  unless a portal requires a Google login (document which account was used).
- Redirect URIs to register for every OAuth provider:

| Environment | Redirect URI pattern                                          |
| ----------- | ------------------------------------------------------------- |
| Local       | `http://localhost:3099/api/integrations/<provider>/callback`  |
| Production  | `https://coachwatts.com/api/integrations/<provider>/callback` |

(Confirm local port matches `NUXT` / site URL in your `.env`.)

## Shared Coach Watts application facts (for forms)

Use these consistently across partner applications:

| Field             | Value                                                                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Legal entity      | Watt Mind Kft.                                                                                                                                                 |
| Product           | Coach Watts                                                                                                                                                    |
| Website           | https://coachwatts.com                                                                                                                                         |
| Privacy           | https://coachwatts.com/privacy                                                                                                                                 |
| Terms             | https://coachwatts.com/terms                                                                                                                                   |
| Logo              | https://coachwatts.com/media/logo-240.png                                                                                                                      |
| Contact           | László Rácz, Founder — `laszlo.racz@coachwatts.com`                                                                                                            |
| One-line use case | AI endurance coaching that unifies consented training and recovery data and can deliver structured workouts back to devices/platforms the athlete already uses |

## Marketing CRM

Live partner/outreach status lives in the watts-marketing repo:
`knowledge/distribution/integrations/contacts.md`.
