import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PublicPageRenderer } from "@/features/public/public-block-renderer";
import type { BlockInstance } from "@/features/admin/cms/builder/block-registry";

const reviewItems = [
  {
    quote:
      "Doug was great. He's extremely detailed in his work. Will definitely use him again when I'm ready to upgrade the other shower door. Highly recommend!",
    name: "Thomas F.",
    role: "Customer",
    location: "Google review",
    rating: 5,
    source: "Google",
    sourceIcon: "google",
  },
  {
    quote:
      "Very happy with the service by Doug. Fast out to give a quote, friendly and good communication, installation as promised and high quality product.",
    name: "Leah O.",
    role: "Customer",
    location: "Google review",
    rating: 5,
    source: "Google",
    sourceIcon: "google",
  },
  {
    quote:
      "Doug was simply fantastic. Very thorough and the shower glass turned out amazing! Highly recommend!",
    name: "Gary D.",
    role: "Customer",
    location: "Google review",
    rating: 5,
    source: "Google",
    sourceIcon: "google",
  },
  {
    quote:
      "Doug was a great communicator and made the whole process easy. He took great care during installation of my frameless shower glass to protect my Carrara Marble.",
    name: "Tyler W.",
    role: "Customer",
    location: "Google review",
    rating: 5,
    source: "Google",
    sourceIcon: "google",
  },
  {
    quote:
      "Very pleased with the results on our frameless shower. Doug was great to work with, very responsive, and professional.",
    name: "Will F.",
    role: "Customer",
    location: "Google review",
    rating: 5,
    source: "Google",
    sourceIcon: "google",
  },
  {
    quote:
      "Great work! Doug was very professional and did a super job with my house window glass replacements.",
    name: "Pam",
    role: "Customer",
    location: "Google review",
    rating: 5,
    source: "Google",
    sourceIcon: "google",
  },
];

const blocks: BlockInstance[] = [
  {
    id: "reviews-header",
    type: "section-header",
    props: {
      title: "Customer Reviews",
      subtitle:
        "Hear from homeowners and businesses across the Charlotte area who trusted Glass & Door Pro.",
      alignment: "center",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "sm",
    },
  },
  {
    id: "reviews-list",
    type: "testimonials",
    props: {
      anchorId: "reviews",
      title: "What Our Customers Say",
      variant: "google-carousel",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "sm",
      sectionPaddingBottom: "lg",
      items: reviewItems,
    },
  },
  {
    id: "reviews-cta",
    type: "cta",
    props: {
      variant: "glass-service",
      heading: "Ready to Start Your Project?",
      subheading:
        "<p>Tell us about your glass, shower, window, door, or commercial project and Doug will follow up with next steps.</p>",
      primaryText: "Get Your Free Estimate",
      primaryAction: "form-modal",
      primaryFormSlug: "contact-form",
      primaryModalTitle: "Request a Free Estimate",
      primaryModalDescription: "Share a few project details and Doug will follow up with next steps.",
      secondaryText: "View Gallery",
      secondaryAction: "internal-link",
      secondaryLink: "/gallery",
    },
  },
];

export default function ReviewsPage() {
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
