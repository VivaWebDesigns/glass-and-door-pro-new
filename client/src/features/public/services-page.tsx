import { Link } from "wouter";
import { BadgeCheck, Building2, DoorOpen, Grid3X3, Wrench, type LucideIcon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { GLASS_PRIMARY_SERVICE_AREA_NAMES } from "@shared/glass-service-areas";

type ServiceCard = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const residentialServices: ServiceCard[] = [
  {
    title: "Frameless Showers",
    description:
      "Custom frameless shower doors and glass enclosures measured and installed personally.",
    href: "/services/frameless-showers",
    icon: BadgeCheck,
  },
  {
    title: "Window Installation",
    description:
      "Residential window installation and replacement for homes across the Charlotte area.",
    href: "/services/window-installation",
    icon: Grid3X3,
  },
  {
    title: "Door Installation",
    description: "Entry, patio, storm, and exterior door installation with clean fit and finish.",
    href: "/services/door-installation",
    icon: DoorOpen,
  },
  {
    title: "Window Repair",
    description:
      "Broken glass, foggy panes, seal failure, and glass-only replacement when possible.",
    href: "/services/window-repair",
    icon: Wrench,
  },
];

const commercialServices: ServiceCard[] = [
  {
    title: "Commercial Storefront Glass Installation",
    description:
      "Aluminum framing, fixed glass panels, and storefront doors for new construction, tenant buildouts, and commercial renovations.",
    href: "/services/commercial-storefront-glass-installation",
    icon: Building2,
  },
  {
    title: "Commercial Storefront Glass Replacement & Repair",
    description:
      "Emergency board-up, broken panel replacement, and storefront glass repair for Charlotte businesses.",
    href: "/services/commercial-storefront-glass-replacement-repair",
    icon: Building2,
  },
  {
    title: "Commercial Door Installation",
    description:
      "Aluminum entry doors, glass storefront doors, and complete commercial entrance systems.",
    href: "/services/commercial-door-installation",
    icon: DoorOpen,
  },
  {
    title: "Commercial Door Replacement & Repair",
    description:
      "Broken glass panels, hardware failure, misaligned frames, and worn closers repaired or replaced fast.",
    href: "/services/commercial-door-replacement-repair",
    icon: Wrench,
  },
  {
    title: "Commercial Window Replacement",
    description: "Apartment and multi-family window replacement with fast mobilization.",
    href: "/services/commercial-window-replacement",
    icon: Building2,
  },
];

const serviceGroups: Array<{ title: string; services: ServiceCard[] }> = [
  { title: "Residential Services", services: residentialServices },
  { title: "Commercial Services", services: commercialServices },
];

export default function ServicesPage() {
  return (
    <div className="public-page-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h1 className="font-heading text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Glass and Door Services
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                Frameless showers, residential windows, door installation, window repair, and
                commercial glass and door services across {GLASS_PRIMARY_SERVICE_AREA_NAMES}, and
                nearby communities.
              </p>
            </div>
            {serviceGroups.map((serviceGroup) => (
              <section key={serviceGroup.title} className="mt-10">
                <h2 className="font-heading text-2xl font-bold text-slate-900">
                  {serviceGroup.title}
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {serviceGroup.services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="group rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                          {service.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {service.description}
                        </p>
                        <span className="mt-5 inline-flex text-sm font-semibold text-primary group-hover:underline">
                          View service
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
        <section className="bg-white px-4 py-12 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-bold text-slate-900">Need a quote?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Doug will review the project personally and give you clear next steps.
          </p>
          <div className="mt-7">
            <a href="tel:+17047716111">
              <Button>Call (704) 771-6111</Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
