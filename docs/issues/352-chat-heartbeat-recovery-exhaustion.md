# 352 — Chat Turns Exhaust Heartbeat Recovery

**Type:** Bug  
**Priority:** High  
**Area:** `ai, chat, backend, infra`  
**Status:** Fixed (2026-07-20)

## Resolution

- Heartbeats and terminal updates are conditional on the current `runId`; a replaced worker aborts
  as soon as it loses the lease and cannot overwrite its successor.
- Recovery records the previous owner, claimant, deployment identity, phase, and bounded-history
  size. Model history is capped by both message count and estimated serialized tokens.
- Persisted successful mutations complete locally during recovery without replay. Exhausted turns
  receive an explicit visible terminal message.
- The protected worker-monitoring endpoint reports 24-hour heartbeat timeout and
  recovery-exhaustion rates grouped by deployment.
- Recovery, ownership, terminal-message, history-budget, and monitoring tests cover the changes
  while preserving issue 222's conditional recovery claim.

## Description

Chat turns continue to lose their heartbeat, get requeued twice, and finish as `INTERRUPTED` with
`executionPhase: recovery_exhausted`. This is distinct from the stale-read race in
[222](./222-chat-stale-turn-recovery-race.md): issue 222 prevents a completed turn from being
overwritten, while this issue tracks turns whose execution genuinely stops heartbeating and never
recovers to a user-visible result.

Some affected request snapshots contain very large historical tool payloads. That may increase
provider latency or executor pressure, but worker ownership, process lifecycle, and recovery claims
also need correlation before assigning root cause.

## Production Evidence (72 hours ending 2026-07-20)

- 13 interrupted turns across 10 rooms and 3 users (4.9% of 263 turns).
- Every interrupted turn had `recoveryReason: heartbeat_timeout`, `recoveryAttempts: 2`, and
  `executionPhase: recovery_exhausted`.
- Four interrupted turns had already completed a tool before heartbeat recovery was exhausted.
- Affected skills included general chat, planning read/write, workout read/update, nutrition,
  availability, analysis, and support.
- The same failure family was previously documented in
  `docs/06-plans/chat-workout-analysis-investigation-2026-07-12.md` (44 turns in the prior 7-day
  sample), so it remains active after earlier chat hardening.

## Expected Behavior

An active executor maintains its lease, and a genuinely abandoned turn is reclaimed once by a new
owner and either completes or fails with a clear, timely message.

## Actual Behavior

Recovery requeues the turn twice, then interrupts it without producing a useful assistant response.

## Affected Files

- `server/utils/chat/turn-runner.ts`
- `server/utils/chat/turn-executor.ts`
- `server/utils/services/chatTurnService.ts`
- `server/plugins/chat-turn-runner.ts`
- `server/utils/chat/turns.ts`

## Acceptance Criteria

- Heartbeat timeout telemetry identifies worker/run ownership, last active phase, deployment or
  process identifier, and recovery claimant.
- A recovered turn cannot run concurrently with its prior owner.
- Recovery resumes or safely restarts from persisted tool results without replaying successful
  mutations.
- Large request histories are bounded before model execution and measured in recovery telemetry.
- Users receive an explicit terminal error if recovery is exhausted.
- A production monitor reports heartbeat timeout and recovery-exhaustion rates by deployment.
- Issue 222's conditional terminal update is preserved and covered alongside the liveness tests.
