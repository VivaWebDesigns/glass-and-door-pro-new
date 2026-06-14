import type { CmsPage } from "@shared/schema";

declare global {
  interface Window {
    __CMS_PRERENDER_PAGE__?: CmsPage;
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

export function bootstrapCmsPrerenderPage() {
  if (typeof window === "undefined") return;
  if (window.__CMS_PRERENDER_PAGE__) return;

  const payload = document.getElementById("__CMS_PRERENDER_PAGE__")?.textContent;
  if (!payload) return;

  try {
    const page = JSON.parse(payload);
    if (isValidCmsPage(page)) {
      window.__CMS_PRERENDER_PAGE__ = page;
    }
  } catch {
    // Ignore malformed embedded payloads and let the CMS API fetch handle the page.
  }
}

export function getPrerenderedCmsPage(slug: string): CmsPage | undefined {
  if (typeof window === "undefined") return undefined;

  if (!window.__CMS_PRERENDER_PAGE__) {
    bootstrapCmsPrerenderPage();
  }

  const page = window.__CMS_PRERENDER_PAGE__;
  return page?.slug === slug && page.status === "published" ? page : undefined;
}
