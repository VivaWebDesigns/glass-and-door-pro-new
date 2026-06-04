import { randomUUID } from "crypto";
import { storage } from "../server/storage";
import type {
  InsertCmsMenu,
  InsertCmsPage,
  InsertSeoSettings,
  MenuItem,
  MenuLocation,
} from "../shared/schema";

function uid() {
  return randomUUID();
}

function item(label: string, url: string, children: MenuItem[] = [], openInNewTab = false): MenuItem {
  return {
    id: uid(),
    label,
    url,
    openInNewTab,
    children,
  };
}

const glassHomeContent: InsertCmsPage["content"] = {
  blocks: [
    {
      id: uid(),
      type: "hero",
      props: {
        anchorId: "hero",
        variant: "glass-home",
        heading: "We've got your glass & door needs covered.",
        subheading:
          "<p>Specializing in frameless glass showers, windows, and doors for homeowners in Charlotte, NC.</p>",
        ctaText: "Get a Free Quote",
        ctaLink: "#contact",
        ctaAction: "internal-link",
        ctaSecondaryText: "",
        ctaSecondaryLink: "",
        backgroundImageUrl: "/images/glass-door-pro/gallery-shower1-1280w.jpg",
        videoBackgroundUrl: "/videos/glass-door-pro/hero-video.mp4",
        overlayColor: "#0f172a",
        overlayOpacity: 50,
        minHeight: "700",
      },
    },
    {
      id: uid(),
      type: "text-image",
      props: {
        anchorId: "about",
        eyebrow: "About Us",
        heading: "Hi there! My name is Doug.",
        subtitle: "",
        body:
          "<p>Welcome to my glass and door installation business, proudly serving the greater Charlotte, North Carolina area. With over 15 years of hands-on experience, I'm dedicated to providing high-quality, personalized solutions for all your glass and door needs.</p><p>Whether you're looking to enhance your home with a custom frameless shower or improve comfort and energy efficiency with new windows or doors, I've got you covered. I handle every project personally, from small repairs to full installations, ensuring each job is completed efficiently, correctly, and with attention to detail.</p>",
        alignment: "left",
        imageUrl: "/images/glass-door-pro/family-1280w.webp",
        imageAlt: "Doug Adams, owner of Glass & Door Pro, with his family in Charlotte, NC",
        imagePosition: "left",
        sectionBackgroundColor: "#ffffff",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "lg",
      },
    },
    {
      id: uid(),
      type: "cards-grid",
      props: {
        anchorId: "services",
        title: "What We Offer",
        sectionEyebrow: "Our Services",
        subtitle: "",
        columns: "5",
        variant: "service-links",
        sectionBackgroundColor: "#f1f5f9",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "lg",
        cards: [
          {
            icon: "Droplets",
            title: "Frameless Showers",
            description: "Custom frameless glass shower enclosures that add luxury and value to any bathroom.",
            link: "#contact",
            buttonText: "Get Quote",
          },
          {
            icon: "Grid3X3",
            title: "Window Installation",
            description: "Energy-efficient window replacements to enhance your property's comfort and curb appeal.",
            link: "#contact",
            buttonText: "Get Quote",
          },
          {
            icon: "DoorOpen",
            title: "Door Installation",
            description: "From entry doors to patio doors, I install options to enhance your home's security and style.",
            link: "#contact",
            buttonText: "Get Quote",
          },
          {
            icon: "Wrench",
            title: "Window Repair",
            description: "Fast, reliable window glass repair for broken panes, foggy windows, and seal failures.",
            link: "#contact",
            buttonText: "Get Quote",
          },
          {
            icon: "Building2",
            title: "Commercial Glass",
            description: "Professional storefront glass, office partitions, and commercial glass solutions for businesses.",
            link: "#contact",
            buttonText: "Get Quote",
          },
        ],
      },
    },
    {
      id: uid(),
      type: "image-block",
      props: {
        variant: "banner",
        imageUrl: "/images/glass-door-pro/gallery-door2-1280w.webp",
        alt: "Custom wooden entry door installation with decorative planters by Glass & Door Pro in Charlotte, NC",
        width: "full",
        sectionPaddingTop: "none",
        sectionPaddingBottom: "none",
      },
    },
    {
      id: uid(),
      type: "text-image",
      props: {
        anchorId: "why-us",
        eyebrow: "Why us?",
        heading: "Get the job done right",
        body:
          "<p>I work closely with my clients to ensure that each installation is tailored to their specific preferences and needs, resulting in a truly unique and beautiful addition to any space.</p><p>With 15+ years of experience, I have the knowledge and equipment necessary to install any type of glass or door, from standard windows and exterior doors to more complex frameless shower enclosures.</p>",
        alignment: "left",
        imageUrl: "/images/glass-door-pro/gallery-door1-1280w.webp",
        imageAlt: "Professional entry door installation by Glass & Door Pro serving Monroe and Indian Trail, NC",
        imagePosition: "right",
        badgeValue: "15+",
        badgeLabel: "Years Experience",
        sectionBackgroundColor: "#ffffff",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "lg",
      },
    },
    {
      id: uid(),
      type: "image-grid",
      props: {
        anchorId: "gallery",
        variant: "gallery-strip",
        columns: "4",
        gap: "sm",
        sectionBackgroundColor: "#f8fafc",
        sectionPaddingTop: "sm",
        sectionPaddingBottom: "sm",
        images: [
          {
            url: "/images/glass-door-pro/gallery-shower1-1280w.webp",
            alt: "Frameless glass shower enclosure installed in a Charlotte area home by Glass & Door Pro",
          },
          {
            url: "/images/glass-door-pro/gallery-windows-1280w.webp",
            alt: "Residential window installation by Glass & Door Pro",
          },
          {
            url: "/images/glass-door-pro/gallery-door3-1280w.webp",
            alt: "Blue entry door installed by Glass & Door Pro in the Charlotte, NC metro area",
          },
          {
            url: "/images/glass-door-pro/gallery-shower2-1280w.webp",
            alt: "Modern frameless shower glass door with sleek hardware installed in Indian Trail, NC",
          },
        ],
      },
    },
    {
      id: uid(),
      type: "testimonials",
      props: {
        anchorId: "reviews",
        title: "What Our Customers Say",
        variant: "google-carousel",
        sectionBackgroundColor: "#ffffff",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "lg",
        items: [
          {
            quote:
              "Doug was great. He's extremely detailed in his work. Will definitely use him again when I'm ready to upgrade the other shower door. Highly recommend!",
            name: "Thomas F.",
            role: "Customer",
            location: "Google review",
            rating: 5,
            source: "Google",
          },
          {
            quote:
              "Very happy with the service by Doug. Fast out to give a quote, friendly and good communication, installation as promised and high quality product.",
            name: "Leah O.",
            role: "Customer",
            location: "Google review",
            rating: 5,
            source: "Google",
          },
          {
            quote:
              "Doug was simply fantastic. Very thorough and the shower glass turned out amazing! Highly recommend!",
            name: "Gary D.",
            role: "Customer",
            location: "Google review",
            rating: 5,
            source: "Google",
          },
          {
            quote:
              "Doug was a great communicator and made the whole process easy. He took great care during installation of my frameless shower glass to protect my Carrara Marble.",
            name: "Tyler W.",
            role: "Customer",
            location: "Google review",
            rating: 5,
            source: "Google",
          },
          {
            quote:
              "Very pleased with the results on our frameless shower. Doug was great to work with, very responsive, and professional.",
            name: "Will F.",
            role: "Customer",
            location: "Google review",
            rating: 5,
            source: "Google",
          },
          {
            quote:
              "Great work! Doug was very professional and did a super job with my house window glass replacements.",
            name: "Pam",
            role: "Customer",
            location: "Google review",
            rating: 5,
            source: "Google",
          },
        ],
      },
    },
    {
      id: uid(),
      type: "contact-form",
      props: {
        anchorId: "contact",
        variant: "split-contact",
        eyebrow: "Get in touch",
        heading: "Ready to start your project?",
        subheading:
          "Tell us what you need installed, repaired, or replaced. Doug will follow up with the next steps.",
        formTitle: "Send a Message",
        formSlug: "contact-form",
        sectionBackgroundColor: "#0f172a",
        sectionPaddingTop: "none",
        sectionPaddingBottom: "none",
        contactItems: [
          {
            icon: "Phone",
            label: "Phone",
            value: "(704) 771-6111",
            href: "tel:+17047716111",
          },
          {
            icon: "Mail",
            label: "Email",
            value: "Doug@GlassandDoorPro.com",
            href: "mailto:Doug@GlassandDoorPro.com",
          },
          {
            icon: "MapPin",
            label: "Service Area",
            value: "Charlotte, Monroe, Indian Trail, and the surrounding North Carolina area",
          },
          {
            icon: "Clock",
            label: "Hours",
            value: "Mon-Sat: 7am - 6pm",
          },
        ],
      },
    },
  ],
};

const glassMenus: Array<InsertCmsMenu & { location: MenuLocation }> = [
  {
    name: "Main Navigation",
    location: "main_navigation",
    items: [
      item("About", "/#about"),
      item("Services", "/#services"),
      item("Gallery", "/#gallery"),
      item("Reviews", "/#reviews"),
      item("Contact", "/#contact"),
    ],
  },
  {
    name: "Services",
    location: "footer_platform",
    items: [
      item("Frameless Showers", "/#services"),
      item("Window Installation", "/#services"),
      item("Door Installation", "/#services"),
    ],
  },
  {
    name: "More Services",
    location: "footer_professionals",
    items: [
      item("Window Repair", "/#services"),
      item("Commercial Glass", "/#services"),
      item("Get a Free Quote", "/#contact"),
    ],
  },
  {
    name: "Resources",
    location: "footer_resources",
    items: [
      item("About Doug", "/#about"),
      item("Project Gallery", "/#gallery"),
      item("Reviews", "/#reviews"),
    ],
  },
  {
    name: "Company",
    location: "footer_company",
    items: [
      item("Contact", "/#contact"),
      item("(704) 771-6111", "tel:+17047716111"),
      item("Doug@GlassandDoorPro.com", "mailto:Doug@GlassandDoorPro.com"),
    ],
  },
  {
    name: "Legal",
    location: "footer_legal",
    items: [
      item("Privacy Policy", "/privacy-policy"),
      item("Terms of Service", "/terms-of-service"),
      item("Disclaimer", "/disclaimer"),
    ],
  },
  {
    name: "Header",
    location: "header",
    items: [
      item("About", "/#about"),
      item("Services", "/#services"),
      item("Gallery", "/#gallery"),
      item("Reviews", "/#reviews"),
      item("Contact", "/#contact"),
    ],
  },
];

const brandingSettings: Record<string, string> = {
  frontend_logo_url: "/images/glass-door-pro/logo.png",
  company_name: "Glass & Door Pro",
  company_address: "2341 Waverly Dr\nMonroe, NC 28112",
  company_phone_numbers: "(704) 771-6111",
  frontend_body_font: "nunito-sans",
  frontend_heading_font: "playfair-display",
  brand_primary_color: "#0F172A",
  brand_secondary_color: "#E2E8F0",
  brand_tertiary_color: "#0F766E",
  brand_quaternary_color: "#A8623A",
  text_h1_color: "#0F172A",
  text_h2_color: "#0F172A",
  text_h3_h6_color: "#0F172A",
  text_body_color: "#0F172A",
  text_muted_color: "#64748B",
  text_link_color: "#0F766E",
  text_link_hover_color: "#0F172A",
  text_inverse_color: "#F8FAFC",
};

const glassSeoSettings: Partial<InsertSeoSettings> = {
  siteName: "Glass & Door Pro",
  titleSuffix: " | Glass & Door Pro",
  defaultMetaDescription:
    "Glass & Door Pro serves Charlotte, NC with frameless shower doors, window installation, door replacement, window repair, and commercial glass.",
  siteUrl: "https://glass-and-door-pro-new-production.up.railway.app",
  defaultOgImageUrl: "/images/glass-door-pro/gallery-shower1-1280w.jpg",
  organizationName: "Glass & Door Pro",
  organizationLogoUrl: "/images/glass-door-pro/logo.png",
};

async function upsertMenu(menu: InsertCmsMenu & { location: MenuLocation }) {
  const allMenus = await storage.cmsMenus.getAll();
  const matches = allMenus.filter((entry) => entry.location === menu.location);
  const [primary, ...duplicates] = matches;

  for (const duplicate of duplicates) {
    await storage.cmsMenus.update(duplicate.id, { location: "unassigned" });
  }

  if (primary) {
    await storage.cmsMenus.update(primary.id, {
      name: menu.name,
      location: menu.location,
      items: menu.items as InsertCmsMenu["items"],
    });
    return;
  }

  await storage.cmsMenus.create(menu);
}

async function seedGlassPublicCms() {
  console.log("Seeding Glass & Door Pro public CMS content...");

  const existingHome = await storage.cmsPages.getPageBySlug("home");
  if (existingHome) {
    await storage.cmsPages.updatePage(existingHome.id, {
      title: "Home",
      slug: "home",
      pageType: "home",
      status: "published",
      template: "full-width",
      content: glassHomeContent,
      seoTitle: "Charlotte Glass & Door Installation",
      seoDescription:
        "Glass & Door Pro serves Charlotte, NC with frameless shower doors, window installation, door replacement, window repair, and commercial glass.",
      seoKeywords:
        "glass installation Charlotte NC, frameless shower doors, window repair, door installation, commercial glass",
      ogImageUrl: "/images/glass-door-pro/gallery-shower1-1280w.jpg",
      publishedAt: new Date(),
    });
    console.log(`  [updated] home page (${existingHome.id})`);
  } else {
    const page = await storage.cmsPages.createPage({
      title: "Home",
      slug: "home",
      pageType: "home",
      status: "published",
      template: "full-width",
      content: glassHomeContent,
      seoTitle: "Charlotte Glass & Door Installation",
      seoDescription:
        "Glass & Door Pro serves Charlotte, NC with frameless shower doors, window installation, door replacement, window repair, and commercial glass.",
      seoKeywords:
        "glass installation Charlotte NC, frameless shower doors, window repair, door installation, commercial glass",
      ogImageUrl: "/images/glass-door-pro/gallery-shower1-1280w.jpg",
      publishedAt: new Date(),
    });
    console.log(`  [created] home page (${page.id})`);
  }

  for (const menu of glassMenus) {
    await upsertMenu(menu);
    console.log(`  [synced] ${menu.location} menu`);
  }

  for (const [key, value] of Object.entries(brandingSettings)) {
    await storage.settings.upsertSetting(key, value, "branding", false);
  }
  console.log("  [synced] branding settings");

  await storage.seoSettings.upsert(glassSeoSettings);
  console.log("  [synced] global SEO settings");

  console.log("Done.");
}

seedGlassPublicCms()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
