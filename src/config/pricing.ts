/**
 * PRICING — single source of truth for the 4 time slots x 4 durations matrix.
 * Also used to seed the `packages` table (see src/db/seed.ts).
 */

export type TimeSlotId = "full_day" | "morning" | "noon" | "female_hour";

export interface TimeSlot {
  id: TimeSlotId;
  name: string;
  timing: string;
  badge?: string;
  note?: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  { id: "full_day", name: "Full Day", timing: "6AM – 11PM" },
  { id: "morning", name: "Morning", timing: "6AM – 12PM" },
  { id: "noon", name: "Noon", timing: "12PM – 6PM" },
  {
    id: "female_hour",
    name: "Only Female Hour",
    timing: "9AM – 3PM",
    badge: "2nd Floor • Women only",
    note: "Dedicated women-only floor with female support staff.",
  },
];

export const DURATIONS = [1, 3, 6, 12] as const;
export type DurationMonths = (typeof DURATIONS)[number];

export interface PricePoint {
  time_slot: TimeSlotId;
  duration_months: DurationMonths;
  original_price_tk: number;
  discounted_price_tk: number;
  label?: "Best Value" | "Most Popular";
}

/** discounted / original — exactly as per the 25% OFF poster */
export const PRICE_MATRIX: PricePoint[] = [
  { time_slot: "full_day", duration_months: 1, discounted_price_tk: 3300, original_price_tk: 4400 },
  { time_slot: "full_day", duration_months: 3, discounted_price_tk: 9000, original_price_tk: 12000 },
  { time_slot: "full_day", duration_months: 6, discounted_price_tk: 15750, original_price_tk: 21000, label: "Most Popular" },
  { time_slot: "full_day", duration_months: 12, discounted_price_tk: 26250, original_price_tk: 35000, label: "Best Value" },

  { time_slot: "morning", duration_months: 1, discounted_price_tk: 2250, original_price_tk: 3000 },
  { time_slot: "morning", duration_months: 3, discounted_price_tk: 6000, original_price_tk: 8000 },
  { time_slot: "morning", duration_months: 6, discounted_price_tk: 11250, original_price_tk: 15000, label: "Most Popular" },
  { time_slot: "morning", duration_months: 12, discounted_price_tk: 18750, original_price_tk: 25000, label: "Best Value" },

  { time_slot: "noon", duration_months: 1, discounted_price_tk: 1875, original_price_tk: 2500 },
  { time_slot: "noon", duration_months: 3, discounted_price_tk: 5250, original_price_tk: 7000 },
  { time_slot: "noon", duration_months: 6, discounted_price_tk: 9000, original_price_tk: 12000, label: "Most Popular" },
  { time_slot: "noon", duration_months: 12, discounted_price_tk: 15000, original_price_tk: 20000, label: "Best Value" },

  { time_slot: "female_hour", duration_months: 1, discounted_price_tk: 2250, original_price_tk: 3000 },
  { time_slot: "female_hour", duration_months: 3, discounted_price_tk: 6000, original_price_tk: 8000 },
  { time_slot: "female_hour", duration_months: 6, discounted_price_tk: 11250, original_price_tk: 15000, label: "Most Popular" },
  { time_slot: "female_hour", duration_months: 12, discounted_price_tk: 18750, original_price_tk: 25000, label: "Best Value" },
];

export const ADMISSION_FEE_TK = 1500;

/** Offer switch — set endDate to null (or active:false) to kill banner + strikethroughs everywhere */
export const OFFER = {
  active: true,
  headline: "25% OFF — Limited Offer Now Available!",
  /** ISO date; null = no countdown */
  endDate: "2026-12-31T23:59:59+06:00" as string | null,
};

export const PACKAGE_FEATURES: Record<DurationMonths, string[]> = {
  1: ["Full access to your chosen slot", "Free body composition check", "Locker room & showers", "Group classes included"],
  3: ["Everything in 1 Month", "1 personal training session", "Custom workout plan", "Steam room access"],
  6: ["Everything in 3 Month", "Quarterly diet plan review", "Steam & cold plunge recovery", "2 guest passes"],
  12: ["Everything in 6 Month", "4 personal training sessions", "Full year diet plan support", "Priority class booking", "Membership freeze up to 30 days"],
};

export const getPrice = (slot: TimeSlotId, duration: DurationMonths): PricePoint =>
  PRICE_MATRIX.find((p) => p.time_slot === slot && p.duration_months === duration)!;

/** Derived, never hardcoded */
export const savePercent = (p: PricePoint) =>
  Math.round(((p.original_price_tk - p.discounted_price_tk) / p.original_price_tk) * 100);

export const saveAmount = (p: PricePoint) => p.original_price_tk - p.discounted_price_tk;

export const perMonth = (p: PricePoint) =>
  Math.round(p.discounted_price_tk / p.duration_months);

export const effectivePrice = (p: PricePoint) =>
  OFFER.active ? p.discounted_price_tk : p.original_price_tk;

export const tk = (n: number) => n.toLocaleString("en-US");
