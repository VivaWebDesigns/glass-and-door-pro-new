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
            link: "/services/frameless-showers",
            buttonText: "Learn More",
          },
          {
            icon: "Grid3X3",
            title: "Window Installation",
            description: "Energy-efficient window replacements to enhance your property's comfort and curb appeal.",
            link: "/services/window-installation",
            buttonText: "Learn More",
          },
          {
            icon: "DoorOpen",
            title: "Door Installation",
            description: "From entry doors to patio doors, I install options to enhance your home's security and style.",
            link: "/services/door-installation",
            buttonText: "Learn More",
          },
          {
            icon: "Wrench",
            title: "Window Repair",
            description: "Fast, reliable window glass repair for broken panes, foggy windows, and seal failures.",
            link: "/services/window-repair",
            buttonText: "Learn More",
          },
          {
            icon: "Building2",
            title: "Commercial Glass",
            description: "Professional storefront glass, office partitions, and commercial glass solutions for businesses.",
            link: "/services/commercial-glass",
            buttonText: "Learn More",
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
        sectionBackgroundColor: "#f0f8fb",
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

const galleryImages = [
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/03.jpg",
    alt: "Black frame glass shower enclosure with marble walls and freestanding tub installed by Glass & Door Pro in SouthPark, Charlotte, NC",
    caption: "Frameless Shower Install - SouthPark",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/01.jpg",
    alt: "Frameless glass shower enclosure with marble walls and built-in bench installed by Glass & Door Pro in Myers Park, Charlotte, NC",
    caption: "Frameless Shower Install - Myers Park",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/06.jpg",
    alt: "Corner frameless shower with gold hardware and blue accent walls installed by Glass & Door Pro in Weddington, NC",
    caption: "Frameless Shower Install - Weddington",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/09.jpg",
    alt: "Sliding frameless shower door with marble walls and patterned floor installed by Glass & Door Pro in Waxhaw, NC",
    caption: "Frameless Shower Install - Waxhaw",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/02.jpg",
    alt: "Modern frameless shower with barn door hardware and wood ceiling installed by Glass & Door Pro in Dilworth, Charlotte, NC",
    caption: "Frameless Shower Install - Dilworth",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/08.jpg",
    alt: "Large frameless shower enclosure with dual shower heads installed by Glass & Door Pro in Marvin, NC near Monroe",
    caption: "Frameless Shower Install - Marvin",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/05.jpg",
    alt: "Black frame shower door with dark tile and modern hardware installed by Glass & Door Pro in Plaza Midwood, Charlotte, NC",
    caption: "Frameless Shower Install - Plaza Midwood",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/12.jpg",
    alt: "Frameless sliding shower door with gold hardware and wood vanity installed by Glass & Door Pro in Matthews, NC",
    caption: "Frameless Shower Install - Matthews",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/04.jpg",
    alt: "Corner frameless shower with gold hardware and blue tile floor installed by Glass & Door Pro in Ballantyne, Charlotte, NC",
    caption: "Frameless Shower Install - Ballantyne",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/07.jpg",
    alt: "Frameless glass shower with gray subway tile and half wall installed by Glass & Door Pro in the Lake Norman area, NC",
    caption: "Frameless Shower Install - Lake Norman",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/10.jpg",
    alt: "Frameless glass shower enclosure with patterned floor tile installed by Glass & Door Pro in Fort Mill, SC near Charlotte",
    caption: "Frameless Shower Install - Fort Mill",
  },
];

const glassGalleryContent: InsertCmsPage["content"] = {
  blocks: [
    block("section-header", {
      title: "Gallery",
      subtitle: "Explore our work by category.",
      alignment: "center",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "sm",
    }),
    block("cards-grid", {
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
        {
          icon: "Grid3X3",
          title: "Windows",
          description: "Coming soon",
        },
        {
          icon: "DoorOpen",
          title: "Doors",
          description: "Coming soon",
        },
        {
          icon: "Building2",
          title: "Commercial Glass",
          description: "Coming soon",
        },
      ],
    }),
    block("image-grid", {
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
    }),
    serviceCtaBlock(
      "Ready to Start Your Project?",
      "See something you like? Tell us about your glass, shower, window, door, or commercial project and Doug will follow up with next steps.",
    ),
  ],
};

type GlassCard = {
  icon: string;
  title: string;
  description: string;
  link?: string;
  buttonText?: string;
};

type GlassFaq = {
  question: string;
  answer: string;
};

type GlassServicePageSeed = {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
  content: InsertCmsPage["content"];
};

const serviceAreaText =
  "Charlotte • Matthews • Mint Hill • Monroe • Pineville • Huntersville • Cornelius • Davidson • Concord • Tega Cay • Waxhaw • Indian Trail • Stallings • Fort Mill • Rock Hill • and surrounding areas";

function block(type: string, props: Record<string, unknown>) {
  return {
    id: uid(),
    type,
    props,
  };
}

function serviceHero(props: {
  heading: string;
  subheading: string;
  imageUrl: string;
  imagePositionY?: number;
}) {
  return block("hero", {
    variant: "glass-service",
    layout: "split",
    heading: props.heading,
    subheading: `<p>${props.subheading}</p>`,
    ctaText: "Request a Quote",
    ctaAction: "form-modal",
    ctaFormSlug: "contact-form",
    ctaModalTitle: "Request a Free Quote",
    ctaModalDescription: "Tell us a little about your project and Doug will follow up with next steps.",
    ctaSecondaryText: "Call (704) 771-6111",
    ctaSecondaryLink: "tel:+17047716111",
    ctaSecondaryAction: "custom-link",
    backgroundImageUrl: props.imageUrl,
    overlayColor: "#000000",
    overlayOpacity: 28,
    minHeight: "700",
    backgroundPositionX: 50,
    backgroundPositionY: props.imagePositionY ?? 35,
    headingColor: "#ffffff",
    subheadingColor: "#ffffff",
  });
}

function cardsGrid(props: {
  anchorId?: string;
  title: string;
  subtitle?: string;
  cards: GlassCard[];
  columns?: string;
  backgroundColor?: string;
}) {
  return block("cards-grid", {
    anchorId: props.anchorId,
    title: props.title,
    subtitle: props.subtitle ?? "",
    columns: props.columns ?? "3",
    variant: "service-links",
    sectionBackgroundColor: props.backgroundColor ?? "#ffffff",
    sectionPaddingTop: "lg",
    sectionPaddingBottom: "lg",
    cards: props.cards,
  });
}

function processCards(title: string, cards: Omit<GlassCard, "icon">[]) {
  return cardsGrid({
    title,
    columns: "4",
    backgroundColor: "#ffffff",
    cards: cards.map((card, index) => ({
      ...card,
      icon: index === 0 ? "Search" : index === cards.length - 1 ? "BadgeCheck" : "CheckCircle",
    })),
  });
}

function galleryBlock(title: string, images: Array<{ url: string; alt: string }>) {
  return block("image-grid", {
    anchorId: "gallery",
    title,
    columns: images.length === 2 ? "2" : "3",
    gap: "lg",
    sectionBackgroundColor: "#f8fafc",
    sectionPaddingTop: "lg",
    sectionPaddingBottom: "lg",
    images,
  });
}

function faqBlock(items: GlassFaq[]) {
  return block("faq", {
    title: "Frequently Asked Questions",
    sectionBackgroundColor: "#f8fafc",
    sectionPaddingTop: "lg",
    sectionPaddingBottom: "lg",
    items,
  });
}

function serviceAreaBlock() {
  return block("rich-text", {
    title: "Serving the Greater Charlotte Area",
    alignment: "center",
    content: `<p>${serviceAreaText}</p>`,
    sectionBackgroundColor: "#ffffff",
    sectionPaddingTop: "md",
    sectionPaddingBottom: "md",
  });
}

function serviceCtaBlock(heading: string, subheading: string) {
  return block("cta", {
    variant: "glass-service",
    heading,
    subheading: `<p>${subheading}</p>`,
    primaryText: "Get Your Free Estimate",
    primaryAction: "form-modal",
    primaryFormSlug: "contact-form",
    primaryModalTitle: "Request a Free Estimate",
    primaryModalDescription: "Share a few project details and Doug will follow up with next steps.",
    secondaryText: "Back to Home",
    secondaryAction: "internal-link",
    secondaryLink: "/",
  });
}

function servicePageContent(props: {
  hero: {
    heading: string;
    subheading: string;
    imageUrl: string;
    imagePositionY?: number;
  };
  intro?: {
    title: string;
    content: string;
  };
  cardsTitle: string;
  cards: GlassCard[];
  galleryTitle: string;
  gallery: Array<{ url: string; alt: string }>;
  processTitle: string;
  process: Omit<GlassCard, "icon">[];
  whyTitle?: string;
  whyCards?: GlassCard[];
  faqs: GlassFaq[];
  cta: {
    heading: string;
    subheading: string;
  };
}): InsertCmsPage["content"] {
  const blocks = [
    serviceHero(props.hero),
    ...(props.intro
      ? [
          block("rich-text", {
            title: props.intro.title,
            alignment: "center",
            content: props.intro.content,
            sectionBackgroundColor: "#ffffff",
            sectionPaddingTop: "lg",
            sectionPaddingBottom: "md",
          }),
        ]
      : []),
    cardsGrid({
      title: props.cardsTitle,
      cards: props.cards,
      columns: "3",
      backgroundColor: props.intro ? "#f8fafc" : "#ffffff",
    }),
    galleryBlock(props.galleryTitle, props.gallery),
    processCards(props.processTitle, props.process),
    ...(props.whyTitle && props.whyCards
      ? [
          cardsGrid({
            title: props.whyTitle,
            cards: props.whyCards,
            columns: "4",
            backgroundColor: "#f8fafc",
          }),
        ]
      : []),
    faqBlock(props.faqs),
    serviceAreaBlock(),
    serviceCtaBlock(props.cta.heading, props.cta.subheading),
  ];

  return { blocks };
}

const glassServicePages: GlassServicePageSeed[] = [
  {
    title: "Frameless Showers",
    slug: "services-frameless-showers",
    seoTitle: "Frameless Shower Doors in Charlotte, NC",
    seoDescription:
      "Custom frameless glass shower door installation in Charlotte, NC with precision-measured tempered safety glass and premium hardware.",
    seoKeywords:
      "frameless shower doors Charlotte NC, glass shower installation, custom shower enclosure, shower glass Monroe NC",
    ogImageUrl: "/images/glass-door-pro/frameless-parallax.jpg",
    content: servicePageContent({
      hero: {
        heading: "Frameless Glass Shower Doors",
        subheading:
          "Transform your bathroom into a luxurious spa-like retreat with custom frameless glass shower enclosures. Serving Charlotte, NC and surrounding areas with over 15 years of expert installation experience.",
        imageUrl: "/images/glass-door-pro/frameless-parallax.jpg",
        imagePositionY: 25,
      },
      cardsTitle: "Why Choose Frameless Shower Doors?",
      cards: [
        {
          icon: "Star",
          title: "Modern Elegance",
          description:
            "Frameless designs create a sleek, open feel that makes your bathroom appear larger and more luxurious.",
        },
        {
          icon: "ShieldCheck",
          title: "Premium Quality",
          description:
            "We use thick tempered safety glass and high-quality hardware that's built to last for decades.",
        },
        {
          icon: "Droplets",
          title: "Easy to Clean",
          description: "No metal frames means fewer places for mold and mildew to hide. Simply wipe and go.",
        },
        {
          icon: "CheckCircle",
          title: "Custom Fit",
          description:
            "Every installation is precision-measured and custom-cut to perfectly fit your unique bathroom space.",
        },
        {
          icon: "BadgeCheck",
          title: "Increases Home Value",
          description:
            "A beautiful frameless shower is a sought-after feature that adds real value to your home.",
        },
        {
          icon: "Wrench",
          title: "Professional Installation",
          description:
            "Doug personally handles every installation with meticulous attention to detail and craftsmanship.",
        },
      ],
      galleryTitle: "Our Frameless Shower Work",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower1-1280w.webp",
          alt: "Custom frameless glass shower enclosure installed by Glass & Door Pro",
        },
        {
          url: "/images/glass-door-pro/gallery-shower2-1280w.webp",
          alt: "Modern frameless shower door with premium hardware",
        },
      ],
      processTitle: "Our Simple Process",
      process: [
        {
          title: "Free Consultation",
          description: "Contact us and we'll schedule a convenient time to discuss your vision.",
        },
        {
          title: "Precise Measurement",
          description: "We take detailed measurements to ensure a perfect custom fit.",
        },
        {
          title: "Custom Fabrication",
          description: "Your glass is precision-cut and edges polished to perfection.",
        },
        {
          title: "Expert Installation",
          description: "Professional installation with attention to every detail.",
        },
      ],
      faqs: [
        {
          question: "How long does installation take?",
          answer:
            "<p>Most frameless shower installations are completed in 2-4 hours, depending on the complexity of your design.</p>",
        },
        {
          question: "What thickness of glass do you use?",
          answer:
            '<p>We typically use 3/8" or 1/2" thick tempered safety glass, which provides excellent durability and a premium look.</p>',
        },
        {
          question: "Do you offer different hardware finishes?",
          answer:
            "<p>Yes. We offer chrome, brushed nickel, oil-rubbed bronze, matte black, gold, and other finishes to match your bathroom.</p>",
        },
        {
          question: "How do I maintain my frameless shower?",
          answer:
            "<p>Simply squeegee after each use and clean weekly with a non-abrasive glass cleaner. We can also apply protective coatings.</p>",
        },
      ],
      cta: {
        heading: "Ready to Transform Your Bathroom?",
        subheading:
          "Get a free quote for your custom frameless shower installation today. We're ready to help you create the bathroom of your dreams.",
      },
    }),
  },
  {
    title: "Window Installation",
    slug: "services-window-installation",
    seoTitle: "Residential Window Installation in Charlotte, NC",
    seoDescription:
      "Energy-efficient residential window installation and replacement for homes in Charlotte, Monroe, Indian Trail, and surrounding areas.",
    seoKeywords:
      "window installation Charlotte NC, window replacement Monroe NC, residential windows, energy efficient windows",
    ogImageUrl: "/images/glass-door-pro/window-parallax.jpg",
    content: servicePageContent({
      hero: {
        heading: "Residential Window Installation",
        subheading:
          "Upgrade your home with energy-efficient windows that improve comfort, reduce energy costs, and enhance curb appeal. Professional installation throughout the Charlotte area.",
        imageUrl: "/images/glass-door-pro/window-parallax.jpg",
        imagePositionY: 45,
      },
      cardsTitle: "Benefits of New Windows",
      cards: [
        {
          icon: "BadgeCheck",
          title: "Energy Efficiency",
          description: "Modern windows help keep conditioned air inside and outdoor weather where it belongs.",
        },
        {
          icon: "CheckCircle",
          title: "Lower Energy Bills",
          description: "Better insulation can reduce heating and cooling costs over time.",
        },
        {
          icon: "Star",
          title: "Natural Light",
          description: "Fresh windows brighten rooms and make your home feel more open and comfortable.",
        },
        {
          icon: "Lock",
          title: "Enhanced Security",
          description: "Updated locks, stronger glass, and better fit help improve home security.",
        },
        {
          icon: "Building2",
          title: "Curb Appeal",
          description: "New windows refresh the exterior and add polish to your home's appearance.",
        },
        {
          icon: "ShieldCheck",
          title: "Noise Reduction",
          description: "Quality windows can reduce outside noise for a quieter indoor environment.",
        },
      ],
      galleryTitle: "Window Installation Projects",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Residential windows installed by Glass & Door Pro",
        },
        {
          url: "/images/glass-door-pro/gallery-sunroom-1280w.webp",
          alt: "Sunroom windows installed in the Charlotte area",
        },
      ],
      processTitle: "Window Installation Process",
      process: [
        {
          title: "In-Home Consultation",
          description: "We review your current windows, goals, and budget.",
        },
        {
          title: "Window Selection",
          description: "Choose efficient, attractive options that fit your home.",
        },
        {
          title: "Professional Install",
          description: "Your windows are installed carefully for a clean, lasting fit.",
        },
        {
          title: "Final Inspection",
          description: "We check operation, sealing, and finish details before wrapping up.",
        },
      ],
      faqs: [
        {
          question: "Do I need to replace all my windows at once?",
          answer:
            "<p>No. Many homeowners replace windows in phases. We can help prioritize the windows that need attention first.</p>",
        },
        {
          question: "Can new windows improve energy efficiency?",
          answer:
            "<p>Yes. Properly installed modern windows can improve insulation, comfort, and overall home efficiency.</p>",
        },
        {
          question: "Do you remove the old windows?",
          answer:
            "<p>Yes. We remove existing units as part of the installation process and keep the job area clean.</p>",
        },
        {
          question: "What areas do you serve?",
          answer:
            "<p>We serve Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, Fort Mill, Rock Hill, and surrounding communities.</p>",
        },
      ],
      cta: {
        heading: "Ready to Upgrade Your Windows?",
        subheading:
          "Schedule a free quote for residential window installation and replacement in the greater Charlotte area.",
      },
    }),
  },
  {
    title: "Door Installation",
    slug: "services-door-installation",
    seoTitle: "Door Installation Services in Charlotte, NC",
    seoDescription:
      "Entry door, patio door, and exterior door installation for homeowners in Charlotte, Monroe, Indian Trail, and surrounding areas.",
    seoKeywords:
      "door installation Charlotte NC, entry doors Monroe NC, patio door replacement, exterior door installer",
    ogImageUrl: "/images/glass-door-pro/door-parallax.jpg",
    content: servicePageContent({
      hero: {
        heading: "Door Installation Services",
        subheading:
          "Enhance your home's security, efficiency, and curb appeal with professionally installed entry, patio, and exterior doors.",
        imageUrl: "/images/glass-door-pro/door-parallax.jpg",
        imagePositionY: 45,
      },
      cardsTitle: "Why Replace or Install a New Door?",
      cards: [
        {
          icon: "Lock",
          title: "Enhanced Security",
          description: "A properly fitted door improves security and peace of mind.",
        },
        {
          icon: "BadgeCheck",
          title: "Energy Efficiency",
          description: "Reduce drafts and improve comfort with doors installed for a tight seal.",
        },
        {
          icon: "Star",
          title: "Curb Appeal",
          description: "A new front or patio door can dramatically refresh your home's look.",
        },
        {
          icon: "CheckCircle",
          title: "Increased Home Value",
          description: "Quality door upgrades add everyday function and long-term value.",
        },
        {
          icon: "DoorOpen",
          title: "Wide Selection",
          description: "Choose the style, glass, finish, and hardware that fits your home.",
        },
        {
          icon: "Wrench",
          title: "Professional Fit",
          description: "Careful installation helps your door open, close, latch, and seal correctly.",
        },
      ],
      galleryTitle: "Door Installation Projects",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-door1-1280w.webp",
          alt: "Wood entry door installed by Glass & Door Pro",
        },
        {
          url: "/images/glass-door-pro/gallery-door2-1280w.webp",
          alt: "Custom exterior door installation",
        },
        {
          url: "/images/glass-door-pro/gallery-door3-1280w.webp",
          alt: "Blue entry door installed in the Charlotte area",
        },
      ],
      processTitle: "Our Door Installation Process",
      process: [
        {
          title: "Consultation",
          description: "We discuss style, performance, and fit for your project.",
        },
        {
          title: "Selection",
          description: "Choose the door and options that work for your home.",
        },
        {
          title: "Installation",
          description: "Doug installs your door with attention to detail and alignment.",
        },
        {
          title: "Final Check",
          description: "We test operation, hardware, locks, and weather sealing.",
        },
      ],
      faqs: [
        {
          question: "What types of doors do you install?",
          answer:
            "<p>We install entry doors, patio doors, storm doors, and other exterior door solutions for residential properties.</p>",
        },
        {
          question: "Can a new door help with drafts?",
          answer:
            "<p>Yes. Proper door fit, weatherstripping, and sealing can reduce drafts and improve comfort.</p>",
        },
        {
          question: "Do you help choose the right door?",
          answer:
            "<p>Yes. We can talk through style, material, glass, security, and budget considerations before installation.</p>",
        },
        {
          question: "How long does door installation take?",
          answer:
            "<p>Many standard door installations can be completed in a day, depending on the door type and existing opening.</p>",
        },
      ],
      cta: {
        heading: "Ready for a New Door?",
        subheading:
          "Get a free quote for professional door installation in Charlotte, Monroe, Indian Trail, and nearby communities.",
      },
    }),
  },
  {
    title: "Window Repair",
    slug: "services-window-repair",
    seoTitle: "Window Repair Services in Charlotte, NC",
    seoDescription:
      "Fast window glass repair for broken panes, foggy glass, seal failure, storm damage, and glass-only replacement in the Charlotte area.",
    seoKeywords:
      "window repair Charlotte NC, broken window glass, foggy window repair, seal failure repair, glass replacement",
    ogImageUrl: "/images/glass-door-pro/window-repair-parallax.jpg",
    content: servicePageContent({
      hero: {
        heading: "Window Repair Services",
        subheading:
          "Broken glass, foggy windows, seal failures, and storm damage can often be fixed without replacing the full window. Get reliable repair help from a local glass pro.",
        imageUrl: "/images/glass-door-pro/window-repair-parallax.jpg",
        imagePositionY: 45,
      },
      cardsTitle: "Common Window Problems We Repair",
      cards: [
        {
          icon: "XCircle",
          title: "Broken Glass",
          description: "Repair cracked or shattered panes quickly and professionally.",
        },
        {
          icon: "Droplets",
          title: "Foggy Windows",
          description: "Address failed seals that leave condensation trapped between panes.",
        },
        {
          icon: "ShieldCheck",
          title: "Seal Failure",
          description: "Restore comfort and visibility when insulated glass units fail.",
        },
        {
          icon: "Wrench",
          title: "Storm Damage",
          description: "Repair glass damage caused by weather, debris, and impact.",
        },
        {
          icon: "Grid3X3",
          title: "Single Pane Upgrade",
          description: "Explore safer, clearer, and more efficient glass replacement options.",
        },
        {
          icon: "CheckCircle",
          title: "Glass-Only Replacement",
          description: "Fix the damaged glass while preserving the existing window frame when possible.",
        },
      ],
      galleryTitle: "Window Repair Work",
      gallery: [
        {
          url: "/images/glass-door-pro/window-repair-broken-1280w.webp",
          alt: "Broken window glass before repair",
        },
        {
          url: "/images/glass-door-pro/window-repair-living-1280w.webp",
          alt: "Living room window repaired by Glass & Door Pro",
        },
      ],
      processTitle: "Why Choose Us for Window Repair",
      process: [
        {
          title: "Fast Response",
          description: "We help you address broken or failed glass without unnecessary delay.",
        },
        {
          title: "Affordable Pricing",
          description: "Glass-only replacement can often avoid the cost of a full window replacement.",
        },
        {
          title: "Quality Materials",
          description: "We use reliable glass and seal solutions chosen for your window type.",
        },
        {
          title: "15+ Years Experience",
          description: "Doug brings hands-on experience to every repair and replacement.",
        },
      ],
      faqs: [
        {
          question: "Can you replace just the glass?",
          answer:
            "<p>In many cases, yes. If the frame is in good condition, glass-only replacement can be a practical option.</p>",
        },
        {
          question: "Can foggy windows be repaired?",
          answer:
            "<p>Fogging often means the insulated glass seal has failed. Replacing the glass unit can restore clarity.</p>",
        },
        {
          question: "Do you repair storm-damaged windows?",
          answer:
            "<p>Yes. We can assess storm or impact damage and recommend the right repair path.</p>",
        },
        {
          question: "Should I replace the full window instead?",
          answer:
            "<p>It depends on the condition of the frame, age of the window, and your goals. We'll help you choose the sensible option.</p>",
        },
      ],
      cta: {
        heading: "Need Window Repair in Charlotte?",
        subheading:
          "Get help with broken glass, foggy panes, seal failure, and glass-only replacement throughout the Charlotte area.",
      },
    }),
  },
  {
    title: "Commercial Glass",
    slug: "services-commercial-glass",
    seoTitle: "Commercial Glass Services in Charlotte, NC",
    seoDescription:
      "Commercial storefront glass, office glass partitions, curtain wall systems, security glass, glass doors, and emergency repairs in Charlotte, NC.",
    seoKeywords:
      "commercial glass Charlotte NC, storefront glass, office glass partitions, glass doors, curtain wall systems",
    ogImageUrl: "/images/glass-door-pro/commercial-hero-1280w.webp",
    content: servicePageContent({
      hero: {
        heading: "Commercial Glass Services",
        subheading:
          "Professional commercial glass installation and repair for storefronts, offices, restaurants, retail spaces, and business properties across the Charlotte area.",
        imageUrl: "/images/glass-door-pro/commercial-hero-1280w.webp",
        imagePositionY: 50,
      },
      intro: {
        title: "Commercial Glass Solutions for Your Business",
        content:
          "<p>Your business space needs glass that looks professional, performs reliably, and supports the way your team and customers use the building. Glass & Door Pro provides commercial glass installation and repair with clear communication, careful workmanship, and responsive service.</p>",
      },
      cardsTitle: "Our Commercial Glass Services",
      cards: [
        {
          icon: "Building2",
          title: "Storefront Glass",
          description: "Clean, professional storefront glass installation and replacement for customer-facing spaces.",
        },
        {
          icon: "Grid3X3",
          title: "Office Glass Partitions",
          description: "Glass walls and partitions that add light, separation, and a polished commercial look.",
        },
        {
          icon: "ShieldCheck",
          title: "Curtain Wall Systems",
          description: "Commercial glass solutions for larger building openings and modern exterior designs.",
        },
        {
          icon: "Lock",
          title: "Security Glass",
          description: "Glass options selected for safety, durability, and business protection.",
        },
        {
          icon: "Wrench",
          title: "Emergency Repairs",
          description: "Responsive repair support when broken commercial glass affects safety or operations.",
        },
        {
          icon: "DoorOpen",
          title: "Glass Doors",
          description: "Commercial glass door installation and replacement for offices, retail, and service businesses.",
        },
      ],
      galleryTitle: "Commercial Glass Projects",
      gallery: [
        {
          url: "/images/glass-door-pro/commercial-glass-interior-1280w.webp",
          alt: "Commercial glass interior project",
        },
        {
          url: "/images/glass-door-pro/commercial-hero-1280w.webp",
          alt: "Commercial storefront glass project",
        },
      ],
      processTitle: "How We Work",
      process: [
        {
          title: "Site Assessment",
          description: "We review your space, measurements, access, and business needs.",
        },
        {
          title: "Custom Quote",
          description: "You receive a clear quote based on the glass, hardware, and installation scope.",
        },
        {
          title: "Professional Install",
          description: "Installation is handled carefully with respect for your property and business operations.",
        },
        {
          title: "Final Walkthrough",
          description: "We review the finished work and confirm everything is clean, secure, and ready to use.",
        },
      ],
      whyTitle: "Why Charlotte Businesses Choose Us",
      whyCards: [
        {
          icon: "Phone",
          title: "Fast Response",
          description: "Responsive communication when your business needs glass service quickly.",
        },
        {
          icon: "BadgeCheck",
          title: "Licensed & Insured",
          description: "Professional service with the credentials commercial properties expect.",
        },
        {
          icon: "MapPin",
          title: "Local Experience",
          description: "Hands-on glass experience throughout Charlotte, Monroe, Indian Trail, and nearby areas.",
        },
        {
          icon: "ShieldCheck",
          title: "Quality Materials",
          description: "Commercial glass and hardware selected for performance, safety, and appearance.",
        },
      ],
      faqs: [
        {
          question: "What types of businesses do you serve?",
          answer:
            "<p>We serve offices, retail spaces, restaurants, service businesses, property managers, and other commercial spaces.</p>",
        },
        {
          question: "Can you repair broken storefront glass?",
          answer:
            "<p>Yes. We can assess damaged storefront glass and recommend a replacement or repair path based on safety and business needs.</p>",
        },
        {
          question: "Do you install office glass partitions?",
          answer:
            "<p>Yes. Glass partitions can create separation while keeping offices bright, open, and professional.</p>",
        },
        {
          question: "Do you offer emergency commercial glass service?",
          answer:
            "<p>We respond as quickly as possible for urgent commercial glass needs. Contact us with the project details and location.</p>",
        },
      ],
      cta: {
        heading: "Ready to Discuss Your Commercial Glass Project?",
        subheading:
          "Tell us about your storefront, office, repair, or commercial glass installation needs and we'll help with the next step.",
      },
    }),
  },
];

const glassMenus: Array<InsertCmsMenu & { location: MenuLocation }> = [
  {
    name: "Main Navigation",
    location: "main_navigation",
    items: [
      item("About", "/#about"),
      item("Services", "/#services", [
        item("Frameless Showers", "/services/frameless-showers"),
        item("Window Installation", "/services/window-installation"),
        item("Door Installation", "/services/door-installation"),
        item("Window Repair", "/services/window-repair"),
        item("Commercial Glass", "/services/commercial-glass"),
      ]),
      item("Gallery", "/gallery"),
      item("Reviews", "/#reviews"),
      item("Contact", "/#contact"),
    ],
  },
  {
    name: "Services",
    location: "footer_platform",
    items: [
      item("Frameless Showers", "/services/frameless-showers"),
      item("Window Installation", "/services/window-installation"),
      item("Door Installation", "/services/door-installation"),
    ],
  },
  {
    name: "More Services",
    location: "footer_professionals",
    items: [
      item("Window Repair", "/services/window-repair"),
      item("Commercial Glass", "/services/commercial-glass"),
      item("Get a Free Quote", "/#contact"),
    ],
  },
  {
    name: "Resources",
    location: "footer_resources",
    items: [
      item("About Doug", "/#about"),
      item("Project Gallery", "/gallery"),
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
      item("Services", "/#services", [
        item("Frameless Showers", "/services/frameless-showers"),
        item("Window Installation", "/services/window-installation"),
        item("Door Installation", "/services/door-installation"),
        item("Window Repair", "/services/window-repair"),
        item("Commercial Glass", "/services/commercial-glass"),
      ]),
      item("Gallery", "/gallery"),
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

  const existingGallery = await storage.cmsPages.getPageBySlug("gallery");
  const galleryPayload: InsertCmsPage = {
    title: "Gallery",
    slug: "gallery",
    pageType: "gallery",
    status: "published",
    template: "full-width",
    content: glassGalleryContent,
    seoTitle: "Project Gallery",
    seoDescription:
      "Browse frameless shower door installations completed by Glass & Door Pro across Charlotte, Monroe, Indian Trail, and surrounding areas.",
    seoKeywords:
      "Glass & Door Pro gallery, frameless shower photos, Charlotte glass installation gallery, shower door projects",
    ogImageUrl: "/images/glass-door-pro/gallery/frameless-showers/03.jpg",
    canonicalUrl: "https://glass-and-door-pro-new-production.up.railway.app/gallery",
    publishedAt: new Date(),
  };

  if (existingGallery) {
    await storage.cmsPages.updatePage(existingGallery.id, galleryPayload);
    console.log(`  [updated] gallery page (${existingGallery.id})`);
  } else {
    const page = await storage.cmsPages.createPage(galleryPayload);
    console.log(`  [created] gallery page (${page.id})`);
  }

  for (const servicePage of glassServicePages) {
    const existingServicePage = await storage.cmsPages.getPageBySlug(servicePage.slug);
    const servicePath = `/services/${servicePage.slug.replace("services-", "")}`;
    const pagePayload: InsertCmsPage = {
      title: servicePage.title,
      slug: servicePage.slug,
      pageType: "service",
      status: "published",
      template: "full-width",
      content: servicePage.content,
      seoTitle: servicePage.seoTitle,
      seoDescription: servicePage.seoDescription,
      seoKeywords: servicePage.seoKeywords,
      ogImageUrl: servicePage.ogImageUrl,
      canonicalUrl: `https://glass-and-door-pro-new-production.up.railway.app${servicePath}`,
      publishedAt: new Date(),
    };

    if (existingServicePage) {
      await storage.cmsPages.updatePage(existingServicePage.id, pagePayload);
      console.log(`  [updated] ${servicePage.slug} page (${existingServicePage.id})`);
    } else {
      const page = await storage.cmsPages.createPage(pagePayload);
      console.log(`  [created] ${servicePage.slug} page (${page.id})`);
    }
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
