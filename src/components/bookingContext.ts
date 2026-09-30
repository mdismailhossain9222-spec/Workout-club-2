import { createContext, useContext } from "react";
import type { TimeSlotId, DurationMonths } from "@/config/pricing";

export interface BookingPrefill {
  trainer?: string;
  branchSlug?: string;
  timeSlot?: TimeSlotId;
  duration?: DurationMonths;
  mode?: "checkout" | "training";
}

interface Ctx {
  open: (p?: BookingPrefill) => void;
}

export const BookingCtx = createContext<Ctx>({ open: () => {} });

export const useBooking = () => useContext(BookingCtx);
