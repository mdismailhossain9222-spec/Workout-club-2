export interface Branch {
  id: string;
  slug: string;
  name: string;
  /** null / empty => "Address coming soon", map hidden */
  address: string | null;
  phone: string;
  mapQuery: string | null;
  lat?: number;
  lng?: number;
  photos: string[];
  facilities: string[];
  hours: string;
}

export const PHONE = "01310-272587";

export const BRANCHES: Branch[] = [
  {
    id: "b-mirpur",
    slug: "mirpur",
    name: "Mirpur (DOHS)",
    address:
      "1st Floor, Plot 3448, Shagufta New Rd, in front of Mirpur DOHS Gate, Pallabi, Dhaka",
    phone: PHONE,
    mapQuery:
      "1st Floor, Plot 3448, Shagufta New Rd, in front of Mirpur DOHS Gate, Pallabi, Dhaka",
    lat: 23.8286,
    lng: 90.3654,
    photos: [
      "/images/gym/mirpur/1.jpg",
      "/images/gym/mirpur/2.jpg",
      "/images/gym/mirpur/3.jpg",
    ],
    facilities: ["gym", "plans", "recovery", "locker", "classes"],
    hours: "6:00 AM – 11:00 PM (Daily)",
  },
  {
    id: "b-banani",
    slug: "banani",
    name: "Banani",
    address: null, // TODO: Banani Road 11 area — to be filled
    phone: PHONE,
    mapQuery: null,
    photos: ["/images/gym/banani/1.jpg", "/images/gym/banani/2.jpg"],
    facilities: ["gym", "plans", "recovery", "locker", "classes"],
    hours: "6:00 AM – 11:00 PM (Daily)",
  },
  {
    id: "b-bashundhara",
    slug: "bashundhara",
    name: "Bashundhara",
    address: null, // TODO: Bashundhara R/A — to be filled
    phone: PHONE,
    mapQuery: null,
    photos: ["/images/gym/bashundhara/1.jpg"],
    facilities: ["gym", "plans", "recovery", "locker", "classes"],
    hours: "6:00 AM – 11:00 PM (Daily)",
  },
];

export const hasAddress = (b: Branch) => Boolean(b.address && b.mapQuery);

export const mapEmbedUrl = (b: Branch) =>
  `https://www.google.com/maps?q=${encodeURIComponent(b.mapQuery ?? "")}&output=embed`;

export const directionsUrl = (b: Branch) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQuery ?? "")}`;

export interface Facility {
  id: string;
  name: string;
  short: string;
  icon: string; // inline svg path key
  desc: string;
}

export const FACILITIES: Facility[] = [
  {
    id: "gym",
    name: "Gym Facility",
    short: "Gym",
    icon: "dumbbell",
    desc: "Full strength & conditioning floor with commercial-grade equipment.",
  },
  {
    id: "plans",
    name: "Workout & Diet Plan Support",
    short: "Plans",
    icon: "clipboard",
    desc: "Customised training and nutrition plans built around your goal.",
  },
  {
    id: "recovery",
    name: "Recovery: Steam & Cold Plunge",
    short: "Recovery",
    icon: "wave",
    desc: "Steam room and cold plunge to speed up recovery between sessions.",
  },
  {
    id: "locker",
    name: "Locker Room",
    short: "Locker",
    icon: "locker",
    desc: "Secure lockers, showers and changing rooms at every branch.",
  },
  {
    id: "classes",
    name: "Regular Classes",
    short: "Classes",
    icon: "bolt",
    desc: "Zumba, Kickboxing, Yoga, HIIT & Aerobics on a weekly schedule.",
  },
];
