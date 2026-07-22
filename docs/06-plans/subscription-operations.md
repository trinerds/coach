# Subscription operations (Stripe + Apple + Google via RevenueCat)

Coach Watts is the authorization source of truth. RevenueCat normalizes commerce events, but mobile customer info alone never unlocks server-paid features. Provider rows project back to the legacy `User.subscription*` fields so existing gates keep their behavior during migration.

## Product mapping

Maintain one comma-separated mapping on the server:

- `SUBSCRIPTION_SUPPORTER_PRODUCT_IDS`: all Stripe product IDs and Apple/Google Supporter product IDs.
- `SUBSCRIPTION_PRO_PRODUCT_IDS`: all Stripe product IDs and Apple/Google Pro product IDs.

RevenueCat entitlement identifiers are exactly `supporter` and `pro`. Unknown products fail closed and emit `REVENUECAT_PRODUCT_MAPPING_FAILED`; add the store product to the correct mapping before retrying the event. The mobile build receives matching public product-ID lists only to label offerings. Prices and localized terms always come from the store SDK.

## Configuration and ownership

Backend-only values: `REVENUECAT_SECRET_API_KEY`, `REVENUECAT_STRIPE_APP_PUBLIC_API_KEY`, and `REVENUECAT_WEBHOOK_AUTHORIZATION`. Store private keys/service accounts live in RevenueCat or the store consoles. Mobile may contain only the platform public SDK keys.

Use `https://coachwatts.com/api/webhooks/revenuecat` as the production webhook and configure the exact authorization header value stored in `REVENUECAT_WEBHOOK_AUTHORIZATION`. Production should leave `REVENUECAT_ACCEPT_SANDBOX=false`; use a separate non-production deployment/configuration for sandbox events.

The Official Mobile App uses `profile:read` for `GET /api/subscriptions/me` and `profile:write` for `POST /api/subscriptions/reconcile`.

## Health and reconciliation

Monitor webhook response rates, `SubscriptionLifecycleEvent` lag, and audit actions prefixed `REVENUECAT_`. Retries reuse the same RevenueCat event ID and are idempotent. Older events are recorded as stale but cannot replace newer provider state.

After deployment, run `pnpm backfill:provider-subscriptions` once to seed provider rows from existing Stripe user fields. Then import active Stripe subscriptions to RevenueCat using the Stripe app public API key and compare active user/provider counts before enabling acquisition.

For customer lookup, start with the stable Coach Watts user UUID in RevenueCat and `ProviderSubscription.userId`. A foreground reconcile fetches that RevenueCat customer and recomputes the canonical tier.

## Support actions

- Collision: never cancel automatically. The highest valid tier is granted; help the athlete manage the unwanted provider and verify the next webhook/reconcile.
- Cancellation: keep access through the paid entitlement end.
- Refund/revocation: confirm the provider event, then verify remaining valid providers still determine the highest tier.
- Restore/transfer: authenticate the target Coach account first, restore in the app, and verify the canonical summary after reconciliation.
- Rollback: set both server and mobile native-subscription acquisition flags false. Existing subscribers and webhook processing remain active.

Watt Mind Kft. owns Apple/Google merchant agreements, catalog pricing, refunds, and store review. Engineering owns mappings, webhook health, reconciliation, and diagnostics. Support owns identity/collision triage and escalates provider-side refunds to the merchant owner.
