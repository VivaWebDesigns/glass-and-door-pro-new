import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PublicPageRenderer } from "@/features/public/public-block-renderer";
import type { BlockInstance } from "@/features/admin/cms/builder/block-registry";

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

const reviewItems = [
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

const blocks: BlockInstance[] = [
  {
    id: "reviews-header",
    type: "section-header",
    props: {
      title: "Customer Reviews",
      subtitle:
        "5.0 stars from customers across the Charlotte area who trusted Glass & Door Pro for showers, windows, doors, repairs, and commercial glass.",
      alignment: "center",
      sectionBackgroundColor: "#f0f8fb",
      sectionPaddingTop: "lg",
      sectionPaddingBottom: "lg",
    },
  },
  {
    id: "reviews-list",
    type: "testimonials",
    props: {
      anchorId: "reviews",
      title: "Latest Google Reviews",
      subtitle: "Newest first from the Glass & Door Pro Google Business Profile.",
      variant: "google-carousel",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "md",
      sectionPaddingBottom: "lg",
      items: reviewItems,
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
