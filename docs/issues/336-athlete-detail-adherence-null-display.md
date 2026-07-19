# 336 — Athlete detail still shows `null%` for 7d adherence

**Priority:** Medium
**Type:** Bug
**Status:** Open
**Area:** `coaching, athletes`
**Related:** [272](./272-adherence-100-with-zero-planned.md) (Partial)

## Summary

272 fixed repository + AthleteCard (`null` → `--`), but athlete detail overview still binds `athlete.stats.adherence7d` without a null check, rendering `null%` and applying orange styling via `null >= 80 === false`.

## Evidence

- `app/pages/coaching/athletes/[id]/index.vue` (~169–171)
- Type on page still declares `adherence7d: number` (should be `number | null`)
- `coachingRepository.getEnrichedAthleteForCoach` returns `null` when `recentPlanned === 0`

## Suggested Fix

Match AthleteCard: show `--` when null; fix TypeScript type.

## Acceptance Criteria

- [ ] Zero-plan athletes show `--` on detail overview, not `null%`
