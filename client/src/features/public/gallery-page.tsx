import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PublicPageRenderer } from "@/features/public/public-block-renderer";
import type { BlockInstance } from "@/features/admin/cms/builder/block-registry";

const framelessShowerImages = [
  ["03.jpg", "Frameless Shower Install - SouthPark"],
  ["01.jpg", "Frameless Shower Install - Myers Park"],
  ["06.jpg", "Frameless Shower Install - Weddington"],
  ["09.jpg", "Frameless Shower Install - Waxhaw"],
  ["02.jpg", "Frameless Shower Install - Dilworth"],
  ["08.jpg", "Frameless Shower Install - Marvin"],
  ["05.jpg", "Frameless Shower Install - Plaza Midwood"],
  ["12.jpg", "Frameless Shower Install - Matthews"],
  ["04.jpg", "Frameless Shower Install - Ballantyne"],
  ["07.jpg", "Frameless Shower Install - Lake Norman"],
  ["10.jpg", "Frameless Shower Install - Fort Mill"],
  ["13.webp", "Frameless Shower Install - Marble Bath"],
  ["14.webp", "Frameless Shower Install - Sliding Glass"],
  ["15.webp", "Frameless Shower Install - Skylit Bath"],
  ["16.webp", "Frameless Shower Install - Herringbone Tile"],
  ["17.webp", "Frameless Shower Install - Bench Shower"],
].map(([file, caption]) => ({
  url: `/images/glass-door-pro/gallery/frameless-showers/${file}`,
  alt: `${caption} by Glass & Door Pro`,
  caption,
}));

const windowImages = [
  ["01.webp", "Residential Window Installation - Double Window"],
  ["02.webp", "Residential Window Installation - Single Window"],
  ["03.webp", "Residential Window Installation - Exterior Windows"],
  ["04.webp", "Residential Window Installation - Multi-Window Project"],
  ["05.webp", "Residential Window Installation - Finished Exterior"],
  ["06.webp", "Insulated Window Replacement - Interior"],
  ["07.webp", "Insulated Window Replacement - Ladder Setup"],
  ["08.webp", "Insulated Window Replacement - Exterior"],
].map(([file, caption]) => ({
  url: `/images/glass-door-pro/gallery/windows/${file}`,
  alt: `${caption} by Glass & Door Pro`,
  caption,
}));

const doorImages = [
  ["01.webp", "Decorative Entry Door Installation"],
  ["02.webp", "Glass Entry Door Installation"],
  ["03.webp", "Glass Door Replacement - Cornelius"],
].map(([file, caption]) => ({
  url: `/images/glass-door-pro/gallery/doors/${file}`,
  alt: `${caption} by Glass & Door Pro`,
  caption,
}));

const commercialGlassImages = [
  ["01.webp", "Commercial Office Glass Conference Room"],
  ["02.webp", "Commercial Glass Entry Doors"],
  ["03.webp", "Commercial Storefront Glass"],
  ["04.webp", "Commercial Window Replacement - Charlotte"],
  ["05.webp", "Commercial Window Installation - Charlotte"],
].map(([file, caption]) => ({
  url: `/images/glass-door-pro/gallery/commercial-glass/${file}`,
  alt: `${caption} by Glass & Door Pro`,
  caption,
}));

const windowRepairImages = [
  ["01.webp", "Window Repair Service - On-Site Glass Work"],
].map(([file, caption]) => ({
  url: `/images/glass-door-pro/gallery/window-repair/${file}`,
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
          buttonText: `${framelessShowerImages.length} Photos`,
        },
        {
          icon: "Grid3X3",
          title: "Windows",
          description: "Residential projects",
          link: "#windows",
          buttonText: `${windowImages.length} Photos`,
        },
        {
          icon: "DoorOpen",
          title: "Doors",
          description: "Entry and glass doors",
          link: "#doors",
          buttonText: `${doorImages.length} Photos`,
        },
        {
          icon: "Building2",
          title: "Commercial Glass",
          description: "Business glass projects",
          link: "#commercial-glass",
          buttonText: `${commercialGlassImages.length} Photos`,
        },
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
      images: framelessShowerImages,
    },
  },
  {
    id: "gallery-windows",
    type: "image-grid",
    props: {
      anchorId: "windows",
      title: "Windows",
      subtitle: "Residential installation projects",
      columns: "3",
      gap: "lg",
      variant: "project-gallery",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
      images: windowImages,
    },
  },
  {
    id: "gallery-doors",
    type: "image-grid",
    props: {
      anchorId: "doors",
      title: "Doors",
      subtitle: "Entry and exterior glass door projects",
      columns: "3",
      gap: "lg",
      variant: "project-gallery",
      sectionBackgroundColor: "#f8fafc",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
      images: doorImages,
    },
  },
  {
    id: "gallery-commercial-glass",
    type: "image-grid",
    props: {
      anchorId: "commercial-glass",
      title: "Commercial Glass",
      subtitle: "Office, storefront, and entry glass projects",
      columns: "3",
      gap: "lg",
      variant: "project-gallery",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
      images: commercialGlassImages,
    },
  },
  {
    id: "gallery-window-repair",
    type: "image-grid",
    props: {
      anchorId: "window-repair",
      title: "Window Repair",
      subtitle: "On-site glass repair work",
      columns: "3",
      gap: "lg",
      variant: "project-gallery",
      sectionBackgroundColor: "#f8fafc",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
      images: windowRepairImages,
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
