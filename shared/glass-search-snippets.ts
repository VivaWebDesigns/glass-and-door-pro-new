// Only the three listings requested for title/snippet cleanup. Descriptions
// and the frameless listing intentionally remain unchanged.
export const GLASS_SEARCH_TITLE_SLUGS = new Set([
  "services",
  "services-window-repair",
  "services-door-installation",
]);

export function correctGlassSearchTitle(slug: string, title: string | null | undefined) {
  return GLASS_SEARCH_TITLE_SLUGS.has(slug)
    ? title?.replace("Charlotte & Monroe, NC", "Charlotte, NC")
    : title;
}

export function excludeServiceUtilitySnippets(pathname: string) {
  return ["/services", "/services/window-repair", "/services/door-installation"].includes(
    pathname.replace(/\/$/, ""),
  );
}
