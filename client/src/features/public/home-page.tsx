import { Link } from "wouter";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/page-layout";

const featuredServices = [
  {
    title: "Frameless Shower Doors",
    href: "/services/frameless-showers",
    description: "Custom glass shower doors installed for Charlotte-area homes.",
  },
  {
    title: "Window Installation",
    href: "/services/window-installation",
    description: "Replacement and new window installation for residential projects.",
  },
  {
    title: "Commercial Storefront Glass",
    href: "/services/commercial-storefront-glass-installation",
    description: "Storefront glass installation and repair for local businesses.",
  },
];

export default function HomePage() {
  return (
    <PageLayout>
      <main>
        <section className="bg-slate-950 text-white">
          <div className="mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-sky-200">
              Glass & Door Pro
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal sm:text-5xl">
              Glass, door, and window service for the Charlotte area.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-200">
              Owner-operated service for frameless showers, window installation, door repair, and commercial glass projects.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="tel:+17047716111">
                  <Phone className="mr-2 h-5 w-5" />
                  Call (704) 771-6111
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/services">
                  View Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {featuredServices.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:border-primary"
              >
                <h2 className="text-xl font-semibold">{service.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
