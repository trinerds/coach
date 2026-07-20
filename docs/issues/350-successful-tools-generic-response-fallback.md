# 350 — Successful Tools End in Generic Response Fallback

**Type:** Bug  
**Priority:** High  
**Area:** `ai, chat, backend`  
**Status:** Fixed (2026-07-20)

## Resolution

- Successful mutations now return deterministic confirmations from persisted result messages.
- Workout analysis, completed-workout details, planned workouts, and training availability have
  bounded local fallbacks when Gemini returns no final text.
- Failed tool results remain excluded from synthesized success responses.
- LLM telemetry records recovered replies as `EMPTY_RESPONSE_RECOVERED` rather than failed turns.

## Description

Tool-enabled turns frequently complete their domain reads or writes but receive no final text from
Gemini. After the repair attempt also returns empty, the executor only has deterministic recovery for
a narrow set of planned-workout reads. Other successful tool families persist the generic response:

> I hit a response issue while processing that. Please retry your last message.

This tells users to repeat an action even when the action already succeeded, which is misleading for
reads and unsafe for writes.

A partial workout-analysis mitigation exists in the current working tree, but it does not cover the
other read and write tool families documented here.

## Production Evidence (72 hours ending 2026-07-20)

- 40 generic fallbacks across 23 rooms (15.2% of 263 turns).
- 35 of those 40 fallback turns had successful tool executions.
- Workout reads accounted for 21 fallbacks: 10 `workout_read + analysis` and 11
  `workout_read`-only turns.
- Successful wellness writes, planned-workout reads/writes, workout streams, and availability reads
  also ended in the generic fallback.
- 52 initial empty-response retries were recorded, so some retries recovered; the remaining generic
  fallback rate is still user-visible.

## Expected Behavior

If tools succeeded, the user receives a useful domain-specific result or confirmation in the same
request. The assistant must not imply that a completed write failed.

## Actual Behavior

Successful tool results are stored in message metadata, but the visible assistant reply is a generic
error asking the user to retry.

## Affected Files

- `server/utils/chat/turn-executor.ts`
- `server/utils/chat/history.ts`
- `server/utils/ai-tools/workouts.ts`
- `server/utils/ai-tools/wellness.ts`
- `server/utils/ai-tools/planning.ts`
- `cli/debug/chatroom.ts`

## Acceptance Criteria

- Successful read tools have bounded deterministic fallbacks for the supported domain cards.
- Successful writes return a confirmation derived from persisted results without rerunning tools.
- `get_workout_details` can produce a concise fallback when no model text is returned.
- Fallback replies preserve enough localization/content from tool results to remain useful.
- LLM usage telemetry distinguishes recovered empty responses from genuine failed turns.
- Tests cover successful read, successful write, partial tool error, and all-tools-failed cases.
