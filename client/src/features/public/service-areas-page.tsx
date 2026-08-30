import { Link } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { GLASS_PRIMARY_SERVICE_AREAS } from "@shared/glass-service-areas";

const serviceAreaDescriptions = {
  Charlotte: "Glass, window, door, shower, and commercial services across Charlotte.",
  Pineville: "Glass, window, door, and repair services for Pineville properties.",
  Matthews: "Residential and commercial glass, window, and door services in Matthews.",
  Weddington: "Custom glass, frameless showers, windows, and doors in Weddington.",
  "Indian Trail": "Frameless showers, windows, doors, repairs, and commercial glass.",
  "Wesley Chapel": "Custom shower glass, replacement windows, door installation, and repair.",
  Stallings: "Local glass and door installation and repair for Stallings homes and businesses.",
  "Fort Mill": "Frameless showers, windows, doors, and commercial glass in Fort Mill.",
  "Indian Land": "Glass and door service for Indian Land, SC homeowners and businesses.",
};

const serviceAreas = GLASS_PRIMARY_SERVICE_AREAS.map(
  ({ label, href }) => [label, href, serviceAreaDescriptions[label]] as const,
);

export default function ServiceAreasPage() {
  return (
    <div className="public-page-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section
          className="public-hero-pattern relative flex items-center justify-start overflow-hidden text-left"
          style={{ minHeight: "700px" }}
        >
          <img
            src="/images/glass-door-pro/charming-suburban-home-hero-1920x1080.webp"
            alt="Suburban home exterior with replacement windows installed"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 45%" }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.28)" }} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/35 to-transparent" />
          <div className="relative z-10 max-w-3xl px-6 py-20 sm:px-8 sm:py-24 md:py-28 lg:ml-[max(2rem,calc((100vw-80rem)/2))]">
            <h1 className="mb-5 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Glass and Door Services Across Greater Charlotte
            </h1>
            <div className="mb-9 max-w-2xl text-base leading-8 text-white/85 sm:text-lg [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-white/80 [&_p]:m-0">
              Glass & Door Pro serves Charlotte, Union County, and nearby South Carolina communities
              with frameless showers, window installation, door installation, window repair, and
              commercial glass services.
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-start">
              <Button
                asChild
                size="lg"
                className="w-full rounded-md border border-white bg-[#1a8ead] px-8 text-white shadow-sm hover:bg-[#167f9b] hover:text-white sm:w-auto"
              >
                <Link href="/#contact">Request a Free Quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full rounded-md border border-white bg-transparent px-8 text-white shadow-sm hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <a href="tel:+17047716111">Call (704) 771-6111</a>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-10 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="py-4">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-heading font-bold">Areas We Serve</h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Choose your city to see local glass and door services.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                {serviceAreas.map(([name, href, description]) => (
                  <div
                    key={href}
                    className="public-section-card-hover h-full overflow-hidden rounded-lg border-border/70 border-none bg-white text-center shadow-sm"
                  >
                    <div className="flex h-full flex-col px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-8">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20">
                        <MapPin className="h-8 w-8 text-primary" aria-hidden="true" />
                      </div>
                      <h3 className="mb-2 text-base font-semibold leading-snug break-words">
                        {name}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                      <div className="mt-auto pt-5">
                        <Link
                          href={href}
                          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          View area
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f8fafc] px-4 py-10 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div>
              <div className="mb-6 text-left">
                <h2 className="text-3xl font-heading font-bold">
                  Serving the Greater Charlotte Area
                </h2>
              </div>
              <div className="public-prose prose prose-sm max-w-none text-left">
                <p>
                  Glass & Door Pro is based in Charlotte and serves homeowners and businesses across
                  the greater Charlotte metro and nearby South Carolina communities. Doug handles
                  measurements, planning, and installation personally, so you work directly with the
                  person responsible for the finished result — no matter which city you're in.
                </p>
                <p>
                  From frameless showers and replacement windows to exterior doors, window repair,
                  and commercial glass, every project starts with a clear in-home or on-site quote.
                  Call Doug directly to get started in your area.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="bg-[#1a8ead] px-4 py-10 text-center text-white sm:px-8 sm:py-16"
          style={{ backgroundColor: "#1a8ead", color: "#ffffff" }}
        >
          <h2 className="mb-3 text-2xl font-heading font-bold leading-tight sm:text-3xl md:text-4xl">
            Ready to Get Started?
          </h2>
          <div className="mb-8 mx-auto max-w-xl text-sm leading-relaxed opacity-80 sm:text-base [&_a]:text-current [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-80 [&_p]:m-0">
            <p>
              Call, text, or request a free quote. Doug will review your project personally and give
              you clear next steps — wherever you are in the Charlotte metro.
            </p>
            <p>
              <strong>
                Mon–Sat: 7am – 7pm | Serving Charlotte, Monroe, Union County, and nearby South
                Carolina communities
              </strong>
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="w-full rounded-md border border-white bg-[#1a8ead] px-8 text-white shadow-sm hover:bg-[#167f9b] hover:text-white sm:w-auto"
            >
              <Link href="/#contact">Get Your Free Estimate</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-md border border-white bg-transparent px-8 text-white shadow-sm hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <a href="tel:+17047716111">Call (704) 771-6111</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
