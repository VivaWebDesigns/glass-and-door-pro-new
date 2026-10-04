# Frontend Code Splitting & Query Freshness Strategy

## Code Splitting

### Route-Level Splitting

All page components in `client/src/App.tsx` use `React.lazy()` for dynamic imports:

```typescript
const ServicesPage = lazy(() => import("@/features/public/services-page"));
const AdminFormsPage = lazy(() => import("@/features/admin/forms-page"));
```

A `<Suspense>` wrapper with a `<PageLoader>` spinner displays while chunks load.

### Shared dependencies

`CmsHybridPage` also uses a lazy import, including on the home route. Route splitting alone does not prevent shared vendor chunks from loading admin-only dependencies. `vite.config.ts` isolates image cropping/compression into `image-editor` and resizable builder panels into `editor-panels`, alongside the existing rich-text editor chunks.

See [the homepage bundle audit](../homepage-bundle-audit.md) for measured before/after payloads and local production-build regression checks.

### Component Organization

- **`client/src/features/`** — Page-level components grouped by domain (admin, auth, public)
- **`client/src/components/`** — Shared and reusable components (forms, layout, shared editors/SEO, UI primitives)
- **`client/src/lib/`** — Utilities, query client config, lead tracking, sanitization

## Query Freshness Strategy

### Global Defaults

Configured in `client/src/lib/queryClient.ts`:

```typescript
staleTime: 5 * 60 * 1000,   // 5 minutes
gcTime: 10 * 60 * 1000,     // 10 minutes (garbage collection)
refetchOnWindowFocus: false,
retry: false,
```

### Query Categories

`queryClient.ts` exports `STALE_TIMES` tiers that individual queries can opt into:

| Tier | Value | Example Queries |
|------|-------|----------------|
| `STATIC` | Infinity | Reference data that rarely changes (not currently used) |
| `SESSION` | 5 min (global default) | Current user (`/api/auth/me`), most admin and CMS queries |
| `OPERATIONAL` | 2 min | Admin users, forms, and backup status lists |
| `LIVE` | 1 min | Near-real-time dashboards (not currently used) |

Some public queries set an explicit `staleTime` instead (branding: 1 min; global SEO: 10 min).

### Cache Invalidation Patterns

- **Auth mutations** (login, logout): Write `/api/auth/me` directly via `setQueryData`; profile/avatar updates invalidate it
- **CRUD mutations**: Invalidate the specific resource query key after create/update/delete
- **Hierarchical keys**: Array-based query keys (e.g., `['/api/admin/cms/pages', id]`, `['/api/admin/cms/pages', id, 'revisions']`) allow targeted invalidation

### Data Fetching Patterns

- Default fetcher is configured globally — queries only need `queryKey`
- Mutations use `apiRequest()` from `queryClient.ts` for POST/PATCH/DELETE
- `queryClient.invalidateQueries()` is called after mutations to refresh data
