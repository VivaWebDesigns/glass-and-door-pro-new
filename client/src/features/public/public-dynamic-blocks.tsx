import { type ElementType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { PublicFormRenderer } from "@/components/forms/public-form-renderer";
import { CompanyInformationCard } from "@/components/shared/company-information-card";

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

export function ContactFormBlock({ props = {} }: { props?: Record<string, unknown> }) {
  const variant = str(props.variant);

  if (variant === "split-contact") {
    const items = arr<{ icon: string; label: string; value: string; href?: string }>(props.contactItems);
    return (
      <section id={str(props.anchorId) || "contact"} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20" data-testid="dynamic-contact-form">
        <div className="mb-10 max-w-3xl">
          {str(props.eyebrow) && (
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#1a8ead]">{str(props.eyebrow)}</p>
          )}
          <h2 className="font-heading text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{str(props.heading) || "Ready to start your project?"}</h2>
          {str(props.subheading) && (
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{str(props.subheading)}</p>
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
            {items.length > 0 ? (
              items.map((item, index) => {
                const Icon = CONTACT_ICON_MAP[item.icon] ?? MapPin;
                const content = <span className="whitespace-pre-line">{item.value}</span>;
                return (
                  <Card key={`${item.label}-${index}`} className="border-none bg-white text-slate-900 shadow-sm">
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1a8ead] text-white">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xl font-bold leading-6 text-slate-900">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="mt-1 block text-base leading-6 text-slate-500 hover:text-[#1a8ead]">
                            {content}
                          </a>
                        ) : (
                          <p className="mt-1 text-base leading-6 text-slate-500">{content}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PublicFormRenderer slug="contact-form" showHeader={false} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <CompanyInformationCard
            titleClassName="public-heading-3"
            bodyClassName="public-helper-text"
            linkClassName="public-text-link hover:text-[hsl(var(--public-text-link-hover))]"
          />
        </div>
      </div>
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
