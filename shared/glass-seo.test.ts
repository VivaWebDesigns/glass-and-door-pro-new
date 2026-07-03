import { describe, expect, it } from "vitest";
import {
  buildGlassLocalBusinessLd,
  buildGlassServiceLdForCmsPage,
  getGlassCityPageArea,
  getGlassServiceSeoOverride,
} from "./glass-seo";

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
      title:
        "Window Installation in Charlotte & Monroe, NC | Replacement Windows | Glass and Door Pro",
    });
  });

  it("keeps commercial service SEO focused on Charlotte", () => {
    expect(
      getGlassServiceSeoOverride("services-commercial-storefront-glass-installation"),
    ).toMatchObject({
      title: "Commercial Storefront Glass Installation in Charlotte, NC | Glass and Door Pro",
      description: expect.stringContaining("Charlotte, NC"),
    });
  });

  it("adds all service child pages to the services hub OfferCatalog", () => {
    const schema = buildGlassServiceLdForCmsPage({
      slug: "services",
      seoDescription: "Meta Description:\nGlass and door services",
    });

    expect(schema?.description).toBe("Glass and door services");
    expect(schema?.hasOfferCatalog).toMatchObject({
      itemListElement: expect.arrayContaining([
        expect.objectContaining({
          itemOffered: expect.objectContaining({
            name: "Commercial Storefront Glass Installation",
            url: "https://glassanddoorpro.com/services/commercial-storefront-glass-installation",
          }),
        }),
        expect.objectContaining({
          itemOffered: expect.objectContaining({
            name: "Commercial Window Replacement",
            url: "https://glassanddoorpro.com/services/commercial-window-replacement",
          }),
        }),
      ]),
    });
    expect(
      (schema?.hasOfferCatalog as { itemListElement: unknown[] }).itemListElement,
    ).toHaveLength(9);
  });

  it("uses city-specific business and service schema for new service-area pages", () => {
    const cityArea = getGlassCityPageArea("service-areas-indian-land");
    const businessSchema = buildGlassLocalBusinessLd(undefined, cityArea);
    const serviceSchema = buildGlassServiceLdForCmsPage({
      slug: "service-areas-indian-land",
      seoDescription: "Indian Land service area",
    });

    expect(serviceSchema).toMatchObject({
      "@type": "Service",
      name: "Glass and Door Services in Indian Land, SC",
      hasOfferCatalog: {
        itemListElement: expect.arrayContaining([
          expect.objectContaining({
            itemOffered: expect.objectContaining({
              name: "Commercial Storefront Glass Installation",
              url: "https://glassanddoorpro.com/services/commercial-storefront-glass-installation",
            }),
          }),
          expect.objectContaining({
            itemOffered: expect.objectContaining({
              name: "Commercial Window Replacement",
              url: "https://glassanddoorpro.com/services/commercial-window-replacement",
            }),
          }),
        ]),
      },
    });
    expect(
      (serviceSchema?.hasOfferCatalog as { itemListElement: unknown[] }).itemListElement,
    ).toHaveLength(9);
    expect(businessSchema.areaServed).toMatchObject({
      "@type": "City",
      name: "Indian Land",
      containedInPlace: { "@type": "State", name: "South Carolina" },
    });
  });
});
