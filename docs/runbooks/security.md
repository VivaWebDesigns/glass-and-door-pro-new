# Glass & Door Pro — Security Runbook

## Required Environment Variables

| Variable | Required In | Description |
|---|---|---|
| `SESSION_SECRET` | Production | JWT signing secret. Must NOT be the dev default (`dev-secret-change-me`). Use a cryptographically random string ≥ 32 characters. |
| `DATABASE_URL` | Production | PostgreSQL connection string. |
| `APP_URL` | Recommended | Canonical URL of the application (e.g., `https://app.example.com`). Used for origin checking. Not enforced at startup but strongly recommended for production. |
| `TRUSTED_ORIGINS` | Optional | Comma-separated list of additional trusted origins for the CSRF origin check (e.g., `https://admin.example.com,https://staging.example.com`). |
| `SETUP_TOKEN` | Optional | One-time token required to create the initial admin account via `/api/setup/admin`. |
| `CMS_PREVIEW_SECRET` | Optional | Signing secret for CMS preview tokens. Falls back to `SESSION_SECRET` when unset. |

The application enforces `SESSION_SECRET` and `DATABASE_URL` at startup in production and will exit immediately if they are missing or if `SESSION_SECRET` still has the dev default value.

## Rate Limiting

All rate limiters are **skipped in development** and enforced in production. They use `express-rate-limit` with standard headers (`RateLimit-*`) enabled.

| Endpoint | Window | Max Requests | Purpose |
|---|---|---|---|
| `POST /api/auth/login` | 15 min | 10 | Brute-force login protection |
| `POST /api/auth/forgot-password` | 15 min | 5 | Password reset email flooding |
| `POST /api/auth/reset-password` | 15 min | 10 | Reset token brute-force protection |
| `ALL /api/*` | 15 min | 300 | General API abuse prevention |

`server/middleware/security.ts` also defines `registerLimiter` and `guestMessageLimiter`, but no route currently uses them (there is no public registration or guest-message endpoint). Public contact/form submissions (`/api/contact`, `/api/forms`) are covered only by the general `/api/*` limiter.

## CSRF / Origin Check

The application uses **origin-based CSRF protection**, appropriate for a same-site SPA architecture that communicates exclusively via JSON API.

- **Safe methods** (`GET`, `HEAD`, `OPTIONS`) are always allowed.
- **Mutating requests** (`POST`, `PUT`, `PATCH`, `DELETE`) must include a valid `Origin` or `Referer` header matching a trusted origin.
- **Trusted origins** are derived from:
  - `APP_URL` environment variable
  - `TRUSTED_ORIGINS` environment variable (comma-separated)
  - The request's `Host` header (auto-added as `https://<host>`)
- Requests without any origin information receive `403 Forbidden: missing origin`.
- Requests from untrusted origins receive `403 Forbidden: untrusted origin`.
- Origin checking is **skipped in development**.

## Cookie Configuration

Authentication uses JWT tokens stored in HTTP-only cookies:

| Setting | Value | Notes |
|---|---|---|
| Cookie name | `corePlatform_token` | Name inherited from the starter template |
| `httpOnly` | `true` | Prevents JavaScript access (XSS mitigation) |
| `secure` | `true` in production | Cookies only sent over HTTPS |
| `sameSite` | `lax` | Prevents cross-site request attachment while allowing top-level navigation |
| `maxAge` | 7 days | Matches JWT expiry |
| `path` | `/` | Available to all routes |

## Helmet / Content Security Policy

Helmet is enabled with the following CSP directives:

| Directive | Allowed Sources | Reason |
|---|---|---|
| `default-src` | `'self'` | Baseline restriction |
| `script-src` | `'self'`, the hashed early-render bootstrap, Google Tag Manager, Cloudflare Insights | App scripts, the narrowly authorized bootstrap, and analytics scripts |
| `style-src` | `'self'`, `'unsafe-inline'`, Google Fonts, `unpkg.com` | App styles, inline styles (Tiptap/shadcn), Google Fonts; `unpkg.com` is a leftover map-style allowance |
| `font-src` | `'self'`, `https://fonts.gstatic.com`, `data:` | Google Fonts, embedded fonts |
| `img-src` | `'self'`, `data:`, `blob:`, R2, OpenStreetMap, Carto, `unpkg.com` | App images and R2 media; OpenStreetMap/Carto/`unpkg.com` are leftover map-tile allowances |
| `connect-src` | `'self'`, Google Analytics, Google Tag Manager, Cloudflare Insights, R2, OpenStreetMap, Carto | API calls, analytics, and R2 uploads; OpenStreetMap/Carto are leftover map allowances |
| `frame-src` | `'self'`, Google Tag Manager | Same-origin iframes plus the GTM noscript frame |
| `media-src` | `'self'`, `blob:`, `*.r2.cloudflarestorage.com`, `*.r2.dev` | Audio/video from R2 |
| `worker-src` | `'self'`, `blob:` | Service workers |
| `object-src` | `'none'` | Block plugins (Flash, Java) |
| `base-uri` | `'self'` | Prevent base tag injection |
| `form-action` | `'self'` | Restrict form submission targets |

Additional Helmet settings:
- `crossOriginEmbedderPolicy`: disabled (app serves cross-origin media)
- `crossOriginResourcePolicy`: `cross-origin` (allows external origins to load served media)

## Payload Size Limits

| Parser | Limit |
|---|---|
| `express.json()` | 1 MB |
| `express.urlencoded()` | 1 MB |

## Error Handling

- **4xx errors**: Return the specific error message to help the client understand the issue.
- **5xx errors in production**: Return a generic `"Internal Server Error"` message. Internal details are logged server-side but never exposed to the client.
- **5xx errors in development**: Return the original error message for debugging convenience.

## Auth Route Information Disclosure

All authentication routes are designed to prevent email enumeration:

- **Login**: Returns `"Invalid email or password"` for both invalid email and invalid password.
- **Forgot password**: Always returns `"If an account with that email exists, a password reset link has been sent."` regardless of whether the email was found.
- **Reset password**: Returns `"Invalid or expired reset link"` without revealing whether the token was valid, expired, or never existed.

## Deployment Security Checklist

- [ ] `SESSION_SECRET` is set to a unique, cryptographically random value (≥ 32 chars)
- [ ] `DATABASE_URL` points to a production database with TLS enabled
- [ ] `APP_URL` is set to the canonical production URL
- [ ] `TRUSTED_ORIGINS` includes any additional legitimate origins (staging, admin panels)
- [ ] HTTPS is enforced (TLS termination at load balancer or reverse proxy)
- [ ] Database credentials use a least-privilege role
- [ ] `SETUP_TOKEN` is set if the initial admin account has not been created yet (remove after setup)
- [ ] Application logs are routed to a centralized logging system
- [ ] Rate limiting is active (verify `NODE_ENV=production`)
- [ ] Backup and recovery procedures are documented and tested
