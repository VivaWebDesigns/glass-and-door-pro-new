import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetSetting = vi.fn();
const mockUpsertSetting = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    settings: {
      getSetting: mockGetSetting,
      upsertSetting: mockUpsertSetting,
    },
  },
}));

describe("ensureSystemBranding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([null, "2341 Waverly Dr\nMonroe, NC 28112"])(
    "sets the current address when the stored value is %s",
    async (storedAddress) => {
      mockGetSetting.mockResolvedValue(storedAddress);

      const mod = await import("../services/system-branding.service");
      await mod.ensureSystemBranding();

      expect(mockUpsertSetting).toHaveBeenCalledWith(
        "company_address",
        "6135 Park South Drive\nSuite 542\nCharlotte, NC 28210",
        "branding",
        false,
      );
    },
  );

  it("preserves a custom address", async () => {
    mockGetSetting.mockResolvedValue("A different admin-managed address");

    const mod = await import("../services/system-branding.service");
    await mod.ensureSystemBranding();

    expect(mockUpsertSetting).not.toHaveBeenCalled();
  });
});
