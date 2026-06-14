import { Link } from "wouter";
import { BadgeCheck, Building2, DoorOpen, Grid3X3, Wrench } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Frameless Showers",
    description: "Custom frameless shower doors and glass enclosures measured and installed personally.",
    href: "/services/frameless-showers",
    icon: BadgeCheck,
  },
  {
    title: "Window Installation",
    description: "Residential window installation and replacement for homes across the Charlotte area.",
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
    description: "Broken glass, foggy panes, seal failure, and glass-only replacement when possible.",
    href: "/services/window-repair",
    icon: Wrench,
  },
  {
    title: "Commercial Glass",
    description: "Storefront glass, office glass, glass doors, and commercial repair support.",
    href: "/services/commercial-glass",
    icon: Building2,
  },
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
                Glass & Door Pro installs and repairs showers, windows, doors, and commercial
                glass throughout Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby
                communities.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="group rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                    <h2 className="mt-4 text-lg font-semibold text-slate-900">{service.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                    <span className="mt-5 inline-flex text-sm font-semibold text-primary group-hover:underline">
                      View service
                    </span>
                  </Link>
                );
              })}
            </div>
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
