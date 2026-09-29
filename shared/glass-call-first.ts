import { GLASS_CALL_CTA_LINK, GLASS_CALL_CTA_TEXT } from "./glass-service-heroes";

// Hero and CTA blocks show the phone call as the primary button. The CMS seed
// applies this when building blocks and startup applies it once to live pages,
// so both produce the same button order.

const BUTTON_FIELDS = [
  "Text",
  "Action",
  "Link",
  "OpenInNewTab",
  "FormSlug",
  "ModalTitle",
  "ModalDescription",
] as const;

const BUTTON_PREFIXES: Record<string, readonly [string, string]> = {
  hero: ["cta", "ctaSecondary"],
  cta: ["primary", "secondary"],
};

function isCallLink(value: unknown) {
  return typeof value === "string" && value.startsWith("tel:");
}

export function putCallButtonFirst(
  blockType: string,
  props: Record<string, unknown>,
): Record<string, unknown> {
  const prefixes = BUTTON_PREFIXES[blockType];
  if (!prefixes) return props;
  const [primary, secondary] = prefixes;

  if (isCallLink(props[`${primary}Link`])) return props;

  const next: Record<string, unknown> = { ...props };
  for (const field of BUTTON_FIELDS) {
    delete next[`${primary}${field}`];
    delete next[`${secondary}${field}`];
  }

  const moveButton = (from: string, to: string) => {
    for (const field of BUTTON_FIELDS) {
      const value = props[`${from}${field}`];
      if (value !== undefined) next[`${to}${field}`] = value;
    }
  };

  if (isCallLink(props[`${secondary}Link`])) {
    moveButton(secondary, primary);
    moveButton(primary, secondary);
    return next;
  }

  // A lone quote button gains a call button in front of it.
  if (props[`${primary}Text`] && !props[`${secondary}Text`]) {
    moveButton(primary, secondary);
    next[`${primary}Text`] = GLASS_CALL_CTA_TEXT;
    next[`${primary}Action`] = "custom-link";
    next[`${primary}Link`] = GLASS_CALL_CTA_LINK;
    return next;
  }

  return props;
}
