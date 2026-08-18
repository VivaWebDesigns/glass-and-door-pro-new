import { describe, expect, it } from "vitest";
import { formatGlassReviewAge } from "@shared/glass-review-dates";

describe("formatGlassReviewAge", () => {
  const now = new Date("2026-08-18T16:00:00-04:00");

  it("formats current, recent, and older review dates consistently", () => {
    expect(formatGlassReviewAge("2026-08-18", "", now)).toBe("today");
    expect(formatGlassReviewAge("2026-08-14", "", now)).toBe("4 days ago");
    expect(formatGlassReviewAge("2026-07-28", "", now)).toBe("3 weeks ago");
    expect(formatGlassReviewAge("2025-08-01", "", now)).toBe("1 year ago");
    expect(formatGlassReviewAge("2021-05-21", "", now)).toBe("5 years ago");
  });

  it("keeps legacy labels when an exact review date is unavailable", () => {
    expect(formatGlassReviewAge(undefined, "a while ago", now)).toBe("a while ago");
  });
});
