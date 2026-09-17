import type { CSSProperties, ReactNode } from "react";
import {
  DEFAULT_SECTION_LINEAR_GRADIENT,
  getRadialGradientStyle,
  getSectionStyleConfig,
  hasSectionStyleConfig,
  hexToRgba,
} from "./section-style-values";

interface SectionStyleWrapperProps {
  props: Record<string, unknown>;
  children: ReactNode;
  id?: string;
  className?: string;
  contentClassName?: string;
  resolveAssetUrl?: (url: string) => string;
}

function backgroundImageWithFallback(url: string) {
  return `url(${JSON.stringify(url)})`;
}

export function SectionStyleWrapper({
  props,
  children,
  id,
  className,
  contentClassName,
  resolveAssetUrl,
}: SectionStyleWrapperProps) {
  const config = getSectionStyleConfig(props, { resolveAssetUrl });

  if (!hasSectionStyleConfig(config)) {
    return <>{children}</>;
  }

  const defaultBackgroundColor =
    !config.backgroundColor && !config.backgroundImageUrl && config.showRadialGradient
      ? "#ffffff"
      : "";

  const wrapperStyle: CSSProperties = {
    ...(config.backgroundColor || defaultBackgroundColor
      ? { backgroundColor: config.backgroundColor || defaultBackgroundColor }
      : {}),
    ...(config.backgroundImageUrl
      ? {
          backgroundImage: backgroundImageWithFallback(config.backgroundImageUrl),
          backgroundSize: "cover",
          backgroundPosition: `${config.backgroundPositionX}% ${config.backgroundPositionY}%`,
          backgroundRepeat: "no-repeat",
        }
      : !config.backgroundColor && !defaultBackgroundColor
        ? { background: DEFAULT_SECTION_LINEAR_GRADIENT }
        : {}),
    ...(config.borderTopWidth > 0
      ? {
          borderTopStyle: "solid",
          borderTopWidth: `${config.borderTopWidth}px`,
          borderTopColor: config.borderTopColor,
        }
      : {}),
    ...(config.borderBottomWidth > 0
      ? {
          borderBottomStyle: "solid",
          borderBottomWidth: `${config.borderBottomWidth}px`,
          borderBottomColor: config.borderBottomColor,
        }
      : {}),
  };
  const overlayOpacity = config.backgroundImageUrl ? config.backgroundOverlayOpacity / 100 : 0;

  return (
    <section
      id={id}
      className={`relative overflow-hidden rounded-2xl ${className ?? ""}`.trim()}
      style={wrapperStyle}
    >
      {overlayOpacity > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: hexToRgba(config.backgroundOverlayColor, overlayOpacity) }}
        />
      )}
      {config.showRadialGradient && (
        <div
          className="pointer-events-none absolute inset-0"
          style={getRadialGradientStyle(config.radialGradientColor, config.radialGradientPosition)}
        />
      )}
      <div className={`relative z-10 ${contentClassName ?? ""}`.trim()}>{children}</div>
    </section>
  );
}
