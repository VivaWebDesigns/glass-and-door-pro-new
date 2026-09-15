import { describe, expect, it } from "vitest";
import { formatGlassReviewDate } from "@shared/glass-review-dates";

describe("formatGlassReviewDate", () => {
  it("formats review dates as month and year", () => {
    expect(formatGlassReviewDate("2026-08-18")).toBe("August 2026");
    expect(formatGlassReviewDate("2026-07-28")).toBe("July 2026");
    expect(formatGlassReviewDate("2025-08-01")).toBe("August 2025");
    expect(formatGlassReviewDate("2021-05-21")).toBe("May 2021");
  });

  it("keeps legacy labels when a valid review date is unavailable", () => {
    expect(formatGlassReviewDate(undefined, "a while ago")).toBe("a while ago");
    expect(formatGlassReviewDate("not-a-date", "a while ago")).toBe("a while ago");
  });
});
