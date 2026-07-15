import { randomUUID } from "crypto";
import { pathToFileURL } from "url";
import type { storage as storageInstance } from "../server/storage";
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

type AppStorage = typeof storageInstance;

let storagePromise: Promise<AppStorage> | null = null;

function getStorage() {
  storagePromise ??= import("../server/storage").then((module) => module.storage);
  return storagePromise;
}

function item(
  label: string,
  url: string,
  children: MenuItem[] = [],
  openInNewTab = false,
): MenuItem {
  return {
    id: uid(),
    label,
    url,
    openInNewTab,
    children,
  };
}

function googleReview(name: string, quote: string) {
  return {
    quote,
    name,
    role: "Customer",
    location: "Google review",
    rating: 5,
    source: "Google",
    sourceIcon: "google",
  };
}

const glassReviewItems = [
  googleReview(
    "Noah Clark",
    "Great experience, made sure the job was done correctly and explained different options allowing us to make an informed decision.",
  ),
  googleReview(
    "RTrish",
    "Overpriced. Called to request a sliding glass door repair. Doug responded quickly. He was very courteous, prompt and had the issue fixed in a timely manner. Thankfully, the screen was just off track. All went well, but it did seem a little pricey.",
  ),
  googleReview(
    "Mike O'Sullivan",
    "Reasonable price. My custom double-pane glass window needed to be replaced. Everything was done exactly on time, and the glass was carefully installed. Good as new!",
  ),
  googleReview("K. Z.", "Very helpful to replace sliding door wheels!"),
  googleReview("Chris Jones", "Great price."),
  googleReview(
    "Jacob Ellison",
    "Great price. Came on time. Was professional and did an amazing install. Great price and great work.",
  ),
  googleReview(
    "Eikon",
    "They came and quickly installed two high quality storm doors the very next day after I called them. Both doors were exactly what I was looking for. Prompt and professional workmanship at a very reasonable price, highly recommended!",
  ),
  googleReview(
    "Frankie23 “Patricia”",
    "I've been finding it very difficult to find good, reliable people for certain renovations. Doug, however, exceeded my expectations by miles. His talent for attention to meticulous details is very impressive. His love and pride for what he does shows through his work, which is immaculate. Not to mention he is just a very nice guy who actually listens and caters to you even if you aren't sure of what you need/want, per se. Extremely communicative and patient. 10/10. Good job and Thank You!",
  ),
  googleReview(
    "Mike Capuano",
    "Fast response, Great communication. Quality work. Would call again.",
  ),
  googleReview(
    "Jvarr",
    "Doug was very quick and responded fast, even cut an extra piece because one was scratched. Then I also needed a third piece cut due to a measuring mishap and he gave it to me with a discounted price all in one day.",
  ),
  googleReview(
    "Conner Kipke",
    "Doug was quick to respond and very professional. His prices are fair and the work is great. I would recommend him to anyone in need of glass repair.",
  ),
  googleReview(
    "Homero Avila",
    "This is who I will call every time I need a glass replaced! Easy to communicate and schedule with, cares about getting the job done and customer satisfaction. Doug came out even with a hurt foot and took care of the glass replacement. 5/5 recommendation!",
  ),
  googleReview(
    "jamie ozment",
    "Doug with Glass and Door Pro is excellent! I broke a piece in my window and I couldn't get my window to open or close. I called Doug on Monday morning and he came out right away. He had all the supplies he needed and sent me texts to let me know the next steps.",
  ),
  googleReview(
    "Holly Widders",
    "He did a fantastic job! Our sliding glass door works better than ever now!",
  ),
  googleReview(
    "Derick Pope",
    "We use Doug at our property. He's very reliable and has great craftsmanship. I would recommend his services to anyone.",
  ),
  googleReview(
    "Mike Duganich",
    "Doug came out right on time and fixed a few issues we were having on a few windows and doors. Highly knowledgeable and recommended good fixes. Highly recommend.",
  ),
  googleReview(
    "Lin Nina",
    "The door in our store is never closed tightly, and it has always been prone to air leakage. Since he repaired the door, the temperature in our store has been very well maintained. He worked very responsibly and gave a reasonable price. We were highly recommended him. It's a really correct choice.",
  ),
  googleReview(
    "Greg Hyder",
    "Quick to respond and quote. Showed up on time and did a great job in installing my door window insert. Very fair pricing. Would highly recommend.",
  ),
  googleReview(
    "Melissa Eyerman",
    "We needed a window replaced in our home. Doug was responsive, professional, and easy to work with. He explained the process, showed up on time, and treated our home with care and respect. The installation itself was done efficiently and carefully.",
  ),
  googleReview(
    "Kimberly Sanders",
    "We broke a large glass panel out of our shower and Doug from Glass and Door Pro did an amazing job replacing that panel for us. He was able to come give us an estimate and then had the shower glass replaced in no time. Highly recommend Glass and Door Pro!",
  ),
  googleReview(
    "Mike Dickerman",
    "Doug was on time and very professional. I called so he could come fix a few broken windows and a door and it turned out to be a simple fix which took him no time and he didn't even charge for it. I admire the honesty.",
  ),
  googleReview(
    "Robbie Mulkey",
    "I had a broken window that needed fixing and they went above and beyond. They showed up on time, explained everything clearly, and the work looks perfect. The area was clean when they finished and the price was great.",
  ),
  googleReview(
    "James Pickard",
    "Doug was excellent. He was prompt and was able to give a price right on the spot. When he showed up for the job he got straight to work and finished the job in a good amount of time. I would refer him to anyone.",
  ),
  googleReview(
    "Pam Jones",
    "Doug and Ben replaced our shower glass enclosure in our primary bathroom. They were on time, professional, extremely meticulous with measurements and installation along with great communication. We would highly recommend.",
  ),
  googleReview(
    "Jenny Cornacchione",
    "Doug helped us to replace a window and install a storm door. He provided exceptional service throughout the entire process, and I highly recommend Glass and Door Pro.",
  ),
  googleReview(
    "Andrey Bayrashev",
    "Great work installing our broken window, with great quality and at affordable price!",
  ),
  googleReview(
    "Ryan Billingsley",
    "Doug installed a new front door and storm door on our house. Due to the extreme temperatures, the door had swollen and was not functioning properly. Called Doug and he came out quickly to get it sorted.",
  ),
  googleReview("Tapan Patel", "Pro."),
  googleReview(
    "Arlie Gunn",
    "These guys were friendly and professional and also showed up to help last minute!!! I was in a tough spot and they showed up with smiles on their faces and helped me out no problem. Also the pricing is fair and very affordable.",
  ),
  googleReview(
    "Hardcor Coleman",
    "Great experience job was done quick and efficient. Plus a good guy will definitely recommend.",
  ),
  googleReview(
    "Samantha Walsh",
    "Doug was amazing with our major window issues. He was prompt and professional and very communicative. He helped alleviate a lot of stress and has been our go to ever since. I have to say not only is the quality top notch but his pricing was the most reasonable in town! Would recommend him 10x over!!",
  ),
  googleReview("Dennis “AusareOne” Stevens", "Excellent work I highly recommend him. 100%."),
  googleReview(
    "Thomas Foy",
    "Doug was great. He's extremely detailed in his work. Will definitely use him again when I'm ready to upgrade the other shower door. Highly recommend!",
  ),
  googleReview(
    "Jim Zellers",
    "Our entire experience was great. Doug was extremely careful in doing the measurements for our shower glass. He also was very particular installing the glass and taking time to make sure everything was perfect. I highly recommend Doug and his company and will use them for any future glass projects.",
  ),
  googleReview(
    "Michael Powers",
    "Wonderful experience using Glass and Door Pro's. They are very meticulous and always look to make the job more affordable by offering option to rework if deemed possible.",
  ),
  googleReview(
    "Chandra Funderburk",
    "Very nice man. Reasonably priced. Came on time. Did excellent work and didn't take long at all. Would definitely recommend.",
  ),
  googleReview(
    "Evelyn Salazar",
    "I had an emergency door that needed a new glass and Doug was very responsive and quick to come out and help during this time. I'm hoping I don't need to give him a call but in case of an incident I know I can count on him. Thank you once again!",
  ),
  googleReview(
    "Behyar Behdani",
    "Doug is a great, honest and hard working gentleman. Based on his hard work I suggested him to keep working with great manufacturers to match his valuable work.",
  ),
  googleReview("Sheila Ellsaesser", "This was a great experience. Very detailed, professional."),
  googleReview(
    "cookiemclaughlin",
    "Doug did a fantastic job removing a large mirror from a wall. Excellent communication before, during and after the job was done. He 100 percent went above and beyond for me and I really appreciate it. Highly recommend!",
  ),
  googleReview(
    "Annette Calise",
    "Glass and Door Pro was very professional, knowledgeable and friendly. We received an appointment quickly to fix our shower door. We are very happy with the results. We will use him again.",
  ),
  googleReview(
    "Leah Korgaard Offutt",
    "Very happy with the service by Doug. Fast out to give a quote, friendly and good communication, installation as promised and high quality product.",
  ),
  googleReview(
    "charles naperski",
    "Replaced a back door and frame that was rotting out. Did an excellent job with a quality door and frame. Punctual, professional, economical!",
  ),
  googleReview(
    "G. Scott Denton",
    "Doug was simply fantastic. Very thorough and the shower glass turned out amazing! Highly recommend!",
  ),
  googleReview(
    "T Woods",
    "Doug was a great communicator and made the whole process easy. He took great care during installation of my frameless shower glass to protect my Carrara Marble. He was meticulous, did a great job and was super great to work with!",
  ),
  googleReview(
    "Gus St. Angelo",
    "Doug was wonderful to work with. He is very efficient, friendly, courteous, on time and he left the work space very clean. Overall a really nice guy.",
  ),
  googleReview(
    "Amy Starr",
    "Very knowledgeable, knew exactly what to do and was both personable and professional. Plus he cleaned up after he completed the job and everything looked great! Thanks Doug for fixing our shower door!",
  ),
  googleReview(
    "Mindy Bass",
    "Doug came the next day and took precise measurements. Very courteous, professional with very reasonable prices.",
  ),
  googleReview(
    "Donna Kelly",
    "Doug was great. From the time I called him he was punctual and thorough. We were extremely satisfied with the work that was done we will definitely be recommending him to others.",
  ),
  googleReview("Colt Atkinson", "Great pricing and even better service!!"),
  googleReview(
    "Bessie Flanders",
    "A stone broke our sliding glass door glass. Doug came, measured, and gave us the quote. Within a week he came and installed the glass. Extremely nice, knowledgeable, honest and reasonable. I highly recommend him.",
  ),
  googleReview("Matthew Berti", "Door came out great and finished off our new shower."),
  googleReview(
    "Will Friedrich",
    "Very pleased with the results on our frameless shower. Doug was great to work with, very responsive, and professional. Would highly recommend for your shower glass project.",
  ),
  googleReview(
    "Felisha Barbee",
    "Doug was quick to respond, very professional, and affordable!! We were extremely pleased with the service and will def call him if we need any other window repairs!",
  ),
  googleReview(
    "Travis Dixon",
    "Had a glass shower door installed, did fantastic work and very easy to work with, and communicated every step of the way.",
  ),
  googleReview(
    "William Owens",
    "First very kind respectful. His work was quick but professional experience.",
  ),
  googleReview(
    "JOSEPH PETRILLI",
    "Professional, quality service. Fixed my problem window and made time to do it right. Had a large job to get to but didn't rush through the job. Outstanding. Thanks!",
  ),
  googleReview(
    "Jeannie Carney",
    "We were extremely pleased with the pergola Doug helped build! Doug was professional, worked hard and completed the job on time. Good attention to detail! Highly recommend!",
  ),
  googleReview(
    "Monique McKenzie",
    "This company installed a frameless shower. The gentleman that runs this business is the ultimate professional. His work is flawless. Beyond that, he installed two glass shelves that I needed which would have cost me a significant amount elsewhere.",
  ),
  googleReview(
    "Kim Payne",
    "He responded quickly to my call and was very flexible with times. He is extremely professional and was so personable and kind. The workmanship is very precise and the damaged area looks like new. I would highly recommend him to anyone.",
  ),
  googleReview(
    "Kristy Compton",
    "Doug did an AMAZING job!! Very meticulous and made sure it was done right. Will definitely use again and highly recommend.",
  ),
  googleReview(
    "Jyotirmoy Banerjee",
    "Doug did a great job repairing our pocket door. He was very professional and took time to make sure that it worked properly.",
  ),
  googleReview(
    "Airy McDaniel",
    "I wish I could figure out how to provide before/after images of the work. He was great, professional, and on time! I will definitely contact Glass and Door Pro in the future! He made my door look like it's brand new.",
  ),
  googleReview(
    "Sanjay Balakrishnan",
    "Doug was awesome. He was very professional at his service. All communications are clear and recorded using his business apps. I was not in town and was a little reluctant to let someone do the job in my absence, but Doug kept me updated throughout.",
  ),
  googleReview(
    "Carla West",
    "Doug was great to work with. He was very professional, did a thorough job and even took the time to explain what he was fixing and how to care for the window afterwards. He did a great job of communicating with me.",
  ),
  googleReview(
    "Michelle Jones",
    "Doug was great from beginning to end! He kept and maintained communication from beginning to end. Instead of replacing a door, he was able to repair it and fix a leak problem with the door. Great work.",
  ),
  googleReview(
    "Jennifer Barber",
    "He did a very professional job. When he finished the door repair it was not like it was ever broken.",
  ),
  googleReview(
    "Custodio Benitez",
    "Did a great job. I recommend him to anybody that needs a window fix and glass job.",
  ),
  googleReview(
    "Mary Beth Roth",
    "Doug measured and installed a new wall mirror in our main bathroom. He was accurate in his cost and time estimate, careful in his installation, and meticulous in his cleanup. A great job.",
  ),
  googleReview(
    "Robin Whitlock",
    "We had an unfortunate incident happen at our home. However, Doug took care of our old door and window problem quickly. He replaced our flimsy storage room door with a very sturdy, nice replacement door.",
  ),
  googleReview(
    "Tony Hinton",
    "Doug took on a tricky job, shaping laminated safety glass to fit our boat and stuck to his original, very reasonable quote.",
  ),
];

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
        backgroundImageUrl: "/images/glass-door-pro/gallery-shower1-1280w.webp",
        backgroundImageAlt:
          "Frameless glass shower installed by Glass & Door Pro in the Charlotte, NC area",
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
        body: "<p>Welcome to my glass and door installation business, proudly serving the greater Charlotte, North Carolina area. With over 15 years of hands-on experience, I'm dedicated to providing high-quality, personalized solutions for all your glass and door needs.</p><p>Whether you're looking to enhance your home with a custom frameless shower or improve comfort and energy efficiency with new windows or doors, I've got you covered. I handle every project personally, from small repairs to full installations, ensuring each job is completed efficiently, correctly, and with attention to detail.</p>",
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
            description:
              "Custom frameless glass shower enclosures that add luxury and value to any bathroom.",
            link: "/services/frameless-showers",
            buttonText: "Learn More",
          },
          {
            icon: "Grid3X3",
            title: "Window Installation",
            description:
              "Energy-efficient window replacements to enhance your property's comfort and curb appeal.",
            link: "/services/window-installation",
            buttonText: "Learn More",
          },
          {
            icon: "DoorOpen",
            title: "Door Installation",
            description:
              "From entry doors to patio doors, I install options to enhance your home's security and style.",
            link: "/services/door-installation",
            buttonText: "Learn More",
          },
          {
            icon: "Wrench",
            title: "Window Repair",
            description:
              "Fast, reliable window glass repair for broken panes, foggy windows, and seal failures.",
            link: "/services/window-repair",
            buttonText: "Learn More",
          },
          {
            icon: "Building2",
            title: "Commercial Storefront Glass Installation",
            description:
              "Aluminum framing, fixed glass panels, and storefront doors for new construction, tenant buildouts, and commercial renovations.",
            link: "/services/commercial-storefront-glass-installation",
            buttonText: "Learn More",
          },
          {
            icon: "Building2",
            title: "Commercial Storefront Glass Replacement & Repair",
            description:
              "Emergency board-up, broken panel replacement, and storefront glass repair for Charlotte businesses.",
            link: "/services/commercial-storefront-glass-replacement-repair",
            buttonText: "Learn More",
          },
          {
            icon: "DoorOpen",
            title: "Commercial Door Installation",
            description:
              "Aluminum entry doors, glass storefront doors, and complete commercial entrance systems.",
            link: "/services/commercial-door-installation",
            buttonText: "Learn More",
          },
          {
            icon: "Wrench",
            title: "Commercial Door Replacement & Repair",
            description:
              "Broken glass panels, hardware failure, misaligned frames, and worn closers repaired or replaced fast.",
            link: "/services/commercial-door-replacement-repair",
            buttonText: "Learn More",
          },
          {
            icon: "Building2",
            title: "Commercial Window Replacement",
            description: "Apartment and multi-family window replacement with fast mobilization.",
            link: "/services/commercial-window-replacement",
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
        body: "<p>I work closely with my clients to ensure that each installation is tailored to their specific preferences and needs, resulting in a truly unique and beautiful addition to any space.</p><p>With 15+ years of experience, I have the knowledge and equipment necessary to install any type of glass or door, from standard windows and exterior doors to more complex frameless shower enclosures.</p>",
        alignment: "left",
        imageUrl: "/images/glass-door-pro/gallery-door1-1280w.webp",
        imageAlt:
          "Professional entry door installation by Glass & Door Pro serving Monroe and Indian Trail, NC",
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
        items: glassReviewItems.slice(0, 6),
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

const framelessShowerImages = [
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/03.webp",
    alt: "Black frame glass shower enclosure with marble walls and freestanding tub installed by Glass & Door Pro in SouthPark, Charlotte, NC",
    caption: "Frameless Shower Install - SouthPark",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/01.webp",
    alt: "Frameless glass shower enclosure with marble walls and built-in bench installed by Glass & Door Pro in Myers Park, Charlotte, NC",
    caption: "Frameless Shower Install - Myers Park",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/06.webp",
    alt: "Corner frameless shower with gold hardware and blue accent walls installed by Glass & Door Pro in Weddington, NC",
    caption: "Frameless Shower Install - Weddington",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/09.webp",
    alt: "Sliding frameless shower door with marble walls and patterned floor installed by Glass & Door Pro in Waxhaw, NC",
    caption: "Frameless Shower Install - Waxhaw",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/02.webp",
    alt: "Modern frameless shower with barn door hardware and wood ceiling installed by Glass & Door Pro in Dilworth, Charlotte, NC",
    caption: "Frameless Shower Install - Dilworth",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/08.webp",
    alt: "Large frameless shower enclosure with dual shower heads installed by Glass & Door Pro in Marvin, NC near Monroe",
    caption: "Frameless Shower Install - Marvin",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/05.webp",
    alt: "Black frame shower door with dark tile and modern hardware installed by Glass & Door Pro in Plaza Midwood, Charlotte, NC",
    caption: "Frameless Shower Install - Plaza Midwood",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/12.webp",
    alt: "Frameless sliding shower door with gold hardware and wood vanity installed by Glass & Door Pro in Matthews, NC",
    caption: "Frameless Shower Install - Matthews",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/04.webp",
    alt: "Corner frameless shower with gold hardware and blue tile floor installed by Glass & Door Pro in Ballantyne, Charlotte, NC",
    caption: "Frameless Shower Install - Ballantyne",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/07.webp",
    alt: "Frameless glass shower with gray subway tile and half wall installed by Glass & Door Pro in the Lake Norman area, NC",
    caption: "Frameless Shower Install - Lake Norman",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/10.webp",
    alt: "Frameless glass shower enclosure with patterned floor tile installed by Glass & Door Pro in Fort Mill, SC near Charlotte",
    caption: "Frameless Shower Install - Fort Mill",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/13.webp",
    alt: "Frameless glass shower enclosure with marble tile and black hardware installed by Glass & Door Pro",
    caption: "Frameless Shower Install - Marble Bath",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/14.webp",
    alt: "Frameless sliding shower glass enclosure installed by Glass & Door Pro",
    caption: "Frameless Shower Install - Sliding Glass",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/15.webp",
    alt: "Skylit bathroom with frameless shower glass installed by Glass & Door Pro",
    caption: "Frameless Shower Install - Skylit Bath",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/16.webp",
    alt: "Frameless shower glass enclosure with herringbone tile installed by Glass & Door Pro",
    caption: "Frameless Shower Install - Herringbone Tile",
  },
  {
    url: "/images/glass-door-pro/gallery/frameless-showers/17.webp",
    alt: "Frameless glass shower enclosure with bench installed by Glass & Door Pro",
    caption: "Frameless Shower Install - Bench Shower",
  },
];

const windowGalleryImages = [
  {
    url: "/images/glass-door-pro/gallery/windows/01.webp",
    alt: "Residential double window installation by Glass & Door Pro",
    caption: "Residential Window Installation - Double Window",
  },
  {
    url: "/images/glass-door-pro/gallery/windows/02.webp",
    alt: "Residential single window installation by Glass & Door Pro",
    caption: "Residential Window Installation - Single Window",
  },
  {
    url: "/images/glass-door-pro/gallery/windows/03.webp",
    alt: "Exterior residential window installation by Glass & Door Pro",
    caption: "Residential Window Installation - Exterior Windows",
  },
  {
    url: "/images/glass-door-pro/gallery/windows/04.webp",
    alt: "Multi-window residential installation project by Glass & Door Pro",
    caption: "Residential Window Installation - Multi-Window Project",
  },
  {
    url: "/images/glass-door-pro/gallery/windows/05.webp",
    alt: "Finished residential exterior window installation by Glass & Door Pro",
    caption: "Residential Window Installation - Finished Exterior",
  },
  {
    url: "/images/glass-door-pro/gallery/windows/06.webp",
    alt: "Insulated window replacement viewed from inside by Glass & Door Pro",
    caption: "Insulated Window Replacement - Interior",
  },
  {
    url: "/images/glass-door-pro/gallery/windows/07.webp",
    alt: "Insulated window replacement with ladder and tools by Glass & Door Pro",
    caption: "Insulated Window Replacement - Ladder Setup",
  },
  {
    url: "/images/glass-door-pro/gallery/windows/08.webp",
    alt: "Exterior insulated window replacement by Glass & Door Pro",
    caption: "Insulated Window Replacement - Exterior",
  },
  {
    url: "/images/glass-door-pro/gallery/windows/09.webp",
    alt: "Window replacement service with on-site glass work by Glass & Door Pro",
    caption: "Window Replacement Service - On-Site Glass Work",
  },
];

const doorGalleryImages = [
  {
    url: "/images/glass-door-pro/gallery/doors/01.webp",
    alt: "Decorative entry door installation by Glass & Door Pro",
    caption: "Decorative Entry Door Installation",
  },
  {
    url: "/images/glass-door-pro/gallery/doors/02.webp",
    alt: "Glass entry door installation by Glass & Door Pro",
    caption: "Glass Entry Door Installation",
  },
  {
    url: "/images/glass-door-pro/gallery/doors/03.webp",
    alt: "Glass door replacement in Cornelius by Glass & Door Pro",
    caption: "Glass Door Replacement - Cornelius",
  },
  {
    url: "/images/glass-door-pro/gallery/doors/04.webp",
    alt: "Luxury pivot door installation by Glass & Door Pro",
    caption: "Luxury Pivot Door Installation",
  },
];

const commercialGlassGalleryImages = [
  {
    url: "/images/glass-door-pro/gallery/commercial-glass/01.webp",
    alt: "Commercial office glass conference room installed by Glass & Door Pro",
    caption: "Commercial Office Glass Conference Room",
  },
  {
    url: "/images/glass-door-pro/gallery/commercial-glass/02.webp",
    alt: "Commercial glass entry doors installed by Glass & Door Pro",
    caption: "Commercial Glass Entry Doors",
  },
  {
    url: "/images/glass-door-pro/gallery/commercial-glass/04.webp",
    alt: "Commercial window replacement in Charlotte by Glass & Door Pro",
    caption: "Commercial Window Replacement - Charlotte",
  },
  {
    url: "/images/glass-door-pro/gallery/commercial-glass/05.webp",
    alt: "Commercial window installation in Charlotte by Glass & Door Pro",
    caption: "Commercial Window Installation - Charlotte",
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
          buttonText: `${framelessShowerImages.length} Photos`,
        },
        {
          icon: "Grid3X3",
          title: "Windows",
          description: "Residential projects",
          link: "#windows",
          buttonText: `${windowGalleryImages.length} Photos`,
        },
        {
          icon: "DoorOpen",
          title: "Doors",
          description: "Entry and glass doors",
          link: "#doors",
          buttonText: `${doorGalleryImages.length} Photos`,
        },
        {
          icon: "Building2",
          title: "Commercial Glass",
          description: "Business glass projects",
          link: "#commercial-glass",
          buttonText: `${commercialGlassGalleryImages.length} Photos`,
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
      images: framelessShowerImages,
    }),
    block("image-grid", {
      anchorId: "windows",
      title: "Windows",
      subtitle: "Residential installation projects",
      columns: "3",
      gap: "lg",
      variant: "project-gallery",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
      images: windowGalleryImages,
    }),
    block("image-grid", {
      anchorId: "doors",
      title: "Doors",
      subtitle: "Entry and exterior glass door projects",
      columns: "3",
      gap: "lg",
      variant: "project-gallery",
      sectionBackgroundColor: "#f8fafc",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
      images: doorGalleryImages,
    }),
    block("image-grid", {
      anchorId: "commercial-glass",
      title: "Commercial Glass",
      subtitle: "Office, storefront, and entry glass projects",
      columns: "3",
      gap: "lg",
      variant: "project-gallery",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
      images: commercialGlassGalleryImages,
    }),
    serviceCtaBlock(
      "Ready to Start Your Project?",
      "See something you like? Tell us about your glass, shower, window, door, or commercial project and Doug will follow up with next steps.",
    ),
  ],
};

const glassReviewsContent: InsertCmsPage["content"] = {
  blocks: [
    block("hero", {
      anchorId: "reviews-hero",
      variant: "glass-reviews",
      layout: "stacked",
      badge: "Customer Reviews",
      heading: "What Charlotte Customers Say About Glass & Door Pro",
      subheading:
        "<p>Real feedback from homeowners and businesses who trusted Doug for showers, windows, doors, repairs, and commercial glass.</p>",
      ctaText: "Read all reviews on Google",
      ctaAction: "custom-link",
      ctaLink: "https://share.google/XGkNPblei2YGTC8FB",
      ctaOpenInNewTab: true,
      ctaSecondaryText: "Request a Free Estimate",
      ctaSecondaryAction: "form-modal",
      ctaSecondaryFormSlug: "contact-form",
      ctaSecondaryModalTitle: "Request a Free Estimate",
      ctaSecondaryModalDescription:
        "Share a few project details and Doug will follow up with next steps.",
      backgroundImageUrl: "/images/glass-door-pro/reviews-hero-1920w.webp",
      overlayColor: "#0f172a",
      overlayOpacity: 18,
      minHeight: "660",
      backgroundPositionX: 50,
      backgroundPositionY: 46,
    }),
    block("testimonials", {
      anchorId: "reviews",
      title: "Latest Google Reviews",
      subtitle: "Newest first from the Glass & Door Pro Google Business Profile.",
      variant: "google-carousel",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "md",
      sectionPaddingBottom: "lg",
      items: glassReviewItems,
    }),
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

const linkedServiceAreaContent =
  '<p>We serve homeowners and businesses throughout the greater Charlotte metro area, including: <a href="/service-areas/charlotte">Charlotte</a>, <a href="/service-areas/monroe">Monroe</a>, <a href="/service-areas/indian-trail">Indian Trail</a>, <a href="/service-areas/stallings">Stallings</a>, <a href="/service-areas/wesley-chapel">Wesley Chapel</a>, <a href="/service-areas/waxhaw">Waxhaw</a>, <a href="/service-areas/matthews">Matthews</a>, <a href="/service-areas/weddington">Weddington</a>, <a href="/service-areas/pineville">Pineville</a>, <a href="/service-areas/fort-mill">Fort Mill</a>, <a href="/service-areas/indian-land">Indian Land</a>, and surrounding areas.</p>';

const commercialLinkedServiceAreaContent =
  '<p>We serve businesses, property managers, general contractors, and commercial facilities throughout the greater Charlotte metro area, including <a href="/service-areas/charlotte">Charlotte</a>, <a href="/service-areas/matthews">Matthews</a>, <a href="/service-areas/indian-trail">Indian Trail</a>, <a href="/service-areas/monroe">Monroe</a>, <a href="/service-areas/waxhaw">Waxhaw</a>, <a href="/service-areas/fort-mill">Fort Mill</a>, <a href="/service-areas/indian-land">Indian Land</a>, <a href="/service-areas/pineville">Pineville</a>, <a href="/service-areas/weddington">Weddington</a>, <a href="/service-areas/wesley-chapel">Wesley Chapel</a>, <a href="/service-areas/stallings">Stallings</a>, and surrounding areas.</p>';

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
  imageAlt?: string;
  imagePositionY?: number;
  primaryText?: string;
  primaryAction?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryAction?: string;
  secondaryLink?: string;
  secondaryFormSlug?: string;
  secondaryModalTitle?: string;
  secondaryModalDescription?: string;
}) {
  return block("hero", {
    variant: "glass-service",
    layout: "split",
    heading: props.heading,
    subheading: `<p>${props.subheading}</p>`,
    ctaText: props.primaryText ?? "Request a Free Quote",
    ctaAction: props.primaryAction ?? "form-modal",
    ctaLink: props.primaryLink ?? "",
    ctaFormSlug: "contact-form",
    ctaModalTitle: "Request a Free Quote",
    ctaModalDescription:
      "Tell us a little about your project and Doug will follow up with next steps.",
    ctaSecondaryText: props.secondaryText ?? "Call (704) 771-6111",
    ctaSecondaryLink: props.secondaryLink ?? "tel:+17047716111",
    ctaSecondaryAction: props.secondaryAction ?? "custom-link",
    ctaSecondaryFormSlug: props.secondaryFormSlug,
    ctaSecondaryModalTitle: props.secondaryModalTitle,
    ctaSecondaryModalDescription: props.secondaryModalDescription,
    backgroundImageUrl: props.imageUrl,
    backgroundImageAlt: props.imageAlt ?? props.heading,
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

function serviceAreaBlock(content = linkedServiceAreaContent) {
  return block("rich-text", {
    title: "Serving the Greater Charlotte Area",
    alignment: "center",
    content,
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

function quoteCtaBlock(
  heading: string,
  body: string,
  footerLine: string,
  options: { primaryAction?: string; primaryLink?: string } = {},
) {
  return block("cta", {
    variant: "glass-service",
    heading,
    subheading: `<p>${body}</p><p><strong>${footerLine}</strong></p>`,
    primaryText: "Get Your Free Estimate",
    primaryAction: options.primaryAction ?? "form-modal",
    primaryLink: options.primaryLink,
    primaryFormSlug: "contact-form",
    primaryModalTitle: "Request a Free Estimate",
    primaryModalDescription: "Share a few project details and Doug will follow up with next steps.",
    secondaryText: "Call (704) 771-6111",
    secondaryAction: "custom-link",
    secondaryLink: "tel:+17047716111",
  });
}

const residentialServiceLinks = [
  {
    label: "Frameless Showers",
    description: "Custom frameless glass shower doors and enclosures.",
    url: "/services/frameless-showers",
  },
  {
    label: "Window Installation",
    description: "For whole-bathroom or whole-home remodels.",
    url: "/services/window-installation",
  },
  {
    label: "Door Installation",
    description: "Entry, patio, and interior doors.",
    url: "/services/door-installation",
  },
  {
    label: "Window Repair",
    description: "Foggy glass, broken panes, seal failures, and hardware.",
    url: "/services/window-repair",
  },
];

function relatedServicesBlock(currentUrl = "/services/frameless-showers") {
  return block("link-list", {
    title: "Related Services",
    columns: "1",
    sectionBackgroundColor: "#ffffff",
    sectionPaddingTop: "md",
    sectionPaddingBottom: "md",
    links: residentialServiceLinks.filter((link) => link.url !== currentUrl),
  });
}

const commercialServiceLinks = [
  {
    label: "Commercial Storefront Glass Installation",
    description:
      "Aluminum framing, fixed glass panels, and storefront doors for new construction, tenant buildouts, and commercial renovations.",
    url: "/services/commercial-storefront-glass-installation",
  },
  {
    label: "Commercial Storefront Glass Replacement & Repair",
    description:
      "Emergency board-up, broken panel replacement, and storefront glass repair for Charlotte businesses.",
    url: "/services/commercial-storefront-glass-replacement-repair",
  },
  {
    label: "Commercial Door Installation",
    description:
      "Aluminum entry doors, glass storefront doors, and complete commercial entrance systems.",
    url: "/services/commercial-door-installation",
  },
  {
    label: "Commercial Door Replacement & Repair",
    description:
      "Broken glass panels, hardware failure, misaligned frames, and worn closers repaired or replaced fast.",
    url: "/services/commercial-door-replacement-repair",
  },
  {
    label: "Commercial Window Replacement",
    description: "Apartment and multi-family window replacement with fast mobilization.",
    url: "/services/commercial-window-replacement",
  },
];

function relatedCommercialServicesBlock(currentUrl: string) {
  return block("link-list", {
    title: "Related Commercial Services",
    subtitle:
      "More commercial glass, storefront, door, and window services for Charlotte businesses.",
    columns: "2",
    sectionBackgroundColor: "#ffffff",
    sectionPaddingTop: "md",
    sectionPaddingBottom: "md",
    links: commercialServiceLinks.filter((link) => link.url !== currentUrl),
  });
}

const month1FramelessContent: InsertCmsPage["content"] = {
  blocks: [
    serviceHero({
      heading: "Frameless Glass Shower Doors in Charlotte, Monroe & Surrounding NC",
      subheading:
        "Custom frameless shower enclosures, measured, fabricated, and installed personally by Doug — owner-operator with 15+ years of experience. Serving Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and the surrounding greater Charlotte area.",
      imageUrl: "/images/glass-door-pro/modern-frameless-shower-hero-1920x1080.webp",
      imageAlt: "Frameless glass shower door installed in a Charlotte area bathroom",
      imagePositionY: 25,
    }),
    block("rich-text", {
      title: "",
      alignment: "left",
      content:
        "<p>A frameless shower is one of the highest-impact upgrades you can make to a bathroom. It opens up the space visually, shows off your tile, simplifies cleaning, and adds real resale value. But the difference between a frameless shower that looks breathtaking and one that looks ordinary comes down to how it's measured, fabricated, and installed.</p><p>I've been installing frameless shower doors across the Charlotte metro for over 15 years. Every shower is custom — measured to your specific bathroom, fabricated from heavy tempered safety glass, and installed by me personally with no subcontractors. That's how we get plumb hinges, even reveals, and a clean, water-tight seal every time.</p>",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "md",
    }),
    cardsGrid({
      title: "Why Choose Frameless Shower Doors?",
      columns: "3",
      cards: [
        {
          icon: "Star",
          title: "Modern Elegance",
          description:
            "Without bulky metal frames, the bathroom reads larger and more open. The tile, stone, and hardware you invested in become the focal point.",
        },
        {
          icon: "ShieldCheck",
          title: "Premium Quality",
          description:
            'We use heavy 3/8" or 1/2" tempered safety glass paired with commercial-grade hinges, clamps, and clips.',
        },
        {
          icon: "Droplets",
          title: "Easy to Clean",
          description:
            "No metal frames means no hidden tracks where soap, mold, and mildew collect. A weekly wipe-down keeps the glass clear.",
        },
        {
          icon: "CheckCircle",
          title: "Custom Fit",
          description:
            "Every shower is measured in person and glass is cut to your exact opening, which is why frameless installations look seamless.",
        },
        {
          icon: "BadgeCheck",
          title: "Increases Home Value",
          description:
            "A frameless shower is one of the most-requested features Charlotte-area buyers look for.",
        },
        {
          icon: "Wrench",
          title: "Personal Installation",
          description:
            "Doug personally handles every installation, from first measurement to final walkthrough.",
        },
      ],
    }),
    block("rich-text", {
      title: "Frameless vs. Semi-Frameless: Which Is Right for You?",
      alignment: "left",
      content:
        "<p>Almost every homeowner who calls us asks about the difference. Both are good products — the right choice depends on budget, the look you want, and how the shower opening is built.</p><h3>Fully Frameless</h3><p>No metal framing at all. Heavy 3/8&quot; or 1/2&quot; tempered glass is held by hinges and clamps attached directly to the wall studs, or to a header bar in some configurations. The look is the cleanest possible — pure glass and minimal hardware. Cleaning is easiest because there are no horizontal tracks for water and soap to collect in.</p><h3>Semi-Frameless</h3><p>Uses a lightweight metal channel around the door edge while the rest of the enclosure stays frameless. Glass is typically 3/16&quot; or 1/4&quot; — thinner than full frameless. Semi-frameless is a real cost saver and the look is still modern, just not as clean as fully frameless.</p><h3>Which to choose</h3><p>If budget is the priority and you want a modern look, semi-frameless is a strong choice. If you want the highest-end look, the easiest long-term cleaning, and the best resale impact, fully frameless is worth the difference. We install both, and I'll give you an honest read during the in-home consultation.</p>",
      sectionBackgroundColor: "#f8fafc",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
    }),
    block("rich-text", {
      title: 'Glass Thickness: 3/8" vs. 1/2"',
      alignment: "left",
      content:
        "<p>Both 3/8&quot; and 1/2&quot; glass are tempered to the same safety standards. The difference is weight, feel, and visual presence.</p><h3>3/8&quot; Tempered Glass — Our Standard</h3><p>3/8&quot; is what we install on most frameless showers. It's structurally excellent for typical residential enclosures, the panels are easier to handle, and most hardware finishes are designed around it. For 90%+ of bathrooms in the Charlotte area, 3/8&quot; is the right call.</p><h3>1/2&quot; Tempered Glass — Upgrade Option</h3><p>1/2&quot; is the premium choice. The glass has a noticeably more substantial feel — the door swings with more weight and the panels look more solid. It's the right choice for unusually large panels, oversized doors, or a true statement bathroom.</p><h3>What we recommend</h3><p>For a typical 60&quot; alcove or corner shower, 3/8&quot; is the right balance of quality and value. For showers with panels over 36&quot; wide, doors over 30&quot; wide, or for anyone building a true statement bathroom, 1/2&quot; is worth the upgrade.</p>",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
    }),
    block("rich-text", {
      title: "Standard Clear vs. Low-Iron Glass",
      alignment: "left",
      content:
        "<p>Standard tempered glass has a slight green tint that comes from its iron content. In a 3/8&quot; or 1/2&quot; panel, you mostly notice it on the polished edges and at the corners. The face of the glass looks mostly clear from across the bathroom but slightly cool-toned up close.</p><p>Low-iron glass has that iron removed during manufacturing. Edges look truly colorless. Whites stay white. Marble veining, mosaic tile, and natural stone behind the glass show their true color instead of being slightly tinted.</p><p>Low-iron is worth it if your shower features statement tile, natural stone, or any white or off-white surface where color accuracy matters. If you're using gray, dark, or muted tile, standard tempered is usually fine.</p>",
      sectionBackgroundColor: "#f8fafc",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
    }),
    block("rich-text", {
      title: "Hardware Finishes",
      alignment: "left",
      content:
        "<p>Hardware is where a frameless shower expresses style. We carry every common finish and will walk you through the options during your in-home consultation.</p><ul><li><strong>Chrome</strong> — the timeless choice. Bright, easy to match with most plumbing fixtures.</li><li><strong>Brushed Nickel</strong> — warmer than chrome, hides water spots better, the most forgiving in daily use.</li><li><strong>Matte Black</strong> — dramatic, modern, and pairs beautifully with white and gray tile.</li><li><strong>Oil-Rubbed Bronze</strong> — warm and traditional. A natural fit for craftsman and transitional homes.</li><li><strong>Polished Gold &amp; Brushed Gold</strong> — popular in Wesley Chapel and Waxhaw new construction.</li><li><strong>Polished Brass</strong> — period-appropriate for older Charlotte homes and historic Dilworth or Myers Park renovations.</li></ul><p>Whichever finish you choose, make sure all the bathroom hardware is in the same finish — or intentionally contrasting. We'll help you think it through.</p>",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
    }),
    block("rich-text", {
      title: "Common Frameless Shower Configurations",
      alignment: "left",
      content:
        "<p>Every bathroom is different, but most frameless installations fall into one of these configurations.</p><h3>Single Panel (Walk-In)</h3><p>A single fixed panel of glass, no door. The cleanest look possible.</p><h3>In-Line</h3><p>A swinging or sliding door plus a fixed stationary panel, all in a straight line. The most common configuration in standard alcove showers.</p><h3>90-Degree Corner</h3><p>Two panels of glass meeting at a corner, with a door in one of them.</p><h3>Neo-Angle</h3><p>A three-panel enclosure that fits a corner shower with an angled front. Common in smaller bathrooms.</p><h3>Steam Shower Enclosures</h3><p>A fully sealed enclosure with a transom panel above the door, designed to contain steam.</p><h3>Tub Splash Panels</h3><p>A single fixed glass panel mounted to a tub deck, replacing a shower curtain.</p>",
      sectionBackgroundColor: "#f8fafc",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
    }),
    galleryBlock("Our Frameless Shower Work", [
      {
        url: "/images/glass-door-pro/gallery-shower1-1280w.webp",
        alt: "Custom frameless glass shower enclosure installed by Glass and Door Pro in a Charlotte, NC area home",
      },
      {
        url: "/images/glass-door-pro/gallery-shower2-1280w.webp",
        alt: "Modern frameless shower door with gold hardware fixtures installed in Monroe, NC",
      },
      {
        url: "/images/glass-door-pro/gallery/frameless-showers/03.webp",
        alt: "Frameless shower glass installation by Glass and Door Pro",
      },
    ]),
    processCards("Our Process", [
      {
        title: "Free Consultation",
        description:
          "We come out to your home, look at the bathroom, and walk through the configuration, glass, and finish options with you.",
      },
      {
        title: "Precise Measurement",
        description:
          "Once you approve the quote, we take detailed measurements after tile and rough-in are complete.",
      },
      {
        title: "Custom Fabrication",
        description:
          "Your glass is cut to spec and the edges polished by the fabricator, typically in 1-2 weeks.",
      },
      {
        title: "Expert Installation",
        description:
          "Doug personally installs every shower, seals it, checks alignment, and walks you through care and maintenance.",
      },
    ]),
    block("rich-text", {
      title: "Caring for Your Frameless Shower",
      alignment: "left",
      content:
        "<p>A frameless shower needs less maintenance than a framed one because there are no tracks where soap and mildew collect. A few habits will keep it looking new for decades:</p><ul><li><strong>Squeegee after every shower.</strong> The single most important habit. It takes 20 seconds and prevents almost all hard-water spotting.</li><li><strong>Clean weekly with a non-abrasive glass cleaner.</strong> Anything safe for car windows is safe for shower glass. Avoid abrasive scrubbers.</li><li><strong>Skip vinegar and ammonia</strong> if your glass has a protective coating because they can degrade it.</li><li><strong>Ask about hydrophobic coatings.</strong> Factory-applied hydrophobic coatings can be ordered through the glass manufacturer at the time of fabrication.</li></ul>",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
    }),
    faqBlock([
      {
        question: "How long does a frameless shower door installation take?",
        answer:
          "<p>Most frameless shower installations are completed in 2-4 hours once the glass is on site. The full process from first call to finished shower typically runs 2-3 weeks because custom glass has to be measured, ordered, and fabricated. We confirm a target install date the day we measure.</p>",
      },
      {
        question: "What thickness of glass do you use for frameless showers?",
        answer:
          '<p>We use 3/8" or 1/2" tempered safety glass. 3/8" is our standard and works beautifully for most enclosures. 1/2" is an upgrade option for larger panels, heavier doors, or homeowners who want the most substantial look and feel. Both are tempered to the same safety standards.</p>',
      },
      {
        question: "What's the difference between frameless and semi-frameless shower doors?",
        answer:
          '<p>Semi-frameless doors use a thin metal frame around the door edge, with the surrounding panels frameless. They cost less and are a solid option. Fully frameless uses no edge framing at all — heavier 3/8" or 1/2" glass attached with minimal hardware and clips. The look is cleaner, the cleaning is easier, and the resale value tends to be higher.</p>',
      },
      {
        question: "Do you offer different hardware finishes?",
        answer:
          "<p>Yes. We carry chrome, brushed nickel, matte black, oil-rubbed bronze, gold, brushed gold, and polished brass. Matte black and brushed gold have been the most popular finishes the last couple of years. We'll walk through the options with you during the in-home consultation and help you choose a finish that complements the rest of your bathroom hardware.</p>",
      },
      {
        question: "What is low-iron glass and is it worth the upgrade?",
        answer:
          "<p>Standard tempered glass has a slight green tint from its iron content — you mostly notice it on the edges and in thicker panels. Low-iron glass removes that tint, so the glass looks truly clear and the tile colors behind it look accurate. It costs more, but for showers featuring statement tile or natural stone, most homeowners feel it's worth it.</p>",
      },
      {
        question: "How do I clean and maintain my frameless shower?",
        answer:
          "<p>Squeegee the glass after each use — that single habit prevents most water-spot buildup. For weekly cleaning, use a non-abrasive glass cleaner. Avoid anything with vinegar or ammonia if you have a protective coating applied. Hydrophobic glass coatings can be ordered factory-applied through the glass manufacturer at the time of fabrication, which helps water sheet off and significantly reduces maintenance.</p>",
      },
      {
        question: "What configurations of frameless shower doors do you install?",
        answer:
          "<p>We install every configuration: single-panel walk-ins, in-line layouts, 90-degree corner enclosures, neo-angle showers, fixed splash panels for tubs, and steam shower enclosures with sealed transoms. Every installation is measured and fabricated specifically for your bathroom — nothing is off-the-shelf.</p>",
      },
      {
        question: "What areas do you serve for frameless shower installation?",
        answer:
          "<p>Glass and Door Pro serves the greater Charlotte metro area including Charlotte, Matthews, Mint Hill, Monroe, Pineville, Huntersville, Cornelius, Davidson, Concord, Tega Cay, Waxhaw, Weddington, Wesley Chapel, Indian Trail, Stallings, Fort Mill, Indian Land, Rock Hill, and surrounding areas. We're based in Monroe, NC.</p>",
      },
    ]),
    block("rich-text", {
      title: "Serving the Greater Charlotte Area",
      alignment: "center",
      content:
        '<p>We serve homeowners and businesses throughout the greater Charlotte metro area, including: <a href="/service-areas/charlotte">Charlotte</a>, <a href="/service-areas/monroe">Monroe</a>, <a href="/service-areas/indian-trail">Indian Trail</a>, <a href="/service-areas/stallings">Stallings</a>, <a href="/service-areas/wesley-chapel">Wesley Chapel</a>, <a href="/service-areas/waxhaw">Waxhaw</a>, <a href="/service-areas/matthews">Matthews</a>, <a href="/service-areas/weddington">Weddington</a>, <a href="/service-areas/pineville">Pineville</a>, <a href="/service-areas/fort-mill">Fort Mill</a>, <a href="/service-areas/indian-land">Indian Land</a>, and surrounding areas.</p>',
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "md",
      sectionPaddingBottom: "md",
    }),
    relatedServicesBlock(),
    quoteCtaBlock(
      "Ready to Transform Your Bathroom?",
      "Get a free quote for your custom frameless shower installation. Doug will come out personally, look at your bathroom, and give you a clear written estimate the same visit.",
      "Mon–Sat: 7am – 6pm | Saturday appointments available",
    ),
  ],
};

function servicePageContent(props: {
  hero: {
    heading: string;
    subheading: string;
    imageUrl: string;
    imagePositionY?: number;
    primaryText?: string;
    primaryAction?: string;
    primaryLink?: string;
    secondaryText?: string;
    secondaryAction?: string;
    secondaryLink?: string;
    secondaryFormSlug?: string;
    secondaryModalTitle?: string;
    secondaryModalDescription?: string;
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

function expandedServicePageContent(props: {
  hero: {
    heading: string;
    subheading: string;
    imageUrl: string;
    imageAlt?: string;
    imagePositionY?: number;
    primaryText?: string;
    primaryAction?: string;
    primaryLink?: string;
    secondaryText?: string;
    secondaryAction?: string;
    secondaryLink?: string;
    secondaryFormSlug?: string;
    secondaryModalTitle?: string;
    secondaryModalDescription?: string;
  };
  intro: {
    title: string;
    content: string;
  };
  detailTitle: string;
  detailCards: GlassCard[];
  proseSections: Array<{
    title: string;
    content: string;
    backgroundColor?: string;
  }>;
  benefitsTitle: string;
  benefitsCards: GlassCard[];
  faqTitle: string;
  faqs: GlassFaq[];
  serviceAreaContent?: string;
  relatedServicesUrl?: string;
  relatedCommercialUrl?: string;
  cta: {
    heading: string;
    body: string;
    footerLine: string;
    primaryText?: string;
    primaryAction?: string;
    primaryLink?: string;
    secondaryText?: string;
    secondaryAction?: string;
    secondaryLink?: string;
    secondaryFormSlug?: string;
    secondaryModalTitle?: string;
    secondaryModalDescription?: string;
  };
}): InsertCmsPage["content"] {
  return {
    blocks: [
      serviceHero({
        ...props.hero,
        primaryText: props.hero.primaryText ?? "Request a Free Quote",
        primaryAction: props.hero.primaryAction ?? "form-modal",
        primaryLink: props.hero.primaryLink ?? "",
        secondaryText: props.hero.secondaryText,
        secondaryAction: props.hero.secondaryAction,
        secondaryLink: props.hero.secondaryLink,
        secondaryFormSlug: props.hero.secondaryFormSlug,
        secondaryModalTitle: props.hero.secondaryModalTitle,
        secondaryModalDescription: props.hero.secondaryModalDescription,
      }),
      block("rich-text", {
        title: props.intro.title,
        alignment: "left",
        content: props.intro.content,
        sectionBackgroundColor: "#ffffff",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "lg",
      }),
      cardsGrid({
        title: props.detailTitle,
        cards: props.detailCards,
        columns: "3",
        backgroundColor: "#f8fafc",
      }),
      ...props.proseSections.map((section, index) =>
        block("rich-text", {
          title: section.title,
          alignment: "left",
          content: section.content,
          sectionBackgroundColor:
            section.backgroundColor ?? (index % 2 === 0 ? "#ffffff" : "#f8fafc"),
          sectionPaddingTop: "lg",
          sectionPaddingBottom: "lg",
        }),
      ),
      cardsGrid({
        title: props.benefitsTitle,
        cards: props.benefitsCards,
        columns: "3",
        backgroundColor: "#f8fafc",
      }),
      serviceAreaBlock(props.serviceAreaContent),
      block("faq", {
        title: props.faqTitle,
        sectionBackgroundColor: "#f8fafc",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "lg",
        items: props.faqs,
      }),
      ...(props.relatedCommercialUrl
        ? [relatedCommercialServicesBlock(props.relatedCommercialUrl)]
        : []),
      ...(props.relatedServicesUrl ? [relatedServicesBlock(props.relatedServicesUrl)] : []),
      block("cta", {
        variant: "glass-service",
        heading: props.cta.heading,
        subheading: `<p>${props.cta.body}</p><p><strong>${props.cta.footerLine}</strong></p>`,
        primaryText: props.cta.primaryText ?? "Get Your Free Estimate",
        primaryAction: props.cta.primaryAction ?? "form-modal",
        primaryLink: props.cta.primaryLink ?? "",
        primaryFormSlug: "contact-form",
        primaryModalTitle: "Request a Free Estimate",
        primaryModalDescription:
          "Share a few project details and Doug will follow up with next steps.",
        secondaryText: props.cta.secondaryText ?? "Call (704) 771-6111",
        secondaryAction: props.cta.secondaryAction ?? "custom-link",
        secondaryLink: props.cta.secondaryLink ?? "tel:+17047716111",
        secondaryFormSlug: props.cta.secondaryFormSlug,
        secondaryModalTitle: props.cta.secondaryModalTitle,
        secondaryModalDescription: props.cta.secondaryModalDescription,
      }),
    ],
  };
}

const glassServicesContent: InsertCmsPage["content"] = {
  blocks: [
    serviceHero({
      heading: "Glass and Door Services",
      subheading:
        "Frameless showers, residential windows, door installation, window repair, and commercial glass and door services across Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby communities.",
      imageUrl: "/images/glass-door-pro/gallery-shower1-1280w.webp",
      imageAlt: "Frameless glass shower and home glass services in the Charlotte area",
      imagePositionY: 42,
      primaryText: "Request a Free Quote",
    }),
    cardsGrid({
      title: "Residential Services",
      subtitle: "Choose the residential project type you need help with.",
      columns: "3",
      backgroundColor: "#ffffff",
      cards: [
        {
          icon: "Droplets",
          title: "Frameless Showers",
          description:
            "Custom frameless shower doors and glass enclosures measured and installed personally.",
          link: "/services/frameless-showers",
          buttonText: "View frameless showers",
        },
        {
          icon: "Grid3X3",
          title: "Window Installation",
          description:
            "Residential window installation and replacement for homes across the Charlotte area.",
          link: "/services/window-installation",
          buttonText: "View window installation",
        },
        {
          icon: "DoorOpen",
          title: "Door Installation",
          description:
            "Entry, patio, storm, and exterior door installation with clean fit and finish.",
          link: "/services/door-installation",
          buttonText: "View door installation",
        },
        {
          icon: "Wrench",
          title: "Window Repair",
          description:
            "Broken glass, foggy panes, seal failure, and glass-only replacement when possible.",
          link: "/services/window-repair",
          buttonText: "View window repair",
        },
      ],
    }),
    cardsGrid({
      anchorId: "commercial",
      title: "Commercial Services",
      subtitle: "Choose the commercial project type you need help with.",
      columns: "3",
      backgroundColor: "#ffffff",
      cards: [
        {
          icon: "Building2",
          title: "Commercial Storefront Glass Installation",
          description:
            "Aluminum framing, fixed glass panels, and storefront doors for new construction, tenant buildouts, and commercial renovations.",
          link: "/services/commercial-storefront-glass-installation",
          buttonText: "View commercial storefront glass installation",
        },
        {
          icon: "Building2",
          title: "Commercial Storefront Glass Replacement & Repair",
          description:
            "Emergency board-up, broken panel replacement, and storefront glass repair for Charlotte businesses.",
          link: "/services/commercial-storefront-glass-replacement-repair",
          buttonText: "View commercial storefront glass replacement and repair",
        },
        {
          icon: "DoorOpen",
          title: "Commercial Door Installation",
          description:
            "Aluminum entry doors, glass storefront doors, and complete commercial entrance systems.",
          link: "/services/commercial-door-installation",
          buttonText: "View commercial door installation",
        },
        {
          icon: "Wrench",
          title: "Commercial Door Replacement & Repair",
          description:
            "Broken glass panels, hardware failure, misaligned frames, and worn closers repaired or replaced fast.",
          link: "/services/commercial-door-replacement-repair",
          buttonText: "View commercial door replacement and repair",
        },
        {
          icon: "Building2",
          title: "Commercial Window Replacement",
          description: "Apartment and multi-family window replacement with fast mobilization.",
          link: "/services/commercial-window-replacement",
          buttonText: "View commercial window replacement",
        },
      ],
    }),
    block("rich-text", {
      title: "Owner-Operated Glass and Door Work",
      alignment: "left",
      content:
        "<p>Glass & Door Pro is based in Monroe and serves homeowners and businesses throughout the greater Charlotte area. Doug handles measurements, planning, and installation personally, so you work directly with the person responsible for the finished result.</p><p>Whether you need a custom frameless shower, replacement windows, a better-fitting exterior door, foggy window repair, or commercial glass support, the process starts with a clear in-home or on-site quote.</p>",
      sectionBackgroundColor: "#f8fafc",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
    }),
    quoteCtaBlock(
      "Ready to Get Started?",
      "Call, text, or fill out the form for a free quote. Doug will review the project personally and give you clear next steps.",
      "Mon-Sat: 7am - 6pm | Serving Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby areas",
    ),
  ],
};

const glassServicePages: GlassServicePageSeed[] = [
  {
    title: "Frameless Showers",
    slug: "services-frameless-showers",
    seoTitle: "Frameless Shower Doors Charlotte NC | Glass & Door Pro",
    seoDescription:
      "Custom frameless shower doors installed by Doug with 15+ years of experience. Serving Charlotte, Matthews, Indian Trail, Waxhaw & Monroe.",
    seoKeywords:
      "frameless shower doors Charlotte NC, glass shower installation, custom shower enclosure, shower glass Monroe NC",
    ogImageUrl: "/images/glass-door-pro/modern-frameless-shower-hero-1920x1080.webp",
    content: month1FramelessContent,
  },
  {
    title: "Window Installation",
    slug: "services-window-installation",
    seoTitle:
      "Window Installation in Charlotte & Monroe, NC | Replacement Windows | Glass and Door Pro",
    seoDescription:
      "Professional window installation and replacement for homes across Charlotte, Monroe, Indian Trail, Matthews, and surrounding areas. Owner-operated, honest pricing, same-week appointments. Call (704) 771-6111.",
    seoKeywords:
      "window installation Charlotte NC, window replacement Monroe NC, residential windows, energy efficient windows",
    ogImageUrl: "/images/glass-door-pro/charming-suburban-home-hero-1920x1080.webp",
    content: expandedServicePageContent({
      relatedServicesUrl: "/services/window-installation",
      hero: {
        heading: "Window Installation & Replacement in Charlotte, NC",
        subheading:
          "Residential replacement windows measured, fitted, and installed personally by Doug Adams — owner-operator with 15+ years of experience. Serving Monroe, Charlotte, Indian Trail, Matthews, Waxhaw, and surrounding communities. Same-week appointments available.",
        imageUrl: "/images/glass-door-pro/charming-suburban-home-hero-1920x1080.webp",
        imageAlt: "Suburban home exterior with replacement windows installed",
        imagePositionY: 45,
      },
      intro: {
        title: "Replacement Windows That Actually Fit",
        content:
          "<p>Most window problems come down to one thing: the wrong window in the wrong opening. Gaps around the frame, drafts that won't go away, moisture between panes — these aren't just nuisances, they're signs that installation wasn't done right the first time.</p><p>Glass and Door Pro handles residential window replacement from start to finish. Doug takes the measurements personally, sources the right window for your home's openings, and does the installation himself. There's no subcontractor showing up in an unmarked van. The person who gives you the quote is the person who does the work.</p><p>That matters more than most people realize. A window that fits correctly keeps your home comfortable, lowers energy bills, and doesn't leak. A window that doesn't fit — no matter how good the brand — causes problems within a few years.</p><p>We work with homeowners across the greater Charlotte area replacing single windows, full-room window sets, and whole-home window upgrades. Whether it's one fogged double-pane in a bedroom or every window in a 1990s ranch that's never been updated, this is the kind of work we do every week.</p>",
      },
      detailTitle: "What's Included in Our Window Installation Service",
      detailCards: [
        {
          icon: "Search",
          title: "In-Home Measurement",
          description:
            "Doug measures every opening on-site before ordering anything. Every home is different, and getting accurate measurements upfront is what prevents gaps, air leaks, and callbacks later.",
        },
        {
          icon: "CheckCircle",
          title: "Window Sourcing & Selection",
          description:
            "We help you choose the right window type for each opening — double-hung, casement, sliding, picture, bay — based on your home's style, ventilation needs, and budget. We don't upsell brands you don't need.",
        },
        {
          icon: "Wrench",
          title: "Old Window Removal",
          description:
            "Existing windows are carefully removed and disposed of. We inspect the rough opening and frame condition before installing the replacement so there are no surprises mid-job.",
        },
        {
          icon: "BadgeCheck",
          title: "Professional Installation",
          description:
            "Each window is set level, plumb, and square. Flashing and sealant are applied correctly to prevent water intrusion. Interior and exterior trim is reinstalled clean and tight.",
        },
        {
          icon: "ShieldCheck",
          title: "Energy Efficiency Upgrades",
          description:
            "We install double-pane insulated glass units as standard. If your home has single-pane windows, the upgrade alone will make a noticeable difference in comfort and utility costs.",
        },
        {
          icon: "CheckCircle",
          title: "Cleanup & Walkthrough",
          description:
            "We leave the job site clean and walk you through every window before we pack up. If anything isn't right, we fix it before we leave.",
        },
      ],
      proseSections: [
        {
          title: "Window Types We Install",
          content:
            "<p>Not every window works in every opening. Here's what we regularly install and replace:</p><p><strong>Double-Hung Windows</strong> — The most common window type in the Charlotte area. Both sashes move up and down, making them easy to clean and ventilate. A good all-around choice for most rooms.</p><p><strong>Casement Windows</strong> — Hinged on one side and opened with a crank, casement windows seal tightly when closed and provide excellent ventilation. Popular in kitchens and bathrooms where you want airflow but not a full-open window.</p><p><strong>Sliding Windows</strong> — One sash slides horizontally past the other. A clean, low-profile option that works well in contemporary homes and in openings where a casement or double-hung wouldn't operate easily.</p><p><strong>Picture Windows</strong> — Fixed windows that don't open. Used where the goal is light and view, not ventilation. Often paired with operable windows on either side.</p><p><strong>Bay &amp; Bow Windows</strong> — A set of windows that project outward from the exterior wall, creating a shelf or seating area inside. More involved to install but a dramatic upgrade when done correctly.</p><p><strong>Awning Windows</strong> — Hinged at the top and open outward from the bottom. Good for basements or anywhere you want to leave a window open during light rain.</p><p>If you're not sure what type is right for your opening, we'll walk you through the options during the in-home quote.</p>",
        },
      ],
      benefitsTitle: "Why Charlotte Homeowners Choose Glass and Door Pro for Window Installation",
      benefitsCards: [
        {
          icon: "UserCheck",
          title: "Owner Does the Work",
          description:
            "Doug handles every project personally — measurement, sourcing, and installation. You're not dealing with a franchise or a rotating crew of subcontractors.",
        },
        {
          icon: "BadgeCheck",
          title: "Honest, Itemized Quotes",
          description:
            "We give you a clear written quote before any work begins. No surprise charges after the job is done. No pressure to upgrade to products you don't need.",
        },
        {
          icon: "CheckCircle",
          title: "Correct Fit, Every Time",
          description:
            "We take our own measurements and don't cut corners on the rough opening inspection. Windows that fit correctly from day one don't cause problems later.",
        },
        {
          icon: "Star",
          title: "15+ Years of Experience",
          description:
            "Doug has been installing windows in the Charlotte metro area for over 15 years. He's seen every kind of opening, every kind of problem, and knows how to handle them.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments Available",
          description:
            "Mon–Sat, 7am–6pm. We know most homeowners can't take a weekday off for a window quote, so Saturday appointments are available by default.",
        },
        {
          icon: "MapPin",
          title: "Local, Not a Franchise",
          description:
            "Glass and Door Pro is a Monroe-based, owner-operated business — not a national franchise with local name recognition and distant management. When you call, Doug answers.",
        },
      ],
      faqTitle: "Frequently Asked Questions — Window Installation",
      faqs: [
        {
          question: "How much does window replacement cost in Charlotte, NC?",
          answer:
            "<p>Window replacement costs depend on window size, type, and how many you're replacing. A single standard double-hung replacement typically runs between $400–$800 installed. Full-home window replacements vary significantly based on window count and type. We provide a free, itemized written quote before any work begins so you know exactly what you're paying for.</p>",
        },
        {
          question: "How long does window installation take?",
          answer:
            "<p>A single window replacement usually takes 1–2 hours. A full room or whole-home replacement depends on window count — most whole-home jobs are completed in one day. Doug will give you a realistic time estimate during the quote so you can plan accordingly.</p>",
        },
        {
          question: "Do I need a permit to replace windows in Charlotte or Monroe?",
          answer:
            "<p>For like-for-like window replacements in existing openings, permits are typically not required in Charlotte or Monroe. If you're changing the size of an opening or adding a window where there wasn't one, a permit may be required. We'll advise you on this during the quoting process.</p>",
        },
        {
          question: "What's the difference between window repair and window replacement?",
          answer:
            "<p>Window repair makes sense when the frame and sash are structurally sound but there's a specific problem — a broken sash lock, a failed seal causing fogging, or a damaged grid. Replacement makes more sense when the frame is warped, the window no longer operates correctly, or the window is old enough that energy performance is a concern. We'll give you an honest assessment of which makes more sense for your specific windows.</p>",
        },
        {
          question: "How do I know if my windows need to be replaced?",
          answer:
            "<p>Common signs include fogging or condensation between panes (failed seal), drafts around the frame when windows are closed, difficulty opening or closing, visible rot or damage to the frame, or a noticeable difference in temperature near the window. Any of these are worth having looked at.</p>",
        },
        {
          question: "Do you offer double-pane or energy-efficient windows?",
          answer:
            "<p>Yes — all of our replacement windows are double-pane insulated glass units as standard. If your home has older single-pane windows, replacing them with double-pane units makes a noticeable difference in comfort and energy costs. We can also discuss Low-E glass coatings for homes with significant sun exposure.</p>",
        },
      ],
      cta: {
        heading: "Ready to Replace Your Windows?",
        body: "Call, text, or fill out the form for a free in-home quote. Doug will measure every opening personally and give you a clear, written estimate with no pressure and no surprises.",
        footerLine:
          "Mon–Sat, 7am–6pm | Serving Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby areas",
      },
    }),
  },
  {
    title: "Door Installation",
    slug: "services-door-installation",
    seoTitle:
      "Door Installation in Charlotte & Monroe, NC | Entry, Patio & Storm Doors | Glass and Door Pro",
    seoDescription:
      "Residential door installation for entry doors, patio doors, storm doors, and exterior doors across Charlotte, Monroe, Indian Trail, Matthews, and surrounding areas. Call (704) 771-6111.",
    seoKeywords:
      "door installation Charlotte NC, entry doors Monroe NC, patio door replacement, exterior door installer",
    ogImageUrl: "/images/glass-door-pro/door-hero.webp",
    content: expandedServicePageContent({
      relatedServicesUrl: "/services/door-installation",
      hero: {
        heading: "Door Installation in Charlotte & Monroe, NC",
        subheading:
          "Entry doors, patio doors, storm doors, and exterior doors installed correctly — level, plumb, weather-tight, and operating smoothly from day one. Owner-operated service across Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and surrounding communities.",
        imageUrl: "/images/glass-door-pro/door-hero.webp",
        imageAlt: "Residential exterior door installation for a Charlotte area home",
        imagePositionY: 45,
        primaryAction: "form-modal",
        primaryLink: "",
      },
      intro: {
        title: "Door Installation Done Right the First Time",
        content:
          "<p>A door that doesn't hang correctly causes problems for as long as it's on the house. It sticks in summer, drafts in winter, and puts stress on the frame and hardware every time it's used. Getting the installation right from the start isn't just about appearance — it's about how the door performs for the next 20 years.</p><p>Glass and Door Pro handles residential door installation throughout the greater Charlotte area. Doug takes the measurements, sources the door, and does the installation personally. The result is a door that opens and closes cleanly, seals tightly against the weather, and looks the way it should against your home's exterior.</p><p>We install entry doors, patio doors, storm doors, French doors, and other exterior doors for existing homes. Whether you're replacing a single door that's reached the end of its life, upgrading to a more energy-efficient unit, or improving your home's curb appeal before a sale, this is work we do every week across Monroe, Charlotte, and the surrounding area.</p>",
      },
      detailTitle: "Types of Doors We Install",
      detailCards: [
        {
          icon: "DoorOpen",
          title: "Entry Doors",
          description:
            "Your front door makes the first impression and handles the most use. We install steel, fiberglass, and wood entry doors with proper weatherstripping, threshold seals, and hardware installation. A correctly hung entry door is secure, weather-tight, and opens and closes without effort.",
        },
        {
          icon: "Grid3X3",
          title: "Patio Doors",
          description:
            "Sliding patio doors and hinged patio doors installed level and square, with correct track alignment (for sliding units) and proper clearance and swing (for hinged units). We handle single-panel, double-panel, and multi-panel configurations.",
        },
        {
          icon: "ShieldCheck",
          title: "Storm Doors",
          description:
            "Storm doors add a layer of weather protection and extend the life of your entry door. We install full-view, ventilating, and retractable screen storm doors. Proper alignment is critical — a storm door that doesn't close flush is more of a nuisance than an asset.",
        },
        {
          icon: "CheckCircle",
          title: "French Doors",
          description:
            "Double-door configurations with proper alignment between the two panels, correct astragal placement, and hardware that keeps both doors operating smoothly. French doors are as much about precision as they are about appearance.",
        },
        {
          icon: "DoorOpen",
          title: "Exterior Side Doors & Back Doors",
          description:
            "Garage side doors, back entries, and utility doors installed with the same attention to fit and weatherproofing as a front entry. These doors often get less attention but take significant daily use.",
        },
        {
          icon: "Wrench",
          title: "Door Frame Repair & Replacement",
          description:
            "When a door's frame is damaged — rotted wood, warped framing, damage from forced entry — the frame needs to be repaired or replaced before a new door will hang correctly. We assess and address frame issues as part of the installation process.",
        },
      ],
      proseSections: [
        {
          title: "What's Included in Every Door Installation",
          content:
            "<p>Every door installation we do includes:</p><p><strong>Accurate Measurement</strong> — Doug measures the rough opening and existing frame before anything is ordered. Doors are not one-size-fits-all, and getting the measurements right is what prevents fitting problems at installation.</p><p><strong>Old Door Removal</strong> — The existing door, frame components, and weatherstripping are removed and disposed of. We inspect the rough opening for rot, damage, or framing issues before the new door goes in.</p><p><strong>Proper Shimming &amp; Leveling</strong> — The new door is set level and plumb using shims. This is what ensures the door swings freely, closes completely, and seals correctly against the weatherstripping.</p><p><strong>Weatherstripping &amp; Threshold Seal</strong> — All exterior doors are fitted with proper weatherstripping and threshold seals. This is what keeps air, water, and insects out.</p><p><strong>Hardware Installation</strong> — Locksets, deadbolts, hinges, and door closers installed correctly. We test operation before we leave.</p><p><strong>Interior &amp; Exterior Trim</strong> — Casing and trim reinstalled clean and tight. The finished installation should look like the door has always been there.</p><p><strong>Operational Walkthrough</strong> — We walk you through the door before we pack up. You'll see how it locks, how it swings, and how the weatherstripping engages. If anything isn't right, we fix it on the spot.</p>",
        },
      ],
      benefitsTitle: "Why Charlotte Homeowners Choose Glass and Door Pro for Door Installation",
      benefitsCards: [
        {
          icon: "UserCheck",
          title: "Owner Does Every Installation",
          description:
            "Doug measures, sources, and installs every door himself. There's no crew of subcontractors. The person who quoted the job is the person who shows up.",
        },
        {
          icon: "BadgeCheck",
          title: "Fit and Finish That Lasts",
          description:
            "Doors that aren't hung correctly cause problems for years. We do the job right — level, plumb, weather-tight — so the door performs the way it should long after we leave.",
        },
        {
          icon: "DoorOpen",
          title: "All Exterior Door Types",
          description:
            "Entry doors, patio doors, storm doors, French doors, side doors — we handle the full range of residential exterior door installations, not just one category.",
        },
        {
          icon: "CheckCircle",
          title: "Honest Upfront Quotes",
          description:
            "We quote the full job in writing before any work begins. No surprise charges for disposal, hardware, or trim work.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments Available",
          description:
            "Mon–Sat, 7am–6pm. Door installation doesn't have to wait for a weekday when you can take time off work.",
        },
        {
          icon: "Star",
          title: "15+ Years of Local Experience",
          description:
            "Doug has been hanging doors in the Charlotte metro area for over 15 years. He's installed every door type in every kind of home — from 1960s ranch houses to new construction in the Union County suburbs.",
        },
      ],
      faqTitle: "Frequently Asked Questions — Door Installation",
      faqs: [
        {
          question: "How much does door installation cost in Charlotte, NC?",
          answer:
            "<p>Door installation costs depend on the door type, size, and condition of the existing frame. A standard entry door replacement typically runs $300–$600 for installation labor, not including the door itself. Patio doors and French doors vary based on size and configuration. We provide a free written quote that covers all labor, disposal, and hardware installation so you know the full cost before we start.</p>",
        },
        {
          question: "How long does door installation take?",
          answer:
            "<p>Most single exterior door replacements take 2–4 hours from start to finish, including old door removal, installation, and trim work. Patio door and French door installations can take longer depending on the configuration. Doug will give you a realistic time estimate during the quote.</p>",
        },
        {
          question: "Do I need a permit to replace an exterior door in Charlotte or Monroe?",
          answer:
            "<p>For like-for-like door replacements in existing openings, permits are typically not required. If you're modifying the size of the opening or adding a door where there wasn't one, a permit may be needed. We'll advise you on this during the quoting process.</p>",
        },
        {
          question: "Can you install a door I've already purchased, or do you supply the door?",
          answer:
            "<p>Both. We can supply and install the door, or we can install a door you've already purchased. If you're supplying the door, let us know the brand and model during the quote so we can confirm it's appropriate for your opening and has everything needed for a proper installation.</p>",
        },
        {
          question: "My existing door frame is damaged — can it still be replaced?",
          answer:
            "<p>Possibly. Minor frame damage — soft spots, surface rot, or small areas of deterioration — can often be repaired as part of the installation. Severe rot or structural damage to the rough framing may require more significant repairs first. Doug will assess the frame condition during the quote and give you an honest read on what's involved.</p>",
        },
        {
          question: "What's the difference between a storm door and a screen door?",
          answer:
            "<p>A storm door is a full exterior door with glass panels, typically installed in front of your entry door to add weather protection and insulation. Many storm doors have retractable or interchangeable glass and screen panels so you can switch between full glass in winter and screened ventilation in summer. A screen door provides ventilation without weather protection and is typically lighter-duty. We install both.</p>",
        },
      ],
      cta: {
        heading: "Ready to Install or Replace a Door?",
        body: "Call, text, or fill out the form for a free quote. Doug will measure the opening personally and give you a clear written estimate — no pressure, no surprises.",
        footerLine:
          "Mon–Sat, 7am–6pm | Serving Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby areas",
      },
    }),
  },
  {
    title: "Window Repair",
    slug: "services-window-repair",
    seoTitle:
      "Window Repair in Charlotte & Monroe, NC | Foggy Glass, Broken Seals & More | Glass and Door Pro",
    seoDescription:
      "Window repair for broken seals, foggy panes, failed IGUs, broken hardware, and cracked glass. Serving Charlotte, Monroe, Indian Trail, Matthews, and surrounding areas. Call (704) 771-6111.",
    seoKeywords:
      "window repair Charlotte NC, broken window glass, foggy window repair, seal failure repair, glass replacement",
    ogImageUrl: "/images/glass-door-pro/broken-glass-hero.webp",
    content: expandedServicePageContent({
      relatedServicesUrl: "/services/window-repair",
      hero: {
        heading: "Window Repair in Charlotte & Monroe, NC",
        subheading:
          "Foggy panes, broken seals, failed IGUs, cracked glass, and stuck sashes — fixed without replacing the whole window when possible. Owner-operated service across Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and surrounding areas. Same-week appointments available.",
        imageUrl: "/images/glass-door-pro/broken-glass-hero.webp",
        imageAlt: "Broken window glass ready for repair or replacement",
        imagePositionY: 45,
      },
      intro: {
        title: "Window Repair Before You Commit to Replacement",
        content:
          "<p>A fogged-up window doesn't automatically mean you need a new window. In many cases, the frame and sash are perfectly fine — the only thing that's failed is the insulated glass unit (IGU) inside. Replacing just the glass is faster, less disruptive, and significantly less expensive than full window replacement.</p><p>Glass and Door Pro handles residential window repair throughout the greater Charlotte area. Doug assesses each window honestly — if repair is the right call, we repair it. If the frame is damaged, the window no longer operates correctly, or replacement makes more economic sense, we'll tell you that too. You won't get pushed toward a more expensive option just to pad the ticket.</p><p>Common repair jobs we handle include foggy or cloudy glass caused by seal failure, broken or damaged IGUs, cracked single panes, stuck or difficult-to-operate sashes, broken hardware (locks, cranks, balances), and failed weatherstripping that's letting air in around the frame.</p><p>If you're not sure whether your window can be repaired or needs to be replaced, call us. Doug will take a look and give you a straight answer.</p>",
      },
      detailTitle: "Window Problems We Fix",
      detailCards: [
        {
          icon: "Droplets",
          title: "Foggy & Cloudy Glass (Failed Seal)",
          description:
            "When you see fog, haze, or condensation between the panes of a double-pane window, the seal has failed and the inert gas inside the IGU has been replaced by humid air. We replace the IGU — the glass unit itself — without touching the frame or sash.",
        },
        {
          icon: "XCircle",
          title: "Broken or Cracked Glass",
          description:
            "A cracked pane is a security and energy efficiency problem. We replace cracked single panes and failed insulated units. Glass-only replacement is often possible without removing the entire window.",
        },
        {
          icon: "Wrench",
          title: "Stuck or Hard-to-Operate Sashes",
          description:
            "Windows that won't open, won't close, or take real effort to move are often suffering from worn balance systems, swollen frames, or damaged hardware. We diagnose and fix the specific issue rather than recommending replacement by default.",
        },
        {
          icon: "Wrench",
          title: "Broken Window Hardware",
          description:
            "Sash locks, cam locks, tilt latches, casement cranks, and balance springs all wear out over time. We source and replace hardware to restore proper operation.",
        },
        {
          icon: "ShieldCheck",
          title: "Failed Weatherstripping & Air Leaks",
          description:
            "Drafts around a closed window usually mean the weatherstripping has compressed, cracked, or pulled away. Replacing it is straightforward and makes a real difference in comfort and energy costs.",
        },
        {
          icon: "CheckCircle",
          title: "Broken Window Screens",
          description:
            "Torn, bent, or missing screens replaced with properly fitted new screens. We cut screens to fit and re-screen existing frames when the frame is in good shape.",
        },
      ],
      proseSections: [
        {
          title: "When to Repair — and When to Replace",
          content:
            "<p>Not every window problem requires a full replacement. Here's how we generally think about it:</p><p><strong>Repair usually makes sense when:</strong></p><ul><li>The frame and sash are structurally sound and operate correctly</li><li>The problem is a failed IGU (foggy glass) and the frame has years of life left</li><li>A single piece of hardware has failed (lock, crank, balance spring)</li><li>The weatherstripping has worn but the window itself is in good shape</li><li>You have one or two problem windows in an otherwise functioning set</li></ul><p><strong>Replacement usually makes more sense when:</strong></p><ul><li>The frame is warped, rotted, or structurally compromised</li><li>The window no longer opens, closes, or locks reliably after hardware repairs</li><li>The window is old enough that energy performance is a real concern and repair costs approach replacement costs</li><li>You're updating your home's appearance and want consistent window styles throughout</li></ul><p>We'll give you an honest assessment of which direction makes sense. If repair is viable, we'll repair it. If replacement is the better long-term value, we'll tell you that — and we can handle that too.</p>",
        },
      ],
      benefitsTitle: "Why Homeowners Trust Glass and Door Pro for Window Repair",
      benefitsCards: [
        {
          icon: "BadgeCheck",
          title: "Repair First Mentality",
          description:
            "We don't automatically recommend replacement to increase the ticket. If your window can be repaired properly, we'll repair it and tell you why.",
        },
        {
          icon: "Grid3X3",
          title: "Glass-Only Replacement Available",
          description:
            "When seal failure is the only problem, we can replace the IGU without disturbing the frame — faster, cleaner, and less expensive than full window replacement.",
        },
        {
          icon: "UserCheck",
          title: "Owner Does the Diagnostic",
          description:
            "Doug assesses every repair job himself. You get an honest read on what's actually wrong and what it will take to fix it, not a sales pitch from a subcontractor on commission.",
        },
        {
          icon: "CalendarDays",
          title: "Same-Week Availability",
          description:
            "Window repairs don't have to wait weeks. We typically schedule within a few days, and Saturday appointments are available.",
        },
        {
          icon: "CheckCircle",
          title: "Honest, Upfront Pricing",
          description:
            "We quote the repair before we do it. No surprise invoices after the job is complete.",
        },
        {
          icon: "MapPin",
          title: "Serving the Full Charlotte Metro",
          description:
            "Monroe-based, serving Charlotte, Indian Trail, Matthews, Waxhaw, Weddington, and surrounding communities. No travel surcharges for nearby areas.",
        },
      ],
      faqTitle: "Frequently Asked Questions — Window Repair",
      faqs: [
        {
          question: "Can a foggy window be repaired without replacing the whole window?",
          answer:
            "<p>In most cases, yes. Foggy or cloudy glass is caused by a failed seal in the insulated glass unit (IGU). If the window frame and sash are in good condition, we can replace just the IGU — the glass itself — without touching the frame. This is significantly less expensive than full window replacement and is the right call when the rest of the window is still functional.</p>",
        },
        {
          question: "How much does window repair cost in Charlotte, NC?",
          answer:
            "<p>Window repair costs vary by the type of repair. IGU replacement (for foggy glass) typically runs $150–$350 per window depending on size. Hardware repairs are generally less. We provide a free assessment and written quote before any work begins so you know the cost upfront.</p>",
        },
        {
          question: "How do I know if my window seal has failed?",
          answer:
            "<p>The most obvious sign is fogging, haze, or condensation that appears between the panes and can't be wiped away. You may also notice the window looks streaky or discolored in a way that doesn't clean up. These are all signs the inert gas inside the IGU has escaped and humid air has taken its place.</p>",
        },
        {
          question: "Can you replace just the glass in a window without replacing the frame?",
          answer:
            "<p>Yes, in many cases. If the frame and sash are structurally sound, we can replace the glass unit (IGU) only. This works well for standard rectangular windows with intact frames. We'll assess the window during the quote and let you know if glass-only replacement is viable.</p>",
        },
        {
          question: "My window won't open or close properly — is that repairable?",
          answer:
            "<p>Usually, yes. Stiff or stuck windows are often caused by worn balance systems (in double-hung windows), damaged cranks (in casement windows), or swollen frames. We diagnose the specific issue and repair what's actually broken rather than recommending replacement by default.</p>",
        },
        {
          question: "Do you repair windows on upper floors or hard-to-reach areas?",
          answer:
            "<p>Yes. We work with windows throughout the home, including upper-floor windows. For particularly difficult access situations, Doug will assess during the quote and let you know if any special equipment is needed.</p>",
        },
      ],
      cta: {
        heading: "Have a Window That Needs Attention?",
        body: "Call, text, or fill out the form and Doug will take a look. Most window repair jobs can be diagnosed quickly and scheduled within the same week.",
        footerLine:
          "Mon–Sat, 7am–6pm | Serving Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby areas",
      },
    }),
  },
  {
    title: "Commercial Storefront Glass Installation",
    slug: "services-commercial-storefront-glass-installation",
    seoTitle: "Commercial Storefront Glass Installation in Charlotte, NC | Glass and Door Pro",
    seoDescription:
      "Professional commercial storefront glass installation for new construction and business buildouts in Charlotte, NC. Aluminum framing, glass systems, and storefront doors. Call (704) 771-6111.",
    seoKeywords:
      "commercial storefront glass installation Charlotte NC, aluminum storefront framing, commercial glass doors, tenant buildout glazing",
    ogImageUrl: "/images/glass-door-pro/commercial-hero-1280w.webp",
    content: expandedServicePageContent({
      serviceAreaContent: commercialLinkedServiceAreaContent,
      relatedCommercialUrl: "/services/commercial-storefront-glass-installation",
      hero: {
        heading: "Commercial Storefront Glass Installation in Charlotte, NC",
        subheading:
          "Storefront glass systems, aluminum framing, and commercial glass doors installed for new construction, tenant buildouts, and commercial renovations across Charlotte. Reliable scheduling, clean execution, and a single point of contact from quote through completion.",
        imageUrl: "/images/glass-door-pro/commercial-hero-1280w.webp",
        imageAlt: "Commercial storefront glass installation for a Charlotte business",
        imagePositionY: 50,
        primaryText: "Request a Commercial Quote",
      },
      intro: {
        title: "Storefront Glass Installation That Stays on Your Timeline",
        content:
          "<p>When you're managing a commercial buildout or new construction project in Charlotte, the glazing contractor is one of the variables you can't afford to have go sideways. A missed installation window doesn't just affect one trade — it backs up everything behind it.</p><p>Glass and Door Pro handles commercial storefront glass installation for general contractors, project managers, and business owners across the Charlotte area. Every project is managed personally. When you call to discuss a project, you're talking to the person who will be on site. There's no project manager in the middle, no handoff to a crew you've never met, and no communication gaps between the person who took the measurements and the person doing the installation.</p><p>We install complete storefront glass systems for new commercial construction, tenant buildouts, retail renovations, and commercial property upgrades. That includes aluminum storefront framing, fixed glass panels, glass storefront doors, and entrance systems. Whether you're working on a single retail suite in a strip center, a full commercial renovation, or a new commercial building that needs its exterior glazing package completed, we bring the same attention to detail and schedule reliability to every project.</p><p>For GCs and project managers, working with an owner-operator changes the dynamic. You get direct access to the person accountable for the work — not a dispatcher, not an account manager. If there's a scheduling question, a field condition that needs a decision, or a specification that needs to be confirmed on site, you make one call. That level of responsiveness matters when a job site is moving fast and you need answers now.</p><p>Charlotte's commercial market is active — new retail, restaurant, and office buildouts are happening across the metro, and the demand for reliable commercial glazing contractors who can execute on schedule is real. Glass and Door Pro is positioned to serve that market with the responsiveness and accountability that larger glazing operations can't always deliver.</p>",
      },
      detailTitle: "Commercial Storefront Glass Systems We Install",
      detailCards: [
        {
          icon: "Building2",
          title: "Aluminum Storefront Framing Systems",
          description:
            "The structural backbone of a commercial storefront. We install aluminum framing systems that are properly engineered for the opening, correctly anchored to the building structure, and set square and plumb before any glass goes in. The framing determines how the finished storefront looks and performs — we don't cut corners on it.",
        },
        {
          icon: "Grid3X3",
          title: "Fixed Storefront Glass Panels",
          description:
            "Large fixed glass panels installed in aluminum framing for retail storefronts, restaurants, office lobbies, and commercial facades. Properly set, sealed, and glazed to prevent water intrusion and thermal movement issues over time.",
        },
        {
          icon: "DoorOpen",
          title: "Commercial Glass Storefront Doors",
          description:
            "Aluminum-framed glass doors installed as part of a complete storefront system — single doors, pairs, and multi-door entrance configurations. Correctly hung, properly aligned with the frame, and fitted with commercial-grade hardware that holds up to daily business use.",
        },
        {
          icon: "Wrench",
          title: "Tenant Buildout Glazing",
          description:
            "Interior and exterior glass work for tenant spaces in commercial buildings and strip centers. We work within the constraints of an existing building envelope and coordinate with GCs and property managers to hit lease commencement dates.",
        },
        {
          icon: "BadgeCheck",
          title: "Commercial Renovation Glass",
          description:
            "Replacing or upgrading the glass package on an existing commercial building — new aluminum framing, updated glass panels, modern entrance systems. A storefront renovation changes the appearance of a building significantly and Glass and Door Pro handles the full glazing scope.",
        },
        {
          icon: "Lock",
          title: "Entrance Systems & Hardware",
          description:
            "Door closers, panic hardware, floor pivots, pulls, and locks installed correctly for ADA compliance, security requirements, and daily operational durability. Commercial entrance hardware is specified for load — we use the right hardware for each application.",
        },
      ],
      proseSections: [
        {
          title: "How Glass and Door Pro Works on Commercial Projects",
          content:
            "<p>Commercial storefront installation is a coordination-intensive scope. Here's how we approach it:</p><p><strong>Pre-Construction Consultation</strong><br>Before anything is ordered, we review the project drawings, confirm rough opening dimensions, and discuss the glass and framing specifications. Getting the specification right at this stage prevents costly changes later.</p><p><strong>Accurate Field Measurement</strong><br>We take field measurements from the actual rough opening — not from drawings alone. Commercial construction tolerances vary, and field conditions don't always match what's on paper. Measuring from the actual opening is what prevents fit issues at installation.</p><p><strong>Material Procurement</strong><br>We source aluminum framing systems and commercial glass through established supply relationships. Lead times are discussed at the time of order so the GC or PM has accurate information for scheduling downstream trades.</p><p><strong>Installation</strong><br>Installation is sequenced around the project schedule. We confirm the opening is ready before mobilizing — proper substrate, correct rough opening dimensions, structural support in place. We don't show up to a site that isn't ready, and we don't leave a site until the work is complete and clean.</p><p><strong>Punch List &amp; Closeout</strong><br>After installation, we walk the work with the GC or PM, address any punch list items on the spot, and provide documentation for the project file.</p>",
        },
      ],
      benefitsTitle:
        "Why Charlotte Contractors Choose Glass and Door Pro for Storefront Installation",
      benefitsCards: [
        {
          icon: "UserCheck",
          title: "Single Point of Contact",
          description:
            "Doug handles every commercial project personally — from the initial scope conversation through installation and closeout. One call gets you the person responsible for the work, not a dispatcher or account manager.",
        },
        {
          icon: "CalendarDays",
          title: "Schedule Reliability",
          description:
            "We show up when we say we will and complete the work on the agreed timeline. On a commercial job site, a glazing contractor who misses their window creates problems for every trade behind them. We take that seriously.",
        },
        {
          icon: "Phone",
          title: "Field Responsiveness",
          description:
            "When a field condition requires a decision, we're reachable and we respond. GCs and PMs don't have time to chase subcontractors for answers — working with an owner-operator means you get fast, accountable communication throughout the project.",
        },
        {
          icon: "Building2",
          title: "Complete Storefront Scope",
          description:
            "Framing, glass panels, doors, and hardware — we handle the complete storefront glazing package rather than carving out portions of the scope. One contractor, one contract, one accountable party.",
        },
        {
          icon: "ShieldCheck",
          title: "Commercial-Grade Materials",
          description:
            "We specify and install materials appropriate for commercial applications — the right aluminum systems, the right glass specifications, and the right hardware for the load and use requirements of each project.",
        },
        {
          icon: "BadgeCheck",
          title: "Competitive on Price",
          description:
            "Owner-operated means lower overhead than a large glazing company. That translates to competitive pricing on commercial projects without compromising on materials or execution quality.",
        },
      ],
      faqTitle: "Frequently Asked Questions — Commercial Storefront Glass Installation",
      faqs: [
        {
          question:
            "How far in advance should I schedule a commercial storefront glass installation?",
          answer:
            "<p>Lead time depends on the scope and the materials specified. Standard aluminum storefront systems typically have material lead times of 2–4 weeks from order. We recommend reaching out as early in the project schedule as possible so we can confirm material availability and lock in the installation window. For projects with firm completion dates, earlier engagement gives us more scheduling flexibility.</p>",
        },
        {
          question: "Do you work directly with general contractors and project managers?",
          answer:
            "<p>Yes. Most of our commercial storefront work is coordinated with GCs and project managers. We're used to working within a construction schedule, coordinating with other trades, and communicating directly with whoever is managing the project. We can work from drawings or from field conditions — whatever the project requires.</p>",
        },
        {
          question: "What types of commercial buildings do you install storefront glass for?",
          answer:
            "<p>We install storefront glass for retail spaces, restaurants, office buildings, strip centers, medical offices, and other commercial properties throughout Charlotte. If you have a commercial glazing scope and want to discuss it, call us and we'll tell you quickly whether it's a good fit.</p>",
        },
        {
          question: "Do you handle the permitting for commercial storefront glass installation?",
          answer:
            "<p>Permitting requirements vary by project type, building, and jurisdiction. We advise on what's typically required for the scope of work and can assist with the process — but permit responsibility is typically coordinated between the GC and the building department. We'll discuss this during the initial project consultation.</p>",
        },
        {
          question: "Can you match existing aluminum framing on a renovation or expansion project?",
          answer:
            "<p>In many cases, yes. We work to match existing framing systems when a renovation requires new glazing that needs to be consistent with the existing envelope. Bring us the existing specifications or let us take a look at the building, and we'll confirm what's achievable.</p>",
        },
        {
          question: "What's the difference between a storefront system and a curtain wall?",
          answer:
            "<p>A storefront system is a non-load-bearing aluminum and glass assembly typically used at ground level for retail and commercial entries — the most common commercial glazing system for the types of projects we work on. A curtain wall is a larger-scale exterior cladding system used on multi-story buildings. Glass and Door Pro specializes in storefront systems for commercial construction and renovation projects.</p>",
        },
      ],
      cta: {
        heading: "Have a Commercial Storefront Project in Charlotte?",
        body: "Call or submit a project inquiry and Doug will follow up directly. We work with GCs, project managers, and business owners — and we respond fast.",
        footerLine: "Mon–Sat, 7am–6pm | Charlotte, NC and surrounding metro area",
        primaryText: "Request a Commercial Quote",
      },
    }),
  },
  {
    title: "Commercial Storefront Glass Replacement & Repair",
    slug: "services-commercial-storefront-glass-replacement-repair",
    seoTitle:
      "Commercial Storefront Glass Replacement & Repair in Charlotte, NC | Glass and Door Pro",
    seoDescription:
      "Emergency storefront glass repair, board-up, and replacement for Charlotte businesses. Broken storefront glass secured and replaced fast. Owner-operated, same-day response. Call (704) 771-6111.",
    seoKeywords:
      "commercial storefront glass replacement Charlotte NC, storefront glass repair, emergency board-up, broken storefront glass",
    ogImageUrl: "/images/glass-door-pro/storefront-glass-replacement-hero.webp",
    content: expandedServicePageContent({
      serviceAreaContent: commercialLinkedServiceAreaContent,
      relatedCommercialUrl: "/services/commercial-storefront-glass-replacement-repair",
      hero: {
        heading: "Commercial Storefront Glass Replacement & Repair in Charlotte, NC",
        subheading:
          "Broken storefront glass secured and replaced fast. Whether it's vandalism, an accident, or a failed panel — we board up to secure the building, then return to complete the permanent glass replacement. One call handles the whole situation.",
        imageUrl: "/images/glass-door-pro/storefront-glass-replacement-hero.webp",
        imageAlt: "Commercial storefront glass door replacement for a Charlotte business",
        imagePositionY: 45,
        primaryText: "Call (704) 771-6111",
        primaryAction: "custom-link",
        primaryLink: "tel:+17047716111",
        secondaryText: "Request a Quote",
        secondaryAction: "form-modal",
        secondaryLink: "",
        secondaryFormSlug: "contact-form",
        secondaryModalTitle: "Request a Free Quote",
        secondaryModalDescription:
          "Tell us a little about your project and Doug will follow up with next steps.",
      },
      intro: {
        title: "When Your Storefront Glass Goes Down, You Need Fast and Reliable",
        content:
          "<p>A broken storefront glass panel creates two problems at once. The first is security — your building is open, your inventory or equipment is exposed, and you need it secured before you can leave for the night. The second is replacement — you need the glass back in place as quickly as possible so your business can operate normally and your storefront looks the way it should.</p><p>Glass and Door Pro handles both. When a Charlotte business owner calls about a broken storefront panel, we respond fast. If the situation requires it, we provide emergency board-up to secure the opening until the replacement glass is ready. Then we return to complete the permanent replacement — measured correctly, installed right, and finished clean.</p><p>That's important because the two-step process is often the only realistic option. Commercial storefront glass is typically tempered or laminated safety glass, cut to specific dimensions for the opening. It can't be picked up off a shelf. Board-up buys the time needed to source the correct glass, and permanent replacement follows as quickly as the material is available.</p><p>We also handle non-emergency storefront glass situations — a panel that has developed a crack, an older storefront with failing seals, or a business that wants to upgrade its glass as part of a renovation. Not every storefront glass call is an emergency, and we handle the full range from urgent response to planned replacement.</p><p>For Charlotte businesses, working with a local owner-operator means you're not calling a national dispatch center and waiting to hear back from a franchisee. You're calling the person who will show up, assess the situation, and tell you exactly what needs to happen and when.</p>",
      },
      detailTitle: "Storefront Glass Services We Provide",
      detailCards: [
        {
          icon: "ShieldCheck",
          title: "Emergency Storefront Glass Board-Up",
          description:
            "When a storefront glass panel is broken and the building needs to be secured immediately, we provide emergency board-up service. The opening is covered with plywood or board material, properly secured to protect the interior until permanent replacement glass is available. This is the first step when glass breaks outside of normal business hours or when the replacement glass requires fabrication lead time.",
        },
        {
          icon: "Grid3X3",
          title: "Storefront Glass Replacement",
          description:
            "Permanent replacement of broken, cracked, or failed storefront glass panels. We measure the opening, source the correct tempered or laminated safety glass to specification, and complete the installation cleanly. The framing is inspected as part of every replacement — if the frame sustained damage, we address it before the new glass goes in.",
        },
        {
          icon: "XCircle",
          title: "Cracked or Damaged Panel Repair",
          description:
            "Not every storefront glass situation is an emergency. Hairline cracks, edge damage, or developing seal failures can often be monitored and addressed on a scheduled basis. We assess the severity and advise on whether immediate replacement is warranted or whether the panel can be addressed on a planned timeline.",
        },
        {
          icon: "Search",
          title: "Storefront Frame Damage Assessment",
          description:
            "When glass breaks under impact, the aluminum framing often sustains damage as well. We inspect the frame as part of every glass replacement and address damage before installing new glass. Installing replacement glass in a damaged frame shortens the life of the new panel and creates ongoing problems.",
        },
        {
          icon: "BadgeCheck",
          title: "Glass Specification & Upgrade",
          description:
            "Businesses updating their storefront glass have options beyond standard clear tempered glass — low-E coatings for energy performance, tinted or reflective glass for solar control, laminated glass for enhanced security. We advise on appropriate specifications for the application and budget.",
        },
        {
          icon: "CalendarDays",
          title: "Scheduled Storefront Glass Maintenance",
          description:
            "For property managers and business owners with multiple locations or older storefronts, periodic glass condition assessment helps catch problems before they become emergencies. We can assess existing storefront glass and framing and provide a condition report.",
        },
      ],
      proseSections: [
        {
          title: "Emergency Storefront Glass — What Happens When You Call",
          content:
            "<p>When you call Glass and Door Pro about a broken storefront panel, here's how it works:</p><p><strong>Step 1 — Immediate Assessment</strong><br>We talk through the situation with you: what happened, what's broken, whether the building is currently accessible or secured, and what your timeline looks like. We give you a realistic picture of what the response will involve.</p><p><strong>Step 2 — Board-Up if Required</strong><br>If the panel is broken and the building needs to be secured, we provide emergency board-up. The opening is properly covered and secured so you can leave the property without concern. Board-up is a temporary measure — its job is to protect the building while we source the replacement glass.</p><p><strong>Step 3 — Glass Sourcing</strong><br>Commercial storefront glass is cut to size — it's not stock material. We measure the opening precisely and place the order for the correct glass specification. We give you an accurate lead time so you know when to expect the permanent replacement.</p><p><strong>Step 4 — Permanent Replacement</strong><br>When the glass is ready, we return to complete the installation. The board-up comes down, the frame is inspected and addressed if needed, and the new glass goes in correctly — set, sealed, and finished clean.</p><p><strong>Step 5 — Walkthrough</strong><br>We walk the completed installation with you before we leave. The storefront should look right and the glass should be properly secured in the frame. If anything needs to be addressed, we handle it before we pack up.</p>",
        },
      ],
      benefitsTitle: "Why Charlotte Businesses Call Glass and Door Pro for Storefront Glass",
      benefitsCards: [
        {
          icon: "CheckCircle",
          title: "One Call, Full Solution",
          description:
            "Board-up and permanent replacement handled by the same contractor. You don't manage two separate vendors for an emergency glass situation — we handle the complete scope from securing the opening through finished installation.",
        },
        {
          icon: "UserCheck",
          title: "Local Owner-Operator",
          description:
            "When you call, you reach the person who will handle your job. No national dispatch, no franchise call center, no waiting to hear back from whoever is available in your area.",
        },
        {
          icon: "Phone",
          title: "Fast Response",
          description:
            "Commercial glass emergencies don't wait for business hours. We respond fast and give you a straight answer on timeline and what's involved — no runaround.",
        },
        {
          icon: "BadgeCheck",
          title: "Correct Glass Specification",
          description:
            "Commercial storefront glass has specific requirements — tempered, laminated, correct thickness for the opening size. We source the right glass for your opening rather than substituting whatever is available.",
        },
        {
          icon: "Search",
          title: "Frame Inspection Included",
          description:
            "Every glass replacement includes an inspection of the existing aluminum framing. If the frame sustained damage, we address it before new glass goes in — not after.",
        },
        {
          icon: "Star",
          title: "Clean Finish",
          description:
            "The completed installation looks the way it should. Properly set glass, clean sealant lines, and framing that's in good condition. Your storefront is the face of your business — the replacement should be indistinguishable from new.",
        },
      ],
      faqTitle: "Frequently Asked Questions — Commercial Storefront Glass Replacement & Repair",
      faqs: [
        {
          question: "My storefront glass is broken and I need it secured tonight — can you help?",
          answer:
            "<p>Yes. We provide emergency board-up service for broken commercial storefront glass. Call (704) 771-6111 directly and we'll assess the situation and respond as quickly as possible. Board-up secures the opening until the replacement glass can be sourced and installed.</p>",
        },
        {
          question: "How long does it take to get replacement storefront glass after a break?",
          answer:
            "<p>Commercial storefront glass is cut to the specific dimensions of your opening — it's not stock material that can be picked up same day. Once we have the correct measurements and glass specification confirmed, typical lead time is 3–7 business days depending on the glass type and current supplier availability. We give you an accurate timeline when the order is placed.</p>",
        },
        {
          question: "Does the aluminum framing need to be replaced when storefront glass breaks?",
          answer:
            "<p>Not always, but it needs to be inspected. When glass breaks under impact — vandalism, a vehicle strike, an accident — the aluminum frame often sustains damage that isn't immediately obvious. We inspect the frame as part of every glass replacement and address any damage before installing new glass. Installing new glass in a damaged frame causes premature failure.</p>",
        },
        {
          question: "What type of glass is used for commercial storefronts?",
          answer:
            "<p>Commercial storefront glass is typically tempered safety glass — heat-treated to be significantly stronger than standard glass and to break into small, relatively safe fragments rather than large shards. Some applications use laminated glass, which holds together when broken. The correct specification depends on the opening size, local building codes, and the application. We advise on the right glass for your specific situation.</p>",
        },
        {
          question: "Can you replace just one broken panel in an existing storefront?",
          answer:
            "<p>Yes. We can replace a single broken or damaged panel in an existing storefront system without disturbing the surrounding framing or glass. As long as the frame is in good condition, panel-only replacement is the standard approach.</p>",
        },
        {
          question: "Do you work with property managers who oversee multiple commercial locations?",
          answer:
            "<p>Yes. Property managers with multiple Charlotte locations can work with us directly for storefront glass maintenance, replacement, and emergency response. We're familiar with the coordination requirements of multi-site property management and can work within your existing service request process.</p>",
        },
      ],
      cta: {
        heading: "Broken Storefront Glass in Charlotte?",
        body: "Call us directly for emergency response. For non-emergency replacement and repair, fill out the form and we'll follow up same day.",
        footerLine: "Mon–Sat, 7am–6pm | Charlotte, NC and surrounding metro area",
        primaryText: "Call (704) 771-6111",
        primaryAction: "custom-link",
        primaryLink: "tel:+17047716111",
        secondaryText: "Request a Quote",
        secondaryAction: "form-modal",
        secondaryLink: "",
        secondaryFormSlug: "contact-form",
        secondaryModalTitle: "Request a Free Quote",
        secondaryModalDescription:
          "Tell us a little about your project and Doug will follow up with next steps.",
      },
    }),
  },
  {
    title: "Commercial Door Installation",
    slug: "services-commercial-door-installation",
    seoTitle:
      "Commercial Door Installation in Charlotte, NC | Storefront & Entry Doors | Glass and Door Pro",
    seoDescription:
      "Commercial door installation for new construction, tenant buildouts, and business renovations in Charlotte, NC. Aluminum entry doors, glass storefront doors, and commercial entrance systems. Call (704) 771-6111.",
    seoKeywords:
      "commercial door installation Charlotte NC, aluminum entry doors, glass storefront doors, commercial entrance systems",
    ogImageUrl: "/images/glass-door-pro/storefront-door-installation-hero.webp",
    content: expandedServicePageContent({
      serviceAreaContent: commercialLinkedServiceAreaContent,
      relatedCommercialUrl: "/services/commercial-door-installation",
      hero: {
        heading: "Commercial Door Installation in Charlotte, NC",
        subheading:
          "Aluminum entry doors, glass storefront doors, and commercial entrance systems installed for new construction, tenant buildouts, and business renovations across Charlotte. Direct contact with the person doing the work — from scope through installation.",
        imageUrl: "/images/glass-door-pro/storefront-door-installation-hero.webp",
        imageAlt: "Commercial storefront door installation for a Charlotte business entrance",
        imagePositionY: 45,
        primaryText: "Request a Commercial Quote",
      },
      intro: {
        title: "Commercial Door Installation Built Around Your Project Schedule",
        content:
          "<p>A commercial door that isn't installed correctly creates problems that outlast the project. Misaligned frames, doors that don't close flush, hardware that fails early, thresholds that let weather in — these aren't cosmetic issues, they're functional failures that cost money to fix after the fact and reflect on whoever installed them.</p><p>Glass and Door Pro installs commercial doors for general contractors, project managers, and business owners throughout Charlotte. The work is managed personally by Doug — the same person who reviews the scope, takes the field measurements, sources the materials, and shows up for installation. There's no handoff between sales and installation, no crew you've never spoken to showing up to your job site. When you need a question answered or a schedule confirmed, one call gets you the person responsible.</p><p>We install aluminum storefront entry doors, glass commercial doors, and complete entrance systems as part of both new construction projects and tenant buildouts. For GCs managing multiple subcontractors on a commercial schedule, working with a glazing contractor who communicates clearly, shows up on time, and completes the scope correctly is the baseline — and it's something we take seriously on every project.</p><p>Commercial door installation is both a functional and aesthetic scope. The door is often the first physical interaction a customer or visitor has with a business — it needs to open easily, close completely, lock securely, and look right in the frame. We approach every commercial door installation with that standard in mind, whether it's a single storefront entry or a multi-door entrance system.</p><p>Charlotte's commercial construction and renovation activity means consistent demand for reliable commercial door contractors. Business owners opening new locations, landlords preparing tenant spaces, and GCs managing commercial fit-outs all need the same thing: a door contractor who delivers on scope and schedule without creating issues on the job site. That's what Glass and Door Pro provides.</p>",
      },
      detailTitle: "Commercial Doors We Install",
      detailCards: [
        {
          icon: "DoorOpen",
          title: "Aluminum Storefront Entry Doors",
          description:
            "The standard for retail, restaurant, and office entries — aluminum-framed glass doors that are durable, low-maintenance, and appropriate for high-traffic commercial use. We install single doors, pairs, and multi-door configurations as part of a complete storefront system or as standalone entry replacements.",
        },
        {
          icon: "Grid3X3",
          title: "Commercial Glass Doors",
          description:
            "Full-glass or predominantly glass commercial doors for office lobbies, retail entries, and interior commercial applications. Properly hung, aligned with the frame, and fitted with hardware specified for commercial use volumes.",
        },
        {
          icon: "ShieldCheck",
          title: "Panic Hardware & ADA-Compliant Entrance Systems",
          description:
            "Commercial entrances in occupied buildings must meet ADA accessibility requirements and may require panic hardware for egress compliance. We install entrance systems that meet code requirements and advise on what's required for the specific application and occupancy type.",
        },
        {
          icon: "Building2",
          title: "Tenant Buildout Entry Doors",
          description:
            "New tenant spaces in commercial buildings and strip centers require door installation as part of the buildout scope. We coordinate with GCs and property managers to install entry doors that fit within the existing building envelope and meet the landlord's specifications for the space.",
        },
        {
          icon: "CheckCircle",
          title: "Multi-Door Entrance Systems",
          description:
            "Larger commercial entries with multiple door openings — paired doors, doors with sidelites, vestibule configurations — require precise coordination between the door units, the framing, and the hardware. We handle multi-door entrance configurations with the same attention to alignment and operation as single-door installs.",
        },
        {
          icon: "Wrench",
          title: "Commercial Door Hardware",
          description:
            "Door closers, panic bars, floor pivots, pulls, locksets, and magnetic hold-opens installed correctly for the door type and use requirements. Commercial hardware is specified for load — the wrong hardware on a high-traffic commercial door fails fast. We specify and install hardware appropriate for each application.",
        },
      ],
      proseSections: [
        {
          title: "How We Approach Commercial Door Projects",
          content:
            "<p><strong>Scope Review &amp; Specification</strong><br>Before anything is ordered, we review the project scope — door types, quantities, hardware specifications, opening dimensions, and any code requirements for the application. Getting the specification right before ordering prevents change orders and delays.</p><p><strong>Field Measurement</strong><br>We measure from the actual rough openings. Commercial construction tolerances vary, and relying on drawing dimensions alone for door orders creates fit problems. Field measurement is non-negotiable for commercial door work.</p><p><strong>Material Procurement</strong><br>Aluminum door systems and commercial hardware are ordered with confirmed lead times. We communicate material availability to the GC or PM so the installation window can be scheduled accurately within the project timeline.</p><p><strong>Installation</strong><br>Doors are installed level, plumb, and square. Hardware is mounted correctly and tested before we leave the site. We don't call a door complete until it opens freely, closes completely, latches properly, and locks as it should. Thresholds and weatherstripping are set to seal correctly against the floor and frame.</p><p><strong>Punch List</strong><br>We walk the completed installation with the GC or PM, address any punch list items on site, and provide documentation for the project closeout package if required.</p>",
        },
      ],
      benefitsTitle:
        "Why Charlotte Contractors Choose Glass and Door Pro for Commercial Door Installation",
      benefitsCards: [
        {
          icon: "UserCheck",
          title: "Owner-Operated Accountability",
          description:
            "Doug manages every commercial door project personally. The person you call to discuss the scope is the person who shows up for installation. That accountability eliminates the communication gaps that create problems on commercial job sites.",
        },
        {
          icon: "CalendarDays",
          title: "Schedule Reliability",
          description:
            "We confirm the installation window in advance and show up when we say we will. On a commercial project, a door contractor who misses their window creates cascading delays. We don't do that.",
        },
        {
          icon: "BadgeCheck",
          title: "Correct Specification from the Start",
          description:
            "Commercial doors and hardware need to be specified correctly for the application — occupancy type, traffic volume, code requirements. We get the specification right before ordering rather than discovering problems at installation.",
        },
        {
          icon: "DoorOpen",
          title: "Complete Entrance Scope",
          description:
            "Frames, doors, hardware, thresholds — we handle the complete entrance installation rather than partial scopes that leave coordination gaps between contractors.",
        },
        {
          icon: "Phone",
          title: "Direct Communication",
          description:
            "GCs and PMs have direct access to Doug throughout the project. Field questions get answered fast. Schedule adjustments are communicated promptly. There's no account manager in the middle slowing down the exchange.",
        },
        {
          icon: "Star",
          title: "Clean, Finished Installation",
          description:
            "The completed door should look and function like it belongs in the building. Proper alignment, clean hardware installation, correct threshold fit — we finish the job the way a professional installation should look.",
        },
      ],
      faqTitle: "Frequently Asked Questions — Commercial Door Installation",
      faqs: [
        {
          question: "Do you work with general contractors on commercial construction projects?",
          answer:
            "<p>Yes. We regularly work with GCs on commercial construction and tenant buildout projects in Charlotte. We're familiar with the coordination requirements of a commercial job site — field measurement, confirmed lead times, scheduled installation windows, and punch list closeout. We communicate directly with whoever is managing the project and keep the schedule moving.</p>",
        },
        {
          question: "What types of commercial doors do you install?",
          answer:
            "<p>We install aluminum storefront entry doors, commercial glass doors, and complete entrance systems for retail, restaurant, office, and other commercial applications. We handle single doors, paired doors, and multi-door entrance configurations with sidelites or vestibule framing.</p>",
        },
        {
          question: "Do the commercial doors you install meet ADA requirements?",
          answer:
            "<p>ADA compliance for commercial entrances involves door width, hardware type, opening force, and threshold height requirements. We install doors that meet standard ADA accessibility requirements and advise on what's required for specific occupancy types. For projects with specific code requirements, we recommend reviewing the project documents with the GC or architect to confirm all compliance items are addressed.</p>",
        },
        {
          question: "How long does commercial door installation take?",
          answer:
            "<p>Installation time depends on the number of doors and the complexity of the entrance configuration. A single commercial entry door typically takes 3–5 hours from start to finish including hardware. Multi-door entrance systems take longer. We provide a realistic time estimate at the time of scheduling so the GC can plan around the installation window.</p>",
        },
        {
          question: "Can you supply the doors and hardware, or do you install only?",
          answer:
            "<p>Both. We can supply and install complete commercial door systems, or we can install doors and hardware that have been supplied by the GC or owner. If you're supplying the materials, share the product specifications with us before delivery so we can confirm everything needed for installation is included.</p>",
        },
        {
          question: "What's the lead time for commercial door materials?",
          answer:
            "<p>Standard aluminum storefront door systems typically have lead times of 2–4 weeks from order depending on the manufacturer and current availability. We confirm lead times when the order is placed and communicate them to the project team so the installation window can be scheduled accurately.</p>",
        },
      ],
      cta: {
        heading: "Commercial Door Project in Charlotte?",
        body: "Call or submit a project inquiry and Doug will follow up directly. We work with GCs, project managers, and business owners — and we respond fast.",
        footerLine: "Mon–Sat, 7am–6pm | Charlotte, NC and surrounding metro area",
        primaryText: "Request a Commercial Quote",
      },
    }),
  },
  {
    title: "Commercial Door Replacement & Repair",
    slug: "services-commercial-door-replacement-repair",
    seoTitle: "Commercial Door Replacement & Repair in Charlotte, NC | Glass and Door Pro",
    seoDescription:
      "Commercial door repair and replacement for Charlotte businesses. Broken glass panels, damaged hardware, misaligned frames, and worn closers fixed fast. Owner-operated. Call (704) 771-6111.",
    seoKeywords:
      "commercial door replacement Charlotte NC, commercial door repair, door closer repair, commercial door glass replacement",
    ogImageUrl: "/images/glass-door-pro/commercial-door-repair-hero.webp",
    content: expandedServicePageContent({
      serviceAreaContent: commercialLinkedServiceAreaContent,
      relatedCommercialUrl: "/services/commercial-door-replacement-repair",
      hero: {
        heading: "Commercial Door Replacement & Repair in Charlotte, NC",
        subheading:
          "Broken glass panels, damaged hardware, misaligned frames, and doors that won't close or lock properly — repaired or replaced fast. Serving Charlotte businesses with honest assessments, same-week scheduling, and owner-operated service you can count on.",
        imageUrl: "/images/glass-door-pro/commercial-door-repair-hero.webp",
        imageAlt: "Commercial door repair and replacement for a Charlotte business entrance",
        imagePositionY: 45,
        primaryText: "Call (704) 771-6111",
        primaryAction: "custom-link",
        primaryLink: "tel:+17047716111",
        secondaryText: "Request a Quote",
        secondaryAction: "form-modal",
        secondaryLink: "",
        secondaryFormSlug: "contact-form",
        secondaryModalTitle: "Request a Free Quote",
        secondaryModalDescription:
          "Tell us a little about your project and Doug will follow up with next steps.",
      },
      intro: {
        title: "Commercial Door Problems Don't Wait — Neither Should the Fix",
        content:
          "<p>A commercial door that doesn't work correctly is more than an inconvenience. It's a security risk, an accessibility problem, and a signal to every customer who walks up to it that something is wrong. Whether the glass panel is cracked, the closer is failing, the door won't latch, or the frame has shifted enough that the door drags on the floor — these are problems that need to be addressed, not worked around.</p><p>Glass and Door Pro handles commercial door repair and replacement for businesses throughout Charlotte. The approach is the same as our residential work: we assess honestly, we repair when repair is the right answer, and we recommend replacement when it isn't. A business owner shouldn't have to manage a door that needs to be lifted to close or pushed hard to latch — that's not a minor inconvenience, it's a daily friction point for every employee and customer who uses it.</p><p>Most commercial door problems fall into a predictable set of categories — broken glass, hardware failure, alignment issues, and frame damage. Each has a repair path and a replacement threshold. We diagnose which applies, explain what we find, and give you a clear picture of what the repair or replacement involves before any work starts.</p><p>For property managers overseeing commercial properties in Charlotte, we're a reliable service provider for door maintenance and repair across your portfolio. For individual business owners dealing with a door problem for the first time, we'll walk you through exactly what's happening and what it takes to fix it.</p>",
      },
      detailTitle: "Commercial Door Problems We Fix",
      detailCards: [
        {
          icon: "XCircle",
          title: "Broken Commercial Door Glass",
          description:
            "A cracked or shattered glass panel in a commercial door is a security and safety issue. We replace broken glass panels in existing commercial door frames — tempered glass cut to the correct specification for the door. If the frame sustained damage when the glass broke, we address that before installing new glass.",
        },
        {
          icon: "Wrench",
          title: "Door Closer Repair & Replacement",
          description:
            "A door that swings too fast, doesn't close completely, or slams shut has a failing closer. Commercial door closers are rated for traffic volume and wear out over time, particularly on high-use entries. We diagnose closer issues and replace with hardware rated for the door's use requirements.",
        },
        {
          icon: "BadgeCheck",
          title: "Misaligned & Dragging Doors",
          description:
            "Doors that drag on the floor, bind in the frame, or require significant force to open or close are usually suffering from frame shift, hinge wear, or installation movement over time. We diagnose the root cause and correct the alignment — adjusting hinges, shimming the frame, or addressing the underlying issue rather than treating the symptom.",
        },
        {
          icon: "Lock",
          title: "Lock & Latch Repair",
          description:
            "A commercial door that doesn't latch or lock reliably is a security issue. Worn latch mechanisms, misaligned strike plates, and failing locksets are repaired or replaced. We test the lock and latch function before we leave to confirm the door is secure.",
        },
        {
          icon: "ShieldCheck",
          title: "Threshold & Weatherstripping Replacement",
          description:
            "Worn thresholds and weatherstripping on commercial doors let in air, water, and pests. Commercial thresholds take significant daily impact from foot traffic and wear faster than residential units. We replace worn thresholds and weatherstripping to restore a proper seal.",
        },
        {
          icon: "DoorOpen",
          title: "Full Commercial Door Replacement",
          description:
            "When repair isn't the right answer — the frame is beyond adjustment, the door has sustained damage that affects its structural integrity, or the hardware failures are symptomatic of a door that's simply at the end of its service life — we handle full commercial door replacement. The old door comes out, the frame is inspected and addressed, and a new commercial door goes in correctly.",
        },
      ],
      proseSections: [
        {
          title: "When to Repair a Commercial Door — and When to Replace It",
          content:
            "<p>The honest answer depends on what's actually wrong. Here's how we think about it:</p><p><strong>Repair is usually the right call when:</strong></p><ul><li>The door frame is in good condition and the door is properly aligned</li><li>The issue is a specific hardware failure — a closer, a latch, a lock</li><li>The glass panel is broken but the frame and door itself are undamaged</li><li>The weatherstripping or threshold has worn but the door functions correctly otherwise</li></ul><p><strong>Replacement makes more sense when:</strong></p><ul><li>The frame has shifted significantly and realignment isn't holding</li><li>The door has sustained impact damage that affects how it hangs or operates</li><li>Multiple hardware components have failed and the door is at the end of its service life</li><li>The door is old enough that repair costs approach or exceed the cost of a new door</li></ul><p>We'll give you a straight assessment of which situation you're in. If repair is viable and the right long-term call, we'll repair it. If replacement is the better value, we'll tell you that — and handle the replacement.</p>",
        },
      ],
      benefitsTitle: "Why Charlotte Businesses Trust Glass and Door Pro for Commercial Door Repair",
      benefitsCards: [
        {
          icon: "Search",
          title: "Honest Assessment First",
          description:
            "We diagnose before we recommend. You'll get a clear explanation of what's wrong and what it takes to fix it — not a default recommendation to replace something that can be repaired.",
        },
        {
          icon: "CalendarDays",
          title: "Fast Scheduling",
          description:
            "Commercial door problems affect daily operations. We schedule commercial door repair and replacement quickly and give you an accurate arrival window so you can plan around it.",
        },
        {
          icon: "UserCheck",
          title: "Owner Does the Work",
          description:
            "Doug assesses and repairs every job personally. You're not dealing with a rotating service crew — the same person who talked you through the problem on the phone is the one who shows up to fix it.",
        },
        {
          icon: "CheckCircle",
          title: "Full Repair Scope",
          description:
            "Glass, hardware, alignment, thresholds — we handle the complete repair scope rather than addressing only one aspect and leaving the rest. A door that's been properly repaired works correctly across all its components.",
        },
        {
          icon: "BadgeCheck",
          title: "Commercial Hardware Specified Correctly",
          description:
            "Replacement hardware is specified for commercial use — the right closer rating, the right latch mechanism, the right lock grade for the application. Residential-grade hardware on a commercial door fails fast.",
        },
        {
          icon: "Building2",
          title: "Property Manager Friendly",
          description:
            "We work with property managers handling commercial door maintenance across multiple Charlotte locations. We can work within your service request process and provide documentation for your property records.",
        },
      ],
      faqTitle: "Frequently Asked Questions — Commercial Door Replacement & Repair",
      faqs: [
        {
          question:
            "My commercial door won't close properly — can it be repaired or does it need to be replaced?",
          answer:
            "<p>In most cases, a commercial door that won't close properly can be repaired. The most common causes are hinge wear, frame shift, or a failing closer — all of which are repairable. We diagnose the specific issue first and give you a clear recommendation before any work starts. If the frame has shifted beyond what adjustment can correct or the door has structural damage, we'll tell you replacement makes more sense.</p>",
        },
        {
          question: "How quickly can you respond to a commercial door problem in Charlotte?",
          answer:
            "<p>We schedule commercial door repairs quickly — typically within a few days for standard repairs. For situations where the door is non-functional or creating a security issue, call us directly at (704) 771-6111 and we'll discuss priority scheduling.</p>",
        },
        {
          question:
            "Can you replace the glass panel in a commercial door without replacing the entire door?",
          answer:
            "<p>Yes, in most cases. If the door frame is in good condition and the door itself is structurally sound, we can replace just the broken glass panel. We source tempered safety glass cut to the correct specification for the door and install it without disturbing the surrounding frame.</p>",
        },
        {
          question: "How long do commercial door closers last?",
          answer:
            "<p>Commercial door closer lifespan depends heavily on traffic volume. On a high-traffic commercial entry — a busy retail or restaurant door — closers may need replacement every 5–10 years. Lower-traffic entries last longer. Signs that a closer is failing include a door that swings too fast or too slow, doesn't close completely, or slams shut. We replace closers with units rated for the door's traffic volume.</p>",
        },
        {
          question: "Do you service commercial doors for property management companies?",
          answer:
            "<p>Yes. We work with property managers overseeing commercial properties in Charlotte. We can handle door maintenance, repair, and replacement across multiple locations and work within your existing service request and documentation process.</p>",
        },
        {
          question:
            "My commercial door hardware keeps failing — is this a hardware quality issue or an installation issue?",
          answer:
            "<p>It can be either. Commercial door hardware that fails repeatedly is often a specification problem — residential-grade or incorrectly rated hardware installed on a commercial door that sees more use than the hardware was designed for. It can also be an installation issue. We diagnose the root cause and specify replacement hardware correctly for the door's use requirements so the repair holds.</p>",
        },
      ],
      cta: {
        heading: "Commercial Door Not Working Right in Charlotte?",
        body: "Call us directly for fast scheduling. For non-urgent repairs and replacement quotes, fill out the form and we'll follow up same day.",
        footerLine: "Mon–Sat, 7am–6pm | Charlotte, NC and surrounding metro area",
        primaryText: "Call (704) 771-6111",
        primaryAction: "custom-link",
        primaryLink: "tel:+17047716111",
        secondaryText: "Request a Quote",
        secondaryAction: "form-modal",
        secondaryLink: "",
        secondaryFormSlug: "contact-form",
        secondaryModalTitle: "Request a Free Quote",
        secondaryModalDescription:
          "Tell us a little about your project and Doug will follow up with next steps.",
      },
    }),
  },
  {
    title: "Commercial Window Replacement",
    slug: "services-commercial-window-replacement",
    seoTitle: "Apartment & Multi-Family Window Replacement in Charlotte, NC | Glass and Door Pro",
    seoDescription:
      "Fast apartment and multi-family window replacement in Charlotte, NC. Wrong windows ordered? Unit damage? Doug mobilizes faster than larger companies — keeping your project on schedule. Call (704) 771-6111.",
    seoKeywords:
      "apartment window replacement Charlotte NC, multi-family window replacement, commercial window replacement, property manager window replacement",
    ogImageUrl: "/images/glass-door-pro/commercial-window-replacement-hero-blue-sky.webp",
    content: expandedServicePageContent({
      serviceAreaContent: commercialLinkedServiceAreaContent,
      relatedCommercialUrl: "/services/commercial-window-replacement",
      hero: {
        heading: "Apartment & Multi-Family Window Replacement in Charlotte, NC",
        subheading:
          "Wrong windows ordered. Unit damage mid-construction. A deadline that can't move. When an apartment or multi-family project in Charlotte has a window problem that needs to be resolved fast, Glass and Door Pro mobilizes quicker than larger companies — and Doug handles the project personally from first call through final installation.",
        imageUrl: "/images/glass-door-pro/commercial-window-replacement-hero-blue-sky.webp",
        imageAlt: "Multi-family building exterior with replacement windows",
        imagePositionY: 45,
        primaryText: "Call (704) 771-6111",
        primaryAction: "custom-link",
        primaryLink: "tel:+17047716111",
        secondaryText: "Request a Quote",
        secondaryAction: "form-modal",
        secondaryLink: "",
        secondaryFormSlug: "contact-form",
        secondaryModalTitle: "Request a Free Quote",
        secondaryModalDescription:
          "Tell us a little about your project and Doug will follow up with next steps.",
      },
      intro: {
        title: "The Window Contractor That Shows Up When Your Schedule Can't Slip",
        content:
          "<p>Multi-family and apartment construction runs on tight timelines. Lease commencement dates are set months in advance, certificate of occupancy schedules are real constraints, and when a window problem surfaces mid-project — wrong units ordered, breakage during construction, units that don't meet spec — the project manager needs someone who can get there fast, assess the situation clearly, and execute the replacement without creating additional delays.</p><p>That's the problem Glass and Door Pro solves for apartment and multi-family projects in Charlotte. When a larger glazing company can't get to your site for two weeks and your schedule doesn't have two weeks to give, an owner-operator who can mobilize quickly changes the outcome of the project.</p><p>Doug handles every multi-family window replacement project personally. When you call about a window problem on an apartment project, you're talking to the person who will be on site — not a dispatcher routing the call to a crew you've never met. That direct access means faster decisions, faster mobilization, and a cleaner handoff from problem identification to resolution.</p><p>We work with property managers and project managers on apartment complexes and multi-family residential buildings throughout Charlotte. The scenarios we handle most often include windows that were incorrectly specified or ordered and need to be replaced before occupancy, unit windows that were broken during construction or move-in, and windows that fail during the warranty period and need to be addressed before they become a tenant issue.</p><p>In every case, the competitive advantage is the same: we move faster than larger companies, we communicate directly with whoever is managing the project, and we get the windows replaced correctly without adding to your problems.</p>",
      },
      detailTitle: "Multi-Family Window Situations We Resolve",
      detailCards: [
        {
          icon: "XCircle",
          title: "Wrong Windows Ordered",
          description:
            "Wrong size, wrong specification, wrong configuration — windows that arrive for a multi-family project and don't fit or don't meet the required spec create an immediate schedule problem. We assess the situation quickly, source the correct replacement windows, and execute the installation to keep the project moving. Speed of response is everything in this scenario.",
        },
        {
          icon: "Wrench",
          title: "Construction Damage Replacement",
          description:
            "Windows broken during the construction process — from other trades, from material handling, or from weather events during the build — need to be replaced before occupancy. We handle single-unit replacements and multi-unit damage situations, working around the active construction schedule to minimize interference with other trades.",
        },
        {
          icon: "BadgeCheck",
          title: "Pre-Occupancy Window Replacement",
          description:
            "Windows that fail inspection or don't meet specification before a building receives its certificate of occupancy need to be resolved fast. We work on compressed timelines to get replacement windows sourced, delivered, and installed before the CO date.",
        },
        {
          icon: "ShieldCheck",
          title: "Warranty Period Window Issues",
          description:
            "Windows that develop problems during the warranty period — seal failures, operational issues, damage from tenant move-in — need to be addressed promptly to avoid tenant disputes and lease complications. We handle warranty-period window replacement with the same speed and accountability as new construction situations.",
        },
        {
          icon: "CalendarDays",
          title: "Unit Turnover Window Replacement",
          description:
            "Apartment units with damaged windows need to be restored before the next tenant takes occupancy. Property managers dealing with unit turnover window damage need a contractor who can schedule quickly and complete the work on the turnover timeline.",
        },
        {
          icon: "Building2",
          title: "Multi-Unit Replacement Projects",
          description:
            "Apartment complexes with aging windows across multiple units or buildings can address the replacement systematically. We can scope multi-unit replacement projects, provide phased installation schedules that work around tenant occupancy, and execute the project with minimal disruption to residents.",
        },
      ],
      proseSections: [
        {
          title: "Why Project Managers Call Glass and Door Pro Instead of a Larger Company",
          content:
            "<p>The math on this is straightforward. When a window problem surfaces on an apartment project, a project manager has two options: call a large glazing company and wait, or call an owner-operator who can mobilize fast.</p><p>Large glazing companies have more locations and more name recognition. They also have more jobs ahead of yours in the queue, more layers of scheduling coordination between the call and the crew, and less flexibility to reprioritize around a single project manager's deadline.</p><p>Glass and Door Pro operates differently. When you call about a window problem on an apartment project, Doug assesses the situation the same day. If the windows can be sourced quickly, installation can be scheduled within days. There's no account manager, no scheduler, no crew coordinator in the chain — it's a direct line from the problem to the solution.</p><p>That responsiveness has real value on a project where the schedule is the constraint. A window replacement that gets resolved in three days instead of three weeks is the difference between hitting your CO date and explaining to the owner why you missed it.</p>",
        },
      ],
      benefitsTitle: "Why Charlotte Property Managers Choose Glass and Door Pro",
      benefitsCards: [
        {
          icon: "CalendarDays",
          title: "Faster Mobilization",
          description:
            "We move faster than larger glazing companies. When your project has a window problem and your schedule can't absorb a long queue, an owner-operator who can be on site in days — not weeks — is the right call.",
        },
        {
          icon: "UserCheck",
          title: "Direct Access to Decision-Maker",
          description:
            "When you call, you reach Doug. He assesses the situation, gives you an accurate timeline, and stays reachable throughout the project. No dispatcher, no account manager, no hold music.",
        },
        {
          icon: "Building2",
          title: "Apartment & Multi-Family Experience",
          description:
            "We understand how apartment and multi-family projects work — construction schedules, CO timelines, tenant move-in dates, and the pressure of a lease commencement that doesn't move. We work within those constraints.",
        },
        {
          icon: "CheckCircle",
          title: "Accurate Timelines",
          description:
            "We give you a realistic timeline from the first call — material lead time, installation window, and completion date. You won't get an optimistic promise that turns into a delay. If there's a constraint, we tell you upfront.",
        },
        {
          icon: "Phone",
          title: "Single Point of Contact",
          description:
            "One person manages the project start to finish. You make one call for updates, one call for schedule questions, and one call if anything changes. That simplicity reduces the coordination burden on your end.",
        },
        {
          icon: "BadgeCheck",
          title: "Clean, Documented Work",
          description:
            "Multi-family projects require documentation — installation records, product specifications, warranty information. We provide what you need for the project file and property records.",
        },
      ],
      faqTitle: "Frequently Asked Questions — Apartment & Multi-Family Window Replacement",
      faqs: [
        {
          question:
            "We ordered the wrong windows for an apartment project — how fast can you help?",
          answer:
            "<p>Call us directly at (704) 771-6111 and describe the situation. We'll assess what's needed — window type, quantity, dimensions, specification — and give you an accurate lead time for sourcing and installation. In situations where the project schedule is the constraint, we prioritize getting an accurate timeline to you immediately so you can make decisions. Speed of response starts with the first call.</p>",
        },
        {
          question:
            "Can you handle window replacement on an occupied apartment building without disrupting tenants?",
          answer:
            "<p>Yes. We work around occupancy schedules and coordinate with property managers to minimize disruption to residents. Unit-by-unit replacement can be scheduled around tenant availability, and we communicate clearly about what the installation process involves for each unit so residents know what to expect.</p>",
        },
        {
          question: "What types of windows do you replace in apartment and multi-family buildings?",
          answer:
            "<p>We replace the full range of window types common in apartment and multi-family construction — double-hung, sliding, casement, fixed, and combination configurations. We work from the existing window specifications or assess the opening directly if the original specs aren't available.</p>",
        },
        {
          question: "How do you handle a situation where multiple units need window replacement?",
          answer:
            "<p>We scope the full project — total window count, unit locations, access requirements, and any constraints around tenant occupancy or construction schedule. We provide a phased installation schedule that works within your project timeline and execute unit by unit or in batches depending on what works best for the property.</p>",
        },
        {
          question:
            "Do you work with property management companies on ongoing window maintenance and replacement?",
          answer:
            "<p>Yes. Property management companies with apartment portfolios in Charlotte can work with us on an ongoing basis for window maintenance, damage replacement, and unit turnover window repair. We're familiar with the documentation and communication requirements of property management operations.</p>",
        },
        {
          question: "What's the typical lead time for apartment window replacement in Charlotte?",
          answer:
            "<p>Lead time depends on the window type and quantity. Standard residential window units for apartment replacement typically have lead times of 1–3 weeks from order depending on the specification and supplier availability. We give you an accurate lead time when the order is placed — not an estimate that gets revised later. If a particular window type has a longer lead time, we tell you immediately so you can adjust the project schedule accordingly.</p>",
        },
      ],
      cta: {
        heading: "Window Problem on an Apartment Project in Charlotte?",
        body: "Call Doug directly. He'll assess the situation, give you an accurate timeline, and tell you exactly what it takes to resolve it. No runaround.",
        footerLine: "Mon–Sat, 7am–6pm | Charlotte, NC and surrounding metro area",
        primaryText: "Call (704) 771-6111",
        primaryAction: "custom-link",
        primaryLink: "tel:+17047716111",
        secondaryText: "Request a Quote",
        secondaryAction: "form-modal",
        secondaryLink: "",
        secondaryFormSlug: "contact-form",
        secondaryModalTitle: "Request a Free Quote",
        secondaryModalDescription:
          "Tell us a little about your project and Doug will follow up with next steps.",
      },
    }),
  },
];

type GlassCityPageSeed = {
  title: string;
  slug: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
  content: InsertCmsPage["content"];
};

function cityPageContent(props: {
  hero: { heading: string; subheading: string; imageUrl: string; imagePositionY?: number };
  introTitle: string;
  introContent: string;
  benefitsTitle: string;
  benefits: GlassCard[];
  servicesTitle: string;
  servicesIntro: string;
  serviceCards: GlassCard[];
  areasTitle: string;
  areasIntro: string;
  areas: string[];
  areasClosing: string;
  galleryTitle: string;
  gallery: Array<{ url: string; alt: string }>;
  faqTitle: string;
  faqs: GlassFaq[];
  ctaHeading: string;
  ctaBody: string;
  ctaFooter: string;
}): InsertCmsPage["content"] {
  return {
    blocks: [
      serviceHero(props.hero),
      block("rich-text", {
        title: props.introTitle,
        alignment: "left",
        content: props.introContent,
        sectionBackgroundColor: "#ffffff",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "md",
      }),
      cardsGrid({
        title: props.benefitsTitle,
        cards: props.benefits,
        columns: "3",
        backgroundColor: "#f8fafc",
      }),
      cardsGrid({
        title: props.servicesTitle,
        subtitle: props.servicesIntro,
        cards: props.serviceCards,
        columns: "3",
        backgroundColor: "#ffffff",
      }),
      block("rich-text", {
        title: "Meet Doug Adams",
        alignment: "left",
        content:
          "<p>I'm Doug, and I've been installing glass and doors in the Charlotte area for over 15 years. I started Glass and Door Pro because I wanted to do this the way I think it should be done: one craftsman, one project at a time, with the person who quotes the job actually being the person who shows up to install it.</p><p>Most of what I do is frameless shower doors, windows, and door installation, but I also handle everything from brand-new construction to historic homes — and the tricky, custom projects other contractors don't want to mess with are usually the ones I actually enjoy the most.</p><p>Based in Monroe. Serving Charlotte and surrounding areas. Saturday appointments available.</p>",
        sectionBackgroundColor: "#f8fafc",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "lg",
      }),
      block("rich-text", {
        title: props.areasTitle,
        alignment: "left",
        content: `<p>${props.areasIntro}</p><ul>${props.areas
          .map((area) => `<li>${area}</li>`)
          .join("")}</ul><p>${props.areasClosing}</p>`,
        sectionBackgroundColor: "#ffffff",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "md",
      }),
      galleryBlock(props.galleryTitle, props.gallery),
      block("testimonials", {
        title: "What Our Clients Say",
        variant: "google-carousel",
        sectionBackgroundColor: "#ffffff",
        sectionPaddingTop: "md",
        sectionPaddingBottom: "md",
        items: [
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
        ],
      }),
      block("faq", {
        title: props.faqTitle,
        sectionBackgroundColor: "#f8fafc",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "lg",
        items: props.faqs,
      }),
      quoteCtaBlock(props.ctaHeading, props.ctaBody, props.ctaFooter),
    ],
  };
}

const cityServiceCards: GlassCard[] = [
  {
    icon: "Droplets",
    title: "Frameless Showers",
    description:
      'Custom frameless glass shower enclosures in single-panel walk-ins, in-line layouts, 90-degree corners, neo-angle showers, steam enclosures, and tub splash panels. Glass is custom-cut in either 3/8" or 1/2" tempered safety glass.',
    link: "/services/frameless-showers",
    buttonText: "Learn more about frameless showers",
  },
  {
    icon: "Grid3X3",
    title: "Window Installation",
    description:
      "Energy-efficient window replacements to enhance your home's comfort and curb appeal. We work with common materials and styles, from double-hung and casement to sliding, bay, and picture windows.",
    link: "/services/window-installation",
    buttonText: "Learn more about window installation",
  },
  {
    icon: "Wrench",
    title: "Window Repair",
    description:
      "Fast, reliable window glass repair for broken panes, foggy windows, and seal failures. We can often repair the glass without replacing the entire window unit.",
    link: "/services/window-repair",
    buttonText: "Learn more about window repair",
  },
  {
    icon: "DoorOpen",
    title: "Door Installation",
    description:
      "Entry doors, patio doors, sliding glass doors, French doors, storm doors, and pet doors in fiberglass, steel, wood, and composite. Smart locks and security upgrades available.",
    link: "/services/door-installation",
    buttonText: "Learn more about door installation",
  },
  {
    icon: "Building2",
    title: "Commercial Services",
    description:
      "Storefront glass, commercial doors, and apartment window replacement for Charlotte-area businesses.",
    link: "/services/commercial-storefront-glass-installation",
    buttonText: "Learn more about commercial services",
  },
];

const glassCityPages: GlassCityPageSeed[] = [
  {
    title: "Monroe, NC",
    slug: "areas-served-monroe-nc",
    path: "/service-areas/monroe",
    seoTitle: "Glass & Door Services in Monroe, NC | Glass & Door Pro",
    seoDescription:
      "Monroe, NC's local glass and door company. Frameless showers, window installation, door installation, window repair, and commercial glass. Owner-operator with 15+ years of experience. Call (704) 771-6111.",
    seoKeywords:
      "glass services Monroe NC, frameless shower doors Monroe NC, window installation Monroe NC, door installation Monroe NC, window repair Monroe NC",
    ogImageUrl: "/images/glass-door-pro/city-monroe-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Monroe, NC",
        subheading:
          "Frameless shower doors, window and door installation, window repair, and commercial glass — installed personally by Doug, your Monroe-based owner-operator with 15+ years of experience. Same-week appointments. Saturday hours available.",
        imageUrl: "/images/glass-door-pro/city-monroe-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Your Local Glass & Door Company in Monroe",
      introContent:
        "<p>Glass and Door Pro is based right here in Monroe. Doug Adams lives and works in Union County, and Monroe homeowners are some of our most valued clients — many have become repeat customers and personal friends.</p><p>Being local matters more than most people realize. When you call a Monroe-area company for a frameless shower install, you're not waiting for a Charlotte-based crew to fit you into a route. We answer the phone, get out for a quote quickly, and don't add a travel premium to Union County projects the way some competitors quietly do. We're also the only local glass and door specialist working Saturdays.</p><p>Whether you're remodeling a master bathroom in one of the newer subdivisions off Highway 74, repairing a foggy bedroom window in a 1990s home near Sun Valley, or replacing the entry door on a historic home near downtown Monroe, this is the kind of work I do every week.</p>",
      benefitsTitle: "Why Monroe Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "MapPin",
          title: "Truly Local",
          description:
            "Based in Monroe, not Charlotte. Faster response, no travel surcharges, and a genuine personal stake in our reputation around town.",
        },
        {
          icon: "User",
          title: "Owner-Operator",
          description:
            "Doug measures, plans, and installs every project personally. You won't get a sales rep followed by a subcontracted crew.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments",
          description:
            "We work Monday through Saturday, 7 AM to 6 PM. Saturday installs and quotes are common.",
        },
        {
          icon: "Wrench",
          title: "Repair Before Replace",
          description:
            "Where it makes sense, we'll repair fogged glass, broken seals, or worn hardware instead of selling something new you don't need.",
        },
        {
          icon: "BadgeCheck",
          title: "15+ Years of Experience",
          description:
            "From simple window repairs to complex frameless steam shower enclosures, Doug has the experience to do the job right.",
        },
        {
          icon: "CheckCircle",
          title: "Free, Clear Quotes",
          description:
            "We come out to your home, look at the project, and leave you with a clear written quote the same visit.",
        },
      ],
      servicesTitle: "Our Services in Monroe, NC",
      servicesIntro:
        "Most Monroe homeowners find us for one specific service, then come back for others. Here's the full range of what we install and repair across Union County:",
      serviceCards: cityServiceCards,
      areasTitle: "Neighborhoods and Areas We Serve In & Around Monroe",
      areasIntro:
        "We regularly work throughout the Monroe area and surrounding Union County communities, including:",
      areas: [
        "Downtown Monroe and the historic district",
        "Belk Heritage District",
        "The neighborhoods around Sun Valley High School",
        "Subdivisions along Highway 74 and Highway 200",
        "The growing developments off the Monroe Bypass",
        "Indian Trail and Stallings",
        "Waxhaw and Weddington",
        "Wesley Chapel and Marvin",
        "Lake Park, Mineral Springs, and Unionville",
      ],
      areasClosing:
        'Not seeing your area listed? We almost certainly cover it. Give us a call at <a href="tel:+17047716111">(704) 771-6111</a> and we\'ll let you know.',
      galleryTitle: "Our Work in the Monroe Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower2-1280w.webp",
          alt: "Modern frameless shower door with gold hardware fixtures installed in Monroe, NC",
        },
        {
          url: "/images/glass-door-pro/gallery-door1-1280w.webp",
          alt: "Professional entry door installation by Glass and Door Pro serving Monroe and Indian Trail, NC",
        },
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Energy-efficient window installation for homes in the Monroe and greater Charlotte, NC area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Monroe, NC",
      faqs: [
        {
          question: "Are you actually based in Monroe, NC?",
          answer:
            "<p>Yes. Glass and Door Pro is based right here in Monroe. Doug lives and works in Union County, which means shorter response times for Monroe homeowners and a real local presence — not a Charlotte-based company driving an hour into Union County for a quote.</p>",
        },
        {
          question: "How quickly can you get out for a quote in Monroe?",
          answer:
            "<p>For Monroe addresses, we can usually get out for a free in-home quote within a few business days, and same-week appointments are common. Saturday appointments are available, which is a meaningful difference vs. most of our competitors who are weekday-only.</p>",
        },
        {
          question: "Do you serve all of Union County or just Monroe city limits?",
          answer:
            "<p>All of Union County. We regularly work in Monroe, Indian Trail, Stallings, Waxhaw, Weddington, Wesley Chapel, Marvin, Lake Park, Mineral Springs, and Unionville. Our service area extends well into the greater Charlotte metro and across the SC line to Fort Mill and Indian Land.</p>",
        },
        {
          question: "What's the most common service homeowners in Monroe need?",
          answer:
            "<p>It's a mix. Frameless shower doors are very popular in newer Monroe construction and in master bathroom remodels. Window repair, especially foggy windows from failed seals, is a steady call, particularly in homes built in the late 1990s through mid-2000s. Window and door installation picks up seasonally.</p>",
        },
        {
          question: "Are you licensed and insured?",
          answer:
            "<p>Yes. Glass and Door Pro is fully insured and licensed for the work we do in North Carolina. We bring proof of insurance to the in-home consultation if you'd like to see it.</p>",
        },
        {
          question: "Do you do work on older Monroe homes, or just new construction?",
          answer:
            "<p>Both. Doug has worked on Monroe homes from every era — historic homes in downtown and around the Belk Heritage District, mid-century homes on the south side, and brand-new construction in the developments expanding around the bypass. Older homes often need more careful measurement because walls aren't always plumb, but that's exactly the kind of work we specialize in.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Monroe?",
      ctaBody:
        "Call, text, or fill out the form for a free in-home quote. Doug will come out personally — and Saturday appointments are available.",
      ctaFooter: "Mon–Sat: 7am – 6pm | Based in Monroe, NC",
    }),
  },
  {
    title: "Charlotte, NC",
    slug: "areas-served-charlotte-nc",
    path: "/service-areas/charlotte",
    seoTitle: "Glass & Door Services in Charlotte, NC | Glass & Door Pro",
    seoDescription:
      "Personal, owner-operated glass and door services for Charlotte, NC homeowners. Frameless showers, window installation, door installation, window repair, and commercial glass. 15+ years of experience. Call (704) 771-6111.",
    seoKeywords:
      "glass services Charlotte NC, frameless shower doors Charlotte NC, window installation Charlotte NC, door installation Charlotte NC, window repair Charlotte NC",
    ogImageUrl: "/images/glass-door-pro/city-charlotte-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Charlotte, NC",
        subheading:
          "Personal, owner-operated frameless shower doors, window and door installation, window repair, and commercial glass — for homeowners and businesses throughout Charlotte, NC. 15+ years of experience. Saturday appointments available.",
        imageUrl: "/images/glass-door-pro/city-charlotte-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Personal Service for Charlotte Homeowners",
      introContent:
        "<p>Charlotte has no shortage of glass and door companies — but most of them have something in common: when you call, you talk to a salesperson. When the crew shows up, they're subcontractors. When something needs follow-up, you're calling a 1-800 number.</p><p>Glass and Door Pro is different. I'm Doug — owner, operator, and the person who'll actually come measure your project, plan it with you, and install it myself. I've been doing this work in the greater Charlotte area for 15+ years, and the reason I keep getting referrals is simple: the person who quotes the job is the person who does the job.</p><p>We're based in Monroe, just 30-40 minutes from most Charlotte addresses, and the greater Charlotte metro is our primary service area. Whether you're remodeling a master bathroom in SouthPark, replacing a foggy bedroom window in NoDa, or putting a new entry door on a craftsman bungalow in Dilworth, this is the work I do every week.</p>",
      benefitsTitle: "Why Charlotte Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "User",
          title: "Owner On Every Job",
          description:
            "Doug personally measures, plans, and installs every project. You don't get a salesperson followed by a subcontracted crew.",
        },
        {
          icon: "BadgeCheck",
          title: "Honest Pricing",
          description:
            "Our overhead is lower than the larger Charlotte shops, which means competitive quotes on equivalent quality.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments",
          description:
            "Mon-Sat, 7 AM to 6 PM. Saturday availability is one of the most common reasons clients choose us.",
        },
        {
          icon: "Wrench",
          title: "Repair Before Replace",
          description:
            "Where it makes sense, we repair foggy glass, failed seals, or worn hardware instead of selling something you don't need.",
        },
        {
          icon: "ShieldCheck",
          title: "15+ Years of Experience",
          description:
            "From simple window repairs to complex frameless steam shower enclosures, we have the experience to do the job right.",
        },
        {
          icon: "Phone",
          title: "Personal, Not Corporate",
          description: "We answer the phone. We text back. We show up when we say we will.",
        },
      ],
      servicesTitle: "Our Services in Charlotte, NC",
      servicesIntro:
        "Most Charlotte clients find us for one specific project, then come back for others. Here's the full range of services we install and repair throughout the city:",
      serviceCards: cityServiceCards,
      areasTitle: "Charlotte Neighborhoods and Areas We Serve",
      areasIntro: "We work throughout the greater Charlotte metro area, including:",
      areas: [
        "South Charlotte: SouthPark, Ballantyne, Pineville, Quail Hollow",
        "Historic neighborhoods: Myers Park, Dilworth, Eastover, Plaza Midwood",
        "East Charlotte: Cotswold, Elizabeth, Matthews-adjacent",
        "North Charlotte: NoDa, Optimist Park, Plaza Hills",
        "Uptown and South End",
        "Matthews, Mint Hill, Pineville",
        "Huntersville, Cornelius, and Davidson",
        "Concord and Harrisburg",
        "Across the SC line: Fort Mill, Indian Land, Tega Cay, Rock Hill",
      ],
      areasClosing:
        'Not seeing your neighborhood? We almost certainly cover it. Give us a call at <a href="tel:+17047716111">(704) 771-6111</a> and we\'ll let you know.',
      galleryTitle: "Our Work in the Charlotte Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower1-1280w.webp",
          alt: "Custom frameless glass shower enclosure installed by Glass and Door Pro in a Charlotte, NC area home",
        },
        {
          url: "/images/glass-door-pro/gallery-door2-1280w.webp",
          alt: "Custom wooden entry door installation with decorative planters by Glass and Door Pro in Charlotte, NC",
        },
        {
          url: "/images/glass-door-pro/gallery-door3-1280w.webp",
          alt: "Charming blue entry door installed by Glass and Door Pro in the Charlotte, NC metro area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Charlotte, NC",
      faqs: [
        {
          question: "Do you actually come into Charlotte, or do you stay in Union County?",
          answer:
            "<p>We work throughout Charlotte regularly. Glass and Door Pro is based in Monroe, but the greater Charlotte metro is our primary service area. We have clients across South Charlotte, Ballantyne, SouthPark, Myers Park, Dilworth, Cotswold, and most other Charlotte neighborhoods. We're typically less than 40 minutes from any Charlotte address.</p>",
        },
        {
          question: "Is there a travel fee for working in Charlotte?",
          answer:
            "<p>No. Our quotes for Charlotte addresses include everything — no separate travel fees, no service-area surcharges, no hidden costs. The price you see is the price you pay.</p>",
        },
        {
          question: "What kinds of projects do you do in Charlotte?",
          answer:
            "<p>Everything. Frameless shower doors are our most-requested service in Charlotte, especially in higher-end neighborhoods like SouthPark, Ballantyne, and Myers Park. We also do window installation, door installation, window repair (foggy windows, broken panes, seal failures), and commercial glass for storefronts and offices throughout the city.</p>",
        },
        {
          question: "How quickly can you get out for a quote in Charlotte?",
          answer:
            "<p>Usually within a few business days. Saturday appointments are available, which is one of the most common reasons Charlotte homeowners choose us — most glass and door companies are weekday-only, and Saturday quotes work much better around busy schedules.</p>",
        },
        {
          question: "Why would I choose a Monroe-based company over a Charlotte-based one?",
          answer:
            "<p>Three reasons most clients tell us. First, Doug personally handles every project — no sales reps, no subcontracted crews. Second, our pricing tends to be more competitive than the larger Charlotte shops because our overhead is lower. Third, Saturday availability — we work Monday through Saturday. The Monroe location is only a disadvantage if you assume we don't actually work in Charlotte, which we do, every week.</p>",
        },
        {
          question:
            "Do you do work in historic Charlotte neighborhoods like Dilworth or Myers Park?",
          answer:
            "<p>Yes. Historic Charlotte homes are some of our favorite projects. Older homes often require more careful measurement because walls and openings aren't always plumb or square, but that's exactly what 15+ years of experience prepares you for. We've worked on craftsman bungalows, mid-century homes, and older transitional homes throughout Dilworth, Myers Park, Eastover, Plaza Midwood, and similar neighborhoods.</p>",
        },
        {
          question: "Are you licensed and insured to work in Charlotte?",
          answer:
            "<p>Yes. Glass and Door Pro is fully insured and licensed for the work we do throughout North Carolina, including Charlotte and Mecklenburg County. Proof of insurance is available at the in-home consultation.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Charlotte?",
      ctaBody:
        "Call, text, or fill out the form for a free in-home quote. Doug will come out personally — and Saturday appointments are available.",
      ctaFooter: "Mon–Sat: 7am – 6pm | Serving the greater Charlotte metro",
    }),
  },
  {
    title: "Indian Trail, NC",
    slug: "service-areas-indian-trail",
    path: "/service-areas/indian-trail",
    seoTitle: "Glass and Door Services in Indian Trail, NC | Glass and Door Pro",
    seoDescription:
      "Frameless showers, window installation, window repair, door installation, and commercial glass services in Indian Trail, NC. Owner-operated, honest pricing, Saturday appointments. Call (704) 771-6111.",
    seoKeywords:
      "glass services Indian Trail NC, frameless shower doors Indian Trail NC, window installation Indian Trail NC, door installation Indian Trail NC, window repair Indian Trail NC",
    ogImageUrl: "/images/glass-door-pro/city-indian-trail-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Indian Trail, NC",
        subheading:
          "Frameless shower doors, window installation, door installation, window repair, and commercial glass services for Indian Trail homeowners and businesses. Owner-operated with 15+ years of experience. Monroe-based, locally serving Union County. Saturday appointments available.",
        imageUrl: "/images/glass-door-pro/city-indian-trail-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Your Local Glass and Door Company in Indian Trail",
      introContent:
        "<p>Indian Trail has grown fast — and with that growth comes a lot of homeowners upgrading aging houses, finishing bathrooms that were never quite done, and putting real money into properties that now sit at real values. The glass and door work that gets done in Indian Trail reflects that — more frameless shower enclosures, more window replacements in homes from the late 90s and early 2000s, more entry door upgrades as people put finishing touches on homes they plan to stay in.</p><p>Glass and Door Pro is based in Monroe, which means Indian Trail is right in our backyard. Doug handles every project personally — there's no subcontractor showing up, no crew you haven't met. When you call for a quote, you're talking to the person who will measure the job and install the work. That's a different experience than calling a franchise and getting whoever is available.</p><p>Whether you're adding a frameless glass enclosure to a master bath remodel, replacing foggy windows in a guest room, or installing a new entry door before a home sale, the process starts with a clear quote and ends with work you're happy with. Saturday appointments are available for homeowners who can't take a weekday off.</p>",
      benefitsTitle: "Why Indian Trail Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "User",
          title: "Owner On Every Job",
          description:
            "Doug measures, plans, and installs every project personally. You won't get a subcontractor — the person who quotes the job is the person who does it.",
        },
        {
          icon: "MapPin",
          title: "Monroe-Based, Truly Local",
          description:
            "We're not a Charlotte company that occasionally drives to Union County. Glass and Door Pro is based in Monroe and Indian Trail is one of our most consistent service areas.",
        },
        {
          icon: "FileText",
          title: "Honest, Written Quotes",
          description:
            "Every quote is clear and written before work begins. No surprises on the invoice, no pressure to upgrade to things you don't need.",
        },
        {
          icon: "Wrench",
          title: "Repair Before Replace",
          description:
            "If your window can be repaired rather than replaced, we'll tell you. We don't push replacement to increase the ticket when repair is the right call.",
        },
        {
          icon: "BadgeCheck",
          title: "15+ Years of Experience",
          description:
            "Doug has been doing this work in Union County for over 15 years. He's seen every house type in Indian Trail and knows how to handle them.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments",
          description:
            "Mon–Sat, 7am–6pm. Saturday availability is the norm, not an exception — because most homeowners can't take a weekday off for a glass quote.",
        },
      ],
      servicesTitle: "Our Services in Indian Trail, NC",
      servicesIntro:
        "Most Indian Trail homeowners come to us for one specific project. Here's the full range of what we install, repair, and maintain in this area.",
      serviceCards: cityServiceCards,
      areasTitle: "Neighborhoods and Areas We Serve in Indian Trail",
      areasIntro:
        "We regularly work throughout Indian Trail and surrounding Union County communities, including:",
      areas: [
        "Bonterra and the neighborhoods around Bonterra Town Center",
        "Chestnut Square and surrounding subdivisions",
        "The neighborhoods along Unionville-Indian Trail Road",
        "Stallings Road corridor and nearby communities",
        "Sun Valley High School area neighborhoods",
        "Sardis Church Road and east Indian Trail",
        "The growing developments off Wesley Chapel Road",
        "Crooked Creek and nearby subdivisions",
      ],
      areasClosing:
        "Not seeing your neighborhood? We almost certainly serve it. Give us a call at (704) 771-6111 and we'll let you know.",
      galleryTitle: "Our Work in the Indian Trail Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower1-1280w.webp",
          alt: "Custom frameless glass shower enclosure installed by Glass and Door Pro in the Indian Trail area",
        },
        {
          url: "/images/glass-door-pro/gallery-door1-1280w.webp",
          alt: "Professional entry door installation by Glass and Door Pro serving Indian Trail, NC",
        },
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Energy-efficient window installation for homes in the Indian Trail, NC area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Indian Trail, NC",
      faqs: [
        {
          question: "Are you actually based near Indian Trail, or do you come from Charlotte?",
          answer:
            "<p>Glass and Door Pro is based in Monroe, NC — which puts us right in Indian Trail's backyard. We work in Indian Trail regularly and don't charge travel fees for Union County service areas. When you call, you're getting a local company, not a Charlotte franchise routing work to whoever is closest.</p>",
        },
        {
          question: "How quickly can you get out to Indian Trail for a quote?",
          answer:
            "<p>We typically schedule within a few days. Saturday appointments are available, which works well for Indian Trail homeowners who can't take a weekday off. Call or text (704) 771-6111 and we'll find a time that works.</p>",
        },
        {
          question: "What's the most common project you do in Indian Trail?",
          answer:
            "<p>Frameless shower enclosures are the most frequent call — Indian Trail has a lot of homes from the late 1990s and early 2000s where the original shower surrounds are ready for an upgrade. Window replacement in that same era of homes is also very common, particularly for fogged double-pane units with failed seals.</p>",
        },
        {
          question: "Do you work on newer construction in Indian Trail, or only older homes?",
          answer:
            "<p>Both. We work on everything from recent construction where a builder's standard shower door needs to be upgraded, to 1990s homes getting full bathroom remodels. Doug has worked on virtually every home style and age in Indian Trail.</p>",
        },
        {
          question: "Are you licensed and insured to work in Indian Trail and Union County?",
          answer:
            "<p>Yes. Glass and Door Pro is licensed and insured to operate throughout Union County, including Indian Trail, Stallings, Waxhaw, Weddington, Wesley Chapel, and Monroe.</p>",
        },
        {
          question: "Do you do commercial glass work in Indian Trail?",
          answer:
            "<p>Yes. We handle commercial glass and door work for Indian Trail businesses — storefront glass, commercial door installation and repair, and commercial window replacement. View our full commercial services at glassanddoorpro.com/services.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Indian Trail?",
      ctaBody:
        "Call, text, or fill out the form for a free quote. Doug will come out personally, review the project, and give you clear next steps.",
      ctaFooter: "Mon–Sat, 7am–6pm | Monroe-based, serving Indian Trail and Union County",
    }),
  },
  {
    title: "Stallings, NC",
    slug: "service-areas-stallings",
    path: "/service-areas/stallings",
    seoTitle: "Glass and Door Services in Stallings, NC | Glass and Door Pro",
    seoDescription:
      "Frameless showers, window installation, window repair, and door installation in Stallings, NC. Monroe-based, owner-operated, Saturday appointments available. Call (704) 771-6111.",
    seoKeywords:
      "glass services Stallings NC, frameless shower doors Stallings NC, window installation Stallings NC, door installation Stallings NC, window repair Stallings NC",
    ogImageUrl: "/images/glass-door-pro/city-stallings-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Stallings, NC",
        subheading:
          "Frameless shower enclosures, replacement windows, door installation, and window repair for Stallings homeowners. Monroe-based and owner-operated — Doug handles every project personally. Saturday appointments available.",
        imageUrl: "/images/glass-door-pro/city-stallings-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Glass and Door Pro — Serving Stallings Homeowners",
      introContent:
        "<p>Stallings sits in a pocket of Union County where established neighborhoods mix with newer developments, and the homes reflect that — everything from early 2000s construction that's ready for bathroom upgrades and window replacements, to recently built homes where owners are customizing beyond the builder standard. Glass and door work in Stallings tends to be detail-oriented, done by homeowners who care about how things look and want the work done right.</p><p>Glass and Door Pro is a Monroe-based business, which makes Stallings one of our closest and most regular service areas. Doug doesn't hand off projects to other installers — he measures, plans, and installs every job himself. That personal accountability is something homeowners in Stallings notice and mention when they refer us to neighbors.</p><p>The most common calls we get from Stallings are frameless glass shower enclosures for master bath remodels, fogged window replacement, and front entry door upgrades. We also handle window repair when replacement isn't necessary — and we'll always give you an honest read on which one makes sense for your situation.</p>",
      benefitsTitle: "Why Stallings Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "MapPin",
          title: "Truly Local",
          description:
            "Based in Monroe, we're closer to Stallings than most Charlotte-based glass companies. No travel surcharges, no scheduling delays because we're booked out across the metro.",
        },
        {
          icon: "User",
          title: "One Person, Start to Finish",
          description:
            "Doug handles the quote, the measurement, and the installation. There's no handoff between sales and a crew you've never met.",
        },
        {
          icon: "Droplets",
          title: "Frameless Shower Expertise",
          description:
            "Frameless glass enclosures require precise measurement and careful installation. Doug has installed hundreds of them across Union County and brings that experience to every Stallings project.",
        },
        {
          icon: "Wrench",
          title: "Honest Assessment on Repairs",
          description:
            "We don't push replacement when repair is viable. If a fogged window can be fixed with an IGU swap rather than a full replacement, we'll tell you — and price it accordingly.",
        },
        {
          icon: "BadgeCheck",
          title: "Competitive, Upfront Pricing",
          description:
            "Our pricing reflects a local, owner-operated business — lower overhead than a franchise means more competitive quotes without cutting corners on materials.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Availability",
          description:
            "Mon–Sat, 7am–6pm. Saturday appointments are standard, not a premium — because most of our Stallings clients work during the week.",
        },
      ],
      servicesTitle: "Our Services in Stallings, NC",
      servicesIntro:
        "Most Stallings homeowners reach out for one specific project. Here's everything we do in this area.",
      serviceCards: cityServiceCards,
      areasTitle: "Neighborhoods and Areas We Serve in and Around Stallings",
      areasIntro: "We work regularly throughout Stallings and the nearby communities, including:",
      areas: [
        "The neighborhoods along Stallings Road and NC-84",
        "Chestnut Square area and surrounding subdivisions",
        "The communities connecting Stallings to Indian Trail",
        "Fairhaven and nearby residential developments",
        "The subdivisions off Potter Road and Lawyers Road",
        "Neighborhoods near Stallings Elementary and Bain Elementary",
        "The residential areas bordering Matthews to the north",
      ],
      areasClosing:
        "Not seeing your street or subdivision? Call (704) 771-6111 — we serve virtually all of Stallings and surrounding Union County.",
      galleryTitle: "Our Work in the Stallings Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower2-1280w.webp",
          alt: "Modern frameless shower door installed by Glass and Door Pro in the Stallings area",
        },
        {
          url: "/images/glass-door-pro/gallery-door2-1280w.webp",
          alt: "Custom wooden entry door installation by Glass and Door Pro in the Stallings area",
        },
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Window installation for homes in the Stallings, NC area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Stallings, NC",
      faqs: [
        {
          question: "Do you serve Stallings, or is it too far from Monroe?",
          answer:
            "<p>Stallings is one of our most regular service areas — it's right next door to Monroe and Indian Trail, and we're out there multiple times a week. No travel fees, no minimum project size for the area.</p>",
        },
        {
          question: "What glass and door projects are most common in Stallings?",
          answer:
            "<p>Frameless shower enclosures are the top request — many Stallings homes from the early 2000s have tile showers with dated framed doors that homeowners are ready to upgrade. Window replacement for fogged or failed double-pane units is also very common, along with entry door replacements for homes going on the market or getting exterior refreshes.</p>",
        },
        {
          question: "Can you replace just one fogged window, or do you require a whole-house job?",
          answer:
            "<p>We replace single windows all the time. There's no minimum project requirement. If one window has a failed seal, we'll replace that one unit — and we'll tell you honestly whether the others are likely to follow soon so you can make an informed decision.</p>",
        },
        {
          question: "How do I get a quote for a frameless shower in Stallings?",
          answer:
            "<p>Call or text (704) 771-6111 or fill out the contact form. Doug will schedule an in-home measurement — he needs to see the actual shower space before quoting because every opening is different. Most frameless shower quotes are done on-site within a few days of your call.</p>",
        },
        {
          question: "Are you licensed and insured to work in Stallings?",
          answer:
            "<p>Yes. Glass and Door Pro is licensed and insured to work throughout Union County, including Stallings, Indian Trail, Monroe, Waxhaw, and surrounding areas.</p>",
        },
        {
          question: "Do you do window repair in Stallings, or only replacement?",
          answer:
            "<p>Both. If a window has a failed seal causing fogging, we can often replace just the insulated glass unit (IGU) rather than the entire window — which is significantly less expensive. We assess each window honestly and recommend the option that makes the most sense for the condition and age of the window.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Stallings?",
      ctaBody:
        "Call, text, or fill out the form for a free quote. Doug will come out personally and give you clear next steps.",
      ctaFooter: "Mon–Sat, 7am–6pm | Monroe-based, serving Stallings and Union County",
    }),
  },
  {
    title: "Wesley Chapel, NC",
    slug: "service-areas-wesley-chapel",
    path: "/service-areas/wesley-chapel",
    seoTitle: "Glass and Door Services in Wesley Chapel, NC | Glass and Door Pro",
    seoDescription:
      "Frameless shower doors, window installation, window repair, and door installation in Wesley Chapel, NC. Monroe-based, owner-operated, Saturday appointments. Call (704) 771-6111.",
    seoKeywords:
      "glass services Wesley Chapel NC, frameless shower doors Wesley Chapel NC, window installation Wesley Chapel NC, door installation Wesley Chapel NC, window repair Wesley Chapel NC",
    ogImageUrl: "/images/glass-door-pro/city-wesley-chapel-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Wesley Chapel, NC",
        subheading:
          "Frameless shower enclosures, window replacement, door installation, and window repair for Wesley Chapel homeowners. Monroe-based and owner-operated — every project handled personally by Doug Adams. Saturday appointments available.",
        imageUrl: "/images/glass-door-pro/city-wesley-chapel-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Glass and Door Services Right Here in Wesley Chapel",
      introContent:
        "<p>Wesley Chapel is one of the fastest-growing areas in Union County — and the homes here reflect a range of eras and upgrade needs. Newer subdivisions where buyers are customizing above builder standard sit alongside established communities where owners are making long-term investments in their properties. Glass and door work in Wesley Chapel tends to involve homeowners who have done their research and want the job done by someone who knows what they're doing.</p><p>Glass and Door Pro is based in Monroe, which makes Wesley Chapel a short drive and a regular part of our weekly schedule. Doug handles every project personally from the initial measurement through the finished installation. You won't be handed off to a subcontractor, and you won't get a different person showing up than the one who gave you the quote.</p><p>We work throughout Wesley Chapel on frameless glass shower installations, window replacement and repair, and exterior door upgrades. If you're in the middle of a bathroom remodel and want a frameless enclosure to finish it off, or you've got a handful of fogged windows that need addressing, or your front door is due for an upgrade — we handle all of it, and the process is straightforward from first call to finished job.</p>",
      benefitsTitle: "Why Wesley Chapel Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "MapPin",
          title: "Monroe-Based, Genuinely Local",
          description:
            "We're not a large Charlotte operation that services Union County when it's convenient. Monroe is home base, and Wesley Chapel is right in our regular service rotation.",
        },
        {
          icon: "User",
          title: "Owner Does Every Job",
          description:
            "Every project is handled by Doug — the same person who answers the phone, measures the opening, and installs the work. That's not how most glass companies operate, and it shows in the results.",
        },
        {
          icon: "Droplets",
          title: "Custom Frameless Shower Work",
          description:
            "Frameless glass enclosures are precision work. Wrong measurements mean panels that don't fit. Doug has installed hundreds of frameless enclosures across Union County and approaches every one with that same precision.",
        },
        {
          icon: "BadgeCheck",
          title: "No Unnecessary Upsells",
          description:
            "If a window can be repaired instead of replaced, we'll say so. If a less expensive door option meets your needs, we'll show it to you. We'd rather give honest advice and earn a referral than oversell a single project.",
        },
        {
          icon: "DollarSign",
          title: "Competitive Pricing",
          description:
            "Owner-operated means lower overhead. That translates directly to more competitive pricing compared to franchise operations with more layers of cost.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments Available",
          description:
            "We schedule Mon–Sat, 7am–6pm. Saturday is available by default — not something you have to request specially or pay extra for.",
        },
      ],
      servicesTitle: "Our Services in Wesley Chapel, NC",
      servicesIntro: "",
      serviceCards: cityServiceCards,
      areasTitle: "Neighborhoods and Areas We Serve in Wesley Chapel",
      areasIntro:
        "We work throughout Wesley Chapel and the surrounding Union County area, including:",
      areas: [
        "The subdivisions along Wesley Chapel-Stouts Road",
        "Neighborhoods off Highway 74 in the Wesley Chapel corridor",
        "The growing developments off Weddington Road",
        "Communities near Wesley Chapel Middle and Parkwood High School",
        "The residential areas connecting Wesley Chapel to Waxhaw",
        "Neighborhoods near Antioch Church Road",
        "The developments along Unionville-Indian Trail Road",
      ],
      areasClosing:
        "Not seeing your neighborhood? Call (704) 771-6111 — we cover all of Wesley Chapel and surrounding areas.",
      galleryTitle: "Our Work in the Wesley Chapel Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower1-1280w.webp",
          alt: "Custom frameless glass shower enclosure installed by Glass and Door Pro in the Wesley Chapel area",
        },
        {
          url: "/images/glass-door-pro/gallery-door3-1280w.webp",
          alt: "Entry door installation by Glass and Door Pro in the Wesley Chapel area",
        },
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Window replacement for homes in the Wesley Chapel, NC area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Wesley Chapel, NC",
      faqs: [
        {
          question: "Do you come to Wesley Chapel regularly, or is it out of your usual area?",
          answer:
            "<p>Wesley Chapel is a regular part of our schedule — we're out there multiple times a week. Based in Monroe, we cover all of Union County without travel fees or minimum project requirements.</p>",
        },
        {
          question: "How does the frameless shower quote process work in Wesley Chapel?",
          answer:
            "<p>Doug schedules an in-home visit to measure the shower opening and discuss your preferences — glass thickness, hardware finish, door configuration. The measurement has to happen on-site because every shower is different. From that visit, you get a written quote. Most visits are scheduled within a few days of your initial call.</p>",
        },
        {
          question:
            "What's the best way to handle a home with multiple fogged windows in Wesley Chapel?",
          answer:
            "<p>We assess each window individually. Some may benefit from IGU-only replacement (just the glass, not the frame), while others may warrant full window replacement depending on the frame condition and age. We'll walk through the windows with you, give you an honest read on each one, and let you decide how to prioritize based on budget and urgency.</p>",
        },
        {
          question:
            "Can you match the hardware finish on a new shower door to existing fixtures in the bathroom?",
          answer:
            "<p>Yes. We offer a range of hardware finishes — brushed nickel, matte black, chrome, oil-rubbed bronze, and others — so the new door hardware coordinates with your existing fixtures. Doug discusses finish options during the in-home measurement.</p>",
        },
        {
          question: "Are you licensed and insured to work in Wesley Chapel?",
          answer:
            "<p>Yes. Glass and Door Pro is fully licensed and insured to work throughout Union County, including Wesley Chapel, Monroe, Indian Trail, Waxhaw, and surrounding communities.</p>",
        },
        {
          question:
            "Do you do door installation in Wesley Chapel for homes that already have the door purchased?",
          answer:
            "<p>Yes. We can install a door you've already purchased or supply and install the door. If you've already bought a door, share the brand and model with us before the installation visit so we can confirm it includes everything needed for a proper install.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Wesley Chapel?",
      ctaBody:
        "Call, text, or fill out the form. Doug will schedule a visit personally and walk you through next steps.",
      ctaFooter: "Mon–Sat, 7am–6pm | Monroe-based, serving Wesley Chapel and Union County",
    }),
  },
  {
    title: "Waxhaw, NC",
    slug: "service-areas-waxhaw",
    path: "/service-areas/waxhaw",
    seoTitle: "Glass and Door Services in Waxhaw, NC | Glass and Door Pro",
    seoDescription:
      "Frameless shower doors, window installation, window repair, and door installation in Waxhaw, NC. Monroe-based, owner-operated, honest pricing. Saturday appointments available. Call (704) 771-6111.",
    seoKeywords:
      "glass services Waxhaw NC, frameless shower doors Waxhaw NC, window installation Waxhaw NC, door installation Waxhaw NC, window repair Waxhaw NC",
    ogImageUrl: "/images/glass-door-pro/city-waxhaw-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Waxhaw, NC",
        subheading:
          "Custom frameless shower enclosures, window replacement, door installation, and window repair for Waxhaw homeowners. Monroe-based, owner-operated, and personally handled by Doug Adams on every project. Saturday appointments available.",
        imageUrl: "/images/glass-door-pro/city-waxhaw-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Your Glass and Door Company in Waxhaw",
      introContent:
        "<p>Waxhaw homeowners tend to have high standards for how their homes are finished — it's that kind of community. When someone in Waxhaw is putting in a frameless glass shower, they're not looking for the cheapest option. They want it measured right, installed cleanly, and finished with hardware that matches the rest of the bathroom. That's exactly the kind of work Glass and Door Pro does.</p><p>Doug is based in Monroe and has been working in Waxhaw for years. He knows the neighborhoods, he knows the home styles, and he's installed glass and doors in enough Waxhaw bathrooms and entryways to know what works and what doesn't. When he comes out for a quote, you're getting real expertise — not a salesperson reading from a product catalog.</p><p>Waxhaw's housing mix means we see everything from custom homes where the finishes need to be exactly right, to more modest properties where the goal is a quality upgrade without overspending. We approach both with the same care. A clear quote, honest advice, and work that holds up.</p>",
      benefitsTitle: "Why Waxhaw Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "BadgeCheck",
          title: "Attention to Detail",
          description:
            "Waxhaw homes are well-maintained and finished carefully. We bring the same standard to every installation — precise measurements, clean hardware installation, and a finished result that looks right.",
        },
        {
          icon: "MapPin",
          title: "Monroe-Based, No Travel Fees",
          description:
            "We're based right next door in Monroe. Waxhaw is a regular part of our weekly schedule, not an occasional out-of-area trip.",
        },
        {
          icon: "Droplets",
          title: "Custom Frameless Shower Installations",
          description:
            "From standard single-door enclosures to more complex configurations with multiple panels, we measure and install frameless glass that fits the space perfectly.",
        },
        {
          icon: "Wrench",
          title: "Honest on Repair vs. Replace",
          description:
            "We don't recommend replacement when repair makes sense. If your windows can be fixed with a glass-only IGU swap, we'll price that option first.",
        },
        {
          icon: "Palette",
          title: "Hardware That Matches Your Home",
          description:
            "We offer a range of finishes and help you select hardware that coordinates with your existing fixtures and home style — not just whatever is in stock.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments Are Standard",
          description:
            "We work Mon–Sat, 7am–6pm. Saturday availability is built into our regular schedule for Waxhaw homeowners who can't do weekday appointments.",
        },
      ],
      servicesTitle: "Our Services in Waxhaw, NC",
      servicesIntro: "",
      serviceCards: cityServiceCards,
      areasTitle: "Neighborhoods and Areas We Serve in and Around Waxhaw",
      areasIntro:
        "We work throughout Waxhaw and the surrounding southern Union County area, including:",
      areas: [
        "Downtown Waxhaw and the historic district",
        "Cureton and Cureton West",
        "Millbridge and nearby communities",
        "Providence Downs South area",
        "The neighborhoods along Waxhaw-Indian Trail Road",
        "Waxhaw-Marvin Road corridor",
        "The communities off New Town Road and Kensington Drive",
        "Rea Road extension and nearby residential areas",
      ],
      areasClosing:
        "Not seeing your neighborhood? We serve all of Waxhaw — call (704) 771-6111 and we'll confirm.",
      galleryTitle: "Our Work in the Waxhaw Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower2-1280w.webp",
          alt: "Modern frameless shower door installed by Glass and Door Pro in the Waxhaw area",
        },
        {
          url: "/images/glass-door-pro/gallery-door2-1280w.webp",
          alt: "Custom wooden entry door installed by Glass and Door Pro in the Waxhaw area",
        },
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Replacement windows installed by Glass and Door Pro in the Waxhaw, NC area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Waxhaw, NC",
      faqs: [
        {
          question: "Do you work in Waxhaw regularly, or is it far from your base?",
          answer:
            "<p>Waxhaw is one of our most consistent service areas. We're based in Monroe, which is just up the road, and we have clients throughout Waxhaw's neighborhoods. No travel fees, no minimum project size.</p>",
        },
        {
          question: "What are the most popular projects in Waxhaw?",
          answer:
            "<p>Custom frameless shower enclosures are the top request — Waxhaw homeowners tend to invest in their bathrooms and want glass work that reflects that. Entry door upgrades are also very common, particularly for homes in Waxhaw's higher-end subdivisions where the front elevation matters. Window replacement and repair round out the most frequent calls.</p>",
        },
        {
          question:
            "Can you install a frameless shower in a master bath that has a non-standard configuration?",
          answer:
            "<p>Yes. Non-standard shower configurations — angled walls, knee walls, offset drains, unusual proportions — are something we encounter regularly. Doug measures every opening on-site and custom-orders the glass panels to fit. There's no standard template we're trying to force your shower into.</p>",
        },
        {
          question: "How do I know if my windows need replacement or just repair?",
          answer:
            "<p>The most common sign that repair (rather than replacement) is appropriate is fogging between the panes with an otherwise sound frame and operating sash. If the window opens, closes, and locks correctly but is fogged, IGU replacement is usually the right call. If the frame is damaged, the window doesn't operate correctly, or the window is old enough that repair costs approach replacement costs, we'll tell you replacement makes more sense.</p>",
        },
        {
          question: "Are you licensed and insured to work in Waxhaw?",
          answer:
            "<p>Yes. Glass and Door Pro is licensed and insured to work throughout Union County, including Waxhaw, Monroe, Indian Trail, Weddington, and surrounding communities.</p>",
        },
        {
          question: "Do you do commercial glass work in Waxhaw?",
          answer:
            "<p>Yes. We handle commercial glass and door work for Waxhaw businesses — storefront glass, commercial door installation and repair, and commercial window replacement for multi-family properties. See our full commercial services at glassanddoorpro.com/services.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Waxhaw?",
      ctaBody:
        "Call, text, or fill out the form for a free quote. Doug will come out personally and give you a clear, written estimate.",
      ctaFooter: "Mon–Sat, 7am–6pm | Monroe-based, serving Waxhaw and Union County",
    }),
  },
  {
    title: "Matthews, NC",
    slug: "service-areas-matthews",
    path: "/service-areas/matthews",
    seoTitle: "Glass and Door Services in Matthews, NC | Glass and Door Pro",
    seoDescription:
      "Frameless shower doors, window installation, window repair, and door installation in Matthews, NC. Owner-operated with 15+ years of experience. Saturday appointments available. Call (704) 771-6111.",
    seoKeywords:
      "glass services Matthews NC, frameless shower doors Matthews NC, window installation Matthews NC, door installation Matthews NC, window repair Matthews NC",
    ogImageUrl: "/images/glass-door-pro/city-matthews-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Matthews, NC",
        subheading:
          "Frameless shower enclosures, window replacement, door installation, and window repair for Matthews homeowners. Owner-operated with 15+ years of experience serving the greater Charlotte area. Saturday appointments available.",
        imageUrl: "/images/glass-door-pro/city-matthews-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Glass and Door Services for Matthews Homeowners",
      introContent:
        "<p>Matthews has an established character — mature neighborhoods, well-maintained homes, and homeowners who've been in place long enough to know exactly what they want when they're upgrading. Glass and door work in Matthews reflects that. Frameless shower installations going into bathrooms that are being properly remodeled, not just touched up. Window replacements on homes where the original windows are finally past their useful life. Entry door upgrades that make a real difference to a home's appearance.</p><p>Glass and Door Pro serves Matthews regularly. Doug is Monroe-based, which puts Matthews on the eastern edge of the Charlotte side of his service area — close enough that scheduling is easy and there are no travel fees. He handles every project personally, which Matthews homeowners tend to appreciate. When you call, you're getting the person who will actually do the work.</p><p>Matthews sits in Mecklenburg County, and we work throughout the town — from the neighborhoods near downtown Matthews to the subdivisions along the Mecklenburg-Union County line. If you've been putting off a glass or door project because you weren't sure who to call, Glass and Door Pro is a straightforward choice.</p>",
      benefitsTitle: "Why Matthews Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "User",
          title: "Personal Service from an Owner-Operator",
          description:
            "Doug runs Glass and Door Pro himself. Every project is handled by the same person — no franchisee, no rotating crews, no one unfamiliar with your job showing up at your door.",
        },
        {
          icon: "Home",
          title: "Experience in Established Neighborhoods",
          description:
            "Matthews homes vary in age and style. Doug has worked on everything from mid-century ranches to newer construction and knows how to approach each one appropriately.",
        },
        {
          icon: "Droplets",
          title: "Precision Frameless Shower Work",
          description:
            "Custom frameless glass enclosures installed to fit the specific dimensions of your shower — not a standard kit adapted to your space. Every panel is measured and ordered for the opening.",
        },
        {
          icon: "Wrench",
          title: "Honest Repair vs. Replace Advice",
          description:
            "We assess windows and doors honestly. If a window can be repaired at a fraction of replacement cost, we'll tell you. We're not in the business of recommending work you don't need.",
        },
        {
          icon: "MapPin",
          title: "No Travel Surcharges for Matthews",
          description:
            "Matthews is within our regular service area. No additional fees for being in Mecklenburg County rather than Union County.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments Available",
          description:
            "We work Mon–Sat, 7am–6pm, and Saturday is a standard part of our schedule — not an exception.",
        },
      ],
      servicesTitle: "Our Services in Matthews, NC",
      servicesIntro: "",
      serviceCards: cityServiceCards,
      areasTitle: "Neighborhoods and Areas We Serve in Matthews",
      areasIntro: "We work throughout Matthews and the surrounding area, including:",
      areas: [
        "Downtown Matthews and the historic neighborhood area",
        "Stumptown Road and Idlewild Road corridors",
        "Matthews Township Greenway area neighborhoods",
        "The subdivisions along Monroe Road into Matthews",
        "Crews Road and surrounding communities",
        "Neighborhoods near Matthews Elementary and Crestdale Middle",
        "The residential areas near Matthews-Mint Hill Road",
        "Communities connecting Matthews to Stallings and Indian Trail",
      ],
      areasClosing: "Not seeing your neighborhood? We serve all of Matthews — call (704) 771-6111.",
      galleryTitle: "Our Work in the Matthews Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower1-1280w.webp",
          alt: "Custom frameless glass shower enclosure installed by Glass and Door Pro in the Matthews area",
        },
        {
          url: "/images/glass-door-pro/gallery-door1-1280w.webp",
          alt: "Entry door installation by Glass and Door Pro in the Matthews area",
        },
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Window replacement for homes in the Matthews, NC area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Matthews, NC",
      faqs: [
        {
          question: "Do you serve Matthews even though you're based in Monroe?",
          answer:
            "<p>Yes. Matthews is a regular part of our service area — we're out there consistently and don't add travel fees for Mecklenburg County locations. Monroe is close enough that Matthews is a short drive, and we schedule Matthews visits the same way as any other area.</p>",
        },
        {
          question: "What glass and door projects are most common in Matthews?",
          answer:
            "<p>Frameless shower enclosures for bathroom remodels, window replacement for homes with original windows from the 1980s and 1990s, and entry door upgrades are the most frequent requests. Matthews has a range of home ages and styles, so we see a good variety of project types.</p>",
        },
        {
          question: "How long does a frameless shower installation take in Matthews?",
          answer:
            "<p>The installation itself typically takes one day. The process starts with an in-home measurement visit, followed by the glass order (usually 2–3 weeks lead time), and then the installation day. Doug walks you through the finished enclosure before he leaves and addresses anything that needs adjustment before packing up.</p>",
        },
        {
          question:
            "My windows are original to the house from the 1980s — should I replace them all at once or a few at a time?",
          answer:
            "<p>Either approach works and depends on your budget and priorities. Replacing all at once is more efficient and ensures consistency across the house. Prioritizing the worst performers first — typically the ones with the most fogging, worst drafts, or most visible deterioration — lets you spread the cost over time. Doug will walk through the windows with you and give you an honest read on which ones are most urgent.</p>",
        },
        {
          question: "Are you licensed and insured to work in Matthews and Mecklenburg County?",
          answer:
            "<p>Yes. Glass and Door Pro is licensed and insured to work throughout the greater Charlotte metro area, including Matthews and Mecklenburg County.</p>",
        },
        {
          question: "Can you install a storm door in front of an existing entry door in Matthews?",
          answer:
            "<p>Yes. Storm door installation is a straightforward project. We install full-view, ventilating, and retractable-screen storm doors. Proper alignment is important — a storm door that doesn't close flush is more trouble than it's worth — and we make sure it's set correctly before we leave.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Matthews?",
      ctaBody:
        "Call, text, or fill out the form for a free quote. Doug will schedule a visit personally and walk you through everything.",
      ctaFooter: "Mon–Sat, 7am–6pm | Serving Matthews and the greater Charlotte area",
    }),
  },
  {
    title: "Weddington, NC",
    slug: "service-areas-weddington",
    path: "/service-areas/weddington",
    seoTitle: "Glass and Door Services in Weddington, NC | Glass and Door Pro",
    seoDescription:
      "Custom frameless shower doors, window installation, door installation, and window repair in Weddington, NC. Owner-operated, detail-oriented, Saturday appointments available. Call (704) 771-6111.",
    seoKeywords:
      "glass services Weddington NC, frameless shower doors Weddington NC, window installation Weddington NC, door installation Weddington NC, window repair Weddington NC",
    ogImageUrl: "/images/glass-door-pro/city-weddington-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Weddington, NC",
        subheading:
          "Custom frameless shower enclosures, window replacement, door installation, and window repair for Weddington homeowners. Owner-operated, detail-oriented, and personally handled by Doug Adams. Saturday appointments available.",
        imageUrl: "/images/glass-door-pro/city-weddington-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Custom Glass and Door Work in Weddington",
      introContent:
        "<p>Weddington is one of Union County's most established communities — larger homes, carefully maintained properties, and homeowners who expect quality work to match the quality of what's already there. Glass and door work in Weddington tends toward the custom end: frameless shower enclosures in primary baths that are being properly renovated, entry door replacements that make a statement at the front of the house, and window upgrades across homes where the original windows have simply reached the end of a long life.</p><p>Glass and Door Pro brings that same attention to detail to every Weddington project. Doug measures every job himself, orders materials to the exact specifications of the opening, and does the installation personally. If you're putting a frameless glass enclosure into a primary bath remodel that you've invested real money in, you want it done by someone who cares about the result. That's the work we do.</p><p>Weddington is a short drive from Monroe, and we've worked throughout the town's neighborhoods for years. No travel fees, consistent availability, and a direct line to the person responsible for the work on every project.</p>",
      benefitsTitle: "Why Weddington Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "BadgeCheck",
          title: "Custom Work Done Right",
          description:
            "Weddington homes are finished carefully, and the glass and door work should match. Every frameless enclosure is measured and ordered to fit the specific opening — not adapted from a standard size.",
        },
        {
          icon: "User",
          title: "Owner-Operated Accountability",
          description:
            "Doug is responsible for every project from the first call to the final walkthrough. There's no crew turnover, no subcontractors, no one unfamiliar with your project showing up.",
        },
        {
          icon: "Palette",
          title: "Hardware That Matches the Home",
          description:
            "We offer a full range of finishes — brushed nickel, matte black, polished chrome, oil-rubbed bronze — and help you select hardware that works with your existing fixtures and the overall feel of the space.",
        },
        {
          icon: "MapPin",
          title: "Monroe-Based, No Travel Fees",
          description:
            "Weddington is part of our regular Union County service area. No additional charges for location.",
        },
        {
          icon: "FileText",
          title: "Transparent, Written Quotes",
          description:
            "Every quote is detailed and written before any work begins. You know exactly what you're getting and what it costs.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments",
          description:
            "Mon–Sat, 7am–6pm. We work around your schedule, including Saturdays — which is when most Weddington homeowners prefer to meet for project visits.",
        },
      ],
      servicesTitle: "Our Services in Weddington, NC",
      servicesIntro: "",
      serviceCards: cityServiceCards,
      areasTitle: "Neighborhoods and Areas We Serve in Weddington",
      areasIntro:
        "We work throughout Weddington and surrounding Union County communities, including:",
      areas: [
        "The established neighborhoods along Weddington Road",
        "Providence Road West corridor communities",
        "Weddington Chase and nearby subdivisions",
        "The neighborhoods near Weddington High School",
        "Marvin and the Marvin-Weddington area",
        "The residential communities along Rea Road in Weddington",
        "Kensington and nearby developments",
        "The communities connecting Weddington to Waxhaw and Ballantyne",
      ],
      areasClosing: "Not in one of these areas? Call (704) 771-6111 — we cover all of Weddington.",
      galleryTitle: "Our Work in the Weddington Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower2-1280w.webp",
          alt: "Custom frameless shower enclosure installed by Glass and Door Pro in the Weddington area",
        },
        {
          url: "/images/glass-door-pro/gallery-door2-1280w.webp",
          alt: "Entry door replacement by Glass and Door Pro in the Weddington area",
        },
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Window replacement for homes in the Weddington, NC area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Weddington, NC",
      faqs: [
        {
          question: "Do you work in Weddington regularly?",
          answer:
            "<p>Yes. Weddington is one of our most consistent Union County service areas. We're based in Monroe and have worked throughout Weddington's neighborhoods for years. No travel fees, consistent availability, and direct access to Doug on every project.</p>",
        },
        {
          question: "What's the most popular project you do in Weddington?",
          answer:
            "<p>Custom frameless shower enclosures are by far the most frequent request. Weddington homeowners tend to invest significantly in primary bath remodels, and a properly installed frameless glass enclosure is usually the finishing element. Entry door replacement and window upgrades for older homes are also very common.</p>",
        },
        {
          question: "How custom can a frameless shower enclosure get in terms of configuration?",
          answer:
            "<p>Very custom. We work with openings that have multiple panels, fixed and hinged combinations, knee walls, angled ceilings, and non-standard proportions. Doug measures the specific space, discusses the configuration options that work for it, and custom-orders the glass accordingly. The goal is a result that looks like it was designed for that bathroom — not installed in spite of it.</p>",
        },
        {
          question: "What hardware finishes do you offer for frameless shower enclosures?",
          answer:
            "<p>We offer brushed nickel, matte black, polished chrome, oil-rubbed bronze, and satin brass. Doug brings samples to the in-home measurement visit so you can see the finishes against your existing fixtures before committing.</p>",
        },
        {
          question: "Are you licensed and insured to work in Weddington?",
          answer:
            "<p>Yes. Glass and Door Pro is fully licensed and insured to operate throughout Union County, including Weddington, Monroe, Waxhaw, and surrounding communities.</p>",
        },
        {
          question:
            "Can you replace windows in a home that has custom or non-standard window sizes?",
          answer:
            "<p>Yes. We measure every opening and source windows to fit the specific dimensions — there's no assumption that your windows match a standard size. Homes in Weddington often have larger or more customized window configurations than typical production housing, and we handle those without issue.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Weddington?",
      ctaBody:
        "Call, text, or fill out the form. Doug will visit personally, take measurements, and give you a clear written quote.",
      ctaFooter: "Mon–Sat, 7am–6pm | Monroe-based, serving Weddington and Union County",
    }),
  },
  {
    title: "Indian Land, SC",
    slug: "service-areas-indian-land",
    path: "/service-areas/indian-land",
    seoTitle: "Glass and Door Services in Indian Land, SC | Glass and Door Pro",
    seoDescription:
      "Frameless shower doors, window installation, window repair, and door installation in Indian Land, SC. Monroe-based, owner-operated, Saturday appointments available. Call (704) 771-6111.",
    seoKeywords:
      "glass services Indian Land SC, frameless shower doors Indian Land SC, window installation Indian Land SC, door installation Indian Land SC, window repair Indian Land SC",
    ogImageUrl: "/images/glass-door-pro/city-indian-land-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Indian Land, SC",
        subheading:
          "Frameless shower enclosures, window replacement, door installation, and window repair for Indian Land homeowners. Monroe-based and owner-operated — Doug handles every project personally. Saturday appointments available.",
        imageUrl: "/images/glass-door-pro/city-indian-land-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Glass and Door Pro — Serving Indian Land Homeowners",
      introContent:
        "<p>Indian Land has grown into one of the fastest-developing communities in the greater Charlotte area, with new construction happening alongside more established neighborhoods that are ready for upgrades. The housing mix here runs from recent builds where homeowners are customizing above the builder standard to homes that are 10–15 years old and ready for bathroom and window improvements.</p><p>Glass and Door Pro is based in Monroe, NC, which puts Indian Land just across the state line and well within our regular service area. Doug works in Indian Land regularly — there's no border fee, no minimum project requirement, and no difference in how we approach a project here versus anywhere else in our service area. You're getting the same owner-operated, personally managed service that clients across Union County and the Charlotte metro have come to rely on.</p><p>The most common projects we handle in Indian Land are frameless glass shower enclosures for homeowners investing in bathroom upgrades, window replacement for fogged or aging double-pane units, and exterior door installations. Whatever the project, the process is the same: Doug comes out, measures in person, gives you a clear written quote, and does the work himself.</p>",
      benefitsTitle: "Why Indian Land Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "MapPin",
          title: "No State Line Hassle",
          description:
            "We work in Indian Land regularly and treat it the same as any other part of our service area. No additional fees, no scheduling issues — just a local company doing consistent work across the South Charlotte and Lancaster County area.",
        },
        {
          icon: "User",
          title: "Owner-Operated",
          description:
            "Doug handles every project from measurement to installation. There are no subcontractors and no handoffs — the person you meet for the quote is the person who installs the work.",
        },
        {
          icon: "MapPinned",
          title: "Monroe-Based, Short Drive Away",
          description:
            "Monroe is right across the border from Indian Land. We're closer to many Indian Land neighborhoods than most Charlotte-based glass companies.",
        },
        {
          icon: "Droplets",
          title: "Frameless Shower Expertise",
          description:
            "Indian Land has a lot of relatively new construction where homeowners are upgrading above builder standard. Frameless glass enclosures are the most common way to finish a master bath, and we install them correctly every time.",
        },
        {
          icon: "FileText",
          title: "Honest, Written Quotes",
          description:
            "Every quote is clear and committed to in writing before any work starts. No surprise charges, no pressure to upgrade beyond what you actually need.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments Available",
          description:
            "Mon–Sat, 7am–6pm. We schedule around your availability, and Saturday is a standard option for Indian Land homeowners.",
        },
      ],
      servicesTitle: "Our Services in Indian Land, SC",
      servicesIntro: "",
      serviceCards: cityServiceCards,
      areasTitle: "Neighborhoods and Areas We Serve in Indian Land",
      areasIntro:
        "We work throughout Indian Land and the surrounding Lancaster County area, including:",
      areas: [
        "The neighborhoods along Highway 521 in Indian Land",
        "Baxter Village and surrounding communities",
        "The subdivisions near Indian Land High School",
        "Rea Road extension communities crossing into SC",
        "Providence Road corridor into Indian Land",
        "Foxcroft and nearby established neighborhoods",
        "The new construction communities along Doby's Bridge Road",
        "Neighborhoods connecting Indian Land to Fort Mill",
      ],
      areasClosing:
        "Not seeing your community? Call (704) 771-6111 — we cover all of Indian Land and surrounding areas.",
      galleryTitle: "Our Work in the Indian Land Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower1-1280w.webp",
          alt: "Frameless shower enclosure installed by Glass and Door Pro in the Indian Land area",
        },
        {
          url: "/images/glass-door-pro/gallery-door3-1280w.webp",
          alt: "Entry door installation by Glass and Door Pro in the Indian Land area",
        },
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Window replacement for homes in the Indian Land, SC area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Indian Land, SC",
      faqs: [
        {
          question: "Do you cross into South Carolina to serve Indian Land?",
          answer:
            "<p>Yes. Indian Land is a regular part of our service area — we're based in Monroe, NC, just across the state line, and work in Indian Land consistently. No additional fees for the SC location.</p>",
        },
        {
          question: "What are the most common projects in Indian Land?",
          answer:
            "<p>Frameless shower enclosures are the top request — Indian Land has a lot of newer construction where homeowners are upgrading above the builder-standard shower surrounds. Window replacement for homes that are now 10–15 years old with failing double-pane seals is also very common, along with entry door upgrades.</p>",
        },
        {
          question: "How does the frameless shower process work from start to finish?",
          answer:
            "<p>Doug schedules an in-home measurement visit to assess the shower opening, discuss glass thickness and hardware finish options, and take the precise measurements needed to order the glass. After the order is placed (typically 2–3 weeks lead time), he returns for the installation. The whole process from first call to installed enclosure usually runs 3–4 weeks.</p>",
        },
        {
          question:
            "Can you replace windows in a newer Indian Land home that has non-standard sizes?",
          answer:
            "<p>Yes. We measure every opening on-site and source windows to those exact dimensions. New construction in Indian Land often has windows in sizes that don't match standard replacement dimensions, and we handle custom-sized replacements without issue.</p>",
        },
        {
          question: "Are you set up to work on the SC side of the border?",
          answer:
            "<p>Yes. We work regularly in Indian Land and Fort Mill and are set up to do so. For the type of residential glass and door work we do, there's no practical difference between serving NC and SC homeowners in this area.</p>",
        },
        {
          question: "Do you do commercial glass work in Indian Land?",
          answer:
            "<p>Yes. We handle commercial glass and door work for Indian Land businesses — storefront glass, commercial door installation and repair, and commercial window replacement. View our full commercial services at glassanddoorpro.com/services.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Indian Land?",
      ctaBody:
        "Call, text, or fill out the form for a free quote. Doug will come out personally, measure the project, and give you clear next steps.",
      ctaFooter:
        "Mon–Sat, 7am–6pm | Monroe-based, serving Indian Land and the greater Charlotte area",
    }),
  },
  {
    title: "Fort Mill, SC",
    slug: "service-areas-fort-mill",
    path: "/service-areas/fort-mill",
    seoTitle: "Glass and Door Services in Fort Mill, SC | Glass and Door Pro",
    seoDescription:
      "Frameless shower doors, window installation, window repair, and door installation in Fort Mill, SC. Monroe-based, owner-operated, Saturday appointments. Call (704) 771-6111.",
    seoKeywords:
      "glass services Fort Mill SC, frameless shower doors Fort Mill SC, window installation Fort Mill SC, door installation Fort Mill SC, window repair Fort Mill SC",
    ogImageUrl: "/images/glass-door-pro/city-fort-mill-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Fort Mill, SC",
        subheading:
          "Frameless shower enclosures, window replacement, door installation, and window repair for Fort Mill homeowners. Monroe-based, owner-operated, and personally handled by Doug Adams on every project. Saturday appointments available.",
        imageUrl: "/images/glass-door-pro/city-fort-mill-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Local Glass and Door Service for Fort Mill Homeowners",
      introContent:
        "<p>Fort Mill has become one of the most sought-after communities in the greater Charlotte area — and the homes here reflect that growth. Established neighborhoods mix with significant newer development, and homeowners across Fort Mill are investing in properties that have real value and that they intend to improve. Glass and door work here ranges from frameless shower upgrades in homes that have been owned for a decade or more, to window replacements in newer construction where the builder's spec units are starting to show their limitations.</p><p>Glass and Door Pro is based in Monroe, NC, right across the South Carolina border, and Fort Mill is a regular part of our service schedule. Doug works in Fort Mill the same way he works everywhere — personally, with a clear quote before anything starts, and with himself doing the installation. There's no dispatch, no subcontractors, no variation in the quality of work based on who happened to be available.</p><p>Fort Mill homeowners have a wide range of glass and door needs and we handle all of them. If you've been putting a project off because you weren't sure who to call in this area, Glass and Door Pro is a local, accountable option that shows up when scheduled and finishes what it starts.</p>",
      benefitsTitle: "Why Fort Mill Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "MapPin",
          title: "Monroe-Based, Right Across the Border",
          description:
            "We're closer to Fort Mill than most Charlotte glass companies. Monroe is just across the state line, and Fort Mill is a regular part of our weekly schedule.",
        },
        {
          icon: "BadgeCheck",
          title: "No SC Upcharge",
          description:
            "We work in Fort Mill the same way we work in Union County — no additional fees, no travel charges, no minimum project requirements.",
        },
        {
          icon: "User",
          title: "Owner Does the Work",
          description:
            "Every Fort Mill project is handled personally by Doug. He measures, he orders the materials, and he installs. You're not getting a different person for each step.",
        },
        {
          icon: "Droplets",
          title: "Frameless Shower Installations",
          description:
            "Fort Mill has a strong demand for frameless glass shower enclosures from homeowners upgrading primary baths. We install them correctly — custom measured, properly supported, and finished the way they should be.",
        },
        {
          icon: "FileText",
          title: "Clear Quotes, No Surprises",
          description:
            "Written quotes before any work begins. No ambiguity about what's included and what it costs.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments Available",
          description:
            "Mon–Sat, 7am–6pm. We accommodate Fort Mill homeowners' schedules including Saturdays.",
        },
      ],
      servicesTitle: "Our Services in Fort Mill, SC",
      servicesIntro: "",
      serviceCards: cityServiceCards,
      areasTitle: "Neighborhoods and Areas We Serve in Fort Mill",
      areasIntro:
        "We work throughout Fort Mill and the surrounding York County communities, including:",
      areas: [
        "Downtown Fort Mill and the historic district",
        "Baxter Village and surrounding communities",
        "Kingsley and the neighborhoods along Carowinds Boulevard",
        "The Tega Cay peninsula communities",
        "Nation Ford Road and surrounding subdivisions",
        "Springfield neighborhood and nearby areas",
        "The communities along Gold Hill Road",
        "Neighborhoods connecting Fort Mill to Indian Land and Pineville",
      ],
      areasClosing:
        "Not seeing your community? Call (704) 771-6111 — we cover all of Fort Mill and surrounding York County areas.",
      galleryTitle: "Our Work in the Fort Mill Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower2-1280w.webp",
          alt: "Frameless shower door installed by Glass and Door Pro in the Fort Mill area",
        },
        {
          url: "/images/glass-door-pro/gallery-door1-1280w.webp",
          alt: "Door installation by Glass and Door Pro in the Fort Mill area",
        },
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Window replacement for homes in the Fort Mill, SC area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Fort Mill, SC",
      faqs: [
        {
          question: "Do you serve Fort Mill even though you're based in North Carolina?",
          answer:
            "<p>Yes. Fort Mill is a regular part of our service area. We're based in Monroe, NC, just across the state line, and work in Fort Mill and the surrounding York County area consistently. No additional fees or charges for the SC location.</p>",
        },
        {
          question: "What glass and door projects are most common in Fort Mill?",
          answer:
            "<p>Frameless shower enclosures for master bath upgrades are the most frequent request. Fort Mill has a large base of well-maintained homes where owners are making long-term improvements, and a frameless glass shower is often the project that finishes a bathroom remodel. Window replacement and entry door installation are also very common.</p>",
        },
        {
          question:
            "Can you install a frameless shower in a Fort Mill home with a walk-in shower that has multiple walls?",
          answer:
            "<p>Yes. Multi-wall shower configurations with multiple fixed panels and one or more doors are something we handle regularly. Doug measures the specific configuration on-site and orders the glass panels to fit. Every element is custom to the opening.</p>",
        },
        {
          question: "How long does window replacement take in Fort Mill?",
          answer:
            "<p>A single window replacement typically takes 1–2 hours. Larger replacement projects depend on window count and are usually completed in one day. Doug gives you a time estimate at the time of scheduling so you can plan accordingly.</p>",
        },
        {
          question: "Do you work on commercial glass projects in Fort Mill?",
          answer:
            "<p>Yes. We handle commercial glass and door work for Fort Mill businesses — storefront glass, commercial door installation and repair, and commercial window replacement for multi-family properties. See our full commercial services at glassanddoorpro.com/services.</p>",
        },
        {
          question: "Is there a minimum project size to work with Glass and Door Pro in Fort Mill?",
          answer:
            "<p>No. We handle single window replacements, individual door installations, and smaller frameless shower projects the same as larger jobs. There's no minimum project requirement for Fort Mill or anywhere else in our service area.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Fort Mill?",
      ctaBody:
        "Call, text, or fill out the form. Doug will schedule a visit, measure the project personally, and give you clear next steps.",
      ctaFooter:
        "Mon–Sat, 7am–6pm | Monroe-based, serving Fort Mill and the greater Charlotte area",
    }),
  },
  {
    title: "Pineville, NC",
    slug: "service-areas-pineville",
    path: "/service-areas/pineville",
    seoTitle: "Glass and Door Services in Pineville, NC | Glass and Door Pro",
    seoDescription:
      "Frameless shower doors, window installation, window repair, and door installation in Pineville, NC. Owner-operated, Monroe-based, Saturday appointments available. Call (704) 771-6111.",
    seoKeywords:
      "glass services Pineville NC, frameless shower doors Pineville NC, window installation Pineville NC, door installation Pineville NC, window repair Pineville NC",
    ogImageUrl: "/images/glass-door-pro/city-pineville-hero.webp",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Pineville, NC",
        subheading:
          "Frameless shower enclosures, replacement windows, door installation, and window repair for Pineville homeowners. Owner-operated with 15+ years of experience. Serving the south Charlotte area with same-week scheduling and Saturday appointments.",
        imageUrl: "/images/glass-door-pro/city-pineville-hero.webp",
        imagePositionY: 45,
      },
      introTitle: "Glass and Door Services for Pineville Homeowners",
      introContent:
        "<p>Pineville sits at the southern edge of Charlotte proper — close enough to the city to benefit from its growth, established enough to have neighborhoods with real character and homes that have been well cared for over time. Glass and door work in Pineville tends to involve homeowners who've been in place long enough to know what they want: bathroom upgrades that are done right, window replacements that actually solve the draft and fogging problems they've been dealing with, and door installations that look like they belong on the house.</p><p>Glass and Door Pro serves Pineville from our Monroe base — we're on the southeastern side of the Charlotte metro and Pineville falls naturally into our regular service route. Doug handles every project himself. When he comes out to a Pineville home for a measurement, he's the same person who will be back to do the installation. That kind of consistency is rarer than it should be in home services, and Pineville clients notice it.</p><p>Whether you're finishing a bathroom remodel with a frameless glass enclosure, replacing windows that have been fogging for years, or upgrading your front entry door before listing the house or just because it's time — we handle all of it and we do it well.</p>",
      benefitsTitle: "Why Pineville Homeowners Choose Glass and Door Pro",
      benefits: [
        {
          icon: "User",
          title: "Owner-Operated Personal Service",
          description:
            "Pineville homeowners deal with Doug directly — no account managers, no rotating installers, no disconnection between who quoted the job and who shows up to do it.",
        },
        {
          icon: "BadgeCheck",
          title: "Consistent Quality",
          description:
            "The same person measuring is the same person installing. That consistency means fewer errors, better fits, and a finished result that reflects the care put into the measurement.",
        },
        {
          icon: "DollarSign",
          title: "South Charlotte Coverage Without the Franchise Overhead",
          description:
            "We serve Pineville without the overhead of a national franchise operation. That means more competitive pricing and a more direct service experience.",
        },
        {
          icon: "Home",
          title: "All Residential Glass and Door Services",
          description:
            "From frameless shower enclosures to window repair to storm door installation — we handle the full range of residential glass and door work, so you're not managing multiple contractors.",
        },
        {
          icon: "MessageCircle",
          title: "Honest Advice on Every Project",
          description:
            "If a window can be repaired instead of replaced, we'll tell you. If a door option you're considering isn't the best fit for your home, we'll say so. Honest advice earns referrals — and that's how we grow.",
        },
        {
          icon: "CalendarDays",
          title: "Saturday Appointments Are Standard",
          description:
            "Mon–Sat, 7am–6pm. We don't limit Saturday availability to upsell a premium — it's part of our regular schedule for Pineville and surrounding areas.",
        },
      ],
      servicesTitle: "Our Services in Pineville, NC",
      servicesIntro: "",
      serviceCards: cityServiceCards,
      areasTitle: "Neighborhoods and Areas We Serve in Pineville",
      areasIntro:
        "We work throughout Pineville and the surrounding south Charlotte communities, including:",
      areas: [
        "The neighborhoods along Highway 51 and Pineville-Matthews Road",
        "Pineville town center and surrounding residential areas",
        "The communities near Carolina Place Mall and south into Pineville",
        "Quail Hollow and surrounding south Charlotte neighborhoods",
        "The subdivisions along Elm Lane and Pineville-Indian Trail Road",
        "Neighborhoods connecting Pineville to Ballantyne and the south Charlotte corridor",
        "The residential areas near Pineville-Matthews and Rea Road",
        "Communities bordering Fort Mill and Indian Land to the south",
      ],
      areasClosing:
        "Not seeing your neighborhood? Call (704) 771-6111 — we cover all of Pineville and surrounding south Charlotte areas.",
      galleryTitle: "Our Work in the Pineville Area",
      gallery: [
        {
          url: "/images/glass-door-pro/gallery-shower1-1280w.webp",
          alt: "Frameless shower enclosure installed by Glass and Door Pro in the Pineville area",
        },
        {
          url: "/images/glass-door-pro/gallery-door3-1280w.webp",
          alt: "Door installation by Glass and Door Pro in the Pineville area",
        },
        {
          url: "/images/glass-door-pro/gallery-windows-1280w.webp",
          alt: "Window replacement for homes in the Pineville, NC area",
        },
      ],
      faqTitle: "Frequently Asked Questions — Pineville, NC",
      faqs: [
        {
          question: "Do you serve Pineville from Monroe — isn't that far?",
          answer:
            "<p>Not at all. Pineville is on the south side of Charlotte and Monroe is on the southeast — it's a straightforward drive and a regular part of our service area. No travel fees for Pineville and no difference in scheduling compared to any other area we serve.</p>",
        },
        {
          question: "What projects do you most commonly handle in Pineville?",
          answer:
            "<p>Frameless shower enclosures for bathroom remodels are the most common call. Pineville has a mix of home ages where bathroom upgrades are a priority. Window replacement for fogged or aging double-pane units is also very common, and entry door replacement rounds out the most frequent project types.</p>",
        },
        {
          question:
            "Can you replace windows in a Pineville home that has aluminum-framed originals from the 1980s or 1990s?",
          answer:
            "<p>Yes. Older aluminum-framed windows are one of the most common replacement scenarios in Pineville's established neighborhoods. We replace them with modern double-pane vinyl or other appropriate frame types, and the difference in comfort and energy performance is immediately noticeable.</p>",
        },
        {
          question: "How much does a frameless shower enclosure cost in Pineville?",
          answer:
            "<p>Frameless shower enclosures vary based on the size of the opening, the glass thickness, and the hardware selection. Doug measures the opening on-site and provides a written quote from there — there's no way to give an accurate price without seeing the actual space. Most frameless enclosures in the area run in the range of $1,200–$2,500 installed, depending on the configuration, but the specific quote will reflect your exact opening.</p>",
        },
        {
          question: "Are you licensed and insured to work in Pineville and Mecklenburg County?",
          answer:
            "<p>Yes. Glass and Door Pro is licensed and insured to work throughout the greater Charlotte metro area, including Pineville and Mecklenburg County.</p>",
        },
        {
          question: "Do you handle commercial glass work in Pineville?",
          answer:
            "<p>Yes. We handle commercial glass and door work for Pineville businesses — storefront glass, commercial door installation and repair, and commercial window replacement for multi-family properties. See our full commercial services at glassanddoorpro.com/services.</p>",
        },
      ],
      ctaHeading: "Ready to Get Started in Pineville?",
      ctaBody:
        "Call, text, or fill out the form for a free quote. Doug will schedule a personal visit and walk you through everything before any work begins.",
      ctaFooter: "Mon–Sat, 7am–6pm | Serving Pineville and the greater south Charlotte area",
    }),
  },
];

const glassMenus: Array<InsertCmsMenu & { location: MenuLocation }> = [
  {
    name: "Main Navigation",
    location: "main_navigation",
    items: [
      item("About", "/#about"),
      item("Services", "/services", [
        item("Residential", "#", [
          item("Frameless Showers", "/services/frameless-showers"),
          item("Window Installation", "/services/window-installation"),
          item("Door Installation", "/services/door-installation"),
          item("Window Repair", "/services/window-repair"),
        ]),
        item("Commercial", "#", [
          item(
            "Commercial Storefront Glass Installation",
            "/services/commercial-storefront-glass-installation",
          ),
          item(
            "Commercial Storefront Glass Replacement & Repair",
            "/services/commercial-storefront-glass-replacement-repair",
          ),
          item("Commercial Door Installation", "/services/commercial-door-installation"),
          item(
            "Commercial Door Replacement & Repair",
            "/services/commercial-door-replacement-repair",
          ),
          item("Commercial Window Replacement", "/services/commercial-window-replacement"),
        ]),
      ]),
      item("Service Areas", "/service-areas/charlotte", [
        item("Charlotte", "/service-areas/charlotte"),
        item("Monroe", "/service-areas/monroe"),
        item("Indian Trail", "/service-areas/indian-trail"),
        item("Stallings", "/service-areas/stallings"),
        item("Wesley Chapel", "/service-areas/wesley-chapel"),
        item("Waxhaw", "/service-areas/waxhaw"),
        item("Matthews", "/service-areas/matthews"),
        item("Weddington", "/service-areas/weddington"),
        item("Indian Land", "/service-areas/indian-land"),
        item("Fort Mill", "/service-areas/fort-mill"),
        item("Pineville", "/service-areas/pineville"),
      ]),
      item("Gallery", "/gallery"),
      item("Reviews", "/reviews"),
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
      item(
        "Commercial Storefront Glass Installation",
        "/services/commercial-storefront-glass-installation",
      ),
      item(
        "Commercial Storefront Glass Replacement & Repair",
        "/services/commercial-storefront-glass-replacement-repair",
      ),
      item("Commercial Door Installation", "/services/commercial-door-installation"),
      item("Commercial Door Replacement & Repair", "/services/commercial-door-replacement-repair"),
      item("Commercial Window Replacement", "/services/commercial-window-replacement"),
      item("Get a Free Quote", "/#contact"),
    ],
  },
  {
    name: "Resources",
    location: "footer_resources",
    items: [
      item("Charlotte", "/service-areas/charlotte"),
      item("Monroe", "/service-areas/monroe"),
      item("Indian Trail", "/service-areas/indian-trail"),
      item("Stallings", "/service-areas/stallings"),
      item("Wesley Chapel", "/service-areas/wesley-chapel"),
      item("Waxhaw", "/service-areas/waxhaw"),
      item("Matthews", "/service-areas/matthews"),
      item("Weddington", "/service-areas/weddington"),
      item("Indian Land", "/service-areas/indian-land"),
      item("Fort Mill", "/service-areas/fort-mill"),
      item("Pineville", "/service-areas/pineville"),
      item("About Doug", "/#about"),
      item("Project Gallery", "/gallery"),
      item("Reviews", "/reviews"),
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
      item("Services", "/services", [
        item("Residential", "#", [
          item("Frameless Showers", "/services/frameless-showers"),
          item("Window Installation", "/services/window-installation"),
          item("Door Installation", "/services/door-installation"),
          item("Window Repair", "/services/window-repair"),
        ]),
        item("Commercial", "#", [
          item(
            "Commercial Storefront Glass Installation",
            "/services/commercial-storefront-glass-installation",
          ),
          item(
            "Commercial Storefront Glass Replacement & Repair",
            "/services/commercial-storefront-glass-replacement-repair",
          ),
          item("Commercial Door Installation", "/services/commercial-door-installation"),
          item(
            "Commercial Door Replacement & Repair",
            "/services/commercial-door-replacement-repair",
          ),
          item("Commercial Window Replacement", "/services/commercial-window-replacement"),
        ]),
      ]),
      item("Service Areas", "/service-areas/charlotte", [
        item("Charlotte", "/service-areas/charlotte"),
        item("Monroe", "/service-areas/monroe"),
        item("Indian Trail", "/service-areas/indian-trail"),
        item("Stallings", "/service-areas/stallings"),
        item("Wesley Chapel", "/service-areas/wesley-chapel"),
        item("Waxhaw", "/service-areas/waxhaw"),
        item("Matthews", "/service-areas/matthews"),
        item("Weddington", "/service-areas/weddington"),
        item("Indian Land", "/service-areas/indian-land"),
        item("Fort Mill", "/service-areas/fort-mill"),
        item("Pineville", "/service-areas/pineville"),
      ]),
      item("Gallery", "/gallery"),
      item("Reviews", "/reviews"),
      item("Contact", "/#contact"),
    ],
  },
];

const brandingSettings: Record<string, string> = {
  frontend_logo_url: "/images/glass-door-pro/brand/logo-header-900x260-white-bg.webp",
  favicon_url: "/favicon-32x32.png?v=large-2",
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
  siteUrl: "https://glassanddoorpro.com",
  defaultOgImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
  organizationName: "Glass & Door Pro",
  organizationLogoUrl: "/images/glass-door-pro/brand/logo-full-white-bg.png",
};

const glassPrivacyPolicyContent = {
  blocks: [
    {
      id: uid(),
      type: "section-header",
      props: {
        eyebrow: "Legal",
        title: "Privacy Policy",
        subtitle:
          "How Glass & Door Pro handles contact form details, service inquiries, cookies, analytics, and customer records.",
        alignment: "left",
        headingLevel: "h1",
      },
    },
    {
      id: uid(),
      type: "rich-text",
      props: {
        alignment: "left",
        content:
          '<p><strong>Last updated:</strong> June 9, 2026</p><p>Glass &amp; Door Pro is a glass, window, and door company located at 2341 Waverly Dr, Monroe, NC 28112. Our website address is <a href="https://glassanddoorpro.com">glassanddoorpro.com</a>.</p><h2>Information We Collect</h2><p>We collect information you provide directly when you contact us, including your name, phone number, email address, service address if provided, and a description of your glass, window, door, shower, or commercial glass project. This information is used solely to respond to your inquiry, provide an estimate, schedule service, document warranty or service history, and communicate with you about your project.</p><p>If you submit our contact form, we receive and store the information contained in the form submission. This information is used only to respond to your request and manage the service relationship. We do not sell or share this information with third parties for marketing purposes.</p><h2>Cookies &amp; Analytics</h2><p>Our website may use cookies and analytics tools, such as Google Analytics, to understand how visitors find and use the site. This data is aggregated and used to improve the website, measure performance, and understand which services visitors are interested in. We do not use analytics data to personally identify individual visitors. You can disable cookies in your browser settings at any time.</p><h2>Third-Party Services</h2><p>Our website may embed maps from Google Maps or link to third-party services such as Google Business Profile, phone links, review platforms, or other tools used to help customers contact or locate us. These third-party services are subject to their own privacy policies. We do not control their data practices.</p><h2>Data Retention</h2><p>We retain contact form submissions, estimate details, project notes, customer records, and related communications for the duration of our business relationship and as needed for warranty, service documentation, accounting, and legal recordkeeping purposes. We do not retain customer payment card information on this website.</p><p>You may contact us at any time to request access to, correction of, or deletion of personal information we hold about you, subject to any records we are required or permitted to retain for legitimate business, warranty, accounting, or legal purposes.</p><h2>Changes to This Policy</h2><p>We may update this privacy policy from time to time. The date at the top of this page reflects the most recent update.</p><h2>Contact Us</h2><p>Questions about this privacy policy can be directed to Glass &amp; Door Pro at <a href="tel:+17047716111">(704) 771-6111</a>, through our contact page, or by mail to 2341 Waverly Dr, Monroe, NC 28112.</p>',
      },
    },
  ],
};

const glassTermsOfServiceContent = {
  blocks: [
    {
      id: uid(),
      type: "section-header",
      props: {
        eyebrow: "Legal",
        title: "Terms of Service",
        subtitle:
          "Website terms for Glass & Door Pro estimates, service information, third-party links, and use of site content.",
        alignment: "left",
        headingLevel: "h1",
      },
    },
    {
      id: uid(),
      type: "rich-text",
      props: {
        alignment: "left",
        content:
          '<p><strong>Last updated:</strong> June 9, 2026</p><h2>1. About This Website</h2><p>This website is operated by Glass &amp; Door Pro, located at 2341 Waverly Dr, Monroe, NC 28112. By accessing or using this website, you agree to these terms. If you do not agree, please do not use the site.</p><h2>2. Informational Purpose Only</h2><p>The content on this website, including service descriptions, pricing references, process descriptions, project photos, reviews, and any other information, is provided for general informational purposes only. Nothing on this website constitutes a binding estimate, quote, contract, warranty, or commitment to perform any service.</p><p>All project details, pricing, scope of work, scheduling, and warranty terms are established directly between Glass &amp; Door Pro and the customer through a separate estimate and service agreement process. No website content creates or modifies that agreement.</p><h2>3. Estimates and Service Agreements</h2><p>Submitting a contact form or requesting an estimate through this website does not create a service agreement or obligate Glass &amp; Door Pro to perform any work. A binding service agreement is formed only when both parties have agreed in writing to a specific scope of work, pricing, and terms.</p><p>Free estimates are offered as a courtesy and do not guarantee availability, pricing, or scheduling. Glass &amp; Door Pro reserves the right to decline any project at its discretion.</p><h2>4. Accuracy of Information</h2><p>Glass &amp; Door Pro makes reasonable efforts to keep the information on this website accurate and current. However, we do not warrant that all content is complete, accurate, or up to date at all times. Service offerings, product availability, hours, service areas, and other details may change. Confirm current information directly with Glass &amp; Door Pro before making decisions based on website content.</p><h2>5. Intellectual Property</h2><p>All content on this website, including text, photography, graphics, logos, and page structure, is the property of Glass &amp; Door Pro or is used with permission. You may not reproduce, distribute, republish, or use any content from this website for commercial purposes without express written permission from Glass &amp; Door Pro.</p><p>Customer reviews displayed on this website are reproduced with the understanding that they were submitted as public reviews. If you believe your content has been used in error, contact us and we will address it promptly.</p><h2>6. Third-Party Links</h2><p>This website may contain links to third-party websites, including Google Maps, Google Business Profile, manufacturer websites, review platforms, and other external services. These links are provided for convenience only. Glass &amp; Door Pro does not control third-party sites and is not responsible for their content, accuracy, or privacy practices. Accessing a third-party site from a link on our website is at your own risk. See our Privacy Policy for more information about how we handle information submitted through this website.</p><h2>7. Limitation of Liability</h2><p>To the fullest extent permitted by applicable law, Glass &amp; Door Pro and its owners, employees, contractors, and agents shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or reliance on any information contained herein.</p><h2>8. Disclaimer of Warranties</h2><p>This website is provided "as is" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. Glass &amp; Door Pro does not warrant that the website will be available without interruption or free from errors.</p><h2>9. Governing Law</h2><p>These terms are governed by the laws of the State of North Carolina, without regard to its conflict of law provisions. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of Union County, North Carolina.</p><h2>10. Changes to These Terms</h2><p>Glass &amp; Door Pro reserves the right to update or modify these terms at any time without prior notice. The date at the top of this page reflects the most recent update. Continued use of the website after changes are posted constitutes acceptance of the updated terms.</p><h2>11. Contact</h2><p>Questions about these terms can be directed to Glass &amp; Door Pro:</p><p>Glass &amp; Door Pro<br>2341 Waverly Dr<br>Monroe, NC 28112<br><a href="tel:+17047716111">(704) 771-6111</a></p>',
      },
    },
  ],
};

const glassDisclaimerContent = {
  blocks: [
    {
      id: uid(),
      type: "section-header",
      props: {
        eyebrow: "Legal",
        title: "Disclaimer",
        subtitle:
          "Important context about website information, estimates, repair recommendations, warranty references, pricing, and commercial glass work.",
        alignment: "left",
        headingLevel: "h1",
      },
    },
    {
      id: uid(),
      type: "rich-text",
      props: {
        alignment: "left",
        content:
          "<p><strong>Last updated:</strong> June 9, 2026</p><h2>General Information Only</h2><p>The content published on this website is provided for general informational purposes only. It describes the types of services Glass &amp; Door Pro typically offers and the general conditions under which those services are performed. It does not constitute professional advice, a formal assessment, or a recommendation specific to any individual property, window, glass unit, door, shower enclosure, commercial opening, or building condition.</p><h2>Conditions Vary by Property</h2><p>Glass, window, door, shower, and commercial glass recommendations depend heavily on the specific condition of the product, the installation, the surrounding structure, and factors that can only be assessed through an in-person inspection. Information on this website, including descriptions of repair versus replacement criteria, typical repair processes, and expected outcomes, reflects general experience and may not apply to your specific situation. No assessment or recommendation is valid without a direct evaluation by Glass &amp; Door Pro.</p><h2>Manufacturer Warranty Coverage</h2><p>References to manufacturer warranties, warranty service, product defects, or product eligibility on this website are general in nature. Warranty coverage for any specific product depends on the manufacturer's warranty terms, the product's eligibility, proof of purchase, installation documentation, the nature of the defect or failure, and other factors determined by the manufacturer. Glass &amp; Door Pro cannot confirm warranty coverage or eligibility without reviewing the product and documentation directly. Any manufacturer or product reference does not guarantee that a specific claim will be approved by the manufacturer. Contact Glass &amp; Door Pro for project-specific questions.</p><h2>Pricing and Availability</h2><p>Any pricing references, ranges, or cost comparisons on this website are general in nature and do not constitute a quote or estimate for any specific project. Actual pricing depends on product specifications, site conditions, measurements, finish selections, hardware, parts availability, access requirements, and other factors assessed at the time of the estimate. Availability of services, scheduling, and parts is subject to change without notice. See our Terms of Service for additional information about estimates and service agreements.</p><h2>Commercial Work</h2><p>Descriptions of commercial glass services on this website are general in nature. Commercial project scope, access requirements, permitting, insurance requirements, and applicable code standards vary significantly by property type, location, and jurisdiction. No description on this website should be relied upon as a complete characterization of what a commercial project will require.</p><h2>No Liability</h2><p>Glass &amp; Door Pro makes reasonable efforts to ensure the accuracy of information on this website but does not warrant that all content is current, complete, or error-free. Glass &amp; Door Pro and its owners, employees, contractors, and agents are not liable for any decisions made or actions taken in reliance on information published on this website.</p><h2>Contact</h2><p>If you have questions about a specific project or situation, contact us directly rather than relying on website content.</p><p>Glass &amp; Door Pro<br>2341 Waverly Dr<br>Monroe, NC 28112<br><a href=\"tel:+17047716111\">(704) 771-6111</a></p>",
      },
    },
  ],
};

function envFlag(name: string) {
  const raw = process.env[name];
  return raw === "1" || raw?.toLowerCase() === "true";
}

async function upsertMenu(
  menu: InsertCmsMenu & { location: MenuLocation },
  options: { force: boolean },
) {
  const storage = await getStorage();
  const allMenus = await storage.cmsMenus.getAll();
  const matches = allMenus.filter((entry) => entry.location === menu.location);
  const [primary, ...duplicates] = matches;

  if (primary && !options.force) {
    console.log(
      `  [skipped] ${menu.location} menu (${primary.id}) already exists; set GLASS_CMS_SEED_FORCE_MENUS=true to replace menus`,
    );
    return;
  }

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

function getSeedOnlySlugs() {
  const raw = process.env.GLASS_CMS_SEED_ONLY_SLUGS;
  if (!raw) return null;

  const slugs = raw
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  return slugs.length > 0 ? new Set(slugs) : null;
}

function shouldOverwriteExistingCmsPages() {
  return envFlag("GLASS_CMS_SEED_FORCE_PAGES") || envFlag("GLASS_CMS_SEED_OVERWRITE_EXISTING");
}

function shouldOverwriteExistingCmsMenus() {
  return envFlag("GLASS_CMS_SEED_FORCE_MENUS");
}

function shouldOverwriteExistingBrandingSettings() {
  return envFlag("GLASS_CMS_SEED_FORCE_BRANDING");
}

function shouldOverwriteExistingSeoSettings() {
  return envFlag("GLASS_CMS_SEED_FORCE_SEO");
}

function printSeedHelp() {
  console.log(`Glass & Door Pro public CMS seed

Usage:
  npm run seed:glass-public-cms

Safe mode is the default. Existing CMS pages, menus, branding settings, and global SEO settings
are preserved unless a specific force flag is set.

Force flags:
  GLASS_CMS_SEED_FORCE_PAGES=true
    Replace existing seeded public CMS pages and delete deprecated seeded pages.
    May overwrite page text, block structure, images, focal points, alt text, captions, SEO fields,
    canonical URLs, status, template, and publish timestamps.

  GLASS_CMS_SEED_FORCE_MENUS=true
    Replace existing menus in seeded theme locations and unassign duplicate menus in those locations.
    May overwrite admin-created navigation labels, URLs, nesting, and location assignments.

  GLASS_CMS_SEED_FORCE_BRANDING=true
    Replace existing seeded branding settings such as logo, colors, company name, address, and phone.

  GLASS_CMS_SEED_FORCE_SEO=true
    Replace existing global SEO settings such as site name, title suffix, default meta description,
    site URL, default OG image, organization name, and organization logo.

Legacy:
  GLASS_CMS_SEED_OVERWRITE_EXISTING=true
    Pages-only alias for GLASS_CMS_SEED_FORCE_PAGES=true. It does not force menus, branding, or SEO.

Targeting:
  GLASS_CMS_SEED_ONLY_SLUGS=services-frameless-showers,services-window-installation
    Limit page seeding to supported service-page slugs. Existing targeted pages are still preserved
    unless page force mode is enabled.
`);
}

function logSkippedExistingPage(slug: string, id: string) {
  console.log(
    `  [skipped] ${slug} page (${id}) already exists; set GLASS_CMS_SEED_FORCE_PAGES=true to replace it`,
  );
}

async function upsertGlassServicePage(servicePage: GlassServicePageSeed) {
  const storage = await getStorage();
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
    canonicalUrl: `https://glassanddoorpro.com${servicePath}`,
    publishedAt: new Date(),
  };

  if (existingServicePage) {
    if (!shouldOverwriteExistingCmsPages()) {
      logSkippedExistingPage(servicePage.slug, existingServicePage.id);
      return;
    }
    await storage.cmsPages.updatePage(existingServicePage.id, pagePayload);
    console.log(`  [updated] ${servicePage.slug} page (${existingServicePage.id})`);
  } else {
    const page = await storage.cmsPages.createPage(pagePayload);
    console.log(`  [created] ${servicePage.slug} page (${page.id})`);
  }
}

export async function seedGlassPublicCms() {
  console.log("Seeding Glass & Door Pro public CMS content...");
  const storage = await getStorage();
  const seedOnlySlugs = getSeedOnlySlugs();
  const forcePages = shouldOverwriteExistingCmsPages();
  const forceMenus = shouldOverwriteExistingCmsMenus();
  const forceBranding = shouldOverwriteExistingBrandingSettings();
  const forceSeo = shouldOverwriteExistingSeoSettings();

  if (!forcePages) {
    console.log(
      "  [safe mode] existing CMS pages will not be overwritten; set GLASS_CMS_SEED_FORCE_PAGES=true to reset pages from seed content",
    );
  }
  if (!forceMenus) {
    console.log(
      "  [safe mode] existing CMS menus will not be overwritten; set GLASS_CMS_SEED_FORCE_MENUS=true to reset menus from seed content",
    );
  }
  if (!forceBranding) {
    console.log(
      "  [safe mode] existing branding settings will not be overwritten; set GLASS_CMS_SEED_FORCE_BRANDING=true to reset branding",
    );
  }
  if (!forceSeo) {
    console.log(
      "  [safe mode] existing global SEO settings will not be overwritten; set GLASS_CMS_SEED_FORCE_SEO=true to reset global SEO",
    );
  }

  if (seedOnlySlugs) {
    console.log(`  [targeted] limiting seed to slugs: ${[...seedOnlySlugs].join(", ")}`);
    const matchedSlugs = new Set<string>();
    for (const servicePage of glassServicePages) {
      if (!seedOnlySlugs.has(servicePage.slug)) continue;
      matchedSlugs.add(servicePage.slug);
      await upsertGlassServicePage(servicePage);
    }

    const unmatchedSlugs = [...seedOnlySlugs].filter((slug) => !matchedSlugs.has(slug));
    if (unmatchedSlugs.length > 0) {
      throw new Error(`No supported targeted seed page found for: ${unmatchedSlugs.join(", ")}`);
    }

    console.log("Done.");
    return;
  }

  const existingCommercialGlassPage = await storage.cmsPages.getPageBySlug(
    "services-commercial-glass",
  );
  if (existingCommercialGlassPage) {
    if (forcePages) {
      await storage.cmsPages.deletePage(existingCommercialGlassPage.id);
      console.log(`  [deleted] services-commercial-glass page (${existingCommercialGlassPage.id})`);
    } else {
      console.log(
        `  [skipped] services-commercial-glass page (${existingCommercialGlassPage.id}) already exists; set GLASS_CMS_SEED_FORCE_PAGES=true to delete deprecated seeded pages`,
      );
    }
  }

  const existingHome = await storage.cmsPages.getPageBySlug("home");
  if (existingHome) {
    if (!forcePages) {
      logSkippedExistingPage("home", existingHome.id);
    } else {
      await storage.cmsPages.updatePage(existingHome.id, {
        title: "Home",
        slug: "home",
        pageType: "home",
        status: "published",
        template: "full-width",
        content: glassHomeContent,
        seoTitle: "Glass & Door Services in Charlotte & Monroe, NC",
        seoDescription:
          "Glass & Door Pro serves Charlotte and Monroe, NC with frameless shower doors, window installation, door replacement, window repair, and commercial glass. Owner-operated with 15+ years of experience.",
        seoKeywords:
          "glass installation Charlotte NC, frameless shower doors, window repair, door installation, commercial glass",
        ogImageUrl: "/images/glass-door-pro/gallery-shower1-1280w.webp",
        publishedAt: new Date(),
      });
      console.log(`  [updated] home page (${existingHome.id})`);
    }
  } else {
    const page = await storage.cmsPages.createPage({
      title: "Home",
      slug: "home",
      pageType: "home",
      status: "published",
      template: "full-width",
      content: glassHomeContent,
      seoTitle: "Glass & Door Services in Charlotte & Monroe, NC",
      seoDescription:
        "Glass & Door Pro serves Charlotte and Monroe, NC with frameless shower doors, window installation, door replacement, window repair, and commercial glass. Owner-operated with 15+ years of experience.",
      seoKeywords:
        "glass installation Charlotte NC, frameless shower doors, window repair, door installation, commercial glass",
      ogImageUrl: "/images/glass-door-pro/gallery-shower1-1280w.webp",
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
    ogImageUrl: "/images/glass-door-pro/gallery/frameless-showers/03.webp",
    canonicalUrl: "https://glassanddoorpro.com/gallery",
    publishedAt: new Date(),
  };

  if (existingGallery) {
    if (!forcePages) {
      logSkippedExistingPage("gallery", existingGallery.id);
    } else {
      await storage.cmsPages.updatePage(existingGallery.id, galleryPayload);
      console.log(`  [updated] gallery page (${existingGallery.id})`);
    }
  } else {
    const page = await storage.cmsPages.createPage(galleryPayload);
    console.log(`  [created] gallery page (${page.id})`);
  }

  const existingReviews = await storage.cmsPages.getPageBySlug("reviews");
  const reviewsPayload: InsertCmsPage = {
    title: "Customer Reviews",
    slug: "reviews",
    pageType: "reviews",
    status: "published",
    template: "full-width",
    content: glassReviewsContent,
    seoTitle: "Customer Reviews",
    seoDescription:
      "Read customer reviews for Glass & Door Pro's frameless shower doors, window installation, door installation, window repair, and commercial glass work around Charlotte.",
    seoKeywords:
      "Glass & Door Pro reviews, Charlotte glass company reviews, shower door reviews, window installation reviews",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    canonicalUrl: "https://glassanddoorpro.com/reviews",
    publishedAt: new Date(),
  };

  if (existingReviews) {
    if (!forcePages) {
      logSkippedExistingPage("reviews", existingReviews.id);
    } else {
      await storage.cmsPages.updatePage(existingReviews.id, reviewsPayload);
      console.log(`  [updated] reviews page (${existingReviews.id})`);
    }
  } else {
    const page = await storage.cmsPages.createPage(reviewsPayload);
    console.log(`  [created] reviews page (${page.id})`);
  }

  const existingServices = await storage.cmsPages.getPageBySlug("services");
  const servicesPayload: InsertCmsPage = {
    title: "Glass and Door Services",
    slug: "services",
    pageType: "service",
    status: "published",
    template: "full-width",
    content: glassServicesContent,
    seoTitle: "Glass and Door Services in Charlotte & Monroe, NC",
    seoDescription:
      "Explore frameless showers, window installation, door installation, window repair, and commercial glass and door services in Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby areas.",
    seoKeywords:
      "glass and door services Charlotte NC, Monroe glass company, frameless showers, window installation, door installation, window repair, commercial glass",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    canonicalUrl: "https://glassanddoorpro.com/services",
    publishedAt: new Date(),
  };

  if (existingServices) {
    if (!forcePages) {
      logSkippedExistingPage("services", existingServices.id);
    } else {
      await storage.cmsPages.updatePage(existingServices.id, servicesPayload);
      console.log(`  [updated] services page (${existingServices.id})`);
    }
  } else {
    const page = await storage.cmsPages.createPage(servicesPayload);
    console.log(`  [created] services page (${page.id})`);
  }

  for (const servicePage of glassServicePages) {
    await upsertGlassServicePage(servicePage);
  }

  for (const cityPage of glassCityPages) {
    const existingCityPage = await storage.cmsPages.getPageBySlug(cityPage.slug);
    const pagePayload: InsertCmsPage = {
      title: cityPage.title,
      slug: cityPage.slug,
      pageType: "area",
      status: "published",
      template: "full-width",
      content: cityPage.content,
      seoTitle: cityPage.seoTitle,
      seoDescription: cityPage.seoDescription,
      seoKeywords: cityPage.seoKeywords,
      ogImageUrl: cityPage.ogImageUrl,
      canonicalUrl: `https://glassanddoorpro.com${cityPage.path}`,
      publishedAt: new Date(),
    };

    if (existingCityPage) {
      if (!forcePages) {
        logSkippedExistingPage(cityPage.slug, existingCityPage.id);
      } else {
        await storage.cmsPages.updatePage(existingCityPage.id, pagePayload);
        console.log(`  [updated] ${cityPage.slug} page (${existingCityPage.id})`);
      }
    } else {
      const page = await storage.cmsPages.createPage(pagePayload);
      console.log(`  [created] ${cityPage.slug} page (${page.id})`);
    }
  }

  const privacyPayload: InsertCmsPage = {
    title: "Privacy Policy",
    slug: "privacy-policy",
    pageType: "custom",
    status: "published",
    template: "full-width",
    content: glassPrivacyPolicyContent,
    seoTitle: "Privacy Policy",
    seoDescription:
      "Review how Glass & Door Pro handles contact form details, service inquiries, cookies, analytics, and customer records.",
    seoKeywords:
      "Glass & Door Pro privacy policy, Charlotte glass company privacy, customer information",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    canonicalUrl: "https://glassanddoorpro.com/privacy-policy",
    noindex: false,
    publishedAt: new Date(),
  };
  const existingPrivacyPolicy = await storage.cmsPages.getPageBySlug("privacy-policy");
  if (existingPrivacyPolicy) {
    if (!forcePages) {
      logSkippedExistingPage("privacy-policy", existingPrivacyPolicy.id);
    } else {
      await storage.cmsPages.updatePage(existingPrivacyPolicy.id, privacyPayload);
      console.log(`  [updated] privacy-policy page (${existingPrivacyPolicy.id})`);
    }
  } else {
    const page = await storage.cmsPages.createPage(privacyPayload);
    console.log(`  [created] privacy-policy page (${page.id})`);
  }

  const termsPayload: InsertCmsPage = {
    title: "Terms of Service",
    slug: "terms-of-service",
    pageType: "custom",
    status: "published",
    template: "full-width",
    content: glassTermsOfServiceContent,
    seoTitle: "Terms of Service",
    seoDescription:
      "Review Glass & Door Pro website terms for estimates, service information, third-party links, and site content.",
    seoKeywords: "Glass & Door Pro terms of service, Charlotte glass company terms, website terms",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    canonicalUrl: "https://glassanddoorpro.com/terms-of-service",
    noindex: false,
    publishedAt: new Date(),
  };
  const existingTermsOfService = await storage.cmsPages.getPageBySlug("terms-of-service");
  if (existingTermsOfService) {
    if (!forcePages) {
      logSkippedExistingPage("terms-of-service", existingTermsOfService.id);
    } else {
      await storage.cmsPages.updatePage(existingTermsOfService.id, termsPayload);
      console.log(`  [updated] terms-of-service page (${existingTermsOfService.id})`);
    }
  } else {
    const page = await storage.cmsPages.createPage(termsPayload);
    console.log(`  [created] terms-of-service page (${page.id})`);
  }

  const disclaimerPayload: InsertCmsPage = {
    title: "Disclaimer",
    slug: "disclaimer",
    pageType: "custom",
    status: "published",
    template: "full-width",
    content: glassDisclaimerContent,
    seoTitle: "Disclaimer",
    seoDescription:
      "Review Glass & Door Pro disclaimers about website information, estimates, repair recommendations, pricing, and commercial work.",
    seoKeywords:
      "Glass & Door Pro disclaimer, glass service disclaimer, Charlotte glass company disclaimer",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    canonicalUrl: "https://glassanddoorpro.com/disclaimer",
    noindex: false,
    publishedAt: new Date(),
  };
  const existingDisclaimer = await storage.cmsPages.getPageBySlug("disclaimer");
  if (existingDisclaimer) {
    if (!forcePages) {
      logSkippedExistingPage("disclaimer", existingDisclaimer.id);
    } else {
      await storage.cmsPages.updatePage(existingDisclaimer.id, disclaimerPayload);
      console.log(`  [updated] disclaimer page (${existingDisclaimer.id})`);
    }
  } else {
    const page = await storage.cmsPages.createPage(disclaimerPayload);
    console.log(`  [created] disclaimer page (${page.id})`);
  }

  for (const menu of glassMenus) {
    await upsertMenu(menu, { force: forceMenus });
  }

  let syncedBrandingSettings = 0;
  let skippedBrandingSettings = 0;
  for (const [key, value] of Object.entries(brandingSettings)) {
    const existingValue = await storage.settings.getSetting(key);
    if (forceBranding || existingValue === null) {
      await storage.settings.upsertSetting(key, value, "branding", false);
      syncedBrandingSettings += 1;
    } else {
      skippedBrandingSettings += 1;
    }
  }

  if (syncedBrandingSettings > 0) {
    console.log(`  [synced] ${syncedBrandingSettings} branding settings`);
  }
  if (skippedBrandingSettings > 0) {
    console.log(
      `  [skipped] ${skippedBrandingSettings} existing branding settings; set GLASS_CMS_SEED_FORCE_BRANDING=true to replace branding`,
    );
  }

  const existingSeoSettings = await storage.seoSettings.get();
  if (forceSeo || !existingSeoSettings) {
    await storage.seoSettings.upsert(glassSeoSettings);
    console.log("  [synced] global SEO settings");
  } else {
    console.log(
      "  [skipped] existing global SEO settings; set GLASS_CMS_SEED_FORCE_SEO=true to replace global SEO",
    );
  }

  console.log("Done.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printSeedHelp();
    process.exit(0);
  }

  seedGlassPublicCms()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
