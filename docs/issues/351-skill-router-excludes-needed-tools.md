# 351 — Skill Router Excludes Tools Needed by the Selected Intent

**Type:** Bug  
**Priority:** High  
**Area:** `ai, chat, backend`  
**Status:** Fixed (2026-07-20)

## Resolution

- Mixed analysis, availability, workout-update, and support requests gain only the required
  read-only companion domains; deterministic expansion cannot expose additional mutation tools.
- Support requests that mention workouts or planning records can now use the corresponding
  user-owned read tools in the same turn.
- Deprecated workout-stream, training-forecast, sync, and namespaced-time aliases are repaired only
  when their canonical tool is already within the policy-selected tool set.
- Regression coverage includes the production routing combinations and out-of-policy alias refusal.

## Description

The skill router selects a fixed tool subset before the main model call. Mixed-intent or imperfectly
classified requests can lead the model to request a valid Coach Wattz tool that is absent from that
subset. `experimental_repairToolCall` only repairs names against the already-selected tools, so it
cannot recover a valid but out-of-scope tool.

Examples include selecting `analysis` while the model needs `get_workout_details`, selecting
`support` for a request that both creates a ticket and inspects a workout, or selecting
`availability` while the model needs `get_planned_workouts`.

## Production Evidence (72 hours ending 2026-07-20)

- 14 messages in 12 rooms contained `AI_NoSuchToolError` metadata.
- Common excluded tools were `get_workout_details` (5), `get_planned_workouts` (2),
  `get_current_time` (2), `get_workout_stream` (2), and `update_workout_notes` (2).
- Additional failures used plausible aliases or stale names such as
  `forecast_training_date_range`, `sync_planned_workouts`, and
  `intervals_icu.get_current_time`.

## Steps to Reproduce

1. Send a mixed request such as reporting a workout-analysis bug while also asking for the workout
   analysis.
2. Let the router select only `support` tools.
3. Observe the main model request `get_workout_details` or a workout-stream tool.
4. The SDK records `AI_NoSuchToolError` because the requested tool is not in `selectedToolNames`.

## Expected Behavior

The selected skill set covers every concrete intent in the request, or the executor safely expands
the tool set when the model requests a known tool that policy allows.

## Actual Behavior

Known tools are rejected because the initial skill classification omitted their domain. Name repair
cannot help because it only sees the reduced set.

## Affected Files

- `server/utils/chat/skills.ts`
- `server/utils/chat/tool-call-repair.ts`
- `server/utils/chat/turn-executor.ts`
- `server/utils/ai-tools.ts`

## Acceptance Criteria

- Mixed-intent routing selects all required skill domains without exposing disallowed tools.
- A known canonical tool omitted by a low-confidence/incomplete routing result has a bounded,
  policy-aware recovery path.
- Deprecated aliases (`get_workout_stream`, `forecast_training_date_range`, namespaced time tools)
  either map unambiguously to canonical names or produce a clear assistant clarification.
- Support-plus-domain requests can create/update a ticket and retrieve relevant user-owned data in
  the same turn.
- Regression tests cover the production routing combinations listed above.
