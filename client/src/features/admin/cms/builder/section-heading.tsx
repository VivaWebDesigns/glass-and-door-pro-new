import type { ElementType } from "react";
import { cn } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { renderPublicDisplayText } from "./display-text";

type HeadingLevel = "h1" | "h2";
type HeadingAlignment = "left" | "center" | "right";

interface SectionHeadingProps {
  props: Record<string, unknown>;
  defaultAlignment?: HeadingAlignment;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  fallbackTitle?: string;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function headingLevel(v: unknown): HeadingLevel {
  return str(v) === "h1" ? "h1" : "h2";
}

function headingAlignment(v: unknown, fallback: HeadingAlignment): HeadingAlignment {
  const value = str(v);
  return value === "left" || value === "right" || value === "center" ? value : fallback;
}

const ALIGNMENT_CLASSES: Record<HeadingAlignment, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const TITLE_CLASSES: Record<HeadingLevel, string> = {
  h1: "text-3xl sm:text-4xl md:text-5xl font-heading font-bold leading-tight public-heading-1",
  h2: "text-2xl sm:text-3xl md:text-4xl font-heading font-bold leading-tight public-heading-2",
};

function firstText(...values: unknown[]) {
  for (const value of values) {
    const text = str(value);
    if (text) return text;
  }
  return "";
}

function getSectionHeadingContent(
  props: Record<string, unknown>,
  fallbackTitle: string | undefined,
) {
  return {
    eyebrow: firstText(props.sectionEyebrow, props.eyebrow),
    title: firstText(props.title, props.heading, fallbackTitle),
    subtitle: firstText(props.subtitle, props.subheading),
    level: headingLevel(props.sectionHeadingLevel ?? props.headingLevel),
  };
}

export function SectionHeading({
  props,
  defaultAlignment = "center",
  className,
  titleClassName,
  subtitleClassName,
  fallbackTitle,
}: SectionHeadingProps) {
  const { eyebrow, title, subtitle, level } = getSectionHeadingContent(props, fallbackTitle);
  const alignment = headingAlignment(
    props.sectionHeadingAlignment ?? props.alignment,
    defaultAlignment,
  );

  if (!eyebrow && !title && !subtitle) return null;

  const HeadingTag = level as ElementType;

  return (
    <div className={cn("flex flex-col gap-2", ALIGNMENT_CLASSES[alignment], className)}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </span>
      )}
      {title && (
        <HeadingTag className={cn(TITLE_CLASSES[level], titleClassName)}>
          {renderPublicDisplayText(title)}
        </HeadingTag>
      )}
      {subtitle && (
        <div
          className={cn(
            "public-heading-subtext max-w-2xl text-sm leading-relaxed sm:text-base [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary/80 [&_p]:m-0",
            subtitleClassName,
          )}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(subtitle) }}
        />
      )}
    </div>
  );
}
