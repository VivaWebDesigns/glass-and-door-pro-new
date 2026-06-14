import { useEffect, useId } from "react";
import type { JsonLdObject } from "@/lib/structured-data";

interface JsonLdProps {
  schemas: (JsonLdObject | null | undefined)[];
}

function canonicalizeSchema(text: string | null) {
  if (!text) return null;

  try {
    return JSON.stringify(JSON.parse(text));
  } catch {
    return null;
  }
}

export function JsonLd({ schemas }: JsonLdProps) {
  const uid = useId().replace(/:/g, "");
  const valid = schemas.filter((s): s is JsonLdObject => !!s);
  const serializedSchemas = JSON.stringify(valid);

  useEffect(() => {
    if (valid.length === 0) return;

    const schemaSet = new Set(valid.map((schema) => JSON.stringify(schema)));
    document
      .querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')
      .forEach((script) => {
        const canonical = canonicalizeSchema(script.textContent);
        if (canonical && schemaSet.has(canonical)) {
          script.remove();
        }
      });

    const scripts: HTMLScriptElement[] = valid.map((schema, i) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = `ld-json-${uid}-${i}`;
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [serializedSchemas, uid]);

  return null;
}
