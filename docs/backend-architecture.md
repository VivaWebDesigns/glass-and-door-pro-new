# Backend Architecture

## Layering: Route → (Service) → Storage

The backend follows a layered architecture:

```
Route Handlers (server/routes/)
       │
       ▼
  Services (server/services/)      ← only where there is orchestration or an integration
       │
       ▼
  Storage (server/storage/)
       │
       ▼
  Database (PostgreSQL via Drizzle ORM)
```

### Route Handlers (`server/routes/`)

Route handlers are **thin**. Their responsibilities are:

1. Parse and validate the incoming request (params, query, body)
2. Call the appropriate storage method or service function
3. Map the result to an HTTP response (status code + JSON body)

Route files also apply middleware (authentication, role and permission guards). Simple CRUD (CMS pages, menus, sidebars, redirects, users) calls the storage facade directly.

**Public and shared routes** live directly under `server/routes/` (e.g., `auth.routes.ts`, `forms.routes.ts`, `cms-public.routes.ts`).

**Admin routes** are grouped under `server/routes/admin/` and mounted behind `authenticateToken` plus role/permission guards via `server/routes/admin/index.ts`. See `docs/architecture/backend-routes.md` for the full map.

### Services (`server/services/`)

Services own integrations and multi-step workflows. They are plain function modules:

| Service | Domain |
|---------|--------|
| `forms.service.ts` | Managed form submission: validation, storage, recipient email, Mailchimp sync |
| `email.service.ts` | Email delivery (Resend → Mailgun → SMTP), template rendering |
| `mailchimp.service.ts` | Mailchimp contact sync and connection test |
| `r2.service.ts` / `local-upload-storage.ts` | File storage (Cloudflare R2 or local volume) |
| `image-optimizer.ts` | sharp image optimization for uploads |
| `editor-locks.service.ts` | Concurrent-editing locks for CMS resources |
| `public-prerender.service.ts` | Server-rendered HTML snapshots for public pages |
| `scheduled-publish.service.ts` | Scheduled CMS page publishing |
| `system-backup.service.ts` / `backup-storage.service.ts` | Database backups and restore |
| `system-bootstrap.service.ts` + `system-*.service.ts` | Startup seeding of system pages, menus, sections, forms, docs, templates, branding |

Services call the **storage layer** for data access and may call other services for cross-cutting concerns (e.g., the forms service calls the email and Mailchimp services).

### Storage (`server/storage/`)

Storage classes are thin data-access wrappers around Drizzle ORM queries. They handle:
- CRUD operations mapped to database tables
- Query composition (joins, filters, ordering)
- No business logic (the exception is `SettingsStorage`, which adds an in-memory TTL cache and secret decryption)

Each storage class corresponds to a domain aggregate (e.g., `FormsStorage` manages `cms_forms` and `cms_form_submissions`; `CmsPagesStorage` manages `cms_pages`).

## Shared Types (`shared/types/index.ts`)

Cross-boundary types that both frontend and backend use are defined here:
- `UserRole` — `admin` / `editor`
- `AdminPermission` — `content` / `design` permissions for editors
- `DocCategory` — internal documentation categories

Table types (`User`, `CmsPage`, `CmsForm`, etc.) are exported from `shared/schema/`.

## Adding a New Feature

1. **Define the data model** in `shared/schema/` if new tables are needed, and re-export it from `shared/schema/index.ts`
2. **Add storage methods** in the appropriate `server/storage/` class (register new classes in `server/storage/index.ts`)
3. **Add or extend a service** in `server/services/` if there is orchestration or an external integration
4. **Add thin route handlers** in `server/routes/` (or `server/routes/admin/`) and register them
5. **Add shared types** in `shared/types/index.ts` if the frontend needs them
