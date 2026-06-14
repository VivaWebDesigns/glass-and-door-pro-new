import { describe, expect, it } from "vitest";
import { buildGlassServiceLdForCmsPage, getGlassServiceSeoOverride } from "./glass-seo";

describe("glass SEO helpers", () => {
  it("adds service-level areaServed to non-frameless service pages", () => {
    const schema = buildGlassServiceLdForCmsPage({
      slug: "services-window-installation",
      seoDescription: "Window installation",
    });

    expect(schema?.areaServed).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Charlotte" }),
        expect.objectContaining({ name: "Monroe" }),
        expect.objectContaining({ name: "Indian Trail" }),
      ]),
    );
  });

  it("provides stronger service SEO defaults", () => {
    expect(getGlassServiceSeoOverride("services-window-installation")).toMatchObject({
      title: "Residential Window Installation in Charlotte & Monroe, NC",
    });
  });
});
