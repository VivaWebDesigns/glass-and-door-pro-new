export const GLASS_HOME_HERO_HEADING = {
  location: "Greater Charlotte",
  firstLine: "Windows, Doors &",
  secondLine: "Frameless Showers",
};

export const GLASS_HOME_HERO_INTRO =
  "Expert installation and repair across Greater Charlotte. Work directly with Doug, from first call to final fit.";

export function getCmsHeroHeadingParts(props: Record<string, unknown>) {
  const location = typeof props.locationHeading === "string" ? props.locationHeading : "";
  const heading = typeof props.heading === "string" ? props.heading : "";
  const accent = typeof props.accentHeading === "string" ? props.accentHeading : "";

  return location
    ? { location, heading, accent: "" }
    : { location, heading: heading || "Hero Heading", accent };
}
