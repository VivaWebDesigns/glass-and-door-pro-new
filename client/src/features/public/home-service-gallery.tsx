import { ArrowRight } from "lucide-react";
import { GLASS_HOMEPAGE_SERVICE_CARDS } from "@shared/glass-homepage-services";
import "./home-service-gallery.css";

type Service = { title: string; description: string; link: string; buttonText?: string };
const photos = [
  {
    src: "services-shower.webp",
    alt: "Frameless glass shower enclosure in a light marble bathroom",
  },
  { src: "services-window.webp", alt: "Black-framed residential windows overlooking trees" },
  { src: "services-door.webp", alt: "Wood entry door with glass panels and stone surround" },
];
const imageRoot = "/images/glass-door-pro/";

const mobilePhotos: Record<string, { src: string; title: string; alt: string }> = {
  "/services/frameless-showers": {
    src: "frameless-showers",
    title: "Frameless Showers",
    alt: "Full frameless glass enclosure in a marble bathroom",
  },
  "/services/window-installation": {
    src: "window-installation",
    title: "Window Installation",
    alt: "Black-framed windows installed in a light exterior wall",
  },
  "/services/door-installation": {
    src: "door-installation",
    title: "Door Installation",
    alt: "Wood entry door with glass panels and stone surround",
  },
  "/services/window-repair": {
    src: "window-repair",
    title: "Window Repair",
    alt: "White-framed residential windows beside horizontal siding",
  },
  "/services/commercial-storefront-glass-installation": {
    src: "storefront-installation",
    title: "Storefront Glass Installation",
    alt: "Glass storefront entrance with aluminum framing",
  },
  "/services/commercial-storefront-glass-replacement-repair": {
    src: "storefront-repair",
    title: "Storefront Glass Repair & Replacement",
    alt: "Large storefront glass panels beside a paved walkway",
  },
  "/services/commercial-door-installation": {
    src: "commercial-door-installation",
    title: "Door Installation",
    alt: "Commercial glass double doors in a stone entrance",
  },
  "/services/commercial-door-replacement-repair": {
    src: "commercial-door-repair",
    title: "Door Repair & Replacement",
    alt: "Commercial glass entrance doors with overhead closers",
  },
  "/services/commercial-window-replacement": {
    src: "commercial-window-replacement",
    title: "Window Replacement",
    alt: "Windows across a multi-family apartment building",
  },
};

function MobileServiceGroup({ title, cards }: { title: string; cards: readonly Service[] }) {
  if (!cards.length) return null;

  return (
    <section className="home-services-mobile-group" aria-label={title}>
      <h3>{title}</h3>
      <div className="home-services-mobile-grid">
        {cards.map((service) => {
          const photo = mobilePhotos[service.link];
          return (
            <a
              className="home-services-mobile-card"
              key={service.link}
              href={service.link}
              aria-label={service.title}
            >
              {photo && (
                <img
                  src={`${imageRoot}mobile-services/${photo.src}.webp`}
                  alt={photo.alt}
                  width={324}
                  height={230}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <h4>
                <span>{photo?.title ?? service.title}</span>
                <ArrowRight aria-hidden="true" />
              </h4>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ServiceLink({ service }: { service: Service }) {
  return (
    <a
      className="home-services-link"
      href={service.link}
      aria-label={`${service.buttonText || "Learn More"} about ${service.title}`}
    >
      {service.buttonText || "Learn More"}
      <ArrowRight aria-hidden="true" />
    </a>
  );
}

export function HomeServiceGallery({ props }: { props: Record<string, unknown> }) {
  const cards = (
    Array.isArray(props.cards) ? props.cards : GLASS_HOMEPAGE_SERVICE_CARDS
  ) as readonly Service[];
  const residential = cards.slice(0, 3);
  const repair = cards.find((card) => card.link === "/services/window-repair");
  const commercial = cards.filter((card) => card.link.startsWith("/services/commercial-"));
  return (
    <div className="home-services-gallery" data-testid="home-services-gallery">
      <div className="home-services-mobile">
        <h2>Our Services</h2>
        <MobileServiceGroup
          title="Residential Services"
          cards={cards.filter((card) => !card.link.startsWith("/services/commercial-"))}
        />
        <MobileServiceGroup title="Commercial Services" cards={commercial} />
      </div>
      <div className="home-services-desktop">
        <header className="home-services-header">
          <p className="home-services-eyebrow">Services</p>
          <h2>
            <span>Made for your home.</span> <span>Installed with care.</span>
          </h2>
          <p className="home-services-intro">
            Custom glass and door solutions for every space — from beautiful bathroom upgrades to
            reliable commercial storefronts.
            <span className="home-services-desktop-copy">
              {" "}
              Quality work, expert installation, lasting results.
            </span>
          </p>
        </header>
        <div className="home-services-residential">
          {residential.map((service, index) => (
            <article className="home-services-feature" key={service.link}>
              <a
                className="home-services-photo"
                href={service.link}
                aria-label={service.title}
                tabIndex={-1}
              >
                <img
                  src={`${imageRoot}${photos[index].src}`}
                  alt={photos[index].alt}
                  width={800}
                  height={688}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <div className="home-services-feature-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ServiceLink service={service} />
              </div>
            </article>
          ))}
        </div>
        {repair && (
          <div className="home-services-repair">
            <h3>{repair.title}</h3>
            <p>{repair.description}</p>
            <ServiceLink service={repair} />
          </div>
        )}
        <div className="home-services-commercial">
          <img
            className="home-services-commercial-photo"
            src={`${imageRoot}services-storefront.webp`}
            alt="Commercial glass storefront with black aluminum framing"
            width={800}
            height={688}
            loading="lazy"
            decoding="async"
          />
          <div className="home-services-commercial-copy">
            <p className="home-services-eyebrow">Commercial Services</p>
            <h2>Built to perform.</h2>
            <p className="home-services-commercial-intro">
              Durable glass and door solutions for new construction, tenant buildouts, and
              commercial renovations.
            </p>
            <div className="home-services-commercial-links">
              {commercial.map((service) => (
                <a key={service.link} href={service.link}>
                  <span>{service.title}</span>
                  <ArrowRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
