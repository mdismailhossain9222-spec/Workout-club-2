export const FOUNDER = {
  id: "t-founder",
  name: "Mubashshir Tahmid",
  role: "Founder & Head Trainer, The Workout Club",
  titleLine: "Fitness Trainer",
  quote: "I make fitness entertaining.",
  bio: "Mubashshir Tahmid founded The Workout Club to prove that training hard never has to feel like a chore. He offers both online and offline personal training with fully customised plans built around your body, your schedule and your goal.",
  services: ["Customized Plans", "Online Training", "Offline Training"],
  programTagline: "Join MubaFitness",
  facebook: "https://www.facebook.com/mubafitnesss/",
  followers: 51000,
  followersLabel: "51K",
  /** photos loaded from /public/images/founder/ — graceful placeholder if missing */
  photos: [
    "/images/founder/owner-mubasshir.jpg",
  ],
  /** object-position focal point so the photo is never cropped badly */
  focalPoint: "50% 28%",
  trainingModes: ["Offline", "Online"] as const,
};

export interface TimelineItem {
  year: string;
  title: string;
  text: string;
}

export const CLUB_TIMELINE: TimelineItem[] = [
  {
    year: "2019",
    title: "Mirpur DOHS opens",
    text: "The first Workout Club floor opens in front of Mirpur DOHS Gate with a handful of members and one very loud sound system.",
  },
  {
    year: "2022",
    title: "Banani joins the club",
    text: "A second location brings the same angular, high-energy training floor to Banani Road 11.",
  },
  {
    year: "2024",
    title: "Bashundhara R/A",
    text: "Third branch launches with a dedicated women-only second floor, steam room and cold plunge recovery zone.",
  },
  {
    year: "Today",
    title: "MubaFitness online",
    text: "Online coaching takes the club worldwide — customised plans, weekly check-ins, same entertainment.",
  },
];
