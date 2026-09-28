import type { ReactNode } from "react";
import {
  getRadialGradientStyle,
  getSectionWrapperStyle,
  getSectionStyleConfig,
  hasSectionStyleConfig,
  hexToRgba,
} from "./section-style";

interface SectionStyleWrapperProps {
  props: Record<string, unknown>;
  children: ReactNode;
  id?: string;
  className?: string;
  contentClassName?: string;
  resolveAssetUrl?: (url: string) => string;
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

  const wrapperStyle = getSectionWrapperStyle(config);
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
