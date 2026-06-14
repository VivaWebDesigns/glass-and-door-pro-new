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

function googleReview(name: string, date: string, quote: string) {
  return {
    quote,
    name,
    date,
    role: "Customer",
    location: "Google review",
    rating: 5,
    source: "Google",
    sourceIcon: "google",
  };
}

const glassReviewItems = [
  googleReview(
    "Frankie23 “Patricia”",
    "a week ago",
    "I've been finding it very difficult to find good, reliable people for certain renovations. Doug, however, exceeded my expectations by miles. His talent for attention to meticulous details is very impressive. His love and pride for what he does shows through his work, which is immaculate. Not to mention he is just a very nice guy who actually listens and caters to you even if you aren't sure of what you need/want, per se. Extremely communicative and patient. 10/10. Good job and Thank You!",
  ),
  googleReview("Mike Capuano", "2 weeks ago", "Fast response, Great communication. Quality work. Would call again."),
  googleReview(
    "Jvarr",
    "2 weeks ago",
    "Doug was very quick and responded fast, even cut an extra piece because one was scratched. Then I also needed a third piece cut due to a measuring mishap and he gave it to me with a discounted price all in one day.",
  ),
  googleReview(
    "Conner Kipke",
    "3 weeks ago",
    "Doug was quick to respond and very professional. His prices are fair and the work is great. I would recommend him to anyone in need of glass repair.",
  ),
  googleReview(
    "Homero Avila",
    "a month ago",
    "This is who I will call every time I need a glass replaced! Easy to communicate and schedule with, cares about getting the job done and customer satisfaction. Doug came out even with a hurt foot and took care of the glass replacement. 5/5 recommendation!",
  ),
  googleReview(
    "jamie ozment",
    "a month ago",
    "Doug with Glass and Door Pro is excellent! I broke a piece in my window and I couldn't get my window to open or close. I called Doug on Monday morning and he came out right away. He had all the supplies he needed and sent me texts to let me know the next steps.",
  ),
  googleReview("Holly Widders", "a month ago", "He did a fantastic job! Our sliding glass door works better than ever now!"),
  googleReview(
    "Derick Pope",
    "a month ago",
    "We use Doug at our property. He's very reliable and has great craftsmanship. I would recommend his services to anyone.",
  ),
  googleReview(
    "Mike Duganich",
    "2 months ago",
    "Doug came out right on time and fixed a few issues we were having on a few windows and doors. Highly knowledgeable and recommended good fixes. Highly recommend.",
  ),
  googleReview(
    "Lin Nina",
    "3 months ago",
    "The door in our store is never closed tightly, and it has always been prone to air leakage. Since he repaired the door, the temperature in our store has been very well maintained. He worked very responsibly and gave a reasonable price. We were highly recommended him. It's a really correct choice.",
  ),
  googleReview(
    "Greg Hyder",
    "3 months ago",
    "Quick to respond and quote. Showed up on time and did a great job in installing my door window insert. Very fair pricing. Would highly recommend.",
  ),
  googleReview(
    "Melissa Eyerman",
    "3 months ago",
    "We needed a window replaced in our home. Doug was responsive, professional, and easy to work with. He explained the process, showed up on time, and treated our home with care and respect. The installation itself was done efficiently and carefully.",
  ),
  googleReview(
    "Kimberly Sanders",
    "3 months ago",
    "We broke a large glass panel out of our shower and Doug from Glass and Door Pro did an amazing job replacing that panel for us. He was able to come give us an estimate and then had the shower glass replaced in no time. Highly recommend Glass and Door Pro!",
  ),
  googleReview(
    "Mike Dickerman",
    "Edited 4 months ago",
    "Doug was on time and very professional. I called so he could come fix a few broken windows and a door and it turned out to be a simple fix which took him no time and he didn't even charge for it. I admire the honesty.",
  ),
  googleReview(
    "Robbie Mulkey",
    "4 months ago",
    "I had a broken window that needed fixing and they went above and beyond. They showed up on time, explained everything clearly, and the work looks perfect. The area was clean when they finished and the price was great.",
  ),
  googleReview(
    "James Pickard",
    "5 months ago",
    "Doug was excellent. He was prompt and was able to give a price right on the spot. When he showed up for the job he got straight to work and finished the job in a good amount of time. I would refer him to anyone.",
  ),
  googleReview(
    "Pam Jones",
    "5 months ago",
    "Doug and Ben replaced our shower glass enclosure in our primary bathroom. They were on time, professional, extremely meticulous with measurements and installation along with great communication. We would highly recommend.",
  ),
  googleReview(
    "Jenny Cornacchione",
    "7 months ago",
    "Doug helped us to replace a window and install a storm door. He provided exceptional service throughout the entire process, and I highly recommend Glass and Door Pro.",
  ),
  googleReview("Andrey Bayrashev", "9 months ago", "Great work installing our broken window, with great quality and at affordable price!"),
  googleReview(
    "Ryan Billingsley",
    "10 months ago",
    "Doug installed a new front door and storm door on our house. Due to the extreme temperatures, the door had swollen and was not functioning properly. Called Doug and he came out quickly to get it sorted.",
  ),
  googleReview("Tapan Patel", "10 months ago", "Pro."),
  googleReview(
    "Arlie Gunn",
    "a year ago",
    "These guys were friendly and professional and also showed up to help last minute!!! I was in a tough spot and they showed up with smiles on their faces and helped me out no problem. Also the pricing is fair and very affordable.",
  ),
  googleReview("Hardcor Coleman", "a year ago", "Great experience job was done quick and efficient. Plus a good guy will definitely recommend."),
  googleReview(
    "Samantha Walsh",
    "a year ago",
    "Doug was amazing with our major window issues. He was prompt and professional and very communicative. He helped alleviate a lot of stress and has been our go to ever since. I have to say not only is the quality top notch but his pricing was the most reasonable in town! Would recommend him 10x over!!",
  ),
  googleReview("Dennis “AusareOne” Stevens", "a year ago", "Excellent work I highly recommend him. 100%."),
  googleReview(
    "Thomas Foy",
    "a year ago",
    "Doug was great. He's extremely detailed in his work. Will definitely use him again when I'm ready to upgrade the other shower door. Highly recommend!",
  ),
  googleReview(
    "Jim Zellers",
    "a year ago",
    "Our entire experience was great. Doug was extremely careful in doing the measurements for our shower glass. He also was very particular installing the glass and taking time to make sure everything was perfect. I highly recommend Doug and his company and will use them for any future glass projects.",
  ),
  googleReview(
    "Michael Powers",
    "a year ago",
    "Wonderful experience using Glass and Door Pro's. They are very meticulous and always look to make the job more affordable by offering option to rework if deemed possible.",
  ),
  googleReview(
    "Chandra Funderburk",
    "a year ago",
    "Very nice man. Reasonably priced. Came on time. Did excellent work and didn't take long at all. Would definitely recommend.",
  ),
  googleReview(
    "Evelyn Salazar",
    "a year ago",
    "I had an emergency door that needed a new glass and Doug was very responsive and quick to come out and help during this time. I'm hoping I don't need to give him a call but in case of an incident I know I can count on him. Thank you once again!",
  ),
  googleReview(
    "Behyar Behdani",
    "a year ago",
    "Doug is a great, honest and hard working gentleman. Based on his hard work I suggested him to keep working with great manufacturers to match his valuable work.",
  ),
  googleReview("Sheila Ellsaesser", "a year ago", "This was a great experience. Very detailed, professional."),
  googleReview(
    "cookiemclaughlin",
    "a year ago",
    "Doug did a fantastic job removing a large mirror from a wall. Excellent communication before, during and after the job was done. He 100 percent went above and beyond for me and I really appreciate it. Highly recommend!",
  ),
  googleReview(
    "Annette Calise",
    "a year ago",
    "Glass and Door Pro was very professional, knowledgeable and friendly. We received an appointment quickly to fix our shower door. We are very happy with the results. We will use him again.",
  ),
  googleReview(
    "Leah Korgaard Offutt",
    "2 years ago",
    "Very happy with the service by Doug. Fast out to give a quote, friendly and good communication, installation as promised and high quality product.",
  ),
  googleReview(
    "charles naperski",
    "2 years ago",
    "Replaced a back door and frame that was rotting out. Did an excellent job with a quality door and frame. Punctual, professional, economical!",
  ),
  googleReview("G. Scott Denton", "2 years ago", "Doug was simply fantastic. Very thorough and the shower glass turned out amazing! Highly recommend!"),
  googleReview(
    "T Woods",
    "2 years ago",
    "Doug was a great communicator and made the whole process easy. He took great care during installation of my frameless shower glass to protect my Carrara Marble. He was meticulous, did a great job and was super great to work with!",
  ),
  googleReview(
    "Gus St. Angelo",
    "2 years ago",
    "Doug was wonderful to work with. He is very efficient, friendly, courteous, on time and he left the work space very clean. Overall a really nice guy.",
  ),
  googleReview(
    "Amy Starr",
    "2 years ago",
    "Very knowledgeable, knew exactly what to do and was both personable and professional. Plus he cleaned up after he completed the job and everything looked great! Thanks Doug for fixing our shower door!",
  ),
  googleReview("Mindy Bass", "2 years ago", "Doug came the next day and took precise measurements. Very courteous, professional with very reasonable prices."),
  googleReview(
    "Donna Kelly",
    "2 years ago",
    "Doug was great. From the time I called him he was punctual and thorough. We were extremely satisfied with the work that was done we will definitely be recommending him to others.",
  ),
  googleReview("Colt Atkinson", "3 years ago", "Great pricing and even better service!!"),
  googleReview(
    "Bessie Flanders",
    "3 years ago",
    "A stone broke our sliding glass door glass. Doug came, measured, and gave us the quote. Within a week he came and installed the glass. Extremely nice, knowledgeable, honest and reasonable. I highly recommend him.",
  ),
  googleReview("Matthew Berti", "3 years ago", "Door came out great and finished off our new shower."),
  googleReview(
    "Will Friedrich",
    "3 years ago",
    "Very pleased with the results on our frameless shower. Doug was great to work with, very responsive, and professional. Would highly recommend for your shower glass project.",
  ),
  googleReview(
    "Felisha Barbee",
    "3 years ago",
    "Doug was quick to respond, very professional, and affordable!! We were extremely pleased with the service and will def call him if we need any other window repairs!",
  ),
  googleReview("Travis Dixon", "3 years ago", "Had a glass shower door installed, did fantastic work and very easy to work with, and communicated every step of the way."),
  googleReview("William Owens", "3 years ago", "First very kind respectful. His work was quick but professional experience."),
  googleReview(
    "JOSEPH PETRILLI",
    "3 years ago",
    "Professional, quality service. Fixed my problem window and made time to do it right. Had a large job to get to but didn't rush through the job. Outstanding. Thanks!",
  ),
  googleReview(
    "Jeannie Carney",
    "3 years ago",
    "We were extremely pleased with the pergola Doug helped build! Doug was professional, worked hard and completed the job on time. Good attention to detail! Highly recommend!",
  ),
  googleReview(
    "Monique McKenzie",
    "3 years ago",
    "This company installed a frameless shower. The gentleman that runs this business is the ultimate professional. His work is flawless. Beyond that, he installed two glass shelves that I needed which would have cost me a significant amount elsewhere.",
  ),
  googleReview(
    "Kim Payne",
    "4 years ago",
    "He responded quickly to my call and was very flexible with times. He is extremely professional and was so personable and kind. The workmanship is very precise and the damaged area looks like new. I would highly recommend him to anyone.",
  ),
  googleReview("Kristy Compton", "4 years ago", "Doug did an AMAZING job!! Very meticulous and made sure it was done right. Will definitely use again and highly recommend."),
  googleReview(
    "Jyotirmoy Banerjee",
    "4 years ago",
    "Doug did a great job repairing our pocket door. He was very professional and took time to make sure that it worked properly.",
  ),
  googleReview(
    "Airy McDaniel",
    "4 years ago",
    "I wish I could figure out how to provide before/after images of the work. He was great, professional, and on time! I will definitely contact Glass and Door Pro in the future! He made my door look like it's brand new.",
  ),
  googleReview(
    "Sanjay Balakrishnan",
    "4 years ago",
    "Doug was awesome. He was very professional at his service. All communications are clear and recorded using his business apps. I was not in town and was a little reluctant to let someone do the job in my absence, but Doug kept me updated throughout.",
  ),
  googleReview(
    "Carla West",
    "4 years ago",
    "Doug was great to work with. He was very professional, did a thorough job and even took the time to explain what he was fixing and how to care for the window afterwards. He did a great job of communicating with me.",
  ),
  googleReview(
    "Michelle Jones",
    "4 years ago",
    "Doug was great from beginning to end! He kept and maintained communication from beginning to end. Instead of replacing a door, he was able to repair it and fix a leak problem with the door. Great work.",
  ),
  googleReview("Jennifer Barber", "4 years ago", "He did a very professional job. When he finished the door repair it was not like it was ever broken."),
  googleReview("Custodio Benitez", "4 years ago", "Did a great job. I recommend him to anybody that needs a window fix and glass job."),
  googleReview(
    "Mary Beth Roth",
    "4 years ago",
    "Doug measured and installed a new wall mirror in our main bathroom. He was accurate in his cost and time estimate, careful in his installation, and meticulous in his cleanup. A great job.",
  ),
  googleReview(
    "Robin Whitlock",
    "4 years ago",
    "We had an unfortunate incident happen at our home. However, Doug took care of our old door and window problem quickly. He replaced our flimsy storage room door with a very sturdy, nice replacement door.",
  ),
  googleReview(
    "Tony Hinton",
    "5 years ago",
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
      ctaSecondaryModalDescription: "Share a few project details and Doug will follow up with next steps.",
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
  primaryText?: string;
}) {
  return block("hero", {
    variant: "glass-service",
    layout: "split",
    heading: props.heading,
    subheading: `<p>${props.subheading}</p>`,
    ctaText: props.primaryText ?? "Request a Free Quote",
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

function quoteCtaBlock(heading: string, body: string, footerLine: string) {
  return block("cta", {
    variant: "glass-service",
    heading,
    subheading: `<p>${body}</p><p><strong>${footerLine}</strong></p>`,
    primaryText: "Get Your Free Estimate",
    primaryAction: "form-modal",
    primaryFormSlug: "contact-form",
    primaryModalTitle: "Request a Free Estimate",
    primaryModalDescription: "Share a few project details and Doug will follow up with next steps.",
    secondaryText: "Call (704) 771-6111",
    secondaryAction: "custom-link",
    secondaryLink: "tel:+17047716111",
  });
}

function relatedServicesBlock() {
  return block("link-list", {
    title: "Related Services",
    columns: "1",
    sectionBackgroundColor: "#ffffff",
    sectionPaddingTop: "md",
    sectionPaddingBottom: "md",
    links: [
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
    ],
  });
}

const month1FramelessContent: InsertCmsPage["content"] = {
  blocks: [
    serviceHero({
      heading: "Frameless Glass Shower Doors in Charlotte, Monroe & Surrounding NC",
      subheading:
        "Custom frameless shower enclosures, measured, fabricated, and installed personally by Doug — owner-operator with 15+ years of experience. Serving Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and the surrounding greater Charlotte area.",
      imageUrl: "/images/glass-door-pro/frameless-parallax.jpg",
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
        url: "/images/glass-door-pro/gallery/frameless-showers/03.jpg",
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
        '<p>We serve homeowners and businesses throughout the greater Charlotte metro area, including: <a href="/areas-served/charlotte-nc">Charlotte</a>, Matthews, Mint Hill, <a href="/areas-served/monroe-nc">Monroe</a>, Pineville, Huntersville, Cornelius, Davidson, Concord, Tega Cay, Waxhaw, Weddington, Wesley Chapel, Indian Trail, Stallings, Fort Mill, Indian Land, Rock Hill, and surrounding areas.</p>',
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

const glassServicesContent: InsertCmsPage["content"] = {
  blocks: [
    serviceHero({
      heading: "Glass and Door Services",
      subheading:
        "Frameless showers, residential windows, door installation, window repair, and commercial glass services across Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby communities.",
      imageUrl: "/images/glass-door-pro/gallery-shower1-1280w.webp",
      imagePositionY: 42,
      primaryText: "Request a Free Quote",
    }),
    cardsGrid({
      title: "Services",
      subtitle: "Choose the project type you need help with.",
      columns: "3",
      backgroundColor: "#ffffff",
      cards: [
        {
          icon: "Droplets",
          title: "Frameless Showers",
          description: "Custom frameless shower doors and glass enclosures measured and installed personally.",
          link: "/services/frameless-showers",
          buttonText: "View frameless showers",
        },
        {
          icon: "Grid3X3",
          title: "Window Installation",
          description: "Residential window installation and replacement for homes across the Charlotte area.",
          link: "/services/window-installation",
          buttonText: "View window installation",
        },
        {
          icon: "DoorOpen",
          title: "Door Installation",
          description: "Entry, patio, storm, and exterior door installation with clean fit and finish.",
          link: "/services/door-installation",
          buttonText: "View door installation",
        },
        {
          icon: "Wrench",
          title: "Window Repair",
          description: "Broken glass, foggy panes, seal failure, and glass-only replacement when possible.",
          link: "/services/window-repair",
          buttonText: "View window repair",
        },
        {
          icon: "Building2",
          title: "Commercial Glass",
          description: "Storefront glass, office glass, glass doors, and commercial repair support.",
          link: "/services/commercial-glass",
          buttonText: "View commercial glass",
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
    seoTitle: "Frameless Shower Doors in Charlotte, Monroe & Indian Trail NC",
    seoDescription:
      "Custom frameless glass shower doors installed by an owner-operator with 15+ years of experience. Serving Charlotte, Monroe, Indian Trail, Matthews, Waxhaw and nearby NC areas. Call for a free quote.",
    seoKeywords:
      "frameless shower doors Charlotte NC, glass shower installation, custom shower enclosure, shower glass Monroe NC",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    content: month1FramelessContent,
  },
  {
    title: "Window Installation",
    slug: "services-window-installation",
    seoTitle: "Residential Window Installation in Charlotte & Monroe, NC",
    seoDescription:
      "Residential window installation and replacement in Charlotte, Monroe, Indian Trail, Matthews, Waxhaw and nearby areas. Owner-operated with 15+ years of experience. Call for a free quote.",
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
        ...windowGalleryImages,
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
    seoTitle: "Door Installation in Charlotte & Monroe, NC",
    seoDescription:
      "Entry door, patio door, and exterior door installation in Charlotte, Monroe, Indian Trail, Matthews, Waxhaw and nearby areas. Owner-operated with 15+ years of experience. Call for a free quote.",
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
        ...doorGalleryImages,
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
    seoTitle: "Window Repair in Charlotte & Monroe, NC",
    seoDescription:
      "Window repair for broken panes, foggy glass, seal failure, storm damage, and glass-only replacement in Charlotte, Monroe, Indian Trail and nearby areas. Call for a free quote.",
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
      "Commercial glass installation and repair for storefronts, office partitions, glass doors, restaurants, retail spaces, and property managers in Charlotte and nearby areas. Call for a free quote.",
    seoKeywords:
      "commercial glass Charlotte NC, storefront glass, office glass partitions, glass doors, curtain wall systems",
    ogImageUrl: "/images/glass-door-pro/commercial-hero-1280w.webp",
    content: servicePageContent({
      hero: {
        heading: "Commercial Glass Services in Charlotte, NC",
        subheading:
          "Professional commercial glass installation and repair for storefronts, offices, restaurants, retail spaces, and business properties across the Charlotte area.",
        imageUrl: "/images/glass-door-pro/commercial-hero-1280w.webp",
        imagePositionY: 50,
      },
      intro: {
        title: "Commercial Glass Solutions for Your Business",
        content:
          "<p>Your business space needs glass that looks professional, performs reliably, and supports the way your team and customers use the building. Glass & Door Pro provides commercial glass installation and repair with clear communication, careful workmanship, and responsive service.</p><p>We help with broken storefront glass, commercial glass doors, office glass partitions, interior glass, safety-focused replacement glass, and repairs that need to be handled with as little disruption as possible. Doug reviews the opening, measurements, hardware, access, and business schedule before recommending the right next step.</p><p>Whether you manage a retail storefront, restaurant, office, service business, or multi-tenant property, we keep the process practical: assess the issue, explain the options, provide a clear quote, and complete the work with attention to security, appearance, and daily operations.</p>",
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
        ...commercialGlassGalleryImages,
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
          description: "Hands-on commercial glass experience throughout Charlotte and nearby areas.",
        },
        {
          icon: "ShieldCheck",
          title: "Quality Materials",
          description: "Commercial glass and hardware selected for performance, safety, and appearance.",
        },
      ],
      faqs: [
        {
          question: "Do you replace broken storefront glass?",
          answer:
            "<p>Yes. We assess broken storefront glass, measure the opening, review safety and security needs, and recommend the right replacement path for your business.</p>",
        },
        {
          question: "Can you install commercial glass doors?",
          answer:
            "<p>Yes. We install and replace commercial glass doors for offices, retail spaces, restaurants, and service businesses, including hardware considerations when needed.</p>",
        },
        {
          question: "Do you work with property managers and business owners?",
          answer:
            "<p>Yes. We work with business owners, property managers, landlords, and tenant improvement contacts who need clear communication and reliable commercial glass service.</p>",
        },
        {
          question: "Do you handle after-hours commercial glass work?",
          answer:
            "<p>After-hours and weekend scheduling may be available depending on the project and urgency. Contact us with the location, photos if possible, and what access is available.</p>",
        },
        {
          question: "What commercial glass services do you offer in Charlotte?",
          answer:
            "<p>We help with storefront glass, commercial glass doors, office partitions, interior glass, replacement glass, and repair work for Charlotte-area businesses.</p>",
        },
        {
          question: "Do you provide glass for restaurants, offices, and retail spaces?",
          answer:
            "<p>Yes. We serve restaurants, offices, retail storefronts, service businesses, and other commercial properties that need durable, professional glass installation or repair.</p>",
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
          "<p>I'm Doug, and I've been installing glass and doors in the Charlotte area for over 15 years. I started Glass and Door Pro because I wanted to do this work the way I think it should be done: one craftsman, one project at a time, with the person who quotes the job actually being the person who shows up to install it.</p><p>Most of what I do is frameless shower doors, window and door installation, and window repair. I work on everything from brand-new construction to historic homes — and the tricky, custom projects other contractors don't want to mess with are usually the ones I enjoy most.</p><p>Based in Monroe. Serving Charlotte and surrounding areas. Saturday appointments available.</p>",
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
    title: "Frameless Shower Doors",
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
    icon: "DoorOpen",
    title: "Door Installation",
    description:
      "Entry doors, patio doors, sliding glass doors, French doors, storm doors, and pet doors in fiberglass, steel, wood, and composite. Smart locks and security upgrades available.",
    link: "/services/door-installation",
    buttonText: "Learn more about door installation",
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
    icon: "Building2",
    title: "Commercial Glass",
    description:
      "Professional storefront glass, office partitions, and commercial glass solutions for businesses. After-hours and weekend appointments available.",
    link: "/services/commercial-glass",
    buttonText: "Learn more about commercial glass",
  },
];

const glassCityPages: GlassCityPageSeed[] = [
  {
    title: "Monroe, NC",
    slug: "areas-served-monroe-nc",
    path: "/areas-served/monroe-nc",
    seoTitle: "Glass & Door Services in Monroe, NC | Glass & Door Pro",
    seoDescription:
      "Monroe, NC's local glass and door company. Frameless showers, window installation, door installation, window repair, and commercial glass. Owner-operator with 15+ years of experience. Call (704) 771-6111.",
    seoKeywords:
      "glass services Monroe NC, frameless shower doors Monroe NC, window installation Monroe NC, door installation Monroe NC, window repair Monroe NC",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Monroe, NC",
        subheading:
          "Frameless shower doors, window and door installation, window repair, and commercial glass — installed personally by Doug, your Monroe-based owner-operator with 15+ years of experience. Same-week appointments. Saturday hours available.",
        imageUrl: "/images/glass-door-pro/family-1280w.webp",
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
      areasIntro: "We regularly work throughout the Monroe area and surrounding Union County communities, including:",
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
    path: "/areas-served/charlotte-nc",
    seoTitle: "Glass & Door Services in Charlotte, NC | Glass & Door Pro",
    seoDescription:
      "Personal, owner-operated glass and door services for Charlotte, NC homeowners. Frameless showers, window installation, door installation, window repair, and commercial glass. 15+ years of experience. Call (704) 771-6111.",
    seoKeywords:
      "glass services Charlotte NC, frameless shower doors Charlotte NC, window installation Charlotte NC, door installation Charlotte NC, window repair Charlotte NC",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    content: cityPageContent({
      hero: {
        heading: "Glass & Door Services in Charlotte, NC",
        subheading:
          "Personal, owner-operated frameless shower doors, window and door installation, window repair, and commercial glass — for homeowners and businesses throughout Charlotte, NC. 15+ years of experience. Saturday appointments available.",
        imageUrl: "/images/glass-door-pro/reviews-hero-1920w.webp",
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
          description:
            "We answer the phone. We text back. We show up when we say we will.",
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
          question: "Do you do work in historic Charlotte neighborhoods like Dilworth or Myers Park?",
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
];

const glassMenus: Array<InsertCmsMenu & { location: MenuLocation }> = [
  {
    name: "Main Navigation",
    location: "main_navigation",
    items: [
      item("About", "/#about"),
      item("Services", "/services", [
        item("Frameless Showers", "/services/frameless-showers"),
        item("Window Installation", "/services/window-installation"),
        item("Door Installation", "/services/door-installation"),
        item("Window Repair", "/services/window-repair"),
        item("Commercial Glass", "/services/commercial-glass"),
      ]),
      item("Service Areas", "/areas-served/charlotte-nc", [
        item("Charlotte, NC", "/areas-served/charlotte-nc"),
        item("Monroe, NC", "/areas-served/monroe-nc"),
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
      item("Commercial Glass", "/services/commercial-glass"),
      item("Get a Free Quote", "/#contact"),
    ],
  },
  {
    name: "Resources",
    location: "footer_resources",
    items: [
      item("Service Areas", "/areas-served/charlotte-nc"),
      item("Charlotte, NC", "/areas-served/charlotte-nc"),
      item("Monroe, NC", "/areas-served/monroe-nc"),
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
        item("Frameless Showers", "/services/frameless-showers"),
        item("Window Installation", "/services/window-installation"),
        item("Door Installation", "/services/door-installation"),
        item("Window Repair", "/services/window-repair"),
        item("Commercial Glass", "/services/commercial-glass"),
      ]),
      item("Service Areas", "/areas-served/charlotte-nc", [
        item("Charlotte, NC", "/areas-served/charlotte-nc"),
        item("Monroe, NC", "/areas-served/monroe-nc"),
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
          '<p><strong>Last updated:</strong> June 9, 2026</p><h2>General Information Only</h2><p>The content published on this website is provided for general informational purposes only. It describes the types of services Glass &amp; Door Pro typically offers and the general conditions under which those services are performed. It does not constitute professional advice, a formal assessment, or a recommendation specific to any individual property, window, glass unit, door, shower enclosure, commercial opening, or building condition.</p><h2>Conditions Vary by Property</h2><p>Glass, window, door, shower, and commercial glass recommendations depend heavily on the specific condition of the product, the installation, the surrounding structure, and factors that can only be assessed through an in-person inspection. Information on this website, including descriptions of repair versus replacement criteria, typical repair processes, and expected outcomes, reflects general experience and may not apply to your specific situation. No assessment or recommendation is valid without a direct evaluation by Glass &amp; Door Pro.</p><h2>Manufacturer Warranty Coverage</h2><p>References to manufacturer warranties, warranty service, product defects, or product eligibility on this website are general in nature. Warranty coverage for any specific product depends on the manufacturer\'s warranty terms, the product\'s eligibility, proof of purchase, installation documentation, the nature of the defect or failure, and other factors determined by the manufacturer. Glass &amp; Door Pro cannot confirm warranty coverage or eligibility without reviewing the product and documentation directly. Any manufacturer or product reference does not guarantee that a specific claim will be approved by the manufacturer. Contact Glass &amp; Door Pro for project-specific questions.</p><h2>Pricing and Availability</h2><p>Any pricing references, ranges, or cost comparisons on this website are general in nature and do not constitute a quote or estimate for any specific project. Actual pricing depends on product specifications, site conditions, measurements, finish selections, hardware, parts availability, access requirements, and other factors assessed at the time of the estimate. Availability of services, scheduling, and parts is subject to change without notice. See our Terms of Service for additional information about estimates and service agreements.</p><h2>Commercial Work</h2><p>Descriptions of commercial glass services on this website are general in nature. Commercial project scope, access requirements, permitting, insurance requirements, and applicable code standards vary significantly by property type, location, and jurisdiction. No description on this website should be relied upon as a complete characterization of what a commercial project will require.</p><h2>No Liability</h2><p>Glass &amp; Door Pro makes reasonable efforts to ensure the accuracy of information on this website but does not warrant that all content is current, complete, or error-free. Glass &amp; Door Pro and its owners, employees, contractors, and agents are not liable for any decisions made or actions taken in reliance on information published on this website.</p><h2>Contact</h2><p>If you have questions about a specific project or situation, contact us directly rather than relying on website content.</p><p>Glass &amp; Door Pro<br>2341 Waverly Dr<br>Monroe, NC 28112<br><a href="tel:+17047716111">(704) 771-6111</a></p>',
      },
    },
  ],
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
      seoTitle: "Glass & Door Services in Charlotte & Monroe, NC",
      seoDescription:
        "Glass & Door Pro serves Charlotte and Monroe, NC with frameless shower doors, window installation, door replacement, window repair, and commercial glass. Owner-operated with 15+ years of experience.",
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
      seoTitle: "Glass & Door Services in Charlotte & Monroe, NC",
      seoDescription:
        "Glass & Door Pro serves Charlotte and Monroe, NC with frameless shower doors, window installation, door replacement, window repair, and commercial glass. Owner-operated with 15+ years of experience.",
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
    canonicalUrl: "https://glassanddoorpro.com/gallery",
    publishedAt: new Date(),
  };

  if (existingGallery) {
    await storage.cmsPages.updatePage(existingGallery.id, galleryPayload);
    console.log(`  [updated] gallery page (${existingGallery.id})`);
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
    await storage.cmsPages.updatePage(existingReviews.id, reviewsPayload);
    console.log(`  [updated] reviews page (${existingReviews.id})`);
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
      "Explore frameless showers, window installation, door installation, window repair, and commercial glass services in Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby areas.",
    seoKeywords:
      "glass and door services Charlotte NC, Monroe glass company, frameless showers, window installation, door installation, window repair, commercial glass",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    canonicalUrl: "https://glassanddoorpro.com/services",
    publishedAt: new Date(),
  };

  if (existingServices) {
    await storage.cmsPages.updatePage(existingServices.id, servicesPayload);
    console.log(`  [updated] services page (${existingServices.id})`);
  } else {
    const page = await storage.cmsPages.createPage(servicesPayload);
    console.log(`  [created] services page (${page.id})`);
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
      canonicalUrl: `https://glassanddoorpro.com${servicePath}`,
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
      await storage.cmsPages.updatePage(existingCityPage.id, pagePayload);
      console.log(`  [updated] ${cityPage.slug} page (${existingCityPage.id})`);
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
    seoKeywords: "Glass & Door Pro privacy policy, Charlotte glass company privacy, customer information",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    canonicalUrl: "https://glassanddoorpro.com/privacy-policy",
    noindex: false,
    publishedAt: new Date(),
  };
  const existingPrivacyPolicy = await storage.cmsPages.getPageBySlug("privacy-policy");
  if (existingPrivacyPolicy) {
    await storage.cmsPages.updatePage(existingPrivacyPolicy.id, privacyPayload);
    console.log(`  [updated] privacy-policy page (${existingPrivacyPolicy.id})`);
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
    await storage.cmsPages.updatePage(existingTermsOfService.id, termsPayload);
    console.log(`  [updated] terms-of-service page (${existingTermsOfService.id})`);
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
    seoKeywords: "Glass & Door Pro disclaimer, glass service disclaimer, Charlotte glass company disclaimer",
    ogImageUrl: "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png",
    canonicalUrl: "https://glassanddoorpro.com/disclaimer",
    noindex: false,
    publishedAt: new Date(),
  };
  const existingDisclaimer = await storage.cmsPages.getPageBySlug("disclaimer");
  if (existingDisclaimer) {
    await storage.cmsPages.updatePage(existingDisclaimer.id, disclaimerPayload);
    console.log(`  [updated] disclaimer page (${existingDisclaimer.id})`);
  } else {
    const page = await storage.cmsPages.createPage(disclaimerPayload);
    console.log(`  [created] disclaimer page (${page.id})`);
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
