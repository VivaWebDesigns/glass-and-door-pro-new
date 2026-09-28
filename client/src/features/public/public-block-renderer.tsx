import { Fragment, useState, useEffect, lazy, Suspense, type MouseEvent, type ReactElement } from "react";
import { useLocation } from "wouter";
import { excludeServiceUtilitySnippets } from "@shared/glass-search-snippets";
import { Button } from "@/components/ui/button";
import { FormModalButton } from "@/components/forms/form-modal-button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getSectionPaddingClasses,
  getSectionStyleConfig,
  hasSectionStyleConfig,
  hexToRgba,
  normalizeHexColor,
} from "@/features/admin/cms/builder/section-style";
import { SectionStyleWrapper } from "@/features/admin/cms/builder/section-style-wrapper";
import {
  arr,
  colorStyle,
  getMobileImageStyles,
  getVimeoId,
  getYouTubeId,
  IMAGE_WIDTH_MAP,
  num,
  resolveCmsAssetUrl,
  SPACING_MAP,
  str,
} from "@/features/admin/cms/builder/block-renderer.shared";
import { SectionHeading } from "@/features/admin/cms/builder/section-heading";
import { renderPublicDisplayText } from "@/features/admin/cms/builder/public-display-text";
import {
  Globe,
  Heart,
  Users,
  MapPin,
  Mail,
  Phone,
  Star,
  CheckCircle,
  Quote,
  UserCheck,
  CalendarDays,
  BookOpen,
  Image,
  Play,
  Minus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  XCircle,
  BadgeCheck,
  ArrowRight,
  Search,
  User,
  ShieldCheck,
  Lock,
  Building2,
  Loader2,
  Droplets,
  Grid3X3,
  DoorOpen,
  Wrench,
} from "lucide-react";
import type { BlockInstance, BuilderContent } from "@/features/admin/cms/builder/block-registry";
import { FULL_WIDTH_BLOCK_TYPES } from "@/features/admin/cms/builder/page-builder-constants";
import { sanitizeEmbedHtml, sanitizeRichHtml } from "@/lib/sanitize-html";
import { ReviewSourceBadge } from "@/components/shared/review-source-badge";
import { withContentKeys } from "@/lib/content-keys";

export type { BlockInstance, BuilderContent };

const LUCIDE_MAP: Record<string, React.ElementType> = {
  Globe,
  Heart,
  Users,
  MapPin,
  Mail,
  Phone,
  Star,
  CheckCircle,
  Quote,
  UserCheck,
  CalendarDays,
  BookOpen,
  Image,
  Play,
  Minus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  XCircle,
  BadgeCheck,
  ArrowRight,
  Search,
  User,
  ShieldCheck,
  Lock,
  Building2,
  Droplets,
  Grid3X3,
  DoorOpen,
  Wrench,
};

const GLASS_CTA_PRIMARY_CLASS =
  "rounded-md border border-white bg-[#1a8ead] px-8 text-white shadow-sm hover:bg-[#167f9b] hover:text-white";
const GLASS_CTA_SECONDARY_CLASS =
  "rounded-md border border-white bg-transparent px-8 text-white shadow-sm hover:bg-white/10 hover:text-white";

function LucideIcon({ name, className }: { name: string; className?: string }) {
  const Icon = LUCIDE_MAP[name] ?? Globe;
  return <Icon className={className} />;
}

const LazyContactFormBlock = lazy(() =>
  import("./public-dynamic-blocks").then((m) => ({ default: m.ContactFormBlock })),
);
const LazyManagedFormEmbedBlock = lazy(() =>
  import("./public-dynamic-blocks").then((m) => ({ default: m.ManagedFormEmbedBlock })),
);

function DynamicFallback() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function getHeroConfig(props: Record<string, unknown>) {
  const variant = str(props.variant);
  const isGlassService = variant === "glass-service";
  const minHeight = str(props.minHeight) || "420";
  const overlayColor = normalizeHexColor(str(props.overlayColor)) || "#000000";
  const overlayStrength = clampPercent(num(props.overlayOpacity as number, 50)) / 100;
  return {
    variant,
    isGlassService,
    isGlassReviews: variant === "glass-reviews",
    usesGlassCtas: isGlassService || variant === "glass-reviews",
    isSplit: str(props.layout) === "split" || isGlassService,
    background: resolveCmsAssetUrl(str(props.backgroundImageUrl)),
    backgroundAlt: str(props.backgroundImageAlt) || str(props.imageAlt),
    backgroundWidth: num(props.backgroundImageWidth as number, 0) || undefined,
    backgroundHeight: num(props.backgroundImageHeight as number, 0) || undefined,
    objectPosition: `${clampPercent(num(props.backgroundPositionX as number, 50))}% ${clampPercent(num(props.backgroundPositionY as number, 50))}%`,
    videoBackground: str(props.videoBackgroundUrl),
    minHeightStyle: minHeight === "100vh" ? "100vh" : `${minHeight}px`,
    overlayStyle: { backgroundColor: hexToRgba(overlayColor, overlayStrength) },
    sectionBackgroundColor: getSectionStyleConfig(props, { resolveAssetUrl: resolveCmsAssetUrl }).backgroundColor,
  };
}

type HeroConfig = ReturnType<typeof getHeroConfig>;

function HeroBackdrop({ config }: { config: HeroConfig }) {
  return (
    <>
      {config.background && (
        <img
          src={config.background}
          alt={config.backgroundAlt}
          width={config.backgroundWidth}
          height={config.backgroundHeight}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: config.objectPosition }}
        />
      )}
      {config.videoBackground && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={config.background || undefined}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={config.videoBackground} type="video/mp4" />
        </video>
      )}
      {config.isGlassReviews ? (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(15, 23, 42, 0.08) 0%, rgba(15, 23, 42, 0.18) 45%, rgba(15, 23, 42, 0.58) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-slate-950/10" />
        </>
      ) : (
        <>
          <div className="absolute inset-0" style={config.overlayStyle} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/35 to-transparent" />
        </>
      )}
    </>
  );
}

function HeroHeading({ props, variant }: { props: Record<string, unknown>; variant: string }) {
  const accentHeading = str(props.accentHeading);
  return (
    <h1
      className={`mb-5 font-heading font-bold leading-tight text-white ${variant === "glass-home" ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl" : "text-4xl sm:text-5xl md:text-6xl"}`}
      style={colorStyle(props.headingColor)}
    >
      {renderPublicDisplayText(str(props.heading) || "Hero Heading")}
      {accentHeading && (
        <>
          {" "}
          <span className="text-accent" style={colorStyle(props.accentHeadingColor)}>
            {renderPublicDisplayText(accentHeading)}
          </span>
        </>
      )}
    </h1>
  );
}

function HeroCtas({ props, config }: { props: Record<string, unknown>; config: HeroConfig }) {
  const [location] = useLocation();
  return (
    <div
      data-nosnippet={excludeServiceUtilitySnippets(location) ? "" : undefined}
      className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${config.isSplit ? "sm:justify-start" : "sm:justify-center"}`}
    >
      {str(props.ctaText) && (
        <FormModalButton
          label={str(props.ctaText)}
          action={props.ctaAction}
          href={props.ctaLink}
          openInNewTab={props.ctaOpenInNewTab}
          formSlug={props.ctaFormSlug}
          modalTitle={props.ctaModalTitle}
          modalDescription={props.ctaModalDescription}
          size="lg"
          className={`w-full sm:w-auto ${config.usesGlassCtas ? GLASS_CTA_PRIMARY_CLASS : "rounded-full bg-white px-7 text-primary shadow-lg hover:bg-white/90"}`}
          testId="hero-cta-primary"
        />
      )}
      {str(props.ctaSecondaryText) && (
        <FormModalButton
          label={str(props.ctaSecondaryText)}
          action={props.ctaSecondaryAction}
          href={props.ctaSecondaryLink}
          openInNewTab={props.ctaSecondaryOpenInNewTab}
          formSlug={props.ctaSecondaryFormSlug}
          modalTitle={props.ctaSecondaryModalTitle}
          modalDescription={props.ctaSecondaryModalDescription}
          size="lg"
          variant="outline"
          className={`w-full sm:w-auto ${config.usesGlassCtas ? GLASS_CTA_SECONDARY_CLASS : "rounded-full border-white/60 bg-white/10 px-7 text-white shadow-sm backdrop-blur hover:bg-white/20"}`}
          testId="hero-cta-secondary"
        />
      )}
    </div>
  );
}

function HeroBlock({ props }: { props: Record<string, unknown> }) {
  const config = getHeroConfig(props);
  const badge = str(props.badge);
  const subheading = str(props.subheading);

  return (
    <section
      id={str(props.anchorId) || undefined}
      className={`public-hero-pattern relative flex items-center overflow-hidden ${config.isSplit ? "justify-start text-left" : "justify-center text-center"}`}
      style={{
        minHeight: config.minHeightStyle,
        ...(config.sectionBackgroundColor ? { backgroundColor: config.sectionBackgroundColor } : {}),
      }}
    >
      <HeroBackdrop config={config} />
      <div
        className={`relative z-10 px-6 py-20 sm:px-8 sm:py-24 md:py-28 ${config.isSplit ? "max-w-3xl lg:ml-[max(2rem,calc((100vw-80rem)/2))]" : "max-w-4xl mx-auto"}`}
      >
        {badge && (
          <span className="mb-5 inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur">
            {badge}
          </span>
        )}
        <HeroHeading props={props} variant={config.variant} />
        {subheading && (
          <div
            className={`mb-9 text-base leading-8 text-white/85 sm:text-lg [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-white/80 [&_p]:m-0 ${config.isSplit ? "max-w-2xl" : "max-w-2xl mx-auto"}`}
            style={colorStyle(props.subheadingColor)}
            dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(subheading) }}
          />
        )}
        <HeroCtas props={props} config={config} />
      </div>
      {config.isSplit && config.background && !config.isGlassService && (
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3">
          <img
            src={config.background}
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: config.objectPosition }}
          />
        </div>
      )}
    </section>
  );
}

function TwoColumnTextBlock({ props }: { props: Record<string, unknown> }) {
  const leftItems = arr<{ text: string }>(props.leftItems);
  const rightItems = arr<{ text: string }>(props.rightItems);
  const columns = [
    {
      heading: str(props.leftHeading),
      body: str(props.leftBody),
      items: leftItems,
    },
    {
      heading: str(props.rightHeading),
      body: str(props.rightBody),
      items: rightItems,
    },
  ];

  return (
    <div className="py-4">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      <div className="grid gap-8 md:grid-cols-2">
        {columns.map(withContentKeys((column, index, itemKey) => (
          <div key={itemKey} className="space-y-4">
            {column.heading && (
              <h3 className="text-xl font-heading font-semibold">{column.heading}</h3>
            )}
            {column.body && (
              <div
                className="prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(column.body) }}
              />
            )}
            {column.items.length > 0 && (
              <ul className="space-y-2 pl-5 list-disc text-sm text-muted-foreground">
                {column.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item.text}</li>
                ))}
              </ul>
            )}
            {!column.heading && !column.body && column.items.length === 0 && (
              <p className="text-sm text-muted-foreground">Add content for this column.</p>
            )}
          </div>
        )))}
      </div>
    </div>
  );
}

function CalloutBoxBlock({ props }: { props: Record<string, unknown> }) {
  const variant = str(props.variant) || "accent";
  const variantClass =
    variant === "neutral"
      ? "bg-muted/45 border"
      : variant === "outline"
        ? "bg-background border-2 border-accent/25"
        : "bg-accent/10 border border-accent/25";

  return (
    <div className="py-4">
      <SectionHeading props={props} defaultAlignment="center" className="mb-6" />
      <div className={`public-section-card rounded-lg p-5 sm:p-8 ${variantClass}`}>
        <div
          className="public-prose prose prose-sm max-w-none break-words"
          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(str(props.content) || "<p>Add callout content.</p>") }}
        />
        {str(props.ctaText) && (
          <div className="mt-6">
            <FormModalButton
              label={str(props.ctaText)}
              action={props.ctaAction}
              href={props.ctaLink}
              openInNewTab={props.ctaOpenInNewTab}
              formSlug={props.ctaFormSlug}
              modalTitle={props.ctaModalTitle}
              modalDescription={props.ctaModalDescription}
              className="w-full rounded-full sm:w-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function LinkListBlock({ props }: { props: Record<string, unknown> }) {
  const links = arr<{ label: string; description: string; url: string }>(props.links);
  const gridClass = str(props.columns) === "2" ? "md:grid-cols-2" : "md:grid-cols-1";

  return (
    <div className="py-4">
      <SectionHeading props={props} defaultAlignment="center" className="mb-6" />
      <div className={`grid grid-cols-1 gap-4 ${gridClass}`}>
        {links.length === 0 ? (
          <div className="text-sm text-muted-foreground">Add links to display here.</div>
        ) : (
          links.map(withContentKeys((link, index, itemKey) => (
            <a
              key={itemKey}
              href={link.url || "#"}
              className="public-section-card public-section-card-hover group rounded-lg p-4 sm:p-5"
              data-testid={`link-list-item-${index}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold break-words transition-colors group-hover:text-accent">
                    {link.label || "Untitled link"}
                  </h3>
                  {link.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {link.description}
                    </p>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
              </div>
            </a>
          )))
        )}
      </div>
    </div>
  );
}

function SectionHeaderBlock({ props }: { props: Record<string, unknown> }) {
  return (
    <SectionHeading
      props={props}
      defaultAlignment="center"
      className="py-4"
      titleClassName="text-3xl font-heading font-bold"
      fallbackTitle="Section Title"
    />
  );
}

function RichTextBlock({ props }: { props: Record<string, unknown> }) {
  const [, setLocation] = useLocation();
  const align = str(props.alignment) || "left";
  const textAlign =
    align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

  function handleContentClick(event: MouseEvent<HTMLDivElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    const anchor =
      event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!anchor) return;
    if (anchor.target && anchor.target !== "_self") return;

    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return;
    }

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    setLocation(`${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <div>
      <SectionHeading
        props={props}
        defaultAlignment={align === "right" ? "right" : align === "center" ? "center" : "left"}
        className="mb-6"
      />
      <div
        className={`public-prose prose prose-sm max-w-none ${textAlign}`}
        role="presentation"
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(str(props.content) || "<p>No content.</p>") }}
      />
    </div>
  );
}

function TextImageBlock({ props }: { props: Record<string, unknown> }) {
  const imageRight = str(props.imagePosition) !== "left";
  const hasImage = !!str(props.imageUrl);
  const mobileImageStyles = getMobileImageStyles(props);
  const align = str(props.alignment) || "left";
  const badgeValue = str(props.badgeValue);
  const badgeLabel = str(props.badgeLabel);
  const bodyAlign =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  return (
    <div
      className={`flex flex-col ${imageRight ? "md:flex-row" : "md:flex-row-reverse"} gap-8 py-4 md:items-stretch lg:gap-12`}
    >
      <div className="min-w-0 flex-1 space-y-3">
        <SectionHeading
          props={props}
          defaultAlignment={align === "center" ? "center" : align === "right" ? "right" : "left"}
          className="mb-4"
        />
        {str(props.body) && (
          <div
            className={`public-prose prose prose-sm max-w-none ${bodyAlign}`}
            dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(str(props.body)) }}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 self-stretch flex-col">
        {hasImage ? (
          <div className="flex h-full flex-col">
            <div className="relative min-h-72 md:h-full md:min-h-0 md:flex-1">
              <img
                src={str(props.imageUrl)}
                alt={str(props.imageAlt)}
                style={mobileImageStyles}
                className="w-full rounded-lg shadow-xl [height:var(--mobile-image-height)] [object-fit:var(--mobile-image-fit)] [object-position:var(--image-position)] md:absolute md:inset-0 md:h-full md:w-full md:object-cover"
              />
              {(badgeValue || badgeLabel) && (
                <div className="absolute -bottom-4 -right-3 rounded-lg bg-primary px-5 py-4 text-primary-foreground shadow-xl sm:-right-4">
                  {badgeValue && (
                    <div className="text-2xl font-bold leading-none">{badgeValue}</div>
                  )}
                  {badgeLabel && (
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide">
                      {badgeLabel}
                    </div>
                  )}
                </div>
              )}
            </div>
            {str(props.imageCaption) && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {str(props.imageCaption)}
              </p>
            )}
          </div>
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/40">
            <span className="text-muted-foreground text-sm">Image placeholder</span>
          </div>
        )}
      </div>
    </div>
  );
}

const CTA_VARIANT_CLASSES: Record<string, string> = {
  dark: "bg-foreground text-background",
  accent: "bg-accent text-accent-foreground",
};

function getCtaStyle(props: Record<string, unknown>) {
  const variant = str(props.variant) || "dark";
  const isGlassService =
    variant === "glass-service" ||
    (variant === "dark" && str(props.secondaryText).toLowerCase() === "back to home");
  const backgroundClass = isGlassService
    ? "bg-[#1a8ead] text-white"
    : (CTA_VARIANT_CLASSES[variant] ?? "bg-muted/40 border");
  return {
    variant,
    isGlassService,
    containerClass: `${isGlassService ? "" : "rounded-lg shadow-xl"} ${backgroundClass}`,
    primaryVariant: (!isGlassService && variant === "dark" ? "secondary" : "default") as "secondary" | "default",
  };
}

function CtaButtons({ props, isGlassService, primaryVariant }: {
  props: Record<string, unknown>;
  isGlassService: boolean;
  primaryVariant: "secondary" | "default";
}) {
  const [location] = useLocation();
  return (
    <div
      data-nosnippet={excludeServiceUtilitySnippets(location) ? "" : undefined}
      className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap"
    >
      {str(props.primaryText) && (
        <FormModalButton
          label={str(props.primaryText)}
          action={props.primaryAction}
          href={props.primaryLink}
          openInNewTab={props.primaryOpenInNewTab}
          formSlug={props.primaryFormSlug}
          modalTitle={props.primaryModalTitle}
          modalDescription={props.primaryModalDescription}
          size="lg"
          variant={primaryVariant}
          className={`w-full sm:w-auto ${isGlassService ? GLASS_CTA_PRIMARY_CLASS : "rounded-full"}`}
          testId="cta-primary"
        />
      )}
      {str(props.secondaryText) && (
        <FormModalButton
          label={str(props.secondaryText)}
          action={props.secondaryAction}
          href={props.secondaryLink}
          openInNewTab={props.secondaryOpenInNewTab}
          formSlug={props.secondaryFormSlug}
          modalTitle={props.secondaryModalTitle}
          modalDescription={props.secondaryModalDescription}
          size="lg"
          variant="outline"
          className={`w-full sm:w-auto ${isGlassService ? GLASS_CTA_SECONDARY_CLASS : "rounded-full"}`}
          testId="cta-secondary"
        />
      )}
    </div>
  );
}

function CtaBlock({ props }: { props: Record<string, unknown> }) {
  const { variant, isGlassService, containerClass, primaryVariant } = getCtaStyle(props);
  const subheading = str(props.subheading);
  return (
    <div
      className={`px-4 py-10 text-center sm:px-8 sm:py-16 ${containerClass}`}
      style={isGlassService ? { backgroundColor: "#1a8ead", color: "#ffffff" } : undefined}
    >
      <h2 className="mb-3 text-2xl font-heading font-bold leading-tight sm:text-3xl md:text-4xl">
        {str(props.heading) || "Ready to Get Started?"}
      </h2>
      {subheading && (
        <div
          className={`mb-8 mx-auto max-w-xl text-sm leading-relaxed sm:text-base [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-80 [&_p]:m-0 ${variant === "light" ? "text-muted-foreground [&_a]:text-primary" : "opacity-80 [&_a]:text-current"}`}
          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(subheading) }}
        />
      )}
      <CtaButtons props={props} isGlassService={isGlassService} primaryVariant={primaryVariant} />
    </div>
  );
}

function CardsGridBlock({ props }: { props: Record<string, unknown> }) {
  const cols = str(props.columns) || "3";
  const colsClass =
    cols === "2"
      ? "md:grid-cols-2"
      : cols === "4"
        ? "md:grid-cols-2 lg:grid-cols-4"
        : cols === "5"
          ? "md:grid-cols-2 lg:grid-cols-5"
          : "md:grid-cols-3";
  const variant = str(props.variant);
  const cards = arr<{
    title: string;
    description: string;
    icon: string;
    link?: string;
    buttonText?: string;
    openInNewTab?: boolean;
  }>(props.cards);
  return (
    <div className="py-4" data-testid="block-cards-grid">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      <div className={`grid grid-cols-1 ${colsClass} gap-4 sm:gap-6`}>
        {cards.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            Add cards to display here
          </div>
        ) : (
          cards.map(withContentKeys((card, i, itemKey) => (
            <Card
              key={itemKey}
              className={`public-section-card-hover h-full overflow-hidden rounded-lg border-border/70 text-center shadow-sm ${variant === "service-links" ? "border-none bg-white" : ""}`}
            >
              <CardContent className="public-service-card-content flex h-full flex-col px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-8">
                <div
                  className={`mx-auto mb-4 flex items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20 ${variant === "service-links" ? "h-16 w-16" : "h-12 w-12"}`}
                >
                  <LucideIcon
                    name={card.icon || "Globe"}
                    className={
                      variant === "service-links" ? "h-8 w-8 text-primary" : "h-6 w-6 text-accent"
                    }
                  />
                </div>
                <h3 className="mb-2 text-base font-semibold leading-snug break-words">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                {card.link && (
                  <div className="mt-auto pt-5">
                    <a
                      href={card.link}
                      target={card.openInNewTab ? "_blank" : undefined}
                      rel={card.openInNewTab ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {card.buttonText || "Learn More"}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )))
        )}
      </div>
    </div>
  );
}

function FaqBlock({ props }: { props: Record<string, unknown> }) {
  const items = arr<{ question: string; answer: string }>(props.items);
  return (
    <div className="py-4">
      <SectionHeading props={props} defaultAlignment="left" className="mb-8" />
      <Accordion type="single" collapsible className="space-y-2">
        {items.length === 0 ? (
          <p className="text-muted-foreground">Add FAQ items to display here.</p>
        ) : (
          items.map(withContentKeys((item, i, itemKey) => (
            <AccordionItem
              key={itemKey}
              value={`faq-${i}`}
              className="public-section-card rounded-lg px-4"
            >
              <AccordionTrigger className="font-medium text-left">{item.question}</AccordionTrigger>
              <AccordionContent>
                <div
                  className="text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary/80 [&_p]:m-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(item.answer) }}
                />
              </AccordionContent>
            </AccordionItem>
          )))
        )}
      </Accordion>
    </div>
  );
}

function TestimonialsBlock({ props }: { props: Record<string, unknown> }) {
  const variant = str(props.variant);
  const ctaText = str(props.ctaText);
  const ctaLink = str(props.ctaLink);
  const items = arr<{
    quote: string;
    name: string;
    role: string;
    location: string;
    rating?: number;
    source?: string;
    sourceIcon?: string;
    date?: string;
    reviewDate?: string;
  }>(props.items);
  const shouldCarousel = items.length > 2;


  const renderCard = (
    item: {
      quote: string;
      name: string;
      role: string;
      location: string;
      rating?: number;
      source?: string;
      sourceIcon?: string;
      date?: string;
      reviewDate?: string;
    },
  ) => (
    <Card
      className={`public-section-card h-full rounded-lg ${variant === "google-carousel" ? "border-none bg-white shadow-lg" : ""}`}
    >
      <CardContent className="pt-6">
        {variant === "google-carousel" ? (
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex text-yellow-400">
              {Array.from({ length: Math.max(1, Math.min(5, num(item.rating, 5))) }).map(
                (_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ),
              )}
            </div>
            <ReviewSourceBadge item={item} />
          </div>
        ) : (
          <Quote className="h-5 w-5 text-accent mb-3" />
        )}
        <p className="text-sm leading-relaxed mb-4 italic">"{item.quote}"</p>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-accent">{item.name?.[0] ?? "?"}</span>
          </div>
          <div>
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.role}
              {item.location ? ` · ${item.location}` : ""}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="py-4">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      {items.length === 0 ? (
        <p className="text-muted-foreground">Add testimonials to display here.</p>
      ) : shouldCarousel ? (
        <div>
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {items.map(withContentKeys((item, i, itemKey) => (
                <CarouselItem key={itemKey} className="pl-6 basis-full md:basis-1/2">
                  {renderCard(item)}
                </CarouselItem>
              )))}
            </CarouselContent>
            <div className="mt-6 flex items-center justify-center gap-3">
              <CarouselPrevious className="static h-9 w-9 translate-x-0 translate-y-0 border-border/70 bg-background/95" />
              <CarouselNext className="static h-9 w-9 translate-x-0 translate-y-0 border-border/70 bg-background/95" />
            </div>
          </Carousel>
          {ctaText && ctaLink ? (
            <div className="mt-7 flex justify-center">
              <Button
                asChild
                variant="outline"
                className="border-[#1a8ead] bg-white text-[#1a8ead] hover:bg-[#1a8ead] hover:text-white"
              >
                <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                  {ctaText}
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(withContentKeys((item, _index, itemKey) => <Fragment key={itemKey}>{renderCard(item)}</Fragment>))}
        </div>
      )}
      {!shouldCarousel && ctaText && ctaLink ? (
        <div className="mt-7 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="border-[#1a8ead] bg-white text-[#1a8ead] hover:bg-[#1a8ead] hover:text-white"
          >
            <a href={ctaLink} target="_blank" rel="noopener noreferrer">
              {ctaText}
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function ButtonGroupBlock({ props }: { props: Record<string, unknown> }) {
  const align = str(props.alignment) || "center";
  const justifyClass =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";
  const buttons = arr<{
    text: string;
    link: string;
    variant: string;
    action?: string;
    openInNewTab?: boolean;
    formSlug?: string;
    modalTitle?: string;
    modalDescription?: string;
  }>(props.buttons);
  return (
    <div className="py-4">
      <SectionHeading
        props={props}
        defaultAlignment={align === "right" ? "right" : align === "center" ? "center" : "left"}
        className="mb-6"
      />
      <div className={`flex flex-wrap gap-3 ${justifyClass}`}>
        {buttons.length === 0 ? (
          <p className="text-muted-foreground text-sm">Add buttons to display here</p>
        ) : (
          buttons.map(withContentKeys((btn, i, itemKey) => (
            <FormModalButton
              key={itemKey}
              label={btn.text}
              action={btn.action}
              href={btn.link}
              openInNewTab={btn.openInNewTab}
              formSlug={btn.formSlug}
              modalTitle={btn.modalTitle}
              modalDescription={btn.modalDescription}
              variant={
                btn.variant === "outline" ||
                btn.variant === "secondary" ||
                btn.variant === "ghost" ||
                btn.variant === "destructive"
                  ? btn.variant
                  : "default"
              }
              size="lg"
              testId={`button-group-${i}`}
            />
          )))
        )}
      </div>
    </div>
  );
}

function RawHtmlBlock({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="py-4">
      <SectionHeading props={props} defaultAlignment="center" className="mb-6" />
      <div
        className="prose prose-sm max-w-none text-foreground"
        dangerouslySetInnerHTML={{ __html: sanitizeEmbedHtml(str(props.html) || "") }}
      />
    </div>
  );
}

function ImageBlockRenderer({ props }: { props: Record<string, unknown> }) {
  const widthClass = IMAGE_WIDTH_MAP[str(props.width)] ?? IMAGE_WIDTH_MAP.contained;
  const hasImage = !!str(props.imageUrl);
  const mobileImageStyles = getMobileImageStyles(props);
  const variant = str(props.variant);

  if (variant === "banner") {
    return (
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden py-0">
        {hasImage ? (
          <img
            src={str(props.imageUrl)}
            alt={str(props.alt)}
            style={mobileImageStyles}
            className="h-full w-full object-cover [object-position:var(--image-position)]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted/40 text-sm text-muted-foreground">
            Image placeholder
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {str(props.caption) && (
          <p className="absolute bottom-4 left-1/2 max-w-3xl -translate-x-1/2 px-4 text-center text-sm text-white/90">
            {str(props.caption)}
          </p>
        )}
      </section>
    );
  }

  return (
    <div className={`py-4 ${widthClass}`}>
      <SectionHeading props={props} defaultAlignment="center" className="mb-6" />
      {hasImage ? (
        <div>
          <img
            src={str(props.imageUrl)}
            alt={str(props.alt)}
            style={mobileImageStyles}
            className="w-full rounded-xl [height:var(--mobile-image-height)] [object-fit:var(--mobile-image-fit)] [object-position:var(--image-position)] md:h-auto md:object-cover"
          />
          {str(props.caption) && (
            <p className="text-xs text-muted-foreground text-center mt-2">{str(props.caption)}</p>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-muted/40 border border-dashed h-48 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Image className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Image placeholder</p>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoEmbedBlock({ props }: { props: Record<string, unknown> }) {
  const url = str(props.url);
  const ytId = url ? getYouTubeId(url) : null;
  const vimeoId = url ? getVimeoId(url) : null;
  const aspect = str(props.aspectRatio) || "16/9";
  const paddingMap: Record<string, string> = { "16/9": "56.25%", "4/3": "75%", "1/1": "100%" };
  const paddingBottom = paddingMap[aspect] ?? "56.25%";
  return (
    <div className="py-4">
      <SectionHeading
        props={props}
        defaultAlignment="left"
        className="mb-4"
        titleClassName="font-medium text-base"
      />
      {!url ? (
        <div className="rounded-xl bg-muted/40 border border-dashed h-48 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Play className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Enter a YouTube or Vimeo URL</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom }}>
          {ytId && (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              title="YouTube video"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {vimeoId && (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}`}
              title="Vimeo video"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
          {!ytId && !vimeoId && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
              <p className="text-sm text-muted-foreground">Enter a valid YouTube or Vimeo URL</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ContactInfoBlock({ props }: { props: Record<string, unknown> }) {
  const items = arr<{ icon: string; label: string; value: string }>(props.items);
  return (
    <div className="py-4">
      <SectionHeading props={props} defaultAlignment="left" className="mb-6" />
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">Add contact items to display here.</p>
        ) : (
          items.map(withContentKeys((item, i, itemKey) => (
            <div key={itemKey} className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <LucideIcon name={item.icon || "Globe"} className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="break-words font-medium text-sm">{item.value}</p>
              </div>
            </div>
          )))
        )}
      </div>
    </div>
  );
}

function DividerBlock({ props }: { props: Record<string, unknown> }) {
  const style = str(props.style) || "spacer";
  const spacing = str(props.spacing) || "md";
  const heightClass = SPACING_MAP[spacing] ?? SPACING_MAP.md;
  if (style === "spacer") return <div className={heightClass} />;
  if (style === "dots")
    return (
      <div className={`flex justify-center items-center gap-2 ${heightClass}`}>
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
      </div>
    );
  return <hr className={`border-border ${heightClass} border-0 border-t-[1px] my-auto`} />;
}

function FeatureListBlock({ props }: { props: Record<string, unknown> }) {
  const cols = str(props.columns) || "3";
  const colsClass =
    cols === "1" ? "grid-cols-1" : cols === "2" ? "md:grid-cols-2" : "md:grid-cols-3";
  const features = arr<{ icon: string; title: string; description: string }>(props.features);
  return (
    <div className="py-4" data-testid="block-feature-list">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      <div className={`grid grid-cols-1 ${colsClass} gap-6 sm:gap-8`}>
        {features.map(withContentKeys((f, i, itemKey) => (
          <div key={itemKey} className="flex items-start gap-4" data-testid={`feature-item-${i}`}>
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <LucideIcon name={f.icon || "CheckCircle"} className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

function ObjectionBustersBlock({ props }: { props: Record<string, unknown> }) {
  const items = arr<{ concern: string; response: string }>(props.items);
  return (
    <div className="py-4" data-testid="block-objection-busters">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      <div className="space-y-6 max-w-3xl mx-auto">
        {items.map(withContentKeys((item, i, itemKey) => (
          <div key={itemKey} className="rounded-xl border p-6" data-testid={`objection-item-${i}`}>
            <div className="flex items-start gap-3 mb-3">
              <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="font-medium text-sm">{item.concern}</p>
            </div>
            <div className="flex items-start gap-3 pl-8">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">{item.response}</p>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

function BeforeAfterBlock({ props }: { props: Record<string, unknown> }) {
  const items = arr<{ milestone: string; before: string; after: string }>(props.items);
  return (
    <div className="py-4" data-testid="block-before-after">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
        <div className="space-y-8">
          {items.map(withContentKeys((item, i, itemKey) => (
            <div key={itemKey} className="flex gap-4 sm:gap-6" data-testid={`milestone-item-${i}`}>
              <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs">
                {item.milestone}
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
                  <p className="text-xs font-medium text-destructive mb-1">Before</p>
                  <p className="text-sm text-muted-foreground">{item.before}</p>
                </div>
                <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3">
                  <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                    After
                  </p>
                  <p className="text-sm text-muted-foreground">{item.after}</p>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}

function TrustBarBlock({ props }: { props: Record<string, unknown> }) {
  const items = arr<{ icon: string; label: string }>(props.items);
  return (
    <div className="py-4 border-y bg-muted/20" data-testid="block-trust-bar">
      <SectionHeading props={props} defaultAlignment="center" className="mb-6" />
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        {items.map(withContentKeys((item, i, itemKey) => (
          <div
            key={itemKey}
            className="flex items-center gap-2 text-muted-foreground"
            data-testid={`trust-signal-${i}`}
          >
            <LucideIcon name={item.icon || "CheckCircle"} className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        )))}
      </div>
    </div>
  );
}

function PressMentionsBlock({ props }: { props: Record<string, unknown> }) {
  const items = arr<{ name: string; logoUrl: string; link: string }>(props.items);
  return (
    <div className="py-4" data-testid="block-press-mentions">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {items.map(withContentKeys((item, i, itemKey) => {
          const content = item.logoUrl ? (
            <img
              src={item.logoUrl}
              alt={item.name}
              className="h-8 sm:h-10 object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
          ) : (
            <span className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              {item.name}
            </span>
          );
          return item.link ? (
            <a
              key={itemKey}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
              data-testid={`press-item-${i}`}
            >
              {content}
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>
          ) : (
            <div key={itemKey} data-testid={`press-item-${i}`}>
              {content}
            </div>
          );
        }))}
      </div>
    </div>
  );
}

function SocialProofStatsBlock({ props }: { props: Record<string, unknown> }) {
  const stats = arr<{ value: string; label: string }>(props.stats);
  return (
    <div className="py-4" data-testid="block-social-proof-stats">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {stats.map(withContentKeys((stat, i, itemKey) => (
          <div key={itemKey} className="text-center" data-testid={`stat-item-${i}`}>
            <p className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        )))}
      </div>
      {str(props.disclaimer) && (
        <p className="text-xs text-muted-foreground text-center mt-6 italic">
          {str(props.disclaimer)}
        </p>
      )}
    </div>
  );
}

function ImageGridBlock({ props }: { props: Record<string, unknown> }) {
  const cols = str(props.columns) || "3";
  const colsClass =
    cols === "2" ? "md:grid-cols-2" : cols === "4" ? "md:grid-cols-4" : "md:grid-cols-3";
  const gapSize = str(props.gap) || "md";
  const gapClass =
    gapSize === "sm" ? "gap-2" : gapSize === "lg" ? "gap-6" : gapSize === "xl" ? "gap-8" : "gap-4";
  const variant = str(props.variant);
  const images = arr<{ url: string; alt: string; caption: string }>(props.images);
  const isProjectGallery = variant === "project-gallery";
  return (
    <div className="py-4" data-testid="block-image-grid">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      {images.length === 0 ? (
        <div className="rounded-xl bg-muted/40 border border-dashed h-48 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Add images to display here</p>
        </div>
      ) : (
        <div
          className={
            variant === "gallery-strip"
              ? "grid grid-cols-2 gap-3 md:grid-cols-4"
              : `grid grid-cols-1 ${colsClass} ${gapClass}`
          }
        >
          {images.map(withContentKeys((img, i, itemKey) => (
            <div
              key={itemKey}
              className={
                variant === "gallery-strip"
                  ? "aspect-square overflow-hidden rounded-lg shadow-md"
                  : isProjectGallery
                    ? "group overflow-hidden rounded-lg bg-white shadow-md"
                    : ""
              }
              data-testid={`grid-image-${i}`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className={`w-full rounded-lg object-cover ${
                  isProjectGallery
                    ? "aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                    : "aspect-square"
                } ${variant === "gallery-strip" ? "h-full transition-transform duration-300 hover:scale-105" : ""}`}
              />
              {img.caption && (
                <p
                  className={
                    isProjectGallery
                      ? "px-3 py-3 text-center text-sm font-medium text-slate-700"
                      : "text-xs text-muted-foreground text-center mt-1"
                  }
                >
                  {img.caption}
                </p>
              )}
            </div>
          )))}
        </div>
      )}
    </div>
  );
}

function SliderBlock({ props }: { props: Record<string, unknown> }) {
  const [current, setCurrent] = useState(0);
  const slides = arr<{ imageUrl: string; heading: string; description: string }>(props.slides);
  useEffect(() => {
    if (slides.length > 0 && current >= slides.length) setCurrent(Math.max(0, slides.length - 1));
  }, [slides.length, current]);
  if (slides.length === 0)
    return (
      <div className="py-4 rounded-xl bg-muted/40 border border-dashed h-48 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Add slides to display here</p>
      </div>
    );
  const safeIdx = Math.min(current, slides.length - 1);
  const slide = slides[safeIdx];
  return (
    <div className="py-4" data-testid="block-slider">
      <SectionHeading props={props} defaultAlignment="center" className="mb-6" />
      <div className="relative rounded-xl overflow-hidden bg-muted/20 border">
        {slide.imageUrl && (
          <img
            src={slide.imageUrl}
            alt={slide.heading}
            className="w-full aspect-[16/9] object-cover"
          />
        )}
        <div
          className={`${slide.imageUrl ? "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent" : ""} p-6 sm:p-8`}
        >
          {slide.heading && (
            <h3
              className={`text-xl font-heading font-bold mb-2 ${slide.imageUrl ? "text-white" : ""}`}
            >
              {slide.heading}
            </h3>
          )}
          {slide.description && (
            <p className={`text-sm ${slide.imageUrl ? "text-white/80" : "text-muted-foreground"}`}>
              {slide.description}
            </p>
          )}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous slide"
            className="rounded-full h-8 w-8"
            onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
            data-testid="button-slider-prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-1.5">
            {slides.map(withContentKeys((_slide, i, itemKey) => (
              <button
                key={itemKey}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-accent" : "bg-muted-foreground/30"}`}
                onClick={() => setCurrent(i)}
                data-testid={`button-slider-dot-${i}`}
              />
            )))}
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next slide"
            className="rounded-full h-8 w-8"
            onClick={() => setCurrent((c) => (c + 1) % slides.length)}
            data-testid="button-slider-next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function StatsBarBlock({ props }: { props: Record<string, unknown> }) {
  const items = arr<{ icon: string; value: string; label: string }>(props.items);
  return (
    <div className="py-6 bg-muted/30 rounded-xl" data-testid="block-stats-bar">
      <SectionHeading props={props} defaultAlignment="center" className="mb-6 px-4" />
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {items.map(withContentKeys((item, i, itemKey) => (
          <div
            key={itemKey}
            className="flex items-center justify-center gap-3 rounded-xl border border-border/50 bg-background/70 px-4 py-4 text-center sm:justify-start"
            data-testid={`stats-bar-item-${i}`}
          >
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
              <LucideIcon name={item.icon || "Star"} className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

function IconGridBlock({ props }: { props: Record<string, unknown> }) {
  const cols = str(props.columns) || "4";
  const colsClass =
    cols === "2"
      ? "sm:grid-cols-2"
      : cols === "3"
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : cols === "5"
          ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          : "sm:grid-cols-2 lg:grid-cols-4";
  const items = arr<{ icon: string; title: string }>(props.items);
  return (
    <div className="py-4" data-testid="block-icon-grid">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      <div className={`grid grid-cols-1 ${colsClass} gap-4`}>
        {items.map(withContentKeys((item, i, itemKey) => (
          <div
            key={itemKey}
            className="flex min-w-0 flex-col items-center gap-3 rounded-xl border p-4 text-center transition-shadow hover:shadow-sm sm:p-5"
            data-testid={`icon-grid-item-${i}`}
          >
            <div className="flex h-12 w-12 rounded-xl bg-accent/10 items-center justify-center">
              <LucideIcon name={item.icon || "Globe"} className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm font-medium leading-snug break-words">{item.title}</p>
          </div>
        )))}
      </div>
    </div>
  );
}

function BenefitStackBlock({ props }: { props: Record<string, unknown> }) {
  const layout = str(props.layout) || "stack";
  const items = arr<{ icon: string; title: string; description: string }>(props.items);
  const isTimeline = layout === "timeline";
  return (
    <div className="py-4" data-testid="block-benefit-stack">
      <SectionHeading props={props} defaultAlignment="left" className="mb-8" />
      <div className={`relative ${isTimeline ? "pl-8" : ""}`}>
        {isTimeline && <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-accent/20" />}
        <div className={isTimeline ? "space-y-6" : "space-y-4"}>
          {items.map(withContentKeys((item, i, itemKey) => (
            <div
              key={itemKey}
              className={`flex items-start gap-4 ${isTimeline ? "relative" : "p-4 rounded-lg border"}`}
              data-testid={`benefit-item-${i}`}
            >
              {isTimeline && (
                <div className="absolute -left-5 top-1 h-4 w-4 rounded-full bg-accent border-2 border-background" />
              )}
              <div
                className={`h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0`}
              >
                <LucideIcon name={item.icon || "CheckCircle"} className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}

function ScienceExplainerBlock({ props }: { props: Record<string, unknown> }) {
  const citations = arr<{ text: string; url: string }>(props.citations);
  return (
    <div className="py-4" data-testid="block-science-explainer">
      <SectionHeading props={props} defaultAlignment="left" className="mb-6" />
      {str(props.body) && (
        <div
          className="prose prose-sm max-w-none text-foreground mb-6"
          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(str(props.body)) }}
        />
      )}
      {citations.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Sources
          </p>
          <ol className="space-y-1">
            {citations.map(withContentKeys((c, i, itemKey) => (
              <li key={itemKey} className="text-xs text-muted-foreground" data-testid={`citation-${i}`}>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2 hover:text-accent/80"
                  >
                    {c.text}
                  </a>
                ) : (
                  c.text
                )}
              </li>
            )))}
          </ol>
        </div>
      )}
    </div>
  );
}

function SafetyChecklistBlock({ props }: { props: Record<string, unknown> }) {
  const items = arr<{ text: string; required: boolean }>(props.items);
  return (
    <div className="py-4" data-testid="block-safety-checklist">
      <SectionHeading props={props} defaultAlignment="left" className="mb-6" />
      <div className="space-y-3 max-w-2xl">
        {items.map(withContentKeys((item, i, itemKey) => (
          <div key={itemKey} className="flex items-start gap-3" data-testid={`checklist-item-${i}`}>
            <CheckCircle
              className={`h-5 w-5 flex-shrink-0 mt-0.5 ${item.required ? "text-accent" : "text-muted-foreground/50"}`}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm">{item.text}</span>
              {item.required && (
                <span className="text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                  Required
                </span>
              )}
            </div>
          </div>
        )))}
      </div>
      {str(props.disclaimer) && (
        <p className="text-xs text-muted-foreground mt-6 italic border-t pt-4">
          {str(props.disclaimer)}
        </p>
      )}
    </div>
  );
}

function GuaranteeWarrantyBlock({ props }: { props: Record<string, unknown> }) {
  const items = arr<{ text: string } | string>(props.items);
  return (
    <div className="py-4" data-testid="block-guarantee-warranty">
      <div className="rounded-2xl bg-accent/5 border border-accent/20 p-8 text-center">
        <BadgeCheck className="h-10 w-10 text-accent mx-auto mb-4" />
        <SectionHeading props={props} defaultAlignment="center" className="mb-6" />
        <ul className="space-y-2 max-w-lg mx-auto text-left mb-6">
          {items.map(withContentKeys((item, i, itemKey) => {
            const text = typeof item === "string" ? item : (item as { text: string }).text;
            return (
              <li key={itemKey} className="flex items-start gap-2" data-testid={`guarantee-item-${i}`}>
                <CheckCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm">{text}</span>
              </li>
            );
          }))}
        </ul>
        {str(props.ctaText) && (
          <FormModalButton
            label={str(props.ctaText)}
            action={props.ctaAction}
            href={props.ctaLink}
            openInNewTab={props.ctaOpenInNewTab}
            formSlug={props.ctaFormSlug}
            modalTitle={props.ctaModalTitle}
            modalDescription={props.ctaModalDescription}
            className="bg-accent text-accent-foreground"
          />
        )}
      </div>
    </div>
  );
}

function DeliverySetupBlock({ props }: { props: Record<string, unknown> }) {
  const steps = arr<{ step: string; title: string; description: string }>(props.steps);
  const includedItems = arr<{ text: string } | string>(props.includedItems);
  return (
    <div className="py-4" data-testid="block-delivery-setup">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      <div className="max-w-3xl mx-auto mb-8">
        <div className="space-y-6">
          {steps.map(withContentKeys((step, i, itemKey) => (
            <div key={itemKey} className="flex gap-4 sm:gap-6" data-testid={`setup-step-${i}`}>
              <div className="relative flex w-12 flex-shrink-0 justify-center">
                {i < steps.length - 1 ? (
                  <div className="absolute left-1/2 top-12 h-[calc(100%+1.5rem)] w-0.5 -translate-x-1/2 bg-border hidden sm:block" />
                ) : null}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-sm">
                  {step.step}
                </div>
              </div>
              <div className="pt-2">
                <h3 className="font-semibold text-sm sm:text-base mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          )))}
        </div>
      </div>
      {includedItems.length > 0 && (
        <div className="bg-muted/30 rounded-xl p-6 max-w-3xl mx-auto">
          <h3 className="font-semibold text-sm mb-3">What's Included</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {includedItems.map(withContentKeys((item, i, itemKey) => {
              const text = typeof item === "string" ? item : (item as { text: string }).text;
              return (
                <li key={itemKey} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  {text}
                </li>
              );
            }))}
          </ul>
        </div>
      )}
    </div>
  );
}

function RecoveryUseCasesBlock({ props }: { props: Record<string, unknown> }) {
  const personas = arr<{ icon: string; title: string; description: string }>(props.personas);
  return (
    <div className="py-4" data-testid="block-recovery-use-cases">
      <SectionHeading props={props} defaultAlignment="center" className="mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personas.map(withContentKeys((p, i, itemKey) => (
          <Card
            key={itemKey}
            className="text-center hover:shadow-md transition-shadow"
            data-testid={`persona-card-${i}`}
          >
            <CardContent className="pt-8 pb-6">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <LucideIcon name={p.icon || "User"} className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </CardContent>
          </Card>
        )))}
      </div>
    </div>
  );
}

function ProtocolBuilderBlock({ props }: { props: Record<string, unknown> }) {
  const level = str(props.level) || "beginner";
  const steps = arr<{ title: string; description: string }>(props.steps);
  const levelColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return (
    <div className="py-4" data-testid="block-protocol-builder">
      <div className="flex flex-wrap items-start gap-3 mb-6">
        <SectionHeading props={props} defaultAlignment="left" className="flex-1 min-w-[220px]" />
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${levelColors[level] || levelColors.beginner}`}
        >
          {level}
        </span>
      </div>
      <div className="space-y-4">
        {steps.map(withContentKeys((step, i, itemKey) => (
          <div key={itemKey} className="flex gap-4 items-start" data-testid={`protocol-step-${i}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
              {i + 1}
            </div>
            <div className="flex-1 border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

const RENDERERS: Record<string, React.ComponentType<{ props: Record<string, unknown> }>> = {
  hero: HeroBlock,
  "section-header": SectionHeaderBlock,
  "rich-text": RichTextBlock,
  "text-image": TextImageBlock,
  "two-column-text": TwoColumnTextBlock,
  "callout-box": CalloutBoxBlock,
  "link-list": LinkListBlock,
  cta: CtaBlock,
  "cards-grid": CardsGridBlock,
  faq: FaqBlock,
  testimonials: TestimonialsBlock,
  "button-group": ButtonGroupBlock,
  "image-block": ImageBlockRenderer,
  "video-embed": VideoEmbedBlock,
  "raw-html": RawHtmlBlock,
  "contact-info": ContactInfoBlock,
  divider: DividerBlock,
  "feature-list": FeatureListBlock,
  "objection-busters": ObjectionBustersBlock,
  "before-after": BeforeAfterBlock,
  "trust-bar": TrustBarBlock,
  "press-mentions": PressMentionsBlock,
  "social-proof-stats": SocialProofStatsBlock,
  "image-grid": ImageGridBlock,
  slider: SliderBlock,
  "stats-bar": StatsBarBlock,
  "icon-grid": IconGridBlock,
  "benefit-stack": BenefitStackBlock,
  "science-explainer": ScienceExplainerBlock,
  "safety-checklist": SafetyChecklistBlock,
  "guarantee-warranty": GuaranteeWarrantyBlock,
  "delivery-setup": DeliverySetupBlock,
  "recovery-use-cases": RecoveryUseCasesBlock,
  "protocol-builder": ProtocolBuilderBlock,
};

const DYNAMIC_BLOCK_TYPES = new Set(["contact-form", "form-embed"]);

export function PublicBlockRenderer({
  block,
  disableSectionStyleWrap = false,
  renderInactive = false,
}: {
  block: BlockInstance;
  disableSectionStyleWrap?: boolean;
  renderInactive?: boolean;
}) {
  if (!renderInactive && block.props.isActive === false) {
    return null;
  }

  let renderedBlock: ReactElement | null = null;

  if (DYNAMIC_BLOCK_TYPES.has(block.type)) {
    if (block.type === "contact-form") {
      renderedBlock = (
        <Suspense fallback={<DynamicFallback />}>
          <LazyContactFormBlock props={block.props} />
        </Suspense>
      );
    }
    if (block.type === "form-embed") {
      renderedBlock = (
        <Suspense fallback={<DynamicFallback />}>
          <LazyManagedFormEmbedBlock props={block.props} />
        </Suspense>
      );
    }
  }

  if (!renderedBlock) {
    const Renderer = RENDERERS[block.type];
    if (!Renderer) {
      return (
        <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm">
          Unknown block type: <code>{block.type}</code>
        </div>
      );
    }
    renderedBlock = <Renderer props={block.props} />;
  }

  if (block.type === "hero") {
    return renderedBlock;
  }

  if (disableSectionStyleWrap) {
    return renderedBlock;
  }

  return (
    <SectionStyleWrapper
      id={str(block.props.anchorId) || undefined}
      props={block.props}
      resolveAssetUrl={resolveCmsAssetUrl}
      contentClassName={getSectionPaddingClasses(block.props)}
    >
      {renderedBlock}
    </SectionStyleWrapper>
  );
}

export function PublicPageRenderer({ blocks }: { blocks: BlockInstance[] }) {
  let nonFullWidthIndex = 0;
  return (
    <div>
      {blocks.map((block) => {
        if (block.props.isActive === false) {
          return null;
        }

        const isFullWidth =
          FULL_WIDTH_BLOCK_TYPES.has(block.type) ||
          (block.type === "image-block" && str(block.props.variant) === "banner") ||
          (block.type === "contact-form" && str(block.props.variant) === "split-contact");
        const sectionStyleConfig = getSectionStyleConfig(block.props, {
          resolveAssetUrl: resolveCmsAssetUrl,
        });
        const hasCustomSectionStyle =
          block.type !== "hero" && hasSectionStyleConfig(sectionStyleConfig);
        const idx = isFullWidth ? nonFullWidthIndex : nonFullWidthIndex++;
        const isAlternate = idx % 2 === 1 && !hasCustomSectionStyle;

        if (hasCustomSectionStyle) {
          return (
            <SectionStyleWrapper
              key={block.id}
              id={str(block.props.anchorId) || undefined}
              props={block.props}
              resolveAssetUrl={resolveCmsAssetUrl}
              className="rounded-none"
              contentClassName={isFullWidth ? undefined : getSectionPaddingClasses(block.props)}
            >
              {isFullWidth ? (
                <PublicBlockRenderer block={block} disableSectionStyleWrap />
              ) : (
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                  <PublicBlockRenderer block={block} disableSectionStyleWrap />
                </div>
              )}
            </SectionStyleWrapper>
          );
        }

        if (isFullWidth) {
          return <PublicBlockRenderer key={block.id} block={block} />;
        }

        return (
          <section
            key={block.id}
            id={str(block.props.anchorId) || undefined}
            className={`relative overflow-hidden ${isAlternate ? "bg-muted/30" : ""}`}
          >
            {isAlternate && (
              <div
                className="pointer-events-none absolute top-0 left-0 right-0 h-32"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, hsl(var(--accent) / 0.10) 0%, transparent 70%)",
                }}
              />
            )}
            <div
              className={`relative max-w-7xl mx-auto px-4 sm:px-6 ${getSectionPaddingClasses(block.props)}`}
            >
              <PublicBlockRenderer block={block} disableSectionStyleWrap />
            </div>
          </section>
        );
      })}
    </div>
  );
}
