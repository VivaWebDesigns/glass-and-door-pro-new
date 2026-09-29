# Stabilization & Improvement Plan

Originally generated from a full codebase audit of the starter template this project was forked from. Findings and phases that only concerned removed starter features (therapist directory, applications, Stripe/subscriptions) have been dropped. Items marked "In place" were verified against the current code on 2026-09-29; everything else is still open or unverified.

---

## Audit Findings (Current State)

### TypeScript Build & Quality Gates

- The original audit's TypeScript errors were all in files that no longer exist, except `shared/schema/cms-menus.ts`. `npm run check` (`tsc`) currently passes.
- `lint`, `test` (Vitest), `test:browser` (Playwright), and `format` scripts now exist. See [Quality Gates](./quality-gates.md).

### Auth / Session Secret

- `SESSION_SECRET` falls back to `"dev-secret-change-me"` in dev.
- Production enforcement via `enforceRequiredSecrets()` in `security.ts` — exits on missing or default secret. Good.
- `SESSION_SECRET` is also used as a fallback for the settings encryption key and CMS preview-token secret.

### Logging

- Structured logger in `server/utils/logger.ts` with named sources (http, email, r2, backup, auth, app, db, cms, metrics). Request ID middleware exists. Adequate foundation.

### Large Files

- `block-renderer.tsx` (~2,020 lines) and `block-registry.ts` (~2,280 lines) are large frontend files. Noted.

### React Query Caching

- Global defaults: `staleTime: 5min` (`STALE_TIMES.SESSION`), `gcTime: 10min`, no retry. Per-query tiers exist but are used by only a few queries.

### Frontend Loading

- `App.tsx` uses `React.lazy()` for most pages. Route-level code splitting in place.

---

## Implementation Phases

### Phase C: DB Indexing & Relational Integrity
**Goal**: Ensure all foreign keys are explicit; add missing indexes.

1. Audit all `varchar` FK columns — confirm they have `references()` declarations.
2. Add missing FK constraints where needed (`cms_page_revisions.pageId → cms_pages.id` is in place).
3. Unique index on `cms_pages.slug` — in place.
4. Review migration numbering (duplicate `0003_*` and `0004_*` prefixes exist).

### Phase D: Security Hardening
**Goal**: Strengthen input validation, CSRF, and secret handling.

1. Enable CSRF protection for state-changing endpoints (double-submit cookie or SameSite=Strict).
2. Audit all admin routes for consistent `requireAdmin` middleware.
3. Request body size limits on JSON/urlencoded endpoints — in place (1 MB).
4. Review `sanitize-html` usage — ensure it's applied to all user-generated HTML content.
5. Secure (HTTPS-only) auth cookies in production — in place.

### Phase E: Frontend Loading & Cache Strategy
**Goal**: Differentiate cache policies; improve perceived performance.

1. Freshness tiers (`STATIC`, `SESSION`, `OPERATIONAL`, `LIVE`) — defined in `client/src/lib/queryClient.ts`.
2. Apply `staleTime` overrides to the remaining queries (branding/theme, CMS content, notifications).
3. Add optimistic updates for common mutations (e.g. mark notification read).

### Phase F: Observability & Operations
**Goal**: Production debugging and monitoring readiness.

1. Add `npm run health` script that hits `/api/health`.
2. Add structured error logging with correlation IDs on all API error responses.
3. Add slow-query logging (log queries > 500ms).
4. Add `/api/admin/system/health` extended health check (DB connectivity, Redis/memory store, R2 reachability).

### Phase G: Service/Support Layer Refinement
**Goal**: Clean service boundaries and reduce route-level business logic.

1. Keep email-sending logic in `email.service.ts` / `forms.service.ts` rather than route handlers.
2. Ensure all storage methods return typed results (no `any`).
3. Keep `docs/` up to date with architectural decisions; consider API route documentation.

## Priority Order

| Priority | Phase | Risk | Effort |
|----------|-------|------|--------|
| 1 | C — DB integrity | Low | Small |
| 2 | D — Security hardening | Medium | Medium |
| 3 | E — Cache strategy | Low | Small |
| 4 | F — Observability | Low | Medium |
| 5 | G — Service refinement | Low | Medium |
