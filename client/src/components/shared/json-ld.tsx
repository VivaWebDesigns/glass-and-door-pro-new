import { useEffect, useId } from "react";
import type { JsonLdObject } from "@/lib/structured-data";

interface JsonLdProps {
  schemas: (JsonLdObject | null | undefined)[];
}

function canonicalizeSchema(text: string | null) {
  if (!text) return null;

  try {
    return JSON.parse(text) as JsonLdObject;
  } catch {
    return null;
  }
}

function schemaIdentity(schema: JsonLdObject) {
  const type = schema["@type"];
  if (typeof type !== "string") return null;

  const id = schema["@id"];
  if (typeof id === "string" && id) return `${type}:id:${id}`;

  const url = schema.url;
  if (typeof url === "string" && url) return `${type}:url:${url}`;

  if (type === "BreadcrumbList") {
    const items = schema.itemListElement;
    if (Array.isArray(items)) {
      const last = items[items.length - 1] as { item?: unknown } | undefined;
      if (typeof last?.item === "string" && last.item) return `${type}:item:${last.item}`;
    }
  }

  if (type === "FAQPage") return type;

  const name = schema.name;
  return typeof name === "string" && name ? `${type}:name:${name}` : null;
}

export function JsonLd({ schemas }: JsonLdProps) {
  const uid = useId().replace(/:/g, "");
  const valid = schemas.filter((s): s is JsonLdObject => !!s);
  const serializedSchemas = JSON.stringify(valid);

  useEffect(() => {
    if (valid.length === 0) return;

    const schemaSet = new Set(valid.map(schemaIdentity).filter((key): key is string => !!key));
    const handledIdentities = new Set<string>();
    const adoptedScripts: HTMLScriptElement[] = [];

    document
      .querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')
      .forEach((script) => {
        const parsed = canonicalizeSchema(script.textContent);
        const identity = parsed ? schemaIdentity(parsed) : null;
        if (!identity || !schemaSet.has(identity)) return;

        handledIdentities.add(identity);
        adoptedScripts.push(script);
      });

    const scripts: HTMLScriptElement[] = valid.flatMap((schema, i) => {
      const identity = schemaIdentity(schema);
      if (identity && handledIdentities.has(identity)) return [];

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = `ld-json-${uid}-${i}`;
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      if (identity) handledIdentities.add(identity);
      return [script];
    });

    return () => {
      adoptedScripts.forEach((s) => s.remove());
      scripts.forEach((s) => s.remove());
    };
  }, [serializedSchemas, uid]);

  return null;
}
