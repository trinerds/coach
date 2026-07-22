# COROS credentials capture template

Copy to **`.secrets/coros.md`** (gitignored). Never commit the filled file.

## Application

- Submitted: YYYY-MM-DD
- Form / ticket URL:
- Confirmation / ticket ID:
- Contact email used:
- Status: submitted / more-info / approved / rejected

## After approval

- Docs received: yes / no (paths under `tmp/coros-api/` if saved)
- Production client ID:
- Production client secret:
- Sandbox client ID:
- Sandbox client secret:
- Authorize URL:
- Token URL:
- API base URL:
- Scopes:
- Webhook support: yes / no / unknown
- Activity format (FIT/JSON):
- Workout push: yes / no / unknown
- Rate limits:

## Proposed `.env`

```bash
COROS_CLIENT_ID=
COROS_CLIENT_SECRET=
COROS_SANDBOX_CLIENT_ID=
COROS_SANDBOX_CLIENT_SECRET=
COROS_API_BASE_URL=
COROS_AUTH_BASE_URL=
```

## Notes
