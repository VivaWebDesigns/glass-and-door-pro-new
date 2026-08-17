import { storage } from "../storage";

export const GLASS_COMPANY_ADDRESS =
  "6135 Park South Drive\nSuite 542\nCharlotte, NC 28210";

const LEGACY_GLASS_COMPANY_ADDRESSES = new Set([
  "2341 Waverly Dr\nMonroe, NC 28112",
  "2341 Waverly Dr, Monroe, NC 28112",
]);

export async function ensureSystemBranding() {
  const currentAddress = await storage.settings.getSetting("company_address");

  if (currentAddress === null || LEGACY_GLASS_COMPANY_ADDRESSES.has(currentAddress.trim())) {
    await storage.settings.upsertSetting(
      "company_address",
      GLASS_COMPANY_ADDRESS,
      "branding",
      false,
    );
  }
}
