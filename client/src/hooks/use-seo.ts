import { useEffect } from "react";

interface SeoOptions {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(name: string, property = false) {
  const attr = property ? "property" : "name";
  const el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.remove();
}

function absoluteUrl(path: string, base?: string) {
  if (!path || /^https?:\/\//i.test(path)) return path;
  const origin = base
    ? new URL(base, typeof window !== "undefined" ? window.location.origin : undefined).origin
    : typeof window !== "undefined"
      ? window.location.origin
      : "";
  return `${origin.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function useSeo({ title, description, ogImage, canonical, noindex }: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;

    if (title) document.title = title;

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, true);
    }

    if (title) setMeta("og:title", title, true);

    if (ogImage) {
      setMeta("og:image", absoluteUrl(ogImage, canonical), true);
    } else {
      removeMeta("og:image", true);
    }

    if (canonical) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    if (noindex) {
      setMeta("robots", "noindex,nofollow");
    } else {
      removeMeta("robots");
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, ogImage, canonical, noindex]);
}
