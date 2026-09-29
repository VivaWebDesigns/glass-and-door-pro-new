# Glass & Door Pro — Architecture Overview

Marketing site and CMS for Glass & Door Pro (Charlotte, NC glass, window, and door contractor). Public pages are rendered from CMS page content with hardcoded React fallbacks; staff manage content, forms, media, SEO, and settings from the admin area.

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + TypeScript | Vite bundler, SPA with route-level code splitting via `React.lazy()` |
| Routing (client) | wouter | Lightweight alternative to React Router |
| State / Data | TanStack Query v5 | Global defaults: `staleTime: 5min`, `gcTime: 10min` (`client/src/lib/queryClient.ts`) |
| UI Framework | shadcn/ui (Radix) + Tailwind CSS | Brand colors/fonts served from `/api/branding` |
| Rich text | Tiptap | CMS rich-text blocks and admin editors |
| Backend | Express 5 (TypeScript) | Node.js HTTP server, bundled for production by `script/build.ts` |
| ORM | Drizzle ORM | `drizzle-orm/node-postgres` with the `pg` Pool (`server/db.ts`) |
| Database | PostgreSQL | Connection via `DATABASE_URL`; SSL enabled in production unless `sslmode` is in the URL |
| Auth | JWT (HTTP-only cookie) | `bcryptjs` password hashing, 7-day token expiry, `admin` / `editor` roles |
| File Storage | Cloudflare R2 or local disk | R2 when configured in settings; otherwise local uploads dir (`UPLOADS_DIR` / Railway volume) |
| Image processing | sharp | Upload optimization in `server/services/image-optimizer.ts` |
| Email | `email.service.ts` | Resend → Mailgun → SMTP (nodemailer) fallback chain, DB-managed templates |
| Marketing sync | Mailchimp | Optional form-submission sync (`mailchimp.service.ts`) |
| Logging | Pino | Structured logging with named sources and request IDs |
| Security | Helmet, rate limiting, origin checking | CSP headers, per-endpoint rate limits |
| Hosting | Railway | Postgres + persistent volume for local uploads |

## Folder Structure

```
├── client/
│   └── src/
│       ├── App.tsx                  # Main router with lazy-loaded pages
│       ├── components/
│       │   ├── auth/                # Auth UI helpers
│       │   ├── forms/               # Public form renderer + modal button
│       │   ├── layout/              # Navbar, footer, page layout
│       │   ├── shared/              # Branding provider, SEO/JSON-LD, editors, cookie consent
│       │   └── ui/                  # shadcn/ui primitives
│       ├── features/
│       │   ├── admin/               # Admin dashboard, CMS builder, forms, users, settings, docs, backups
│       │   ├── auth/                # Login, forgot/reset password, first-admin setup
│       │   └── public/              # Home, services, service areas, gallery, reviews, contact, CMS hybrid pages
│       ├── hooks/                   # Custom React hooks (SEO, editor locks, unsaved changes)
│       └── lib/                     # Query client, analytics/consent, sanitization, structured data
├── server/
│   ├── index.ts                     # Express app bootstrap, middleware pipeline
│   ├── db.ts                        # Drizzle + pg Pool connection
│   ├── migrate.ts                   # Production migration runner
│   ├── static.ts                    # Prod static serving, legacy 301s, retired-URL 410s, prerender injection
│   ├── middleware/                  # auth.ts, security.ts, error-handler.ts, validation.ts
│   ├── routes/
│   │   ├── index.ts                 # Route registration hub (+ branding, sitemap, robots, redirects)
│   │   ├── admin/                   # Admin-only routes (CMS, forms, users, backups, editor locks)
│   │   └── *.routes.ts              # Auth, CMS public, forms, contact, uploads, settings, setup, etc.
│   ├── services/                    # Email, R2, forms, prerender, backups, editor locks, system bootstrap
│   ├── storage/                     # Data access layer (storage facade + per-domain classes)
│   ├── scripts/                     # System backup run/restore, email template seed
│   └── utils/                       # Logger, metrics, retry, route helpers, CMS preview tokens
├── shared/
│   ├── schema/                      # Drizzle table definitions (re-exported from index.ts)
│   ├── types/index.ts               # Roles, admin permissions, doc categories
│   └── glass-*.ts                   # Site-specific SEO, service areas, reviews, hero image data
├── scripts/                         # CMS seed / gallery sync scripts
├── migrations/                      # Drizzle SQL migrations
└── docs/                            # Developer documentation (this folder)
```

## Key Flows

1. **Client → Server**: React components use TanStack Query to call `/api/*` endpoints. Mutations use `apiRequest()` from `queryClient.ts`.

2. **Server → Storage**: Route handlers call the `storage` facade (`server/storage/index.ts`) directly, or a service in `server/services/` when there is orchestration (email, form submission, backups, editor locks).

3. **Storage → Database**: Storage classes use Drizzle query builders against PostgreSQL. Table definitions live in `shared/schema/`.

4. **Auth**: JWT tokens are stored in an HTTP-only cookie (`corePlatform_token`, a name inherited from the starter). `authenticateToken` verifies the token and attaches the user to `req.user`; `requireRole()` and `requireAdminPermission()` (content/design) gate admin routes. The first admin is created via `/api/setup`.

5. **Public page rendering**: `CmsHybridPage` renders a published CMS page by slug, or falls back to a hardcoded React page. In production, `server/static.ts` handles legacy 301 redirects and retired-URL 410s, then injects a server-side HTML snapshot from `public-prerender.service.ts` for known public paths; unknown public paths return a real 404.

6. **Forms / leads**: Managed forms (`cms_forms`) are rendered on public pages and submitted to `/api/forms/:slug/submit`. `forms.service.ts` stores the submission, emails recipients, and optionally syncs to Mailchimp.

7. **File uploads**: Media uploads are optimized with sharp, then stored in Cloudflare R2 when configured (served via `/r2/*`) or on the local uploads volume (served from `/uploads`).

8. **Background jobs**: On startup the server runs `runSystemBootstrap()` (ensures system pages, menus, sections, forms, email templates, docs, branding), then starts the scheduled-publish loop and the system backup service.
