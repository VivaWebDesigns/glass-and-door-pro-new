import { Link } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";

const serviceAreas = [
  [
    "Charlotte",
    "/service-areas/charlotte",
    "Glass, window, door, shower, and commercial services across Charlotte.",
  ],
  [
    "Monroe",
    "/service-areas/monroe",
    "Owner-operated glass and door services from Glass & Door Pro's home base.",
  ],
  [
    "Indian Trail",
    "/service-areas/indian-trail",
    "Frameless showers, windows, doors, repairs, and commercial glass.",
  ],
  [
    "Stallings",
    "/service-areas/stallings",
    "Local glass and door installation and repair for Stallings homes and businesses.",
  ],
  [
    "Wesley Chapel",
    "/service-areas/wesley-chapel",
    "Custom shower glass, replacement windows, door installation, and repair.",
  ],
  [
    "Waxhaw",
    "/service-areas/waxhaw",
    "Glass and door services for Waxhaw remodels, repairs, and replacements.",
  ],
  [
    "Matthews",
    "/service-areas/matthews",
    "Residential and commercial glass, window, and door services in Matthews.",
  ],
  [
    "Weddington",
    "/service-areas/weddington",
    "Custom glass, frameless showers, windows, and doors in Weddington.",
  ],
  [
    "Indian Land",
    "/service-areas/indian-land",
    "Glass and door service for Indian Land, SC homeowners and businesses.",
  ],
  [
    "Fort Mill",
    "/service-areas/fort-mill",
    "Frameless showers, windows, doors, and commercial glass in Fort Mill.",
  ],
  [
    "Pineville",
    "/service-areas/pineville",
    "Glass, window, door, and repair services for Pineville properties.",
  ],
] as const;

export default function ServiceAreasPage() {
  return (
    <PageLayout>
      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Areas We Serve
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Glass and Door Services Across Greater Charlotte
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              Glass & Door Pro serves Charlotte, Monroe, Union County, and nearby South Carolina
              communities with frameless showers, window installation, door installation, window
              repair, and commercial glass services.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map(([name, href, description]) => (
              <Link
                key={href}
                href={href}
                className="group rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <MapPin className="h-7 w-7 text-primary" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
                  View area
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-center sm:px-6">
        <h2 className="font-heading text-3xl font-bold text-slate-900">Need service nearby?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Call Doug directly for a clear next step and a free quote.
        </p>
        <div className="mt-7">
          <a href="tel:+17047716111">
            <Button>Call (704) 771-6111</Button>
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
