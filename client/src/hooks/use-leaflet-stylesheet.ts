import { useEffect, useState } from "react";

const LEAFLET_STYLESHEET_ID = "leaflet-runtime-stylesheet";
const LEAFLET_STYLESHEET_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_STYLESHEET_INTEGRITY = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";

export function useLeafletStylesheet() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = document.getElementById(LEAFLET_STYLESHEET_ID) as HTMLLinkElement | null;
    if (existing) {
      if (existing.sheet) {
        setReady(true);
        return;
      }

      const handleLoad = () => setReady(true);
      existing.addEventListener("load", handleLoad, { once: true });
      return () => existing.removeEventListener("load", handleLoad);
    }

    const link = document.createElement("link");
    link.id = LEAFLET_STYLESHEET_ID;
    link.rel = "stylesheet";
    link.href = LEAFLET_STYLESHEET_URL;
    link.integrity = LEAFLET_STYLESHEET_INTEGRITY;
    link.crossOrigin = "";

    const handleLoad = () => setReady(true);
    link.addEventListener("load", handleLoad, { once: true });
    document.head.appendChild(link);

    return () => link.removeEventListener("load", handleLoad);
  }, []);

  return ready;
}
