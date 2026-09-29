import { describe, expect, it } from "vitest";
import { GLASS_PRIMARY_SERVICE_AREAS } from "./glass-service-areas";
import { getCmsSlugForPublicPath } from "./glass-seo";
import {
  getGlassLocationSearchCopy,
  updateGlassLocationSearchContent,
} from "./glass-location-search";

describe("location shower search copy", () => {
  it("covers every published location with a brand-free title and a phone number", () => {
    for (const area of GLASS_PRIMARY_SERVICE_AREAS) {
      const copy = getGlassLocationSearchCopy(getCmsSlugForPublicPath(area.href));
      expect(copy?.heading).toBe(`Glass Shower Door Installer in ${copy?.place}`);
      expect(copy?.title).toBe(`Glass Shower Door Installation in ${copy?.place}`);
      expect(copy?.description).toContain(`installation in ${copy?.place}.`);
      expect(copy?.description).toContain("(704) 771-6111");
    }
    expect(getGlassLocationSearchCopy("service-areas")).toBeNull();
  });

  it("changes the hero and opening paragraph once while retaining other content", () => {
    const original = {
      blocks: [
        { id: "hero", type: "hero", props: { heading: "Glass & Door Services in Waxhaw, NC" } },
        { id: "intro", type: "rich-text", props: { content: "<p>Existing local detail.</p>" } },
        { id: "services", type: "cards-grid", props: { title: "Our Services in Waxhaw, NC" } },
      ],
    };
    const updated = updateGlassLocationSearchContent("service-areas-waxhaw", original);
    expect(updated).toMatchObject({
      blocks: [
        {
          props: {
            heading: "Glass Shower Door Installer in Waxhaw, NC",
            subheading: expect.stringContaining("Doug personally measures and installs every door"),
          },
        },
        { props: { content: expect.stringContaining("<p>Existing local detail.</p>") } },
        { props: { title: "Our Services in Waxhaw, NC" } },
      ],
    });
    expect((updated as typeof original).blocks[1].props.content).toContain(
      "installs custom glass shower doors in Waxhaw, NC",
    );
    expect(updateGlassLocationSearchContent("service-areas-waxhaw", updated)).toBe(updated);
  });
});
