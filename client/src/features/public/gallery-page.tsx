import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PublicPageRenderer } from "@/features/public/public-block-renderer";
import type { BlockInstance } from "@/features/admin/cms/builder/block-registry";

const galleryImages = [
  ["03", "Frameless Shower Install - SouthPark"],
  ["01", "Frameless Shower Install - Myers Park"],
  ["06", "Frameless Shower Install - Weddington"],
  ["09", "Frameless Shower Install - Waxhaw"],
  ["02", "Frameless Shower Install - Dilworth"],
  ["08", "Frameless Shower Install - Marvin"],
  ["05", "Frameless Shower Install - Plaza Midwood"],
  ["12", "Frameless Shower Install - Matthews"],
  ["04", "Frameless Shower Install - Ballantyne"],
  ["07", "Frameless Shower Install - Lake Norman"],
  ["10", "Frameless Shower Install - Fort Mill"],
].map(([id, caption]) => ({
  url: `/images/glass-door-pro/gallery/frameless-showers/${id}.jpg`,
  alt: `${caption} by Glass & Door Pro`,
  caption,
}));

const blocks: BlockInstance[] = [
  {
    id: "gallery-header",
    type: "section-header",
    props: {
      title: "Gallery",
      subtitle: "Explore our work by category.",
      alignment: "center",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "sm",
    },
  },
  {
    id: "gallery-categories",
    type: "cards-grid",
    props: {
      title: "",
      columns: "4",
      variant: "service-links",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "none",
      sectionPaddingBottom: "lg",
      cards: [
        {
          icon: "Droplets",
          title: "Frameless Showers",
          description: "Recent installations",
          link: "#frameless-showers",
          buttonText: `${galleryImages.length} Photos`,
        },
        { icon: "Grid3X3", title: "Windows", description: "Coming soon" },
        { icon: "DoorOpen", title: "Doors", description: "Coming soon" },
        { icon: "Building2", title: "Commercial Glass", description: "Coming soon" },
      ],
    },
  },
  {
    id: "gallery-frameless-showers",
    type: "image-grid",
    props: {
      anchorId: "frameless-showers",
      title: "Frameless Showers",
      subtitle: "Recent installations",
      columns: "3",
      gap: "lg",
      variant: "project-gallery",
      sectionBackgroundColor: "#f8fafc",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
      images: galleryImages,
    },
  },
  {
    id: "gallery-cta",
    type: "cta",
    props: {
      variant: "glass-service",
      heading: "Ready to Start Your Project?",
      subheading:
        "<p>See something you like? Tell us about your glass, shower, window, door, or commercial project and Doug will follow up with next steps.</p>",
      primaryText: "Get Your Free Estimate",
      primaryAction: "form-modal",
      primaryFormSlug: "contact-form",
      primaryModalTitle: "Request a Free Estimate",
      primaryModalDescription: "Share a few project details and Doug will follow up with next steps.",
      secondaryText: "Back to Home",
      secondaryAction: "internal-link",
      secondaryLink: "/",
    },
  },
];

export default function GalleryPage() {
  return (
    <div className="public-page-shell min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PublicPageRenderer blocks={blocks} />
      </main>
      <Footer />
    </div>
  );
}
