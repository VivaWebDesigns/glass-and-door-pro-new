import { GLASS_HOMEPAGE_SERVICE_CARDS } from "@shared/glass-homepage-services";
import { ArrowRight } from "lucide-react";
import { ServicePhotoCard } from "./service-photo-card";
import "./home-service-gallery.css";
type Service = { title: string; description: string; link: string; buttonText?: string };
export function HomeServiceGallery({ props }: { props: Record<string, unknown> }) {
  const cards = (
    Array.isArray(props.cards) ? props.cards : GLASS_HOMEPAGE_SERVICE_CARDS
  ) as readonly Service[];
  const featuredCards = cards.slice(0, 6);
  const additionalServices = cards.slice(6);
  return (
    <div className="home-services-gallery" data-testid="home-services-gallery">
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
      <div className="service-photo-grid">
        {featuredCards.map((card) => (
          <ServicePhotoCard
            key={card.link}
            title={card.title}
            description={card.description}
            href={card.link}
            buttonText={card.buttonText}
            wholeCardLink
          />
        ))}
      </div>
      {additionalServices.length > 0 && (
        <nav className="home-services-additional" aria-label="More commercial services">
          <h3>More commercial services</h3>
          <ul>
            {additionalServices.map((service) => (
              <li key={service.link}>
                <a href={service.link}>
                  <span>{service.title}</span>
                  <ArrowRight aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
