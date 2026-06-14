import { describe, expect, it } from "vitest";
import { formatBrandFirstTitle } from "./seo-title";

describe("formatBrandFirstTitle", () => {
  it("moves equivalent brand suffixes to the front without duplicating the brand", () => {
    expect(
      formatBrandFirstTitle(
        "Glass & Door Services in Monroe, NC | Glass and Door Pro",
        " | Glass & Door Pro",
        "Glass & Door Pro",
      ),
    ).toBe("Glass & Door Pro | Glass & Door Services in Monroe, NC");
  });

  it("normalizes equivalent brand prefixes to the configured brand", () => {
    expect(
      formatBrandFirstTitle(
        "Glass and Door Pro | Glass & Door Services in Charlotte, NC",
        " | Glass & Door Pro",
        "Glass & Door Pro",
      ),
    ).toBe("Glass & Door Pro | Glass & Door Services in Charlotte, NC");
  });
});
