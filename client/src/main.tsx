import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { bootstrapCmsPrerenderPage } from "@/lib/cms-prerender";
import { bootstrapPublicData } from "@/lib/public-bootstrap";

if (typeof window !== "undefined") {
  bootstrapCmsPrerenderPage();
  bootstrapPublicData();
  document.getElementById("seo-prerender")?.remove();
}

createRoot(document.getElementById("root")!).render(<App />);
