import { FOUNDER } from "./founder";

export const BRAND = {
  name: "The Workout Club",
  short: "TWC",
  tagline: "Train sharp. Stay club.",
  phone: "01310-272587",
  email: "hello@theworkoutclub.com.bd",
};

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialty: string;
  photo: string;
  focal?: string;
  isFounder?: boolean;
  isFeatured?: boolean;
  sort: number;
  modes: string[];
}

export const TRAINERS: Trainer[] = [
  {
    id: FOUNDER.id,
    name: FOUNDER.name,
    role: "Founder & Head Trainer",
    specialty: "Customized Plans • Online & Offline PT",
    photo: FOUNDER.photos[0],
    focal: FOUNDER.focalPoint,
    isFounder: true,
    isFeatured: true,
    sort: 0,
    modes: ["Offline", "Online"],
  },
  { id: "t-2", name: "Rifat Hasan", role: "Strength Coach", specialty: "Powerlifting • Hypertrophy", photo: "/images/trainers/rifat.jpg", sort: 1, modes: ["Offline"] },
  { id: "t-3", name: "Naziha Rahman", role: "Female Hour Lead", specialty: "Women's Strength • Mobility", photo: "/images/trainers/naziha.jpg", sort: 2, modes: ["Offline"] },
  { id: "t-4", name: "Shakib Ahmed", role: "Conditioning Coach", specialty: "HIIT • Kickboxing", photo: "/images/trainers/shakib.jpg", sort: 3, modes: ["Offline", "Online"] },
  { id: "t-5", name: "Tanjila Noor", role: "Yoga & Recovery", specialty: "Yoga • Mobility • Breathwork", photo: "/images/trainers/tanjila.jpg", sort: 4, modes: ["Offline"] },
  { id: "t-6", name: "Arman Chowdhury", role: "Nutrition Lead", specialty: "Diet Planning • Body Recomp", photo: "/images/trainers/arman.jpg", sort: 5, modes: ["Online"] },
];

export interface Program {
  id: string;
  title: string;
  kicker: string;
  desc: string;
  points: string[];
}

export const PROGRAMS: Program[] = [
  { id: "p1", title: "STRENGTH", kicker: "01", desc: "Progressive barbell work built on squat, bench, deadlift and press. Coached technique from day one.", points: ["Periodised blocks", "Form video review", "Strength testing"] },
  { id: "p2", title: "HIIT", kicker: "02", desc: "Short, brutal, addictive. Interval conditioning that burns hard and leaves you laughing at the end.", points: ["30–45 min", "Heart-rate zones", "Daily classes"] },
  { id: "p3", title: "KICKBOXING", kicker: "03", desc: "Pad work, footwork and combinations. Technical striking with a conditioning engine underneath.", points: ["Pad rounds", "Bag circuits", "All levels"] },
  { id: "p4", title: "ZUMBA", kicker: "04", desc: "Full-room, full-volume dance cardio. The most entertaining hour on the timetable.", points: ["Live playlists", "No experience needed", "Group energy"] },
  { id: "p5", title: "YOGA", kicker: "05", desc: "Mobility, control and breath. The recovery counterweight to everything else in the building.", points: ["Vinyasa & Hatha", "Mobility drills", "Breathwork"] },
  { id: "p6", title: "AEROBICS", kicker: "06", desc: "Classic low-impact conditioning for endurance, coordination and joint-friendly volume.", points: ["Low impact", "Choreographed", "Beginner friendly"] },
];

export const STATS = [
  { value: 3, suffix: "", label: "Branches in Dhaka" },
  { value: 4200, suffix: "+", label: "Active Members" },
  { value: 51, suffix: "K", label: "Community Following" },
  { value: 17, suffix: "", label: "Weekly Classes" },
];

export const MARQUEE_WORDS = [
  "TRAIN HARD",
  "STAY CLUB",
  "NO SHORTCUTS",
  "MUBAFITNESS",
  "25% OFF",
  "SHOW UP",
];

export const GALLERY = [
  { id: "g1", title: "Strength Floor", branch: "Mirpur", src: "/images/gym/mirpur/1.jpg", hue: 268 },
  { id: "g2", title: "Cardio Deck", branch: "Mirpur", src: "/images/gym/mirpur/2.jpg", hue: 282 },
  { id: "g3", title: "Class Studio", branch: "Banani", src: "/images/gym/banani/1.jpg", hue: 255 },
  { id: "g4", title: "Recovery Zone", branch: "Banani", src: "/images/gym/banani/2.jpg", hue: 292 },
  { id: "g5", title: "Female Hour Floor", branch: "Bashundhara", src: "/images/gym/bashundhara/1.jpg", hue: 305 },
  { id: "g6", title: "Locker Room", branch: "Mirpur", src: "/images/gym/mirpur/3.jpg", hue: 262 },
  { id: "g7", title: "Free Weights", branch: "Bashundhara", src: "/images/gym/bashundhara/2.jpg", hue: 276 },
  { id: "g8", title: "Ring & Bags", branch: "Banani", src: "/images/gym/banani/3.jpg", hue: 248 },
];

export const FAQS = [
  { q: "Is the admission fee included in the package price?", a: "No. Admission fee is exclusive: 1,500 TK is charged once, separately from your membership package, and appears as its own line item at checkout." },
  { q: "Can I use my membership at all three branches?", a: "Pricing is identical across Mirpur, Banani and Bashundhara. Your membership is registered at the branch you select when buying." },
  { q: "What is the Female Hour?", a: "A women-only session on the 2nd floor from 9AM to 3PM, with female support staff on the floor." },
  { q: "How do I pay?", a: "bKash, Nagad, card or cash at the branch. Online payments are secured end-to-end." },
];
