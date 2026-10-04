import { type ElementType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ChevronRight, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { PublicFormRenderer } from "@/components/forms/public-form-renderer";
import { CompanyInformationCard } from "@/components/shared/company-information-card";
import { withContentKeys } from "@/lib/content-keys";
import { ContactFormGrid } from "@/components/forms/contact-form-grid";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

const CONTACT_ICON_MAP: Record<string, ElementType> = {
  MapPin,
  Mail,
  Phone,
  Clock,
};

type ContactItem = { icon: string; label: string; value: string; href?: string };

// "Charlotte, Pineville, ..." -> "Charlotte and 10 nearby towns" for the compact phone list.
export function summarizeServiceArea(value: string) {
  const places = value
    .split(",")
    .map((place) => place.trim())
    .filter(Boolean);
  if (places.length <= 3) return null;
  return `${places[0]} and ${places.length - 1} nearby towns`;
}

// Phones get one compact card with tappable rows instead of four large cards.
function CompactContactItems({ items }: { items: ContactItem[] }) {
  return (
    <Card
      className="border-none bg-white text-slate-900 shadow-sm md:hidden"
      data-testid="contact-items-compact"
    >
      <ul className="divide-y divide-slate-200">
        {items.map(
          withContentKeys((item, _index, itemKey) => {
            const Icon = CONTACT_ICON_MAP[item.icon] ?? MapPin;
            const areaSummary = item.icon === "MapPin" ? summarizeServiceArea(item.value) : null;
            const body = (
              <>
                <Icon className="h-[22px] w-[22px] shrink-0 text-[#1a8ead]" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold leading-5 text-slate-900">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block whitespace-pre-line break-words text-sm leading-5 text-slate-600">
                    {areaSummary ?? item.value}
                  </span>
                  {areaSummary && (
                    <Link
                      href="/service-areas"
                      className="mt-1 inline-block text-sm font-semibold text-[#1a8ead]"
                    >
                      See all areas
                    </Link>
                  )}
                </span>
              </>
            );
            return (
              <li key={itemKey}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="flex min-h-[60px] items-center gap-3.5 px-5 py-3.5 active:bg-[#e8f7fb]"
                  >
                    {body}
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  </a>
                ) : (
                  <div className="flex min-h-[60px] items-center gap-3.5 px-5 py-3.5">{body}</div>
                )}
              </li>
            );
          }),
        )}
      </ul>
    </Card>
  );
}

export function ContactFormBlock({ props = {} }: { props?: Record<string, unknown> }) {
  const variant = str(props.variant);

  if (variant === "split-contact") {
    const items = arr<ContactItem>(props.contactItems);
    return (
      <section
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20"
        data-testid="dynamic-contact-form"
      >
        <div className="mb-10 max-w-3xl">
          {str(props.eyebrow) && (
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#1a8ead]">
              {str(props.eyebrow)}
            </p>
          )}
          <h2 className="font-heading text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            {str(props.heading) || "Ready to start your project?"}
          </h2>
          {str(props.subheading) && (
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              {str(props.subheading)}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-3 border-none bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Send className="h-5 w-5 text-[#1a8ead]" />
                {str(props.formTitle) || "Send a Message"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PublicFormRenderer
                slug={str(props.formSlug) || "contact-form"}
                showHeader={false}
                submitButtonClassName="!bg-[#1a8ead] !text-white hover:!bg-[#14758f]"
              />
            </CardContent>
          </Card>
          <div className="space-y-4 lg:col-span-2">
            {items.length > 0 && <CompactContactItems items={items} />}
            {items.length > 0 ? (
              items.map(
                withContentKeys((item, _index, itemKey) => {
                  const Icon = CONTACT_ICON_MAP[item.icon] ?? MapPin;
                  const content = <span className="whitespace-pre-line">{item.value}</span>;
                  return (
                    <Card
                      key={itemKey}
                      className="hidden border-none bg-white text-slate-900 shadow-sm md:block"
                    >
                      <CardContent className="flex gap-4 p-6">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1a8ead] text-white">
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="text-xl font-bold leading-6 text-slate-900">{item.label}</p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="mt-1 block text-base leading-6 text-slate-500 hover:text-[#1a8ead]"
                            >
                              {content}
                            </a>
                          ) : (
                            <p className="mt-1 text-base leading-6 text-slate-500">{content}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }),
              )
            ) : (
              <CompanyInformationCard
                titleClassName="public-heading-3"
                bodyClassName="public-helper-text"
                linkClassName="public-text-link hover:text-[hsl(var(--public-text-link-hover))]"
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="dynamic-contact-form">
      <ContactFormGrid />
    </div>
  );
}

export function ManagedFormEmbedBlock({ props }: { props: Record<string, unknown> }) {
  const formSlug = str(props.formSlug) || "contact-form";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid={`dynamic-form-embed-${formSlug}`}>
      <PublicFormRenderer slug={formSlug} />
    </div>
  );
}
