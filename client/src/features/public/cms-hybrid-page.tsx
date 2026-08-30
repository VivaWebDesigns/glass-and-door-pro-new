import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PublicBlockRenderer, PublicPageRenderer } from "@/features/public/public-block-renderer";
import { PublicSidebar } from "@/features/public/public-sidebar";
import { Loader2 } from "lucide-react";
import type { BlockInstance, BuilderContent } from "@/features/admin/cms/builder/block-registry";
import type { CmsPage, SeoSettings } from "@shared/schema";
import { normalizeSeoDescription } from "@shared/seo-description";
import { JsonLd } from "@/components/shared/json-ld";
import { buildBreadcrumbLd, buildFaqPageLd, extractFaqItems } from "@/lib/structured-data";
import { formatBrandFirstTitle, formatBrandLastTitle } from "@shared/seo-title";
import {
  buildGlassBreadcrumbItems,
  getGlassCityPageArea,
  buildGlassLocalBusinessLd,
  buildGlassServiceLdForCmsPage,
  getGlassServiceSeoOverride,
  getGlassServiceSocialMetadata,
  getCmsPublicPath,
  isGlassLegalNoindexSlug,
  isGlassServicePageSlug,
} from "@shared/glass-seo";
import { getPrerenderedCmsPage } from "@/lib/cms-prerender";
import { FramelessServiceLayout } from "@/features/public/frameless-service-layout";

interface CmsHybridPageProps {
  slug: string;
  fallback: React.ReactNode;
}

interface CmsPageViewProps {
  page: CmsPage;
  globalSeo?: SeoSettings;
  previewLabel?: string;
}

class CmsNotFoundError extends Error {
  constructor(slug: string) {
    super(`CMS page not found: ${slug}`);
    this.name = "CmsNotFoundError";
  }
}

export function isValidCmsPage(data: unknown): data is CmsPage {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return (
    (typeof obj.id === "string" || typeof obj.id === "number") &&
    typeof obj.slug === "string" &&
    typeof obj.title === "string" &&
    typeof obj.status === "string"
  );
}

function parseCmsContent(content: unknown): BlockInstance[] {
  if (!content || typeof content !== "object") return [];
  const c = content as BuilderContent;
  return Array.isArray(c.blocks) ? c.blocks : [];
}

function isServiceAreaPageSlug(slug: string) {
  return slug.startsWith("service-areas-") || slug.startsWith("areas-served-");
}

function shouldHideServiceAreaWorkGallery(pageSlug: string, block: BlockInstance) {
  if (!isServiceAreaPageSlug(pageSlug)) return false;
  if (block.type !== "image-grid") return false;

  const title = typeof block.props.title === "string" ? block.props.title : "";
  const anchorId = typeof block.props.anchorId === "string" ? block.props.anchorId : "";
  return anchorId === "gallery" && /^Our Work in the .+ Area$/i.test(title.trim());
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

function hasBrandSuffix(title: string) {
  return /\s[|–—-]\sGlass (?:&|and) Door Pro$/i.test(title.trim());
}

function CmsPageSeo({ page, globalSeo }: { page: CmsPage; globalSeo?: SeoSettings }) {
  useEffect(() => {
    const prevTitle = document.title;
    const seoOverride = getGlassServiceSeoOverride(page.slug);
    const socialOverride = getGlassServiceSocialMetadata(page.slug);
    const effectiveTitle = seoOverride?.title || page.seoTitle || page.title;
    const titleSuffix = globalSeo?.titleSuffix ?? " | Glass & Door Pro";
    const titleFormatter =
      page.slug === "home" || isGlassServicePageSlug(page.slug)
        ? formatBrandLastTitle
        : formatBrandFirstTitle;
    const headTitle =
      effectiveTitle && hasBrandSuffix(effectiveTitle)
        ? effectiveTitle
        : titleFormatter(effectiveTitle, titleSuffix, globalSeo?.siteName ?? "Glass & Door Pro");
    const effectiveDescription =
      seoOverride?.description ||
      normalizeSeoDescription(page.seoDescription) ||
      normalizeSeoDescription(globalSeo?.defaultMetaDescription) ||
      "";
    const socialTitle = socialOverride?.ogTitle || headTitle;
    const socialDescription = socialOverride?.ogDescription || effectiveDescription;
    const origin =
      globalSeo?.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
    const effectiveOgImage = absoluteUrl(
      page.ogImageUrl || globalSeo?.defaultOgImageUrl || "",
      origin,
    );

    if (effectiveTitle) document.title = headTitle;

    if (effectiveDescription) {
      setMeta("description", effectiveDescription);
      setMeta("og:description", socialDescription, true);
    }

    if (effectiveTitle) {
      setMeta("og:title", socialTitle, true);
      setMeta("twitter:title", socialTitle);
    }

    if (socialDescription) setMeta("twitter:description", socialDescription);
    if (socialOverride?.twitterCard) setMeta("twitter:card", socialOverride.twitterCard);
    if (socialOverride?.twitterSite) setMeta("twitter:site", socialOverride.twitterSite);

    if (effectiveOgImage) {
      setMeta("og:image", effectiveOgImage, true);
      setMeta("twitter:image", effectiveOgImage);
    } else {
      removeMeta("og:image", true);
      removeMeta("twitter:image");
    }

    const publicPath = getCmsPublicPath(page.slug);
    const canonical = page.canonicalUrl || (publicPath === "/" ? origin : `${origin}${publicPath}`);
    setLink("canonical", canonical);

    if (page.noindex) {
      setMeta("robots", isGlassLegalNoindexSlug(page.slug) ? "noindex,follow" : "noindex,nofollow");
    } else {
      removeMeta("robots");
    }

    return () => {
      document.title = prevTitle;
      removeLink("canonical");
      removeMeta("robots");
      removeMeta("twitter:title");
      removeMeta("twitter:description");
      removeMeta("twitter:card");
      removeMeta("twitter:site");
      removeMeta("twitter:image");
    };
  }, [page, globalSeo]);

  const origin =
    globalSeo?.siteUrl || (typeof window !== "undefined" ? window.location.origin : "");

  const isHome = page.slug === "home" || page.slug === "";

  const breadcrumbs = isHome ? null : buildBreadcrumbLd(buildGlassBreadcrumbItems(page, origin));

  const faqItems = extractFaqItems(page.content);
  const cityArea = getGlassCityPageArea(page.slug);

  return (
    <JsonLd
      schemas={[
        buildGlassLocalBusinessLd(origin, cityArea),
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
  const blocks = parseCmsContent(page.content).filter(
    (block) => !shouldHideServiceAreaWorkGallery(page.slug, block),
  );
  const showSidebar =
    page.template === "with-sidebar" && Boolean(page.sidebarId || page.slug === "insights");
  const useDefaultSidebar = !page.sidebarId && page.slug === "insights";
  const heroBlocks = showSidebar && blocks[0] && /hero/i.test(blocks[0].type) ? [blocks[0]] : [];
  const contentBlocks = heroBlocks.length > 0 ? blocks.slice(1) : blocks;
  const isFramelessServicePage = page.slug === "services-frameless-showers";

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
          ) : isFramelessServicePage ? (
            <FramelessServiceLayout blocks={blocks} />
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
    if (prerenderedPage?.status === "published") {
      return <CmsPageView page={prerenderedPage} globalSeo={globalSeo} />;
    }

    if (import.meta.env.DEV && !(error instanceof CmsNotFoundError)) {
      console.warn(
        `[CmsHybridPage] Transient error for slug "${slug}", showing fallback:`,
        error.message,
      );
    }
    return <>{fallback}</>;
  }

  if (!page || page.status !== "published") {
    if (prerenderedPage?.status === "published") {
      return <CmsPageView page={prerenderedPage} globalSeo={globalSeo} />;
    }

    return <>{fallback}</>;
  }

  return <CmsPageView page={page} globalSeo={globalSeo} />;
}
