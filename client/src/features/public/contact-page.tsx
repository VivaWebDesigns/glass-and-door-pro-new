import { PageLayout } from "@/components/layout/page-layout";
import { ContactFormGrid } from "@/components/forms/contact-form-grid";

export default function ContactPage() {
  return (
    <PageLayout>
      <section className="relative bg-muted/30 overflow-hidden" data-testid="section-contact-hero">
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "radial-gradient(ellipse at 50% 100%, hsl(var(--accent) / 0.18) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 md:py-24 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4" data-testid="text-contact-heading">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14" data-testid="section-contact-form">
        <ContactFormGrid />
      </section>
    </PageLayout>
  );
}
