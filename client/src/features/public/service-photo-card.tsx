import { ArrowRight } from "lucide-react";
import "./service-photo-card.css";

const root = "/images/glass-door-pro/";
const images: Record<string, [string, string]> = {
  "frameless-showers": ["services-shower.webp", "Frameless glass shower in a marble bathroom"],
  "window-installation": [
    "services-window.webp",
    "Black-framed residential windows overlooking trees",
  ],
  "door-installation": ["services-door-v2.webp", "Wood and glass entry door with stone surround"],
  "window-repair": [
    "service-cards/window-repair.webp",
    "Clear glass in white residential window frames",
  ],
  "commercial-storefront-glass-installation": [
    "service-cards/storefront-installation.webp",
    "Modern glass storefront with black aluminum framing",
  ],
  "commercial-storefront-glass-replacement-repair": [
    "service-cards/storefront-repair.webp",
    "Clear storefront glass panels in a brick facade",
  ],
  "commercial-door-installation": [
    "service-cards/commercial-door-installation.webp",
    "Commercial glass double doors with a stone surround",
  ],
  "commercial-door-replacement-repair": [
    "service-cards/commercial-door-repair.webp",
    "Commercial glass doors with metal handles and overhead closer",
  ],
  "commercial-window-replacement": [
    "service-cards/commercial-window-replacement.webp",
    "Black-framed commercial windows in a landscaped building",
  ],
};

export function getServiceImage(href?: string) {
  if (!href) return undefined;
  const path = href
    .replace(/^https?:\/\/(?:www\.)?glassanddoorpro\.com(?=\/)/, "")
    .split(/[?#]/)[0]
    .replace(/\/$/, "");
  if (path === "/services")
    return {
      src: root + "service-cards/all-services-v2.webp",
      alt: "Sunlit home entrance with a wood door, glass sidelights, and black-framed windows",
    };
  const entry = path.startsWith("/services/") ? images[path.slice(10)] : undefined;
  return entry ? { src: root + entry[0], alt: entry[1] } : undefined;
}

export type ServicePhotoCardProps = {
  title: string;
  description?: string;
  href: string;
  buttonText?: string;
  openInNewTab?: boolean;
  wide?: boolean;
};

export function ServicePhotoCard({
  title,
  description,
  href,
  buttonText = "Learn More",
  openInNewTab,
  wide = false,
}: ServicePhotoCardProps) {
  const image = getServiceImage(href);
  return (
    <article className={`service-photo-card${wide ? " service-photo-card-wide" : ""}`}>
      {image && (
        <div className="service-photo-card-image">
          <img
            src={image.src}
            alt={image.alt}
            width={1200}
            height={1032}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="service-photo-card-copy">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <a
          className="service-photo-card-link"
          href={href}
          aria-label={`${buttonText}: ${title}`}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
        >
          {buttonText}
          <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
