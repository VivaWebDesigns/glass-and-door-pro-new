# Database Indexing & Foreign Key Strategy

## Database Engine

PostgreSQL, accessed through Drizzle ORM with the `pg` (node-postgres) Pool driver (`server/db.ts`). Production runs on Railway Postgres.

## Index Strategy

Indexes are declared alongside table definitions in `shared/schema/`. Tables are small, so indexes focus on the lookup and ordering patterns the CMS and admin actually use.

### Key Table Indexes

| Table | Indexes | Notes |
|-------|---------|-------|
| `users` | `email` (unique), `idx_users_role` | Login lookup, role filtering |
| `cms_pages` | `idx_cms_pages_slug` (unique), `idx_cms_pages_status` | Page rendering by slug, published filter |
| `cms_page_revisions` | `idx_cms_page_revisions_page_id` | Revision history per page |
| `cms_media` | `idx_cms_media_created_at` | Media library ordering |
| `cms_sections` | `idx_cms_sections_category`, `idx_cms_sections_created_at` | Section library filtering |
| `cms_sidebars` | `idx_cms_sidebars_default`, `idx_cms_sidebars_updated_at` | Default sidebar lookup |
| `cms_forms` | `idx_cms_forms_slug_unique` (unique), `idx_cms_forms_kind`, `idx_cms_forms_updated_at` | Public form lookup by slug |
| `cms_form_submissions` | `idx_cms_form_submissions_form_id`, `idx_cms_form_submissions_created_at` | Submissions per form, newest first |
| `editor_locks` | `editor_locks_resource_unique` on `(resource_type, resource_id)` | One lock per resource |
| `contact_messages` | `idx_contact_messages_created_at` | Admin listing by date |
| `notifications` | `idx_notif_user_date`, `idx_notif_user_unread` | User notification queries |
| `activity_logs` | `idx_activity_user_date` | Activity per user |
| `docs`, `email_templates`, `system_settings`, `password_reset_tokens` | Unique `slug` / `key` / `token` | Lookup by natural key |

## Foreign Key Relationships

Most tables use `varchar` IDs (UUID-style strings); `notifications` uses a serial ID. Foreign keys are declared via Drizzle's `references()`:

```
users.id ←── notifications.userId
users.id ←── notification_preferences.userId
users.id ←── activity_logs.userId
users.id ←── password_reset_tokens.userId
users.id ←── docs.createdBy
users.id ←── cms_pages.createdBy / updatedBy          (on delete set null)
users.id ←── cms_page_revisions.changedBy             (on delete set null)
users.id ←── cms_media.uploadedBy                     (on delete set null)
users.id ←── cms_sections.createdBy                   (on delete set null)

cms_pages.id ←── cms_page_revisions.pageId            (on delete cascade)
cms_forms.id ←── cms_form_submissions.formId          (on delete cascade)
```

### Legacy starter tables

The starter messaging tables (`conversations`, `direct_messages`, `guest_messages`) were removed from the schema and are dropped idempotently at startup by `server/migrate.ts`. Older migrations also created other starter tables (e.g. `events`) that are no longer in the schema; those have not been dropped.

## Migration Strategy

- Migrations are stored in `migrations/` (journal metadata in `migrations/meta/`)
- Production migrations run automatically on startup via `server/migrate.ts`; if the database has tables but no Drizzle journal, startup migrations are skipped (schema assumed to be provisioned via push)
- Schema changes use `npm run db:push` for development
- Migration files are numbered sequentially (0000, 0001, etc.)
