import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const isReplit = process.env.REPL_ID !== undefined;

function preambleFixPlugin(): Plugin {
  return {
    name: "preamble-fix",
    enforce: "post",
    apply: "serve",
    transform(code, id) {
      if (id.includes("node_modules") || !code.includes("can't detect preamble")) return;
      return code.replace(
        /if\s*\(!window\.\$RefreshReg\$\)\s*\{[^}]*can't detect preamble[^}]*\}/s,
        `if (!window.$RefreshReg$) { window.$RefreshReg$ = () => {}; window.$RefreshSig$ = () => (t) => t; }`,
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    preambleFixPlugin(),
    ...(isReplit && process.env.NODE_ENV !== "production"
      ? [
          await import("@replit/vite-plugin-runtime-error-modal").then((m) => m.default()),
          await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer()),
          await import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    modulePreload: {
      resolveDependencies(_filename, deps) {
        const routeOnlyChunks = [
          "calendar-vendor",
          "date-vendor",
          "dnd-vendor",
          "form-vendor",
          "interaction-vendor",
          "motion-vendor",
          "prosemirror",
          "tiptap",
        ];

        return deps.filter(
          (dep) => !routeOnlyChunks.some((chunkName) => dep.includes(`${chunkName}-`)),
        );
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("/@tanstack/react-query/") || id.includes("/@tanstack/query-core/")) {
            return "query-vendor";
          }

          if (id.includes("/wouter/")) {
            return "router-vendor";
          }

          if (id.includes("/@radix-ui/")) {
            return "radix-vendor";
          }

          if (
            id.includes("/react-hook-form/") ||
            id.includes("/@hookform/") ||
            id.includes("/zod/") ||
            id.includes("/drizzle-zod/")
          ) {
            return "form-vendor";
          }

          if (id.includes("/lucide-react/")) {
            return "icons-vendor";
          }

          if (id.includes("/date-fns/") || id.includes("/react-day-picker/")) {
            return "date-vendor";
          }

          if (id.includes("/framer-motion/")) {
            return "motion-vendor";
          }

          if (id.includes("/@dnd-kit/")) {
            return "dnd-vendor";
          }

          if (id.includes("/@fullcalendar/")) {
            return "calendar-vendor";
          }

          if (id.includes("/cmdk/") || id.includes("/vaul/") || id.includes("/input-otp/")) {
            return "interaction-vendor";
          }

          if (id.includes("/@tiptap/")) {
            return "tiptap";
          }

          if (
            id.includes("/prosemirror-") ||
            id.includes("/orderedmap/") ||
            id.includes("/rope-sequence/")
          ) {
            return "prosemirror";
          }

          if (id.includes("/recharts/")) {
            return "charts";
          }

          if (id.includes("/embla-carousel")) {
            return "carousel";
          }

          return "vendor";
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
