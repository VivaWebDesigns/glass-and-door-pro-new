import { Link } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useMobileHeroViewport } from "@/hooks/use-mobile-hero-viewport";
import { getMobileHeroImageUrl } from "@shared/glass-hero-images";
import {
  GLASS_SERVICE_AREA_HUB,
  GLASS_SERVICE_AREA_HUB_CARDS,
  GLASS_SERVICE_AREAS_HERO_IMAGE,
} from "@shared/glass-service-areas";

export default function ServiceAreasPage() {
  const mobileHeroImage = getMobileHeroImageUrl(GLASS_SERVICE_AREAS_HERO_IMAGE);
  const heroImage =
    useMobileHeroViewport() && mobileHeroImage ? mobileHeroImage : GLASS_SERVICE_AREAS_HERO_IMAGE;
  return (
    <div className="public-page-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section
          className="public-hero-pattern relative flex items-center justify-start overflow-hidden text-left"
          style={{ minHeight: "700px" }}
        >
          <img
            src={heroImage}
            alt={GLASS_SERVICE_AREA_HUB.heroAlt}
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
              {GLASS_SERVICE_AREA_HUB.heading}
            </h1>
            <div className="mb-9 max-w-2xl text-base leading-8 text-white/85 sm:text-lg [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-white/80 [&_p]:m-0">
              {GLASS_SERVICE_AREA_HUB.intro}
            </div>
            {/* Hidden below md, where MobileCtaBar takes over. */}
            <div className="hidden gap-3 md:flex md:flex-row md:flex-wrap md:justify-start">
              <Button
                asChild
                size="lg"
                className="w-full rounded-md border border-white bg-[#1a8ead] px-8 text-white shadow-sm hover:bg-[#167f9b] hover:text-white sm:w-auto"
              >
                <a href="tel:+17047716111">Call (704) 771-6111</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full rounded-md border border-white bg-slate-950/60 px-8 font-semibold text-white shadow-md backdrop-blur-sm hover:bg-slate-950/75 hover:text-white sm:w-auto"
              >
                <Link href="/#contact">Get a Free Quote</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-10 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="py-4">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-heading font-bold">
                  {GLASS_SERVICE_AREA_HUB.areasTitle}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  {GLASS_SERVICE_AREA_HUB.areasIntro}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                {GLASS_SERVICE_AREA_HUB_CARDS.map(([name, href, description]) => (
                  <div
                    key={href}
                    className="public-section-card-hover relative h-full overflow-hidden rounded-lg border-border/70 border-none bg-white text-center shadow-sm"
                  >
                    <div className="flex h-full flex-col px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-8">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                        <MapPin className="h-9 w-9 text-[#1a8ead]" aria-hidden="true" />
                      </div>
                      <h3 className="mb-2 text-base font-semibold leading-snug break-words">
                        {name}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                      <div className="mt-auto pt-5">
                        <Link
                          href={href}
                          className="inline-flex items-center text-sm font-semibold text-[#1a8ead] transition-colors hover:text-[#167f9b] after:absolute after:inset-0 after:content-['']"
                        >
                          {GLASS_SERVICE_AREA_HUB.areaLinkText}
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
                  {GLASS_SERVICE_AREA_HUB.detailsTitle}
                </h2>
              </div>
              <div className="public-prose prose prose-sm max-w-none text-left">
                <p>{GLASS_SERVICE_AREA_HUB.detailsIntro}</p>
                <p>{GLASS_SERVICE_AREA_HUB.detailsClosing}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="bg-[#1a8ead] px-4 py-10 text-center text-white sm:px-8 sm:py-16"
          style={{ backgroundColor: "#1a8ead", color: "#ffffff" }}
        >
          <h2 className="mb-3 text-2xl font-heading font-bold leading-tight sm:text-3xl md:text-4xl">
            {GLASS_SERVICE_AREA_HUB.quoteTitle}
          </h2>
          <div className="mb-8 mx-auto max-w-xl text-sm leading-relaxed opacity-80 sm:text-base [&_a]:text-current [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-80 [&_p]:m-0">
            <p>{GLASS_SERVICE_AREA_HUB.quoteIntro}</p>
            <p>
              <strong>{GLASS_SERVICE_AREA_HUB.quoteHours}</strong>
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="w-full rounded-md border border-white bg-[#1a8ead] px-8 text-white shadow-sm hover:bg-[#167f9b] hover:text-white sm:w-auto"
            >
              <a href="tel:+17047716111">Call (704) 771-6111</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full rounded-md border border-white bg-transparent px-8 text-white shadow-sm hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link href="/#contact">Get a Free Quote</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
