# Service Layer & Caching Strategy

## Service Layer Architecture

The application uses a storage-facade pattern plus a small set of function-based service modules. Most requests flow as:

```
Route Handler → Storage Facade → Domain Storage → Drizzle ORM → PostgreSQL
```

Routes call a service instead when the work involves integrations or orchestration (email, form submissions, backups, editor locks).

### Storage Facade

`server/storage/index.ts` exports a single `storage` object that aggregates all domain-specific storage classes:

```typescript
export const storage = {
  users: new UserStorage(),
  settings: new SettingsStorage(),
  cmsPages: new CmsPagesStorage(),
  cmsMedia: new CmsMediaStorage(),
  forms: new FormsStorage(),
  editorLocks: new EditorLocksStorage(),
  // ... 18 storage classes total
};
```

### Services

For integrations and cross-cutting concerns that don't map to a single storage domain (`server/services/`):

| Module | Responsibility |
|--------|---------------|
| `email.service.ts` | Template rendering, email dispatch via Resend → Mailgun → SMTP fallback |
| `r2.service.ts` | Cloudflare R2 upload/download/delete, public URL normalization |
| `local-upload-storage.ts` | Local uploads directory (used when R2 is not configured) |
| `image-optimizer.ts` | sharp-based image optimization presets |
| `forms.service.ts` | Managed form submission: store, notify recipients, Mailchimp sync |
| `mailchimp.service.ts` | Mailchimp connection test and contact sync |
| `editor-locks.service.ts` | Acquire/heartbeat/release editor locks |
| `public-prerender.service.ts` | Server-side HTML snapshots and head tags for public pages |
| `scheduled-publish.service.ts` | Timer loop that publishes CMS pages at their scheduled time |
| `system-backup.service.ts`, `backup-storage.service.ts` | Scheduled/manual database backups to R2 and restore |
| `system-bootstrap.service.ts` + `system-*.service.ts` | Startup seeding of branding, pages, menus, sections, forms, docs, email templates |
| `robots-txt.service.ts`, `cms-media-usage.service.ts` | robots.txt generation, media usage lookup |

### Service Boundary Philosophy

Each integration module (`email.service.ts`, `r2.service.ts`, `mailchimp.service.ts`, `backup-storage.service.ts`) owns a single integration concern. Services are responsible for:

- Configuration fetching and caching
- Client lifecycle management (construction, caching, reset)
- Error handling and logging within their domain
- Exposing a clean async interface to route handlers

### Route Handler Responsibility

Route handlers are intentionally thin. They:
1. Validate request input (via Zod schemas or middleware)
2. Call storage methods or a service
3. Return JSON responses

Some coordination still lives in route handlers (e.g., `settings.routes.ts` resets service caches after settings writes; `cms-media.routes.ts` chooses R2 vs local storage).

## Caching Strategy

### Settings Caching (Server-Side)

`SettingsStorage` implements a TTL-based in-memory cache keyed by category and individual setting key.

#### How it works

- **`getDecryptedCategory(category)`** checks a `Map<string, CacheEntry>` before querying the database. Cache entries expire after a configurable TTL (default: 60 seconds).
- **`getSetting(key)`** uses a separate per-key cache with the same TTL.
- **`upsertSetting` and `deleteSetting`** automatically invalidate the relevant category cache after writes.

#### Invalidation

- **Automatic**: Every `upsertSetting` and `deleteSetting` call invalidates the affected category.
- **Explicit**: `invalidateCategory(category)` clears both the category cache and any per-key entries tracked via an internal category-to-key index.
- **Route-level**: `PUT /api/admin/settings` additionally calls `invalidateCategory` and resets service-specific caches (`r2Service.resetClient`, `resetMailgunConfig`, `resetEmailBrandingCache`) when relevant categories change.
- **Full reset**: `invalidateAll()` clears every cached entry.

#### Why in-memory TTL

- The application runs as a single Node.js process, so in-memory caching is coherent.
- A 60-second TTL bounds staleness for settings that change outside the admin panel.
- No external dependency (Redis) is required.

### Static Responses with HTTP Cache Headers

- `robots.txt` — `Cache-Control: public, max-age=3600`
- `sitemap.xml` — `Cache-Control: public, max-age=3600`
- `/r2/*` media and hashed build assets — `public, max-age=31536000, immutable`
- HTML — `no-cache` (public) or `private, no-store` (`/admin`, `/auth`, `/setup`)

### Client-Side Caching

TanStack Query provides the primary caching layer:
- 5-minute default stale time means repeated navigation doesn't trigger redundant API calls
- Cache is keyed by query parameters, so paginated/filtered results are cached independently
- Mutations invalidate relevant cache entries

### Future Caching Considerations

1. **ETags or conditional requests** for CMS pages
2. **CDN caching** for public API responses (branding, menus, published pages) with short TTL

## Client Lifecycle

### R2 (Cloudflare S3-compatible storage)

- Configuration comes from the `cloudflare_r2` settings category.
- `cachedClient` and `cachedConfig` are module-level singletons.
- `getClient()` returns the cached client immediately if both are non-null, skipping the DB config fetch entirely.
- `resetClient()` nullifies both, forcing a fresh config fetch on next use.
- The settings update route calls `resetClient()` when the `cloudflare_r2` category changes.

### Mailgun (email)

- `cachedMailgunConfig` and a `mailgunConfigFetched` flag implement a singleton pattern.
- `getMailgunConfig()` fetches from DB once, then returns the cached result on subsequent calls. The `mailgunConfigFetched` flag is only set to `true` after a successful DB fetch — transient DB errors do not permanently cache null.
- `resetMailgunConfig()` clears both the config and the fetched flag.
- The settings update route calls `resetMailgunConfig()` when the `mailgun` category changes.

Resend (`RESEND_API_KEY`) and SMTP (`SMTP_*`) are configured from environment variables.

## Error Handling Policy

### When to log-and-continue

- Configuration loading failures (R2, Mailgun) — return null / treat the integration as unconfigured.
- Branding and runtime-integration lookups — return safe defaults.
- Redirect lookup failures — skip the redirect and proceed with normal routing.
- Email send failures — try the next provider; log if all fail.

### When to re-throw

- Missing required configuration at startup (e.g., `DATABASE_URL`) — throw with a descriptive message.
- Database write failures in critical paths — let the global error handler return a 500.

### Justified silent catches

- `optionalAuth` middleware: Invalid/expired tokens should not reject the request; the user simply remains unauthenticated.
- `normalizeOrigin` in security middleware: Malformed origin strings from clients are expected and should map to null.

## Retry Policy

A lightweight `retryOnce` utility (`server/utils/retry.ts`) retries a failed operation exactly once after a short delay (default 500ms). It is applied only to truly idempotent operations:

- **R2 uploads, downloads, and deletes** — idempotent S3 operations where transient network errors are common. PutObject with the same key is idempotent by design.

Retry is **not** applied to:

- Email sends (not safely idempotent — duplicate sends are possible on ambiguous failures)
- Database mutations
- Any state-changing internal operations
