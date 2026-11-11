import { ArrowRight } from "lucide-react";
import "./service-photo-card.css";

import { getServiceImage } from "@shared/glass-service-photo-cards";

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
