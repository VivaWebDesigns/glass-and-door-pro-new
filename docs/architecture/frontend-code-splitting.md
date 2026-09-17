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

- **`client/src/features/`** — Page-level components grouped by domain (admin, auth, directory, public, therapist)
- **`client/src/components/`** — Shared and reusable components (auth dialogs, layout, UI primitives)
- **`client/src/lib/`** — Utilities, query client config, theme presets

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

| Category | Example Queries | Effective staleTime |
|----------|----------------|-------------------|
| Static | Specializations list, theme presets, SEO settings | 5 min (global default) |
| Session | Current user (`/api/auth/me`), setup status | 5 min (with selective invalidation on auth events) |
| Live | Notifications | 5 min (global default) |
| Paginated | Directory results, admin lists | 5 min (cache key includes page/filters) |

### Cache Invalidation Patterns

- **Auth mutations** (login, register, logout): Invalidate `/api/auth/me` and related queries
- **CRUD mutations**: Invalidate the specific resource query key after create/update/delete
- **Hierarchical keys**: Array-based query keys (e.g., `['/api/therapists', id]`) allow targeted invalidation

### Data Fetching Patterns

- Default fetcher is configured globally — queries only need `queryKey`
- Mutations use `apiRequest()` from `queryClient.ts` for POST/PATCH/DELETE
- `queryClient.invalidateQueries()` is called after mutations to refresh data
