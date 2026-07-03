import { describe, expect, it } from "vitest";
import { normalizeSeoDescription } from "./seo-description";

describe("normalizeSeoDescription", () => {
  it("strips pasted CMS field labels and leading newlines", () => {
    expect(
      normalizeSeoDescription(
        "Meta Description:\nOwner-operated glass and door services in Charlotte, NC.",
      ),
    ).toBe("Owner-operated glass and door services in Charlotte, NC.");
  });

  it("strips literal escaped newlines after the pasted label", () => {
    expect(
      normalizeSeoDescription(
        "Meta Description:\\nOwner-operated glass and door services in Charlotte, NC.",
      ),
    ).toBe("Owner-operated glass and door services in Charlotte, NC.");
  });
});
