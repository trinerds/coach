# Suunto — agent credentials session

**Goal:** Get Coach Watts accepted into the Suunto Partner Network, configure the
OAuth app in API Zone, and capture secrets into `.secrets/suunto.md` (gitignored).

**Human must be present** for email verification, 2FA, and signing the API agreement.

## Preconditions

- [ ] Business mailbox access for `laszlo.racz@coachwatts.com` (Himalaya `-a coachwatts`)
- [ ] Company facts from [../README.md](../README.md) “Shared Coach Watts application facts”
- [ ] Local site URL / port known (default redirect assumes `http://localhost:3099`)
- [ ] Empty template ready: copy [credentials.template.md](./credentials.template.md) →
      `.secrets/suunto.md`

## Browser steps

### 1. Apply to partner programme

1. Open https://survey.alchemer.eu/s3/90553908/PARTNER-Become-a-Suunto-Partner  
   (also linked from https://www.suunto.com/welcomepartners).
2. Fill company + product details using the shared facts table.
3. Select interest in **Suunto Cloud API**.
4. Accept / sign the **API agreement** when shown.
5. List every developer email that needs API Zone access (at least
   `laszlo.racz@coachwatts.com`).
6. Mention marketing interest (partner directory / co-marketing) if asked.
7. Submit. Record submission date/time in `.secrets/suunto.md`.

### 2. Wait for acceptance (async)

- Expected: response within ~2 weeks; reviews weekly.
- Watch `coachwatts` inbox for Suunto / API Zone invite.
- If accepted but no portal invite: email `partners@suunto.com` (per FAQ).
- **Stop the session here** if not yet accepted; resume after invite.

### 3. Enter API Zone and subscribe (dev)

1. Open https://apizone.suunto.com/ and sign in with the invited account.
2. Subscribe to **Developer / Development API** (exact label in portal).
3. From profile → **Your subscriptions**, copy **primary subscription key** into
   `.secrets/suunto.md` as `SUUNTO_SUBSCRIPTION_KEY` (dev).
4. Do **not** subscribe to Production until the integration works.

### 4. Configure OAuth application

In profile → OAuth / application settings, set:

| Field                | Value                                                     |
| -------------------- | --------------------------------------------------------- |
| App name             | Coach Watts                                               |
| Client secret        | Generate strong secret; store immediately                 |
| Redirect URI (local) | `http://localhost:3099/api/integrations/suunto/callback`  |
| Redirect URI (prod)  | `https://coachwatts.com/api/integrations/suunto/callback` |
| Webhook URL (prod)   | `https://coachwatts.com/api/integrations/suunto/webhook`  |

Copy `CLIENT_ID` (auto) + `CLIENT_SECRET` into `.secrets/suunto.md`.

Note: Suunto FAQ says **one account = one app**. If local and prod need separate
apps, create a second partner account with a second email before production.

### 5. Smoke-test OAuth (optional in same session)

1. Create / use a Suunto App test account (mobile app).
2. Open authorize URL from [how-to-start](https://apizone.suunto.com/how-to-start):

```text
https://cloudapi-oauth.suunto.com/oauth/authorize?response_type=code&client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>
```

3. Approve; capture `code` from redirect (local callback may 404 until code exists —
   that is OK; still capture query params).
4. Exchange code for tokens (agent may run curl locally — **do not** paste tokens
   into git docs):

```bash
curl -s https://cloudapi-oauth.suunto.com/oauth/token \
  --user '<CLIENT_ID>:<CLIENT_SECRET>' \
  -d grant_type=authorization_code \
  -d redirect_uri='http://localhost:3099/api/integrations/suunto/callback' \
  -d code='<AUTHORIZATION_CODE>'
```

5. Call workouts with JWT + subscription key; confirm HTTP 200:

```bash
curl -s https://cloudapi.suunto.com/v2/workouts \
  -H "Authorization: Bearer <JWT>" \
  -H "Ocp-Apim-Subscription-Key: <SUBSCRIPTION_KEY>"
```

### 6. Persist env proposals

Append proposed `.env` lines to `.secrets/suunto.md` and remind human to copy into
local `.env` / production secret manager:

```bash
SUUNTO_CLIENT_ID=
SUUNTO_CLIENT_SECRET=
SUUNTO_SUBSCRIPTION_KEY=
```

### 7. Session report (to human)

Return a short checklist:

- Application submitted / accepted / API Zone access
- Dev subscription key captured (yes/no)
- OAuth client id/secret captured (yes/no)
- Redirect + webhook URLs registered
- Smoke test result
- Blockers / waiting on Suunto

## Do not

- Commit `.secrets/suunto.md` or paste secrets into `docs/`
- Subscribe to Production API before MVP works
- Promise sleep/HRV from Suunto Cloud API
- Use Movescount credentials (Suunto App accounts only)
