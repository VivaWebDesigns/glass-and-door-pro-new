import { Suspense, lazy, useEffect, useRef } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrandingProvider } from "@/components/shared/branding-provider";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import { DEFAULT_SITE_FEATURES, type SiteFeatures } from "@shared/site-features";

const HomePage = lazy(() => import("@/features/public/home-page"));
const GalleryPage = lazy(() => import("@/features/public/gallery-page"));
const ReviewsPage = lazy(() => import("@/features/public/reviews-page"));
const ServicesPage = lazy(() => import("@/features/public/services-page"));
const CmsHybridPage = lazy(() =>
  import("@/features/public/cms-hybrid-page").then((module) => ({
    default: module.CmsHybridPage,
  }))
);
const CmsPreviewPage = lazy(() => import("@/features/public/cms-preview-page"));

const LoginPage = lazy(() => import("@/features/auth/login-page"));
const ForgotPasswordPage = lazy(() => import("@/features/auth/forgot-password-page"));
const ResetPasswordPage = lazy(() => import("@/features/auth/reset-password-page"));
const AdminSetupPage = lazy(() => import("@/features/auth/admin-setup-page"));

const TherapistDashboardPage = lazy(() => import("@/features/therapist/dashboard-page"));
const ProfileEditPage = lazy(() => import("@/features/therapist/profile-edit-page"));
const SubscriptionPage = lazy(() => import("@/features/therapist/subscription-page"));
const ApplicationPage = lazy(() => import("@/features/therapist/application-page"));
const ApplicationStatusPage = lazy(() => import("@/features/therapist/application-status-page"));
const ReferenceFormPage = lazy(() => import("@/features/public/reference-form-page"));
const StandaloneFormPage = lazy(() => import("@/features/public/standalone-form-page"));
const AdminTherapistsPage = lazy(() => import("@/features/admin/therapists-page"));
const AdminUsersPage = lazy(() => import("@/features/admin/users-page"));
const AdminDirectorySettingsPage = lazy(() => import("@/features/admin/directory-settings-page"));
const AdminFormsPage = lazy(() => import("@/features/admin/forms-page"));
const AdminEventsPage = lazy(() => import("@/features/admin/events-page"));
const DocsPage = lazy(() => import("@/features/admin/docs-page"));
const AdminSettingsPage = lazy(() => import("@/features/admin/settings-page"));
const AdminDesignPage = lazy(() => import("@/features/admin/design-page"));
const AdminSpecializationsPage = lazy(() => import("@/features/admin/specializations-page"));
const CmsBlogPage = lazy(() => import("@/features/admin/cms/cms-blog-page"));
const CmsBlogEditorPage = lazy(() => import("@/features/admin/cms/cms-blog-editor-page"));

const AdminApplicationsPage = lazy(() => import("@/features/admin/applications-page"));
const AdminApplicationDetailPage = lazy(() => import("@/features/admin/application-detail-page"));
const CmsOverviewPage = lazy(() => import("@/features/admin/cms/cms-overview-page"));
const CmsPagesPage = lazy(() => import("@/features/admin/cms/cms-pages-page"));
const CmsPageEditorPage = lazy(() => import("@/features/admin/cms/cms-page-editor-page"));
const CmsMediaPage = lazy(() => import("@/features/admin/cms/cms-media-page"));
const CmsSeoPage = lazy(() => import("@/features/admin/cms/cms-seo-page"));
const CmsMenusPage = lazy(() => import("@/features/admin/cms/cms-menus-page"));
const CmsSidebarsPage = lazy(() => import("@/features/admin/cms/cms-sidebars-page"));
const SystemBackupsPage = lazy(() => import("@/features/admin/system-backups-page"));

const SearchResultsPage = lazy(() => import("@/features/public/search-results-page"));
const LegalFallbackPage = lazy(() => import("@/features/public/legal-fallback-page"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]" data-testid="page-loader">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function AdminIndexRoute() {
  const { user, hasAdminPermission } = useAuth();

  if (!user) {
    return <Redirect to="/auth/login" replace />;
  }

  if (user.role === "admin") {
    return <Redirect to="/admin/cms" replace />;
  }

  if (user.role === "editor") {
    if (hasAdminPermission("directory")) {
      return <Redirect to="/admin/therapists" replace />;
    }
    if (hasAdminPermission("content")) {
      return <Redirect to="/admin/cms" replace />;
    }
    if (hasAdminPermission("design")) {
      return <Redirect to="/admin/design/branding" replace />;
    }
  }

  return <NotFound />;
}

function Router() {
  const { data: siteFeaturesData } = useQuery<SiteFeatures>({
    queryKey: ["/api/site-config"],
    staleTime: 60_000,
  });
  const siteFeatures = siteFeaturesData ?? DEFAULT_SITE_FEATURES;

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={() => <CmsHybridPage slug="home" fallback={<HomePage />} />} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/reviews" component={() => <CmsHybridPage slug="reviews" fallback={<ReviewsPage />} />} />
        <Route path="/services" component={() => <CmsHybridPage slug="services" fallback={<ServicesPage />} />} />
        <Route path="/services/frameless-showers" component={() => <CmsHybridPage slug="services-frameless-showers" fallback={<NotFound />} />} />
        <Route path="/services/window-installation" component={() => <CmsHybridPage slug="services-window-installation" fallback={<NotFound />} />} />
        <Route path="/services/door-installation" component={() => <CmsHybridPage slug="services-door-installation" fallback={<NotFound />} />} />
        <Route path="/services/window-repair" component={() => <CmsHybridPage slug="services-window-repair" fallback={<NotFound />} />} />
        <Route path="/services/commercial-storefront-glass-installation" component={() => <CmsHybridPage slug="services-commercial-storefront-glass-installation" fallback={<NotFound />} />} />
        <Route path="/services/commercial-storefront-glass-replacement-repair" component={() => <CmsHybridPage slug="services-commercial-storefront-glass-replacement-repair" fallback={<NotFound />} />} />
        <Route path="/services/commercial-door-installation" component={() => <CmsHybridPage slug="services-commercial-door-installation" fallback={<NotFound />} />} />
        <Route path="/services/commercial-door-replacement-repair" component={() => <CmsHybridPage slug="services-commercial-door-replacement-repair" fallback={<NotFound />} />} />
        <Route path="/services/commercial-window-replacement" component={() => <CmsHybridPage slug="services-commercial-window-replacement" fallback={<NotFound />} />} />
        <Route path="/service-areas/charlotte" component={() => <CmsHybridPage slug="areas-served-charlotte-nc" fallback={<NotFound />} />} />
        <Route path="/service-areas/monroe" component={() => <CmsHybridPage slug="areas-served-monroe-nc" fallback={<NotFound />} />} />
        <Route path="/service-areas/indian-trail" component={() => <CmsHybridPage slug="service-areas-indian-trail" fallback={<NotFound />} />} />
        <Route path="/service-areas/stallings" component={() => <CmsHybridPage slug="service-areas-stallings" fallback={<NotFound />} />} />
        <Route path="/service-areas/wesley-chapel" component={() => <CmsHybridPage slug="service-areas-wesley-chapel" fallback={<NotFound />} />} />
        <Route path="/service-areas/waxhaw" component={() => <CmsHybridPage slug="service-areas-waxhaw" fallback={<NotFound />} />} />
        <Route path="/service-areas/matthews" component={() => <CmsHybridPage slug="service-areas-matthews" fallback={<NotFound />} />} />
        <Route path="/service-areas/weddington" component={() => <CmsHybridPage slug="service-areas-weddington" fallback={<NotFound />} />} />
        <Route path="/service-areas/indian-land" component={() => <CmsHybridPage slug="service-areas-indian-land" fallback={<NotFound />} />} />
        <Route path="/service-areas/fort-mill" component={() => <CmsHybridPage slug="service-areas-fort-mill" fallback={<NotFound />} />} />
        <Route path="/service-areas/pineville" component={() => <CmsHybridPage slug="service-areas-pineville" fallback={<NotFound />} />} />
        <Route path="/areas-served/monroe-nc"><Redirect to="/service-areas/monroe" replace /></Route>
        <Route path="/areas-served/charlotte-nc"><Redirect to="/service-areas/charlotte" replace /></Route>
        <Route path="/preview/cms/:id" component={CmsPreviewPage} />
        <Route path="/search" component={SearchResultsPage} />
        <Route path="/privacy-policy" component={() => <CmsHybridPage slug="privacy-policy" fallback={<LegalFallbackPage title="Privacy Policy" subtitle="Review how Glass & Door Pro handles contact form details, service inquiries, cookies, analytics, and customer records." />} />} />
        <Route path="/terms-of-service" component={() => <CmsHybridPage slug="terms-of-service" fallback={<LegalFallbackPage title="Terms of Service" subtitle="Review the terms governing use of the Glass & Door Pro website, estimates, service information, third-party links, and site content." />} />} />
        <Route path="/disclaimer" component={() => <CmsHybridPage slug="disclaimer" fallback={<LegalFallbackPage title="Disclaimer" subtitle="Review important context about website information, estimates, repair recommendations, warranty references, pricing, and commercial glass work." />} />} />
        <Route path="/reference/:token" component={ReferenceFormPage} />
        <Route path="/forms/:slug" component={StandaloneFormPage} />
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register"><Redirect to="/" replace /></Route>
        <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
        <Route path="/auth/reset-password" component={ResetPasswordPage} />
        <Route path="/setup" component={AdminSetupPage} />

        <Route path="/therapist">
          <ProtectedRoute roles={["therapist"]}>
            <TherapistDashboardPage />
          </ProtectedRoute>
        </Route>
        <Route path="/therapist/profile">
          <ProtectedRoute roles={["therapist"]}>
            <ProfileEditPage />
          </ProtectedRoute>
        </Route>
        <Route path="/therapist/subscription">
          <ProtectedRoute roles={["therapist"]}>
            {siteFeatures.directoryEnabled ? <SubscriptionPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/therapist/apply">
          <ProtectedRoute roles={["therapist"]}>
            {siteFeatures.directoryEnabled ? <ApplicationPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/therapist/application/status">
          <ProtectedRoute roles={["therapist"]}>
            {siteFeatures.directoryEnabled ? <ApplicationStatusPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>

        <Route path="/admin">
          <ProtectedRoute roles={["admin", "editor"]}>
            <AdminIndexRoute />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/therapists">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["directory"]}>
            {siteFeatures.directoryEnabled ? <AdminTherapistsPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/directory/settings">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["directory"]}>
            {siteFeatures.directoryEnabled ? <AdminDirectorySettingsPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/users">
          <ProtectedRoute roles={["admin"]}>
            <AdminUsersPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/membership-tiers">
          <Redirect to="/admin/directory/settings" />
        </Route>
        <Route path="/admin/events">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            {siteFeatures.eventsEnabled ? <AdminEventsPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/forms">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <AdminFormsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/crm/clients" component={NotFound} />
        <Route path="/admin/crm" component={NotFound} />
        <Route path="/admin/blog">
          <Redirect to="/admin/cms/blog" />
        </Route>
        <Route path="/admin/docs">
          <ProtectedRoute roles={["admin"]}>
            <DocsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/settings">
          <ProtectedRoute roles={["admin"]}>
            <AdminSettingsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/design/branding">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["design"]}>
            <AdminDesignPage initialSubview="branding" />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/design">
          <Redirect to="/admin/design/branding" />
        </Route>
        <Route path="/admin/design/colors">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["design"]}>
            <AdminDesignPage initialSubview="colors" />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/design/typography">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["design"]}>
            <AdminDesignPage initialSubview="typography" />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/therapists/specializations">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["directory"]}>
            {siteFeatures.directoryEnabled ? <AdminSpecializationsPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/system/backups">
          <ProtectedRoute roles={["admin"]}>
            <SystemBackupsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/applications/:id">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["directory"]}>
            {siteFeatures.directoryEnabled ? <AdminApplicationDetailPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/applications">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["directory"]}>
            {siteFeatures.directoryEnabled ? <AdminApplicationsPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsOverviewPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/pages/new">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsPageEditorPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/pages/:id">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsPageEditorPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/pages">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsPagesPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/media">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsMediaPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/blog/new">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            {siteFeatures.blogEnabled ? <CmsBlogEditorPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/blog/settings">
          <Redirect to="/admin/cms/blog?tab=settings" />
        </Route>
        <Route path="/admin/cms/blog/comments">
          <Redirect to="/admin/cms/blog?tab=comments" />
        </Route>
        <Route path="/admin/cms/blog/:id">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            {siteFeatures.blogEnabled ? <CmsBlogEditorPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/blog">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            {siteFeatures.blogEnabled ? <CmsBlogPage /> : <NotFound />}
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/sections/new" component={NotFound} />
        <Route path="/admin/cms/sections/:id" component={NotFound} />
        <Route path="/admin/cms/sections" component={NotFound} />
        <Route path="/admin/cms/seo">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["content"]}>
            <CmsSeoPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/menus">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["design"]}>
            <CmsMenusPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/cms/sidebars">
          <ProtectedRoute roles={["admin", "editor"]} adminPermissions={["design"]}>
            <CmsSidebarsPage />
          </ProtectedRoute>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export function pathRequiresSetupStatus(pathname: string) {
  return pathname === "/setup" || pathname.startsWith("/admin") || pathname.startsWith("/auth");
}

export function shouldRedirectToSetup(pathname: string, needsSetup: boolean) {
  return pathRequiresSetupStatus(pathname) && needsSetup && pathname !== "/setup";
}

function SetupGuard({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const pathname = location.split(/[?#]/)[0] || "/";
  const checksSetup = pathRequiresSetupStatus(pathname);
  const { data: setupStatus, isLoading, isError } = useQuery<{ needsSetup: boolean }>({
    queryKey: ["/api/setup/status"],
    staleTime: 60_000,
    retry: 2,
    enabled: checksSetup,
  });

  const needsSetup = setupStatus?.needsSetup === true;

  useEffect(() => {
    if (shouldRedirectToSetup(pathname, needsSetup)) {
      setLocation("/setup");
    }
  }, [needsSetup, pathname, setLocation]);

  if (checksSetup && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="setup-guard-loading">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (checksSetup && isError && pathname === "/setup") {
    return <NotFound />;
  }

  return <>{children}</>;
}

function RouteScrollManager() {
  const [location] = useLocation();
  const lastRouteRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("scrollRestoration" in window.history)) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pathname = window.location.pathname || location.split(/[?#]/)[0] || "/";
    const hash = window.location.hash;
    const routeKey = `${pathname}${hash}`;
    const lastRoute = lastRouteRef.current;
    lastRouteRef.current = routeKey;

    if (lastRoute === null) {
      if (hash) return scrollToHashTarget(hash);
      return;
    }

    if (hash) return scrollToHashTarget(hash);

    const lastPathname = lastRoute.split("#")[0] || "/";
    if (lastPathname !== pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    let cancelPendingScroll: (() => void) | undefined;

    const scrollToCurrentHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      cancelPendingScroll?.();
      cancelPendingScroll = scrollToHashTarget(hash);
    };

    const handleHashChange = () => scrollToCurrentHash();
    const handleClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const href = link?.getAttribute("href");
      if (!href) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin || !url.hash) return;

      window.setTimeout(() => {
        if (window.location.pathname === url.pathname && window.location.hash === url.hash) {
          scrollToCurrentHash();
        }
      }, 0);
    };

    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleClick);

    return () => {
      cancelPendingScroll?.();
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}

function scrollToHashTarget(hash: string) {
  if (typeof window === "undefined") return undefined;

  const targetId = decodeURIComponent(hash.replace(/^#/, ""));
  if (!targetId) return undefined;

  let frame = 0;
  let attempts = 0;
  const maxAttempts = 40;

  const tryScroll = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ block: "start" });
      return;
    }

    attempts += 1;
    if (attempts < maxAttempts) {
      frame = window.requestAnimationFrame(tryScroll);
    }
  };

  frame = window.requestAnimationFrame(tryScroll);
  return () => window.cancelAnimationFrame(frame);
}

function RouteAdminModeManager() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const pathname = location.split(/[?#]/)[0] || "/";
    const isAdminRoute = pathname.startsWith("/admin");
    const root = document.documentElement;

    root.classList.toggle("admin-mode", isAdminRoute);

    return () => {
      root.classList.remove("admin-mode");
    };
  }, [location]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrandingProvider>
        <TooltipProvider>
          <Toaster />
          <SetupGuard>
            <RouteAdminModeManager />
            <RouteScrollManager />
            <Router />
          </SetupGuard>
        </TooltipProvider>
      </BrandingProvider>
    </QueryClientProvider>
  );
}

export default App;
