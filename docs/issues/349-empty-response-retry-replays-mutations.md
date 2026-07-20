# 349 — Empty-Response Retry Replays Successful Mutations

**Type:** Bug  
**Priority:** Critical  
**Area:** `ai, chat, backend, data`  
**Status:** Fixed (2026-07-20)

## Resolution

- `record_*` tools, including `record_wellness_event`, are now classified as mutations and receive
  lineage idempotency protection.
- An empty response after any successful mutation is completed locally from its persisted tool
  result; the model retry is never entered, so paraphrased arguments cannot replay the write.
- Heartbeat recovery also completes from a persisted successful mutation instead of requeuing it.
- Regression tests cover paraphrased wellness arguments, recovered writes, and mutation
  classification.

## Description

When a tool-enabled chat turn completes one or more mutations but Gemini returns no final text,
`executeChatTurn` starts a second model attempt. The retry receives the original conversation rather
than a continuation that treats the successful tool results as final. Gemini can therefore emit new
tool calls with slightly rephrased arguments.

Mutation idempotency uses `lineageId + toolName + argsHash`. Semantically identical retry calls with
changed descriptions, severity, timestamps, or other generated arguments produce a different hash
and execute again.

## Production Evidence (72 hours ending 2026-07-20)

- 35 generic fallback turns had already completed at least one tool.
- 7 probable duplicate wellness records were created across 6 turns. Each pair used the same
  category and represented the same user report, but the retry paraphrased arguments enough to miss
  the exact hash.
- One repeated `reschedule_planned_workout` call was safely served from the cache because its
  arguments remained identical. This confirms the existing guard works only for exact replays.

## Steps to Reproduce

1. Submit a chat request that invokes a mutating tool such as `record_wellness_event`.
2. Let the tool complete successfully.
3. Make the model finish the step without assistant text so empty-response repair runs.
4. On the repair attempt, emit the same semantic mutation with slightly different generated text.
5. Observe two persisted domain records and two completed tool executions for one user request.

## Expected Behavior

A successful mutation executes at most once for a user turn. Empty-response recovery generates a
confirmation from existing results and never asks the model to recreate completed writes.

## Actual Behavior

The retry can execute a semantically identical mutation again when regenerated arguments do not
hash exactly like the first call.

## Affected Files

- `server/utils/chat/turn-executor.ts`
- `server/utils/chat/tool-execution.ts`
- `server/utils/chat/turns.ts`
- `server/utils/ai-tools/wellness.ts`

## Acceptance Criteria

- A retry after one or more successful mutating tool results cannot execute another mutation for the
  same requested action.
- Empty-response recovery reuses persisted tool results and produces a deterministic confirmation.
- Exact-call idempotency remains in place as defense in depth, but correctness does not depend on
  model-generated arguments remaining byte-identical.
- Regression coverage reproduces paraphrased `record_wellness_event` arguments across attempts and
  proves that only one domain record is created.
- Existing probable duplicate wellness records are reviewed through a separate, explicitly approved
  cleanup operation; the fix itself does not delete production data.
