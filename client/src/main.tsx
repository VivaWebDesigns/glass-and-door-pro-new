import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import App from "./App";
import "./index.css";

const VITE_PRELOAD_RECOVERY_KEY = "vite-preload-recovery";
const PRERENDER_CLEANUP_TIMEOUT_MS = 3000;
const rootElement = document.getElementById("root")!;
const seoPrerenderElement =
  typeof document !== "undefined" ? document.getElementById("seo-prerender") : null;

if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();

    const hasRetried = window.sessionStorage.getItem(VITE_PRELOAD_RECOVERY_KEY) === "1";
    if (hasRetried) {
      window.sessionStorage.removeItem(VITE_PRELOAD_RECOVERY_KEY);
      return;
    }

    window.sessionStorage.setItem(VITE_PRELOAD_RECOVERY_KEY, "1");
    window.location.reload();
  });

  window.sessionStorage.removeItem(VITE_PRELOAD_RECOVERY_KEY);

  if (seoPrerenderElement) {
    rootElement.style.visibility = "hidden";
  }
}

function Root() {
  useEffect(() => {
    const prerender = document.getElementById("seo-prerender");
    if (!prerender) return;

    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      prerender.remove();
      rootElement.style.visibility = "";
    };

    const timeout = window.setTimeout(cleanup, PRERENDER_CLEANUP_TIMEOUT_MS);
    const fontsReady =
      "fonts" in document && document.fonts?.ready ? document.fonts.ready : Promise.resolve();

    fontsReady
      .catch(() => undefined)
      .then(() => {
        window.clearTimeout(timeout);
        window.requestAnimationFrame(cleanup);
      });

    return () => {
      window.clearTimeout(timeout);
      cleanup();
    };
  }, []);

  return <App />;
}

createRoot(rootElement).render(<Root />);
