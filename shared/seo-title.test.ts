import { describe, expect, it } from "vitest";
import { formatBrandFirstTitle, formatBrandLastTitle } from "./seo-title";

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

describe("formatBrandLastTitle", () => {
  it("moves equivalent brand prefixes to the end without duplicating the brand", () => {
    expect(
      formatBrandLastTitle(
        "Glass and Door Pro | Commercial Glass Services in Charlotte, NC",
        " | Glass & Door Pro",
        "Glass & Door Pro",
      ),
    ).toBe("Commercial Glass Services in Charlotte, NC | Glass & Door Pro");
  });

  it("normalizes equivalent brand suffixes to the configured brand", () => {
    expect(
      formatBrandLastTitle(
        "Door Installation in Charlotte & Monroe, NC | Glass and Door Pro",
        " | Glass & Door Pro",
        "Glass & Door Pro",
      ),
    ).toBe("Door Installation in Charlotte & Monroe, NC | Glass & Door Pro");
  });
});
