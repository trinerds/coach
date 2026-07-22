# Suunto credentials capture template

Copy this file to **`.secrets/suunto.md`** (gitignored). Fill during the agent session.
Never commit the filled file.

## Status

- Application submitted: YYYY-MM-DD
- Portal account email:
- Acceptance email date:
- API Zone access: yes / no
- Environment: development / production

## App registration

- App name: Coach Watts
- Client ID:
- Client secret:
- Redirect URIs registered:
  - local:
  - production:
- Webhook URL:
- Subscription name:
- Subscription key (primary):
- Subscription key (secondary, optional):

## Smoke test

- Authorize OK: yes / no
- Token exchange OK: yes / no
- `GET /v2/workouts` OK: yes / no
- Notes:

## Proposed `.env`

```bash
SUUNTO_CLIENT_ID=
SUUNTO_CLIENT_SECRET=
SUUNTO_SUBSCRIPTION_KEY=
```

## Contacts / tickets

- partners@suunto.com threads:
- Other:
