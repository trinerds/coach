# E2E testing runbook

Shared backend stack for **web (Playwright)** and **companion mobile (Maestro/Detox)** tests.

## Stack

| Service           | Host port | Notes                                                   |
| ----------------- | --------- | ------------------------------------------------------- |
| Postgres          | `5440`    | DB `coach_e2e` — never touches local/dev data on `5439` |
| Redis (Dragonfly) | `6389`    | Dedicated; not the local `6379` instance                |
| Nuxt / API        | `3199`    | Docker (`app-e2e`) or host (`pnpm e2e:app:host`)        |

Compose file: `docker-compose.e2e.yml`  
Env template: `.env.e2e.example` → copy to `.env.e2e`

## One-time setup

```bash
cp .env.e2e.example .env.e2e
pnpm e2e:setup
```

`e2e:setup` starts Postgres + Redis, migrates/resets/seeds, then builds and starts the Docker app. The first app build can take several minutes (`Dockerfile.e2e`).

## Day-to-day

```bash
# Start / stop full stack
pnpm e2e:up
pnpm e2e:down

# Infra only (then run app on the host)
pnpm e2e:up:infra
pnpm e2e:db:prepare
pnpm e2e:app:host

# Reset DB (truncate + re-seed) while stack is up
pnpm e2e:reset

# Web E2E
pnpm test:e2e
pnpm test:e2e:ui
```

Playwright’s global setup re-runs DB prepare and waits for `GET /api/health` on `E2E_BASE_URL` (default `http://localhost:3199`).

## Auth helpers (E2E_MODE only)

| Endpoint                | Use                                       |
| ----------------------- | ----------------------------------------- |
| `POST /api/__e2e/login` | Cookie session for **web** Playwright     |
| `POST /api/__e2e/token` | Bearer token for **mobile** / API clients |

Both return 404 unless `E2E_MODE=true`.

Seeded fixtures:

- Athlete: `e2e-athlete@coachwatts.test`
- Admin: `e2e-admin@coachwatts.test`
- Mobile OAuth public client id: `e2e00000-0000-4000-8000-000000000001`
- Completed today `ActivityRecommendation` for the athlete (UTC)

Example Bearer mint:

```bash
curl -s -X POST http://localhost:3199/api/__e2e/token \
  -H 'content-type: application/json' \
  -d '{"email":"e2e-athlete@coachwatts.test"}'
```

## Mobile companion

Point the app / Maestro / Detox at the same API:

| Runtime          | Base URL                    |
| ---------------- | --------------------------- |
| iOS Simulator    | `http://localhost:3199`     |
| Android emulator | `http://10.0.2.2:3199`      |
| Physical device  | `http://<your-lan-ip>:3199` |

Use `POST /api/__e2e/token` (or `e2e/helpers/token.ts`) instead of full PKCE during automated runs. Production mobile auth remains OAuth PKCE against this same API.

## Scripts

| Script                         | Purpose                          |
| ------------------------------ | -------------------------------- |
| `e2e:setup`                    | Infra + DB prepare + Docker app  |
| `e2e:up` / `e2e:down`          | Full compose up/down             |
| `e2e:up:infra`                 | Postgres + Redis only            |
| `e2e:build`                    | Rebuild `app-e2e` image          |
| `e2e:db:prepare` / `e2e:reset` | Migrate, truncate, seed          |
| `e2e:app:host`                 | Nuxt dev on host with `.env.e2e` |
| `test:e2e`                     | Playwright                       |

## Notes

- Keep `workers: 1` until tests are isolated per worker DB.
- Do not enable `E2E_MODE` in production.
- CI wiring (same compose in GitHub Actions) is a follow-up once the local stack is stable.
