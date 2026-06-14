import { describe, expect, it } from "vitest";
import type { SeoSettings } from "@shared/schema";
import { buildDefaultRobotsTxt } from "./robots-txt.service";

const seoSettings = {
  siteUrl: "https://glassanddoorpro.com/",
  defaultRobotsNoindex: false,
} as SeoSettings;

function mostSpecificRule(robotsTxt: string, path: string) {
  const rules = robotsTxt
    .split(/\n+/)
    .map((line) => line.trim())
    .map((line) => line.match(/^(Allow|Disallow):\s*(.+)$/i))
    .filter(Boolean)
    .map((match) => ({
      type: match![1].toLowerCase(),
      path: match![2],
    }))
    .filter((rule) => path.startsWith(rule.path))
    .sort((a, b) => b.path.length - a.path.length);

  return rules[0]?.type;
}

describe("buildDefaultRobotsTxt", () => {
  it("allows only public render/config API endpoints while keeping sensitive APIs blocked", () => {
    const robotsTxt = buildDefaultRobotsTxt(seoSettings);

    expect(mostSpecificRule(robotsTxt, "/api/branding")).toBe("allow");
    expect(mostSpecificRule(robotsTxt, "/api/site-config")).toBe("allow");
    expect(mostSpecificRule(robotsTxt, "/api/seo/global")).toBe("allow");
    expect(mostSpecificRule(robotsTxt, "/api/cms/menus")).toBe("allow");
    expect(mostSpecificRule(robotsTxt, "/api/cms/pages/by-slug/services-window-installation")).toBe(
      "allow",
    );

    expect(mostSpecificRule(robotsTxt, "/api/auth/me")).toBe("disallow");
    expect(mostSpecificRule(robotsTxt, "/api/admin/cms/pages")).toBe("disallow");
    expect(mostSpecificRule(robotsTxt, "/api/setup/status")).toBe("disallow");
    expect(mostSpecificRule(robotsTxt, "/admin")).toBe("disallow");
  });

  it("does not open any API paths when sitewide noindex is enabled", () => {
    const robotsTxt = buildDefaultRobotsTxt({
      ...seoSettings,
      defaultRobotsNoindex: true,
    });

    expect(robotsTxt).toContain("Disallow: /");
    expect(robotsTxt).not.toContain("Allow: /api/branding");
  });
});
