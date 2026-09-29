# ADR: Database Indexes & Foreign Key Constraints

**Status:** Accepted (partially superseded)  
**Date:** 2026-04-01  
**Migration:** `migrations/0005_lazy_stone_men.sql`

## Context

This migration was written while the codebase was still the starter template it was forked from. Most of its changes targeted starter tables (directory profiles, events, direct messaging) that have since been removed from `shared/schema/` and from the application code. The migration remains in `migrations/` as history and was not rewritten.

## Decisions Still Relevant

### B-tree Index on `contact_messages(created_at)`

- **Index:** `idx_contact_messages_created_at`
- **Query pattern:** `ORDER BY created_at DESC` — admin message listing sorted by date.
- **Rationale:** The admin panel lists contact messages sorted by creation date. Without an index, this requires a full table sort.
- **Selectivity:** N/A (primarily used for ordering, not filtering).

### B-tree Index on `direct_messages(sender_id, created_at)`

- **Index:** `idx_dm_sender_date`
- **Status:** Superseded. The `direct_messages` table was removed from the schema and is dropped at startup by `server/migrate.ts` (2026-09).

## Superseded Decisions

The remaining changes in this migration (a self-referential FK on `events.parent_event_id`, `idx_events_status_visibility`, and GIN / composite indexes on `therapist_profiles`) apply to starter tables that are no longer part of the schema. They were not dropped; see `docs/architecture/database-indexing.md` for the current index set.

## Consequences

- All changes were additive; no existing indexes were removed or modified.
- Write overhead is negligible given the low write volume of these tables.
