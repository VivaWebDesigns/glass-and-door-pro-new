import { Link, useLocation } from "wouter";
import { FileText, Phone } from "lucide-react";
import { excludeServiceUtilitySnippets } from "@shared/glass-search-snippets";
import { useBranding } from "@/components/shared/branding-provider";

export const MOBILE_CTA_CLICK_EVENT = "glass_door_pro_mobile_cta_click";
const FALLBACK_PHONE_HREF = "tel:+17047716111";
const FALLBACK_PHONE_DISPLAY = "(704) 771-6111";

// Auth and setup screens share the public chrome but are not lead pages.
export function showsMobileCtaBar(pathname: string) {
  return !pathname.startsWith("/auth/") && pathname !== "/setup";
}

// Reads the first number in the branding phone setting as a display string and tel: link.
export function phoneFromSetting(phoneNumbers: string | null | undefined) {
  const first = (phoneNumbers?.split(/[,;/\n]/)[0] ?? "").trim();
  const digits = first.replace(/\D/g, "");
  if (digits.length === 10) return { display: first, href: `tel:+1${digits}` };
  if (digits.length === 11 && digits.startsWith("1"))
    return { display: first, href: `tel:+${digits}` };
  return { display: FALLBACK_PHONE_DISPLAY, href: FALLBACK_PHONE_HREF };
}

function trackMobileCta(cta: "call" | "quote") {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: MOBILE_CTA_CLICK_EVENT, cta });
}

// Phone-only bar pinned to the bottom of every public page. Replaces the hero
// buttons below the md breakpoint (see HeroCtas in public-block-renderer.tsx).
export function MobileCtaBar() {
  const [location] = useLocation();
  const { companyPhoneNumbers } = useBranding();

  if (!showsMobileCtaBar(location)) return null;
  const phone = phoneFromSetting(companyPhoneNumbers);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[998] flex gap-2.5 border-t border-slate-200 bg-white px-3 pt-2.5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(15,23,42,0.08)] md:hidden"
      data-nosnippet={excludeServiceUtilitySnippets(location) ? "" : undefined}
      data-testid="mobile-cta-bar"
    >
      <a
        href={phone.href}
        onClick={() => trackMobileCta("call")}
        className="flex h-[50px] flex-[1.15] items-center justify-center gap-2 rounded-lg bg-[#1a8ead] text-[15px] font-semibold text-white active:bg-[#167f9b]"
        data-testid="mobile-cta-call"
      >
        <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
        Call Doug
        <span className="sr-only"> at {phone.display}</span>
      </a>
      <Link
        href="/#contact"
        onClick={() => trackMobileCta("quote")}
        className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-lg border-[1.5px] border-[#1a8ead] bg-white text-[15px] font-semibold text-[#1a8ead] active:bg-[#e8f7fb]"
        data-testid="mobile-cta-quote"
      >
        <FileText className="h-[18px] w-[18px]" aria-hidden="true" />
        Free quote
      </Link>
    </div>
  );
}
