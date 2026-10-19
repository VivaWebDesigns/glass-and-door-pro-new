import { useEffect } from "react";
import { BRANDING_FONT_OPTIONS, getRemoteFontStylesheet } from "@shared/branding-fonts";

/** Font previews are needed only while the typography panel is mounted. */
export function FontPreviewLoader() {
  useEffect(() => {
    const href = getRemoteFontStylesheet(BRANDING_FONT_OPTIONS.map((option) => option.value));
    if (!href) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.cmsFontPreviews = "true";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);
  return null;
}
