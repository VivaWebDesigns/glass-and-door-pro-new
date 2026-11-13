import { glassGoogleReviewDate } from "./glass-review-dates";

function googleReview(name: string, quote: string) {
  return {
    quote,
    name,
    reviewDate: glassGoogleReviewDate(name),
    role: "Customer",
    location: "Google review",
    rating: 5,
    source: "Google",
    sourceIcon: "google",
  };
}

// Google Business Profile totals, including star-only and non-5-star reviews the site doesn't show.
// Update these whenever new reviews are pulled from Google.
export const GLASS_GOOGLE_RATING_SUMMARY = {
  rating: 5.0,
  reviewCount: 91,
  checkedOn: "2026-11-13",
};

export const GLASS_NEW_GOOGLE_REVIEWS = [
  googleReview(
    "Austin Quick",
    "Doug is a true professional. Very responsive. Down to earth. A great craftsman and took the time and care to do the job right! Highly recommend for window repair or replacement",
  ),
  googleReview(
    "Kristen Johnson",
    "Doug did a great job installing our storm door! Our doorway was a little challenging due to the way the house was built, but he worked through it and made everything look great. He was very professional, took the time to get everything right, and we are very happy with the results. Highly recommend Glass and Door Pro!",
  ),
  googleReview(
    "Ty Roselli",
    "Doug was great to work with on our shower glass. He knew the options well and gave us great recommendations, and his attention to detail stood out. You can tell he made sure everything was perfect before calling it done. Highly recommend.",
  ),
  googleReview(
    "Hayes Bolton",
    "While didn’t actually do business, they were very helpful in helping me figure out my best option for my situation. I would definitely use him when a glass need comes up and truly appreciate his help which he didn’t have to do!",
  ),
  googleReview(
    "Benita D.",
    "Doug did great job repairing my shattered sliding glass door. He was quick- (finished in about 30 minutes), knowledgeable and courteous . I would recommend him to anyone that needs similar repairs.",
  ),
  googleReview("Yuriy Kobzyev", "great glass door installation company"),
  googleReview(
    "L M",
    "Doug is the owner of the business. When I contacted him. He was responsive on the weekend to do a job I needed to have competed the same day. He gave me options and advice. He was on time. His work was excellent and clean. Would highly recommend him! Thank you Doug!",
  ),
  googleReview(
    "Danielle O'Keeffe",
    "Doug’s professionalism and experience was so evident in the glass work he completed for me. He responds quickly to requests, is entirely dependable, completes the job beautifully, and is a knowledgeable and trustworthy consultant. I highly recommend Doug and Glass & Door Pro!",
  ),
  googleReview("Mariela Salgado", "Good job"),
  googleReview(
    "Mark Evans",
    "The owner, Doug, was exceptional to work with. He knows his business and made the process extremely easy. Arrived when he said he would. Charged what he quoted. Left nothing to clean up. The repairs were perfect. If you need window or door work done on your home, you will be very pleased that you had the work done by Glass & Door Pro.",
  ),
  googleReview(
    "Andrianna Demers",
    "Doug gave us a free estimate, came the same day to confirm and did a great job. No surprise fees, no mess left behind, true professionalism and no delays. We highly recommend this business.",
  ),
  googleReview(
    "Lena S",
    "Was impressed how fast the replacement was done. Would definitely recommend this company. Very responsive answer phone calls quickly and real person not AI. Had to replace shuttered half of glass sliding door",
  ),
  googleReview(
    "Lisa M",
    "I couldn't ask for better service! I had 3 window panes replaced. One of them being a half round that was not perfectly half round. The half round had some issues because of the not so perfect shape and they stuck to it until it was right. Great customer service, I had no complaints. This company serviced my area that doesn't get too many service people due to location. I would refer this company to anyone who needs replacement!",
  ),
  googleReview(
    "Konstantin Kozhemyakov",
    "Doug from Glass & Door Pro was fantastic to work with. Our sliding glass patio door shattered unexpectedly, and after reading through other reviews here, I decided to give him a call. He came out the very next day to take measurements and had everything ready to install as soon as the new glass arrived. The installation was fast, clean, and professional from start to finish. Highly recommend Doug if you need glass work done right!",
  ),
  googleReview(
    "van orcutt",
    "Doug did an amazing job! He’s very professional and knowledgeable with his work. He replaced our front door and added side window panels, put in a shower glass in two of my bathrooms that we remodeled. Highly recommend and would give 10 stars if I could!",
  ),
  googleReview(
    "Jeff Zwally",
    "Very personable and helpful in finding the right choice door. We've been wanting a storm door for the longest time. Always would rather support local rather than using a big box store's third party. The dog is most excited about the new addition since he can now eyeball the entire street comfortably.",
  ),
  googleReview("Chuck Preslar", "Great work!!!!"),
  googleReview(
    "Noah Clark",
    "Great experience, made sure the job was done correctly and explained different options allowing us to make an informed decision.",
  ),
  googleReview(
    "Mike O'Sullivan",
    "My custom double-pain glass window needed to be replaced. Everything was done exactly on time, and the glass was carefully installed. Good as new!",
  ),
  googleReview("K. Z.", "Very helpful to replace sliding door wheels!"),
  googleReview(
    "Jacob Ellison",
    "Came on time. Was professional and did an amazing install. Greats price and great work.",
  ),
  googleReview(
    "Eikon",
    "They came and quickly installed two high quality storm doors the very next day after I called them. Both doors were exactly what I was looking for. Prompt and professional workmanship at a very reasonable price, highly recommended!",
  ),
] as const;

export const GLASS_NEW_HOMEPAGE_REVIEWS = GLASS_NEW_GOOGLE_REVIEWS.slice(0, 2);

export const RETIRED_GLASS_GOOGLE_REVIEW_NAMES = new Set([
  "Frankie23 “Patricia”",
  "Tapan Patel",
  "Chris Jones",
  "RTrish",
]);
