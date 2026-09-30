import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookingCtx, type BookingPrefill } from "./bookingContext";
export { useBooking, type BookingPrefill } from "./bookingContext";
import { BRANCHES } from "@/config/branches";
import { TIME_SLOTS, DURATIONS, getPrice, ADMISSION_FEE_TK, tk, effectivePrice, type TimeSlotId, type DurationMonths } from "@/config/pricing";
import { FOUNDER } from "@/config/founder";
import { EASE } from "@/config/motion";
import { AngularButton, Chip } from "./ui";

export function BookingProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<BookingPrefill | null>(null);
  const value = useMemo<Ctx>(() => ({ open: (p) => setPrefill(p ?? {}) }), []);
  return (
    <BookingCtx.Provider value={value}>
      {children}
      <AnimatePresence>
        {prefill && <BookingModal prefill={prefill} onClose={() => setPrefill(null)} />}
      </AnimatePresence>
    </BookingCtx.Provider>
  );
}

function BookingModal({ prefill, onClose }: { prefill: BookingPrefill; onClose: () => void }) {
  const isCheckout = prefill.mode === "checkout";
  const [mode, setMode] = useState<"Offline" | "Online">("Offline");
  const [branch, setBranch] = useState(prefill.branchSlug ?? BRANCHES[0].slug);
  const [slot, setSlot] = useState<TimeSlotId>(prefill.timeSlot ?? "full_day");
  const [duration, setDuration] = useState<DurationMonths>(prefill.duration ?? 12);
  const [sent, setSent] = useState(false);

  const price = getPrice(slot, duration);
  const pkgAmount = effectivePrice(price);
  const isFounder = prefill.trainer === FOUNDER.name;

  return (
    <motion.div
      className="fixed inset-0 z-[9600] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 40, opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE.fmBlade }}
        className="relative w-full max-w-lg clip-corner glass border border-violet-400/30 p-6 md:p-8 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-silver-dim hover:text-white">✕</button>
        {sent ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rotate-45 border-2 border-violet-400" />
            <h3 className="font-[Syncopate] text-lg text-white">REQUEST SENT</h3>
            <p className="mt-3 text-sm text-silver-dim">
              Our team will call you on the number you provided within 24 hours to confirm.
            </p>
            <div className="mt-6"><AngularButton variant="solid" onClick={onClose}>Close</AngularButton></div>
          </div>
        ) : (
          <>
            <div className="text-[11px] tracking-[0.35em] text-violet-300 uppercase font-[Chakra_Petch]">
              {isCheckout ? "Checkout" : "Book a session"}
            </div>
            <h3 className="mt-2 font-[Syncopate] text-xl text-white">
              {prefill.trainer ? prefill.trainer : "The Workout Club"}
            </h3>
            {isFounder && (
              <span className="mt-2 inline-block clip-btn bg-violet-600 px-3 py-1 text-[10px] tracking-[0.2em] text-white uppercase">
                Founder
              </span>
            )}

            <form
              className="mt-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              {!isCheckout && (
                <div>
                  <Label>Training mode</Label>
                  <div className="flex gap-2">
                    {(["Offline", "Online"] as const).map((m) => (
                      <Chip key={m} active={mode === m} onClick={() => setMode(m)}>
                        {m === "Offline" ? "Offline (at branch)" : "Online"}
                      </Chip>
                    ))}
                  </div>
                  {mode === "Online" && (
                    <p className="mt-2 text-[12px] text-violet-200/80">
                      Session details and your customised plan will be shared after confirmation.
                    </p>
                  )}
                </div>
              )}

              {(isCheckout || mode === "Offline") && (
                <div>
                  <Label>Branch</Label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full clip-btn border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.slug} value={b.slug}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {isCheckout && (
                <>
                  <div>
                    <Label>Time slot</Label>
                    <select
                      value={slot}
                      onChange={(e) => setSlot(e.target.value as TimeSlotId)}
                      className="w-full clip-btn border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
                    >
                      {TIME_SLOTS.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} — {s.timing}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <div className="flex flex-wrap gap-2">
                      {DURATIONS.map((d) => (
                        <Chip key={d} active={duration === d} onClick={() => setDuration(d)}>{d} Month</Chip>
                      ))}
                    </div>
                  </div>
                  <div className="clip-notch border border-violet-400/30 bg-violet-500/5 p-4 text-sm">
                    <Line label={`Package (${duration} month)`} value={`${tk(pkgAmount)} TK`} />
                    <Line label="Admission fee (one time)" value={`${tk(ADMISSION_FEE_TK)} TK`} />
                    <div className="my-2 h-px bg-white/10" />
                    <Line label="Total due" value={`${tk(pkgAmount + ADMISSION_FEE_TK)} TK`} bold />
                  </div>
                </>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Full name" required />
                <Input placeholder="Phone (01xxxxxxxxx)" required />
              </div>
              <Input placeholder="Email (optional)" type="email" />
              <textarea
                placeholder="Your goal (optional)"
                rows={3}
                className="w-full clip-btn border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
              />
          <AngularButton variant="solid" full type="submit">
            {isCheckout ? "Confirm & Pay" : "Send Request"}
          </AngularButton>
              <p className="text-center text-[11px] text-silver-dim">
                Secure payment • bKash / Nagad accepted • Cancel anytime
              </p>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

const Label = ({ children }: { children: ReactNode }) => (
  <div className="mb-2 text-[10px] tracking-[0.3em] text-silver-dim uppercase font-[Chakra_Petch]">{children}</div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full clip-btn border border-white/15 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-silver-dim/60 outline-none focus:border-violet-400"
  />
);

const Line = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className={`flex items-center justify-between ${bold ? "text-white font-semibold" : "text-silver-dim"}`}>
    <span>{label}</span>
    <span className={bold ? "font-[Chakra_Petch] text-violet-200" : ""}>{value}</span>
  </div>
);
