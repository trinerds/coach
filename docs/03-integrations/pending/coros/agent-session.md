# COROS — agent credentials session

**Goal:** Submit a focused COROS API application for Coach Watts and capture any
immediate confirmation IDs. Full client IDs/secrets usually arrive **only after
approval** with private documentation.

**Human must be present** for form CAPTCHA, email verification, and any NDAs.

## Preconditions

- [ ] Business email `laszlo.racz@coachwatts.com` available
- [ ] Application talking points from [README.md](./README.md)
- [ ] Current user/market stats verified if the form asks for scale (do not invent)
- [ ] Copy [credentials.template.md](./credentials.template.md) → `.secrets/coros.md`

## Browser steps

### 1. Open the official application path

1. Navigate to  
   https://support.coros.com/hc/en-us/articles/17085887816340-Submit-an-API-Application
2. Click the article’s **“click here”** / submit link (destination may be a hosted
   form; follow redirects).
3. If the link is broken or blocked:
   - Open https://support.coros.com/hc/en-us/requests/new
   - Choose topic **API Access and Integration**
   - Paste the same application package as the request body
   - Optionally CC/notify via `sales@coros.com` only if support asks

### 2. Fill the application

Use the package table in [README.md](./README.md). Emphasize:

- Athlete-consented coaching use case (not data brokerage)
- Existing production integrations (Garmin, Strava, WHOOP, …) as compliance proof
- MVP ask: **activity import**; planned-workout push as a secondary ask
- Redirect URIs for local + production
- Privacy/Terms/logo URLs

Save screenshots of the confirmation page into a local folder **outside git** if
useful (e.g. Desktop), not into the repo.

### 3. Record submission metadata

In `.secrets/coros.md`:

- Date/time submitted
- Form URL final landing page
- Confirmation / ticket number
- Email address used
- Whether sandbox was mentioned

### 4. Mailbox watch (async)

- Monitor `coachwatts` for COROS replies.
- When private docs + client credentials arrive:
  - Store secrets in `.secrets/coros.md`
  - Save docs under `tmp/coros-api/` if license allows
  - Fill `COROS_API_BASE_URL` / auth URLs / scopes checklist in the secrets file
- If rejected: record reason; set marketing CRM stage to `closed` or `paused`.

### 5. Session report

- Form submitted: yes/no + confirmation ID
- Waiting on COROS approval
- Any immediate credentials? (usually no)
- Next human action: wait / reply with more info

## Do not

- Start coding against unofficial COROS reverse-engineering
- Claim COROS in athlete-facing docs before approval + working ingest
- Commit credentials or private COROS PDFs if their license forbids redistribution
  (default: keep private docs in `tmp/` and out of public marketing repos)
