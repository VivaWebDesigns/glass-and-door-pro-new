# Backend Route Organization

## Route Registration

All API routes are registered in `server/routes/index.ts` via `registerApiRoutes(app)` (called from `server/routes.ts`). Routes are organized by domain and mounted under `/api/`.

## Route Map

| Mount Point | File | Auth | Description |
|-------------|------|------|-------------|
| `/api/auth` | `auth.routes.ts` | Mixed | Login, logout, current user, forgot/reset password, profile and password change |
| `/api/admin/*` | `admin/index.ts` | Admin / editor | CMS, forms, users, backups, editor locks (see below) |
| `/api/admin` | `settings.routes.ts` | Admin | System settings, branding uploads, email templates, connection tests |
| `/api/admin/docs` | `docs.routes.ts` | Admin | Internal documentation (synced from `docs/`) |
| `/api/contact` | `contact.routes.ts` | Public | Contact form submission |
| `/api/forms` | `forms.routes.ts` | Public | Managed form definition by slug, form submission |
| `/api/uploads` | `upload.routes.ts` | Auth | Avatar and attachment uploads |
| `/api/notifications` | `notifications.routes.ts` | Auth | User notifications and preferences |
| `/api/cms` | `cms-public.routes.ts` | Public | Published pages by slug, signed page previews, sidebars, menus |
| `/api/setup` | `setup.routes.ts` | Public (one-time) | Setup status and first-admin creation |
| `/r2` | `r2-public.routes.ts` | Public | Proxies media objects from Cloudflare R2 |

## Admin Sub-Routes

All admin routes require an authenticated user and are registered under `/api/admin/` in `server/routes/admin/index.ts`. Access is gated by `requireRole()` or `requireAdminPermission()` (`content` / `design`; admins have both, editors have what is assigned).

| Path | File | Access | Description |
|------|------|--------|-------------|
| `/dashboard-stats`, `/dashboard-analytics` | `dashboard.routes.ts` | Admin | Dashboard statistics and analytics |
| `/users` | `users.routes.ts` | Admin | User management (create, update, suspend, reset password) |
| `/cms/pages` | `cms.routes.ts` | Content | CMS pages: CRUD, preview link, publish/schedule/unpublish, revisions |
| `/cms/upload`, `/cms/media` | `cms-media.routes.ts` | Content | Media library uploads, replace, alt text, delete |
| `/cms/sections` | `cms-sections.routes.ts` | Content or design | Reusable CMS sections and starter library |
| `/cms/seo` | `cms-seo.routes.ts` | Content | Global SEO settings and custom robots.txt |
| `/cms/redirects` | `cms-redirects.routes.ts` | Content | URL redirect management |
| `/cms/seo-audit` | `cms-audit.routes.ts` | Content | CMS SEO audit |
| `/cms/menus` | `cms-menus.routes.ts` | Design | Navigation menus |
| `/cms/sidebars` | `cms-sidebars.routes.ts` | Design | CMS sidebars |
| `/forms` | `forms.routes.ts` | Content | Managed forms and submissions |
| `/editor-locks` | `editor-locks.routes.ts` | Admin / editor | Acquire, heartbeat, release editing locks |
| `/system/backups` | `system-backups.routes.ts` | Admin | Backup status, manual run, restore |

## Additional Endpoints (inline in `routes/index.ts` / `server/index.ts`)

| Path | Method | Description |
|------|--------|-------------|
| `/api/health` | GET | Basic health check (memory, uptime, version) |
| `/api/health/ready` | GET | Readiness probe (checks DB connectivity) |
| `/api/health/metrics` | GET | Request metrics (dev or when `METRICS_ENABLED=true`) |
| `/api/branding` | GET | Public branding settings (logo, company info, fonts, colors) |
| `/api/runtime-integrations` | GET | Public GA4 measurement ID |
| `/api/seo/global` | GET | Global SEO settings |
| `/robots.txt` | GET | Dynamic robots.txt |
| `/sitemap.xml` | GET | Dynamic XML sitemap from published, indexable CMS pages |
| (any non-API GET) | GET | Admin-managed redirects lookup (`redirects` table) |

Outside the API, `server/static.ts` (production) serves the built client, issues 301s for legacy site URLs, returns `410 Gone` for retired starter paths (`/directory`, `/events`, `/insights`, `/join`, `/recordings`, `/therapist`, and some old commercial-glass paths), and returns a real 404 for unknown public paths instead of the app shell.

## Middleware Pipeline

Applied in order in `server/index.ts`:

1. `enforceRequiredSecrets()` — Startup check (production)
2. `securityHeaders()` — Helmet CSP and related headers
3. `requestIdMiddleware` — Assigns a UUID to each request
4. `express.json({ limit: "1mb" })` — JSON body parser (captures `rawBody`)
5. `express.urlencoded()` — URL-encoded body parser
6. `cookieParser()` — Cookie parsing
7. Health check endpoints
8. `apiLimiter` — Global `/api` rate limit (300 req/15min)
9. `originCheck` — Origin/referer validation for state-changing requests
10. Static file serving (`/uploads`, plus a placeholder SVG for missing CMS images)
11. Request logging middleware (duration, redacted body)
12. Migrations (production) and `runSystemBootstrap()`
13. API route handlers
14. Error handler
15. Vite dev server (dev) or `serveStatic()` (prod)
