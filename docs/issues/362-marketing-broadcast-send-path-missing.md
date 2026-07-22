# 362 — No product send path for marketing / broadcast audience

**Priority:** Medium  
**Type:** Feature / Gap  
**Status:** Open  
**Area:** `email, marketing`

## Summary

`EmailAudience.MARKETING` and preference key `marketing` exist (default false), but no registry template or admin/CLI broadcast flow sends marketing mail. One-time announces (integration partner, mobile beta) cannot go through the product stack with opt-in enforcement until this exists.

Campaign briefs and audience decisions live in watts-marketing `knowledge/email/` (em-007). This issue is the product implementation.

## Evidence

- Prisma / registry: MARKETING audience + `marketing` pref
- No template with `preferenceKey: 'marketing'`
- Admin `/admin/emails` can dispatch queued rows but is not a campaign composer

## Suggested Fix

Define a safe broadcast path: opt-in query (`marketing=true`, not suppressed, email VALID), registry template(s) or admin-approved campaign payload, UTM medium `marketing`, signed unsub. Start minimal (single template + CLI/admin queue). Do not enable UI toggle as “active” until a sender exists (see 358).

## Acceptance Criteria

- [ ] Documented product broadcast path with opt-in enforcement
- [ ] At least one MARKETING template or approved campaign send mechanism
- [ ] Unsub / suppression respected
- [ ] watts-marketing can brief campaigns against a real send path
