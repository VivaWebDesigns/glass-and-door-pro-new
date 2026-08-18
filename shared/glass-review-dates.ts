/**
 * Review dates captured from the Glass & Door Pro Google Business Profile on
 * August 18, 2026. Google's week-based labels only expose week-level precision,
 * so recent dates are anchored to the corresponding week.
 */
export const GLASS_GOOGLE_REVIEW_DATES = {
  "Lisa M": "2026-08-18",
  "Konstantin Kozhemyakov": "2026-08-14",
  "van orcutt": "2026-07-28",
  "Jeff Zwally": "2026-07-21",
  "Chuck Preslar": "2026-07-21",
  "Jillian Reyes": "2026-07-21",
  "Casie Cannaday": "2026-07-14",
  "Noah Clark": "2026-07-07",
  RTrish: "2026-07-07",
  "Mike O'Sullivan": "2026-06-30",
  "K. Z.": "2026-06-23",
  "Chris Jones": "2026-06-16",
  "Jacob Ellison": "2026-06-09",
  Eikon: "2026-06-09",
  "Mike Capuano": "2026-05-19",
  Jvarr: "2026-05-19",
  "Conner Kipke": "2026-05-12",
  "Homero Avila": "2026-05-05",
  "jamie ozment": "2026-04-28",
  "Holly Widders": "2026-04-21",
  "Derick Pope": "2026-04-21",
  "Mike Duganich": "2026-03-10",
  "Lin Nina": "2026-02-24",
  "Greg Hyder": "2026-02-24",
  "Melissa Eyerman": "2026-02-17",
  "Kimberly Sanders": "2026-02-10",
  "Mike Dickerman": "2026-01-27",
  "Robbie Mulkey": "2026-01-27",
  "James Pickard": "2025-12-09",
  "Pam Jones": "2025-12-09",
  "Jenny Cornacchione": "2025-10-14",
  "Andrey Bayrashev": "2025-08-26",
  "Ryan Billingsley": "2025-08-01",
  "Arlie Gunn": "2025-05-08",
  "Hardcor Coleman": "2025-04-22",
  "Samantha Walsh": "2025-01-28",
  "Dennis “AusareOne” Stevens": "2025-01-23",
  "Thomas Foy": "2025-01-11",
  "Jim Zellers": "2025-01-08",
  "Michael Powers": "2024-12-12",
  "Chandra Funderburk": "2024-12-12",
  "Evelyn Salazar": "2024-12-10",
  "Behyar Behdani": "2024-10-11",
  "Sheila Ellsaesser": "2024-09-03",
  cookiemclaughlin: "2024-08-11",
  "Annette Calise": "2024-08-01",
  "Leah Korgaard Offutt": "2023-12-10",
  "charles naperski": "2023-11-25",
  "G. Scott Denton": "2023-11-06",
  "T Woods": "2023-10-08",
  "Gus St. Angelo": "2023-08-14",
  "Amy Starr": "2023-07-22",
  "Mindy Bass": "2023-06-17",
  "Donna Kelly": "2023-06-05",
  "Colt Atkinson": "2023-05-14",
  "Bessie Flanders": "2023-04-28",
  "Matthew Berti": "2023-03-31",
  "Will Friedrich": "2023-03-10",
  "Felisha Barbee": "2023-02-18",
  "Travis Dixon": "2022-12-27",
  "William Owens": "2022-12-03",
  "JOSEPH PETRILLI": "2022-08-23",
  "Jeannie Carney": "2022-07-17",
  "Monique McKenzie": "2022-06-27",
  "Quality Inn": "2022-06-03",
  "Kim Payne": "2022-02-28",
  "Kristy Compton": "2021-12-11",
  "Dick Watson": "2021-10-13",
  "Jyotirmoy Banerjee": "2021-08-17",
  "Airy McDaniel": "2021-08-09",
  "Sanjay Balakrishnan": "2021-08-06",
  "Carla West": "2021-08-03",
  "Michelle Jones": "2021-07-27",
  "Jennifer Barber": "2021-07-06",
  "Custodio Benitez": "2021-06-28",
  "Mary Beth Roth": "2021-06-28",
  "Robin Whitlock": "2021-06-22",
  "Tony Hinton": "2021-05-21",
} as const;

export function glassGoogleReviewDate(name: string) {
  return GLASS_GOOGLE_REVIEW_DATES[name as keyof typeof GLASS_GOOGLE_REVIEW_DATES];
}

export function formatGlassReviewAge(
  reviewDate: string | undefined,
  fallback = "",
  now = new Date(),
) {
  if (!reviewDate) return fallback;

  const reviewed = new Date(`${reviewDate}T12:00:00`);
  if (Number.isNaN(reviewed.getTime())) return fallback;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const reviewedDay = new Date(reviewed.getFullYear(), reviewed.getMonth(), reviewed.getDate(), 12);
  const days = Math.max(0, Math.floor((today.getTime() - reviewedDay.getTime()) / 86_400_000));

  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 14) return `${days} days ago`;
  if (days < 365) {
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }

  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}
