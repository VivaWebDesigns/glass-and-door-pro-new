# Technical Debt Catalog

Organized by priority tier based on risk, impact, and effort.

---

## Tier 1: Immediate Follow-Up

Items that should be addressed in the next development cycle.

> TD-001 (`any` types) and TD-002 (unused imports/variables) were removed: as of 2026-09-29, `eslint client/src server shared` reports no warnings.

### TD-003: Token Revocation Strategy

- **Impact**: Security
- **Current**: JWT tokens cannot be revoked before expiry (7 days)
- **Risk**: Compromised tokens remain valid until expiration
- **Recommendation**: Add a token deny-list (in-memory or Redis) for critical revocation cases (password change, account lockout)

### TD-004: CSRF Protection Enhancement

- **Impact**: Security
- **Current**: Origin checking via `Origin`/`Referer` headers, `sameSite: lax` cookies
- **Risk**: Some edge cases not covered by origin check alone
- **Recommendation**: Add double-submit cookie pattern or synchronizer token for critical state-changing endpoints

---

## Tier 2: Near-Term (Next 1–3 Months)

Items that should be scheduled but are not urgent.

### TD-005: Block Renderer / Registry Size

- **Impact**: Maintainability
- **Current**: `block-renderer.tsx` (~2,020 lines), `block-registry.ts` (~2,280 lines)
- **Recommendation**: Split into individual block component files, create a plugin-style block registration system

### TD-008: Query Freshness Differentiation

- **Impact**: Performance, UX
- **Current**: `STALE_TIMES` (STATIC, SESSION, OPERATIONAL, LIVE) exists in `client/src/lib/queryClient.ts`, but most queries still use the 5-minute SESSION default; only a few admin/auth queries opt into other tiers
- **Recommendation**: Apply appropriate stale times to remaining queries. Add optimistic updates for common mutations.

### TD-009: Server-Side Caching

- **Impact**: Performance
- **Current**: A small in-memory `MemoryCache` (`server/lib/cache.ts`) is used for dashboard analytics; most other reads hit the database
- **Recommendation**: Extend caching to frequently-read, rarely-changed data (branding/theme settings, SEO settings, menus, CMS pages)

### TD-010: Test Coverage Expansion

- **Impact**: Reliability
- **Current**: Vitest unit/component tests across server, client, and shared code (auth, validation, logging, CMS builder/editor, forms, backups, prerendering, and more)
- **Recommendation**: Add integration tests for critical paths (CMS page publishing, form submission and notification email, backups/restore)

---

## Tier 3: Long-Term (3–6+ Months)

Strategic improvements for scale and maintainability.

### TD-013: Background Job Queue

- **Impact**: Reliability, UX
- **Current**: Email sending runs synchronously; scheduled publishing and system backups run via in-process timers
- **Recommendation**: Adopt a job queue (e.g., BullMQ, pg-boss) for async processing with retry logic, dead-letter queues, and job monitoring

### TD-014: Database Migration Cleanup

- **Impact**: Maintainability
- **Location**: `migrations/` directory (journal in `migrations/meta/`)
- **Current**: Duplicate migration prefixes exist (`0003_*`, `0004_*`)
- **Recommendation**: Use unique sequential numbers for all new migrations going forward; do not renumber existing migrations as this would break the journal in `migrations/meta/`

### TD-015: API Documentation

- **Impact**: Developer experience
- **Current**: No auto-generated API documentation
- **Recommendation**: Add OpenAPI/Swagger spec generation from route definitions, or maintain a hand-written API reference

### TD-016: E2E Testing

- **Impact**: Reliability
- **Current**: Playwright specs exist in `e2e/` (rendered pages, local interactions) plus local mobile/bundle measurement scripts
- **Recommendation**: Extend coverage to admin flows (login, CMS page edit/publish, form builder) and public form submission
