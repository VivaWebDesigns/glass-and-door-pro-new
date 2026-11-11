export const GLASS_CHARLOTTE_STOREFRONT_PROJECT_BLOCK = {
  id: "charlotte-storefront-entry-project",
  type: "text-image",
  props: {
    variant: "project-photo",
    title: "Storefront Glass Installation in Charlotte",
    imageUrl:
      "/images/glass-door-pro/gallery/commercial-glass/commercial-storefront-glass-installation.webp",
    imageAlt:
      "Storefront glass installation in Charlotte by Glass & Door Pro, with black framing, fixed glass panels, and a glass entry door",
    body: "<p>Glass &amp; Door Pro installed this Charlotte storefront with fixed glass panels beside and above a black-framed glass entry door. The finished installation brings the storefront glazing and entrance together in one coordinated system.</p>",
    sectionBackgroundColor: "#ffffff",
    sectionPaddingTop: "lg",
    sectionPaddingBottom: "lg",
  },
};

export const GLASS_COMMERCIAL_ENTRY_DOORS_PROJECT_BLOCK = {
  ...GLASS_CHARLOTTE_STOREFRONT_PROJECT_BLOCK,
  id: "commercial-glass-entry-doors-project",
  props: {
    ...GLASS_CHARLOTTE_STOREFRONT_PROJECT_BLOCK.props,
    title: "Commercial Glass Entry Door Installation",
    imageUrl: "/images/glass-door-pro/gallery/commercial-glass/02.webp",
    imageAlt:
      "Commercial glass entry doors installed by Glass & Door Pro, with dark framing and fixed glass panels on either side",
    body: "<p>Glass &amp; Door Pro installed these paired commercial glass entry doors with fixed glass panels on either side. Dark framing connects the doors and adjoining panels across the entrance.</p>",
  },
};
