import { brandingFromPayload } from "@/components/shared/branding-provider";
import { queryClient } from "@/lib/queryClient";

/**
 * Seeds the query cache with the branding and menus the server embeds in the page,
 * so the first render already has the logo, contact details and real navigation.
 */
export function bootstrapPublicData() {
  const payload = document.getElementById("__PUBLIC_BOOTSTRAP__")?.textContent;
  if (!payload) return;
  try {
    const { branding, menus } = JSON.parse(payload) as { branding?: unknown; menus?: unknown };
    if (branding && typeof branding === "object") {
      queryClient.setQueryData(
        ["/api/branding"],
        brandingFromPayload(branding as Parameters<typeof brandingFromPayload>[0]),
      );
    }
    if (menus && typeof menus === "object") queryClient.setQueryData(["/api/cms/menus"], menus);
  } catch {
    // A malformed payload falls back to fetching from the API.
  }
}
