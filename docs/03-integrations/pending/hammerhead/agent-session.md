# Hammerhead — agent credentials session

**Goal:** Create a Hammerhead developer app for Coach Watts, accept the API
licence, and capture Client ID / Secret / webhook secret into
`.secrets/hammerhead.md`.

**Human must be present** for account signup, email verification, and licence accept.

## Preconditions

- [ ] Email for developer account (prefer `laszlo.racz@coachwatts.com` or a dedicated
      `dev@…` alias that you control)
- [ ] Coach Watts SVG logo available (repo has brand assets; or
      https://coachwatts.com/media/logo-240.png — convert to SVG if dashboard requires SVG)
- [ ] Copy [credentials.template.md](./credentials.template.md) → `.secrets/hammerhead.md`
- [ ] Optional: download OpenAPI for offline use:
      `curl -sL https://api.hammerhead.io/v1/docs/openapi.yml -o tmp/hammerhead-api/openapi.yml`

## Browser steps

### 1. Create developer account

1. Open https://support.hammerhead.io/hc/en-us/articles/43558376710683-Creating-a-Developer-Account
2. Follow **Step 1**: create an account on the **Hammerhead Dashboard** (link from
   that article — typically a dashboard.hammerhead.io / SRAM login; follow the
   official link, do not guess phishing URLs).
3. Verify email if prompted.

### 2. Enable developer settings

1. Use the article’s **Step 2** link to enable developer settings on the account.
2. If the link expires, re-open the support article for a fresh enable URL or ask
   `hammerhead.integrations@sram.com`.

### 3. Register the app

Fill:

| Field         | Value                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| App name      | Coach Watts                                                                                                                    |
| Description   | AI endurance coaching platform. Imports consented Karoo activities and can deliver structured workouts for execution on Karoo. |
| SVG logo      | Upload Coach Watts mark                                                                                                        |
| Redirect URLs | `http://localhost:3099/api/integrations/hammerhead/callback` and `https://coachwatts.com/api/integrations/hammerhead/callback` |
| Webhook URLs  | `https://coachwatts.com/api/integrations/hammerhead/webhook` (add local tunnel later if needed)                                |

### 4. Accept API licence

1. Read / accept the licence (also at  
   https://support.hammerhead.io/hc/en-us/articles/42738760915099-API-Licence-Document).
2. Questions → `hammerhead.integrations@sram.com`.

### 5. Copy credentials from API settings

From the dashboard **API settings** tab, capture into `.secrets/hammerhead.md`:

- Client ID
- Client secret
- Webhook secret
- Confirm redirect + webhook URLs

### 6. Smoke test (same session if possible)

1. Build authorize URL (scopes for MVP):

```text
https://api.hammerhead.io/v1/auth/oauth/authorize?response_type=code&client_id=<CLIENT_ID>&redirect_uri=http://localhost:3099/api/integrations/hammerhead/callback&scope=activity:read%20workout:write&state=<RANDOM>
```

2. Log in with a Karoo / Hammerhead test rider account; approve scopes.
3. Capture `code` from redirect (404 on local callback is OK before implementation).
4. Exchange token:

```bash
curl -s https://api.hammerhead.io/v1/auth/oauth/token \
  -d client_id='<CLIENT_ID>' \
  -d client_secret='<CLIENT_SECRET>' \
  -d grant_type=authorization_code \
  -d code='<CODE>' \
  -d redirect_uri='http://localhost:3099/api/integrations/hammerhead/callback'
```

5. List activities:

```bash
curl -s 'https://api.hammerhead.io/v1/api/activities?perPage=5' \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

6. If an activity id exists, download FIT (`/activities/{id}/file`).

Record pass/fail in `.secrets/hammerhead.md`. **Do not** paste access tokens into git docs.

### 7. Session report

- Dashboard account email
- Licence accepted
- Client ID/secret + webhook secret captured
- Redirect/webhook URLs registered
- Smoke test results
- Ready for implementation chat: yes/no

## Do not

- Commit `.secrets/hammerhead.md`
- Request unnecessary scopes on first consent (`route:*` / `metrics:write` can wait)
- Confuse Karoo **extensions** (on-device) with this Cloud API
