import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PublicBlockRenderer, PublicPageRenderer } from "@/features/public/public-block-renderer";
import { PublicSidebar } from "@/features/public/public-sidebar";
import { Loader2 } from "lucide-react";
import type { BlockInstance, BuilderContent } from "@/features/admin/cms/builder/block-registry";
import type { CmsPage, SeoSettings } from "@shared/schema";
import { JsonLd } from "@/components/shared/json-ld";
import {
  buildBreadcrumbLd,
  buildFaqPageLd,
  extractFaqItems,
} from "@/lib/structured-data";
import { formatBrandFirstTitle } from "@shared/seo-title";
import {
  buildGlassBreadcrumbItems,
  buildGlassLocalBusinessLd,
  buildGlassServiceLdForCmsPage,
  getCmsPublicPath,
} from "@shared/glass-seo";

interface CmsHybridPageProps {
  slug: string;
  fallback: React.ReactNode;
}

interface CmsPageViewProps {
  page: CmsPage;
  globalSeo?: SeoSettings;
  previewLabel?: string;
}

declare global {
  interface Window {
    __CMS_PRERENDER_PAGE__?: CmsPage;
  }
}

class CmsNotFoundError extends Error {
  constructor(slug: string) {
    super(`CMS page not found: ${slug}`);
    this.name = "CmsNotFoundError";
  }
}

function isValidCmsPage(data: unknown): data is CmsPage {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return (
    (typeof obj.id === "string" || typeof obj.id === "number") &&
    typeof obj.slug === "string" &&
    typeof obj.title === "string" &&
    typeof obj.status === "string"
  );
}

export function getPrerenderedCmsPage(slug: string): CmsPage | undefined {
  if (typeof window === "undefined") return undefined;

  if (window.__CMS_PRERENDER_PAGE__) {
    const page = window.__CMS_PRERENDER_PAGE__;
    return page.slug === slug && page.status === "published" ? page : undefined;
  }

  const payload = document.getElementById("__CMS_PRERENDER_PAGE__")?.textContent;
  if (!payload) return undefined;

  try {
    const page = JSON.parse(payload);
    if (!isValidCmsPage(page)) return undefined;
    window.__CMS_PRERENDER_PAGE__ = page;
    return page.slug === slug && page.status === "published" ? page : undefined;
  } catch {
    return undefined;
  }
}

function parseCmsContent(content: unknown): BlockInstance[] {
  if (!content || typeof content !== "object") return [];
  const c = content as BuilderContent;
  return Array.isArray(c.blocks) ? c.blocks : [];
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(name: string, property = false) {
  const attr = property ? "property" : "name";
  const el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.remove();
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeLink(rel: string) {
  const el = document.head.querySelector(`link[rel="${rel}"]`);
  if (el) el.remove();
}

function absoluteUrl(path: string, origin: string) {
  if (!path || /^https?:\/\//i.test(path)) return path;
  return `${origin.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

function CmsPageSeo({ page, globalSeo }: { page: CmsPage; globalSeo?: SeoSettings }) {
  useEffect(() => {
    const prevTitle = document.title;
    const effectiveTitle = page.seoTitle || page.title;
    const titleSuffix = globalSeo?.titleSuffix ?? " | Core Platform";
    const headTitle = formatBrandFirstTitle(effectiveTitle, titleSuffix, globalSeo?.siteName ?? "Core Platform");
    const effectiveDescription = page.seoDescription || globalSeo?.defaultMetaDescription || "";
    const origin =
      globalSeo?.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
    const effectiveOgImage = absoluteUrl(page.ogImageUrl || globalSeo?.defaultOgImageUrl || "", origin);

    if (effectiveTitle) document.title = headTitle;

    if (effectiveDescription) {
      setMeta("description", effectiveDescription);
      setMeta("og:description", effectiveDescription, true);
    }

    if (effectiveTitle) setMeta("og:title", headTitle, true);

    if (effectiveOgImage) {
      setMeta("og:image", effectiveOgImage, true);
    } else {
      removeMeta("og:image", true);
    }

    const publicPath = getCmsPublicPath(page.slug);
    const canonical =
      page.canonicalUrl || (publicPath === "/" ? origin : `${origin}${publicPath}`);
    setLink("canonical", canonical);

    if (page.noindex) {
      setMeta("robots", "noindex,nofollow");
    } else {
      removeMeta("robots");
    }

    return () => {
      document.title = prevTitle;
      removeLink("canonical");
      removeMeta("robots");
    };
  }, [page, globalSeo]);

  const origin =
    globalSeo?.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");

  const isHome = page.slug === "home" || page.slug === "";

  const breadcrumbs = isHome
    ? null
    : buildBreadcrumbLd(buildGlassBreadcrumbItems(page, origin));

  const faqItems = extractFaqItems(page.content);

  return (
    <JsonLd
      schemas={[
        buildGlassLocalBusinessLd(origin),
        buildGlassServiceLdForCmsPage(page, origin),
        breadcrumbs,
        buildFaqPageLd(faqItems),
      ]}
    />
  );
}

function CmsLoadingPage() {
  return (
    <div className="public-page-shell min-h-screen flex flex-col" data-testid="cms-public-loading">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </main>
      <Footer />
    </div>
  );
}

export function CmsPageView({ page, globalSeo, previewLabel }: CmsPageViewProps) {
  const blocks = parseCmsContent(page.content);
  const showSidebar =
    page.template === "with-sidebar" && Boolean(page.sidebarId || page.slug === "insights");
  const useDefaultSidebar = !page.sidebarId && page.slug === "insights";
  const heroBlocks = showSidebar && blocks[0] && /hero/i.test(blocks[0].type) ? [blocks[0]] : [];
  const contentBlocks = heroBlocks.length > 0 ? blocks.slice(1) : blocks;

  return (
    <div className="public-page-shell min-h-screen flex flex-col" data-testid="cms-public-page">
      <CmsPageSeo page={page} globalSeo={globalSeo} />
      {previewLabel ? (
        <div className="border-b border-primary/20 bg-primary/10 px-4 py-2 text-center text-sm font-medium text-primary">
          {previewLabel}
        </div>
      ) : null}
      <Navbar />
      <main className="flex-1">
        {blocks.length > 0 ? (
          showSidebar ? (
            <>
              {heroBlocks.length > 0 && <PublicPageRenderer blocks={heroBlocks} />}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
                <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-8" data-testid="cms-page-main-with-sidebar">
                    {contentBlocks.map((block) => (
                      <PublicBlockRenderer key={block.id} block={block} />
                    ))}
                  </div>
                  <PublicSidebar sidebarId={page.sidebarId} useDefault={useDefaultSidebar} />
                </div>
              </div>
            </>
          ) : (
            <PublicPageRenderer blocks={blocks} />
          )
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-heading font-semibold">{page.title}</h1>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export function CmsHybridPage({ slug, fallback }: CmsHybridPageProps) {
  const prerenderedPage = getPrerenderedCmsPage(slug);
  const {
    data: page,
    isLoading,
    error,
  } = useQuery<CmsPage>({
    queryKey: ["/api/cms/pages/by-slug", slug],
    queryFn: async () => {
      const res = await fetch(`/api/cms/pages/by-slug/${slug}`, { credentials: "include" });
      if (res.status === 404) {
        throw new CmsNotFoundError(slug);
      }
      if (!res.ok) {
        throw new Error(`CMS fetch failed: ${res.status} ${res.statusText}`);
      }
      const data: unknown = await res.json();
      if (!isValidCmsPage(data)) {
        if (import.meta.env.DEV) {
          console.error(`[CmsHybridPage] Invalid response shape for slug "${slug}"`, data);
        }
        throw new Error("Invalid CMS page response shape");
      }
      return data;
    },
    retry: (failureCount, err) => {
      if (err instanceof CmsNotFoundError) return false;
      return failureCount < 2;
    },
    initialData: prerenderedPage,
    staleTime: 5 * 60 * 1000,
  });

  const { data: globalSeo } = useQuery<SeoSettings>({
    queryKey: ["/api/seo/global"],
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return <CmsLoadingPage />;
  }

  if (error) {
    if (import.meta.env.DEV && !(error instanceof CmsNotFoundError)) {
      console.warn(
        `[CmsHybridPage] Transient error for slug "${slug}", showing fallback:`,
        error.message,
      );
    }
    return <>{fallback}</>;
  }

  if (!page || page.status !== "published") {
    return <>{fallback}</>;
  }

  return <CmsPageView page={page} globalSeo={globalSeo} />;
}
