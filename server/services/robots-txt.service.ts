import type { SeoSettings } from "@shared/schema";

export interface RobotsTxtPayload {
  generatedContent: string;
  effectiveContent: string;
  customContent: string | null;
}

export function buildDefaultRobotsTxt(seoSettings?: SeoSettings | null) {
  const siteUrl = seoSettings?.siteUrl?.replace(/\/$/, "") || "";
  const noindexAll = seoSettings?.defaultRobotsNoindex ?? false;

  const lines: string[] = [];
  lines.push("User-agent: *");
  if (noindexAll) {
    lines.push("Disallow: /");
  } else {
    lines.push("Disallow: /admin");
    lines.push("Allow: /api/branding");
    lines.push("Allow: /api/site-config");
    lines.push("Allow: /api/seo/global");
    lines.push("Allow: /api/cms/menus");
    lines.push("Allow: /api/cms/pages/by-slug/");
    lines.push("Disallow: /api");
    if (siteUrl) {
      lines.push("");
      lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);
    }
  }

  return `${lines.join("\n")}\n`;
}

export function buildRobotsTxtPayload(seoSettings?: SeoSettings | null): RobotsTxtPayload {
  const generatedContent = buildDefaultRobotsTxt(seoSettings);
  const customContent = seoSettings?.customRobotsTxt?.trim() ? seoSettings.customRobotsTxt : null;

  return {
    generatedContent,
    effectiveContent: customContent ?? generatedContent,
    customContent,
  };
}
