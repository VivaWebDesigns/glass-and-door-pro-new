import { describe, expect, it } from "vitest";
import { correctGlassSearchTitle, excludeServiceUtilitySnippets } from "./glass-search-snippets";
import { getGlassServiceSeoOverride } from "./glass-seo";

describe("scoped search listing cleanup", () => {
  it.each(["services", "services-window-repair", "services-door-installation"])(
    "removes only Monroe from the requested title: %s",
    (slug) => {
      expect(
        correctGlassSearchTitle(slug, "Service in Charlotte & Monroe, NC | Glass & Door Pro"),
      ).toBe("Service in Charlotte, NC | Glass & Door Pro");
    },
  );

  it("preserves the existing descriptions byte for byte", () => {
    expect(getGlassServiceSeoOverride("services-window-repair")?.description).toBe(
      "Window repair for broken seals, foggy panes, failed IGUs, broken hardware, and cracked glass. Serving Charlotte, Monroe, Indian Trail, Matthews, and surrounding areas. Call (704) 771-6111.",
    );
    expect(getGlassServiceSeoOverride("services-door-installation")?.description).toBe(
      "Residential door installation for entry doors, patio doors, storm doors, and exterior doors across Charlotte, Monroe, Indian Trail, Matthews, and surrounding areas. Call (704) 771-6111.",
    );
    expect(getGlassServiceSeoOverride("services-frameless-showers")).toEqual({
      title: "Frameless Shower Doors Charlotte NC | Glass & Door Pro",
      description:
        "Custom frameless shower doors installed by Doug with 15+ years of experience. Serving Charlotte, Matthews, Indian Trail, Waxhaw & Monroe.",
    });
  });

  it("does not affect frameless, window installation, or other routes", () => {
    for (const path of [
      "/",
      "/services/frameless-showers",
      "/services/window-installation",
      "/service-areas/monroe",
    ]) {
      expect(excludeServiceUtilitySnippets(path)).toBe(false);
    }
    expect(excludeServiceUtilitySnippets("/services/")).toBe(true);
    expect(correctGlassSearchTitle("services-frameless-showers", "Charlotte & Monroe, NC")).toBe(
      "Charlotte & Monroe, NC",
    );
  });
});
