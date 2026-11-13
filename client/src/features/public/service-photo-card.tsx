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
  wholeCardLink?: boolean;
};

export function ServicePhotoCard({
  title,
  description,
  href,
  buttonText = "Learn More",
  openInNewTab,
  wide = false,
  wholeCardLink = false,
}: ServicePhotoCardProps) {
  const image = getServiceImage(href);
  const Card = wholeCardLink ? "a" : "article";
  return (
    <Card
      className={`service-photo-card${wide ? " service-photo-card-wide" : ""}`}
      href={wholeCardLink ? href : undefined}
      aria-label={wholeCardLink ? title : undefined}
      target={wholeCardLink && openInNewTab ? "_blank" : undefined}
      rel={wholeCardLink && openInNewTab ? "noopener noreferrer" : undefined}
    >
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
        <h3>
          {title}
          {wholeCardLink && <ArrowRight className="service-photo-card-arrow" aria-hidden="true" />}
        </h3>
        {description && <p>{description}</p>}
        {!wholeCardLink && (
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
        )}
      </div>
    </Card>
  );
}
