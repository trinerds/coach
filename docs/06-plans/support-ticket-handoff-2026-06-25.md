# Support Ticket Handoff - 2026-06-25

Last updated: 2026-06-25

## Purpose

This document is the quick-start handoff for a new context.

Read this first if the goal is to continue support-ticket triage, cleanup, or bug-fix prioritization without replaying the full investigation history.

## Source Documents

- [support-ticket-task-list-2026-06-16.md](./support-ticket-task-list-2026-06-16.md)
- [support-ticket-investigation-2026-06-16.md](./support-ticket-investigation-2026-06-16.md)
- [support-ticket-triage-2026-06-16.md](./support-ticket-triage-2026-06-16.md)
- [support-feature-request-tracker-2026-06-25.md](./support-feature-request-tracker-2026-06-25.md)

## What Was Completed

Engineering and ticket-management progress already made:

- workout access-hardening changes were implemented and previously committed
- Intervals sync hardening was implemented and previously committed
- activity/rendering hardening was implemented and previously committed
- several stale sync tickets were investigated, annotated, and closed
- several feature requests were removed from the engineering bug queue, politely closed, and copied into the feature-request tracker
- account-operation tickets were removed from the engineering bug queue and closed as support/admin workflow items
- the Garmin reconnect-style ticket was closed as operational/support rather than kept as an engineering defect

## Tickets Closed In The Latest Cleanup

Closed as stale or duplicate-style sync reports:

- `8f567102-c948-4039-8e73-5fe60f9f9047`
- `d46cdb78-c9d3-427d-9bb1-289debbaca35`
- `8d59d539-0021-4530-8dc8-e13161d752c0`
- `e4812fc8-7053-4fc4-ac2b-92aa39d69479`

Closed as feature requests:

- `da87107d-304b-4ef5-8857-91374ad2d35d`
- `25b50490-1753-4090-99cb-7249ffeb9144`
- `592855b1-7725-4849-8c3a-8ed6c1ac5cd0`
- `c7fb0210-2535-4995-b01d-c2f540962cd0`
- `36e8f7b5-eb20-44ae-942e-029466a8cce6`

Closed as support or operational items:

- `9f3975a4-55fd-40c5-a757-d420a95e9424`
- `b20dbdce-f330-4c1b-ba9e-1b0effad4806`
- `0686046e-ac48-4411-b7fe-0783ee13e410`

## What Remains Actively Relevant

Highest-value remaining non-chat, non-workout-generation items:

### 1. Sync Reliability And Ingestion

Most important remaining ticket from the recent sweep:

- `85182d74-4ba2-469b-bd89-1f56857f6a51`

Why it still matters:

- Intervals is connected
- the account has a later sync marker
- but the newest imported Intervals workout is still only `2026-01-19`
- this still looks like a real historical-import or source-filtering defect

Borderline ticket worth one more careful pass before closure:

- `fd7c42ec-19f1-4a15-bde9-4ffd223af28d`

Why it is borderline:

- no Intervals workout exists on the reported date
- but a Strava ride for that date does exist in the app
- this may be stale, or may be a source-specific mismatch rather than a true absence

Out of scope for now:

- `221c609f-ae1c-4020-b4cc-d61d059d39e9`

Reason:

- it affects planned-workout publishing to Intervals
- user explicitly asked to avoid workout-generation or trigger-related work for now

### 2. Activity Tab And Workout Rendering

Current anchor tickets:

- `d1f6ddbd-90b6-4bc6-aac7-7b87771bfa34`
- `eeccc4ba-554c-4475-a457-72dfcbba8f73`
- `fcc8048a-e902-4d8f-a99a-902c0cb08442`
- `2963ef72-0fe5-4439-8984-3fe2647f1034`
- `99e9b58a-ac01-44f2-bd61-11b22a3876fc`

Why this is still a good workstream:

- code hardening already landed
- user wanted to avoid workout-generation trigger changes
- this cluster is still product-visible and likely patchable without crossing into the deferred trigger work

### 3. Data Quality And Deduplication

Still queued, but may be a good next sweep if sync work pauses:

- `c5e9c90d-195e-4cad-aa8e-49f9148bfe57`
- `539f2504-dc14-45f8-9f06-126738060117`
- `605032e8-4bfc-4b2d-bc4f-fdfd6515638d`
- `e94d9003-69f5-454f-b35b-9b296100e797`
- `2e217b37-abeb-4b92-bc82-b8b7f01e7637`
- `d2563a93-06a7-4477-87de-18f462c3dca7`
- `61d438f4-2d8a-430e-ab24-8d2c57fa7b07`
- `66b474a5-7a39-43a9-a8ef-11da0db5a9ca`
- `ee4e6641-c4f6-4382-9210-ae8556025145`
- `6f933f13-4d8e-426c-8eb9-b4239a95346c`
- `3c6b08b7-8969-41be-a346-7d1319f5968e`

## Explicit Scope Constraints

Keep these constraints active unless the user changes direction:

- skip chat-related tickets for now
- skip workout-generation and publish-trigger changes for now
- focus on bugs, stale ticket cleanup, and operational triage rather than new features

## Ticket-System Caveat

The CLI does not currently support a `DUPLICATE` status even though the support guide mentions it.

Available close states seen in practice:

- `OPEN`
- `IN_PROGRESS`
- `NEED_MORE_INFO`
- `RESOLVED`
- `CLOSED`

Practical workflow used in this pass:

- add an internal note describing the duplicate or stale rationale
- add a polite user-facing message
- close the ticket as `CLOSED`

## Test Environment Note

The test environment now runs again.

What was verified:

- targeted Vitest execution works
- `tests/unit/server/utils/analyticsScope.test.ts` passes
- `tests/unit/server/utils/intervals-sync.test.ts` partially fails because the mock setup is outdated, not because the environment is broken

Important implication:

- do not keep saying tests are blocked by environment setup
- the remaining issue is test maintenance, not inability to execute tests

## Recommended Next Moves In A Fresh Context

1. Continue with `85182d74-4ba2-469b-bd89-1f56857f6a51` as the best remaining sync investigation.
2. Decide whether `fd7c42ec-19f1-4a15-bde9-4ffd223af28d` should be closed as stale or kept as a source-specific mismatch.
3. If ticket cleanup pauses, resume the activity/rendering cluster rather than touching workout-generation triggers.
4. Keep all new feature requests out of the engineering bug queue and record them in [support-feature-request-tracker-2026-06-25.md](./support-feature-request-tracker-2026-06-25.md).
