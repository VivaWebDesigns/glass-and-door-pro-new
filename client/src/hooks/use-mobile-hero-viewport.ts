import { MOBILE_HERO_MEDIA } from "@shared/glass-hero-images";
import { useEffect, useState } from "react";

export function useMobileHeroViewport() {
  const [matches, setMatches] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia(MOBILE_HERO_MEDIA).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(MOBILE_HERO_MEDIA);
    const update = () => setMatches(query.matches);
    query.addEventListener("change", update);
    update();
    return () => query.removeEventListener("change", update);
  }, []);

  return matches;
}
