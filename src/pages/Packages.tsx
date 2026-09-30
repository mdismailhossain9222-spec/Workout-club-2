import { useState } from "react";
import { motion } from "framer-motion";
import Lazy3D from "@/components/Lazy3D";
import Facilities from "@/components/Facilities";
import Countdown from "@/components/Countdown";
import {
  AngularButton,
  Chip,
  MaskHeading,
  OutlineTitle,
  RollingPrice,
  SectionLabel,
  SpotlightCard,
} from "@/components/ui";
import {
  ADMISSION_FEE_TK,
  DURATIONS,
  OFFER,
  PACKAGE_FEATURES,
  PRICE_MATRIX,
  TIME_SLOTS,
  effectivePrice,
  getPrice,
  perMonth,
  saveAmount,
  savePercent,
  tk,
  type DurationMonths,
  type TimeSlotId,
} from "@/config/pricing";
import { BRANCHES } from "@/config/branches";
import { useBooking } from "@/components/BookingProvider";
import { useStackingCards } from "@/motion/scenes";
import { EASE } from "@/config/motion";

export default function Packages() {
  const [slot, setSlot] = useState<TimeSlotId>("full_day");
  const [branch, setBranch] = useState(BRANCHES[0].slug);
  const [compare, setCompare] = useState(false);
  const stackRef = useStackingCards<HTMLDivElement>(DURATIONS.length);
  const { open } = useBooking();
  const activeSlot = TIME_SLOTS.find((s) => s.id === slot)!;

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0">
          <Lazy3D scene="shards" fallbackLabel="Packages" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(124,58,237,0.32),transparent_70%)]" />
        <div className="relative mx-auto max-w-[1400px] px-5 text-center">
          <SectionLabel>
            <span className="mx-auto">Membership</span>
          </SectionLabel>
          {OFFER.active && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE.fmBlade }}
              className="mt-6"
            >
              <h1
                className="font-[Syncopate] text-[clamp(3.4rem,15vw,11rem)] font-bold leading-none text-white"
                style={{ textShadow: "0 0 80px rgba(139,92,246,0.85), 0 0 22px rgba(167,139,250,0.6)" }}
              >
                25% OFF
              </h1>
              <div className="mt-4 inline-block clip-btn bg-gradient-to-r from-violet-700 via-fuchsia-600 to-violet-700 px-7 py-3">
                <span className="font-[Chakra_Petch] text-[12px] tracking-[0.3em] text-white uppercase">
                  Limited Offer Now Available!
                </span>
              </div>
            </motion.div>
          )}
          <div className="mt-8 flex justify-center">
            <Countdown />
          </div>
          <p className="mx-auto mt-7 max-w-xl text-[15px] text-silver-dim">
            Same pricing at Mirpur, Banani and Bashundhara. Choose your time slot, then your duration.
            Admission fee of {tk(ADMISSION_FEE_TK)} TK is exclusive.
          </p>
        </div>
      </section>

      {/* ============ FACILITIES ============ */}
      <section className="relative z-10 pb-16">
        <div className="mx-auto max-w-[1400px] px-5">
          <Facilities compact />
        </div>
      </section>

      {/* ============ BRANCH SELECTOR ============ */}
      <section className="relative z-10">
        <div className="mx-auto max-w-[1400px] px-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] tracking-[0.3em] text-silver-dim uppercase font-[Chakra_Petch]">Branch</span>
            {BRANCHES.map((b) => (
              <Chip key={b.slug} active={branch === b.slug} onClick={() => setBranch(b.slug)}>
                {b.name}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STEP 1 — TIME SLOT ============ */}
      <section className="relative z-10 py-14">
        <div className="mx-auto max-w-[1400px] px-5">
          <SectionLabel>Step 1</SectionLabel>
          <MaskHeading className="mt-4 font-[Syncopate] text-[clamp(1.3rem,3vw,2.2rem)] font-bold text-white">
            Choose your time slot
          </MaskHeading>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TIME_SLOTS.map((s) => {
              const active = s.id === slot;
              return (
                <button
                  key={s.id}
                  onClick={() => setSlot(s.id)}
                  data-cursor="link"
                  className={`relative clip-corner border p-5 text-left transition-colors duration-300 ${
                    active ? "border-violet-400/70 bg-violet-500/10" : "border-white/10 bg-white/[0.02] hover:border-violet-400/40"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="slot-indicator"
                      className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-600/25 to-fuchsia-500/10"
                      transition={{ duration: 0.45, ease: EASE.fmBlade }}
                    />
                  )}
                  <div className="font-[Syncopate] text-[13px] font-bold tracking-wide text-white">
                    {s.name.toUpperCase()}
                  </div>
                  <div className="mt-2 font-[Chakra_Petch] text-[12px] tracking-[0.18em] text-violet-200">{s.timing}</div>
{s.badge && (
                     <div className="mt-3 inline-block clip-btn bg-fuchsia-600/90 px-3 py-1 text-[9px] tracking-[0.12em] text-white uppercase">
                       {s.badge}
                     </div>
                   )}
                  <span
                    className={`mt-4 block h-[2px] origin-left bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-transform duration-500 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {activeSlot.note && <p className="mt-4 text-[13px] text-violet-200/80">{activeSlot.note}</p>}
        </div>
      </section>

      {/* ============ STEP 2 — DURATION (STICKY STACKING) ============ */}
      <section className="relative z-10 pb-10">
        <div className="mx-auto max-w-[1400px] px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Step 2</SectionLabel>
              <MaskHeading className="mt-4 font-[Syncopate] text-[clamp(1.3rem,3vw,2.2rem)] font-bold text-white">
                Choose your duration
              </MaskHeading>
            </div>
            <Chip active={compare} onClick={() => setCompare((c) => !c)}>
              {compare ? "Card view" : "Compare all"}
            </Chip>
          </div>

          {!compare && (
            <div ref={stackRef} className="mt-10 space-y-8 lg:space-y-10">
              {DURATIONS.map((d) => (
                <div key={d} data-stack-card className="lg:sticky lg:top-24 will-change-transform">
                  <DurationCard slot={slot} duration={d} branch={branch} onBuy={open} />
                </div>
              ))}
            </div>
          )}

          {compare && <CompareTable />}

          {/* admission note */}
          <div className="mt-12 clip-notch border border-violet-400/40 bg-violet-500/[0.07] p-5">
            <div className="font-[Chakra_Petch] text-[12px] tracking-[0.22em] text-violet-200 uppercase">
              Admission fee is exclusive: {tk(ADMISSION_FEE_TK)} TK
            </div>
            <p className="mt-2 text-[13px] text-silver-dim">
              Charged once at registration, shown as a separate line item at checkout. Not included in any package price above.
            </p>
          </div>

          {/* trust row */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Secure Payment", "bKash / Nagad Accepted", "Cancel Anytime"].map((t) => (
              <div key={t} className="clip-btn border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-[11px] tracking-[0.22em] text-silver uppercase font-[Chakra_Petch]">
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16">
        <div className="mx-auto max-w-[1400px] px-5">
          <OutlineTitle text="TRAIN SHARP" className="text-[clamp(2rem,9vw,7rem)]" />
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------ card */
function DurationCard({
  slot,
  duration,
  branch,
  onBuy,
}: {
  slot: TimeSlotId;
  duration: DurationMonths;
  branch: string;
  onBuy: (p: { branchSlug: string; timeSlot: TimeSlotId; duration: DurationMonths; mode: "checkout" }) => void;
}) {
  const price = getPrice(slot, duration);
  const best = price.label === "Best Value";
  const popular = price.label === "Most Popular";

  return (
    <SpotlightCard
      className={`relative overflow-hidden p-7 md:p-9 pr-4 md:pr-6 ${best ? "border border-violet-400/40 pulse-glow" : ""}`}
      depth={best ? 9 : 6}
    >
      {price.label && (
        <div
          className={`absolute right-0 top-0 clip-btn px-6 py-2 text-[10px] tracking-[0.25em] uppercase text-white ${
            best ? "bg-gradient-to-r from-violet-700 to-fuchsia-600" : "bg-white/15"
          }`}
        >
          {price.label}
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <div className="font-[Chakra_Petch] text-[11px] tracking-[0.35em] text-violet-300 uppercase">
            {TIME_SLOTS.find((s) => s.id === slot)!.name} • {TIME_SLOTS.find((s) => s.id === slot)!.timing}
          </div>
          <h3 className={`mt-3 font-[Syncopate] font-bold text-white ${best ? "text-[clamp(1.8rem,5vw,3rem)]" : "text-[clamp(1.4rem,4vw,2.2rem)]"}`}>
            {duration} MONTH
          </h3>

              <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2 w-full">
<div className="flex items-end gap-2">
                   <span className="font-[Inter] [font-variant-numeric:tabular-nums] text-3xl md:text-5xl font-semibold leading-[1.2] text-white whitespace-nowrap">
                     <RollingPrice value={effectivePrice(price)} />
                   </span>
               <span className="mb-1 font-[Chakra_Petch] text-sm tracking-[0.2em] text-violet-300">TK</span>
            </div>
            {OFFER.active && (
              <>
                <span className="mb-2 text-silver-dim line-through">{tk(price.original_price_tk)} TK</span>
<span className="mb-2 clip-btn bg-violet-600 px-3 py-1 text-[10px] tracking-[0.12em] text-white uppercase">
                   Save {savePercent(price)}% • {tk(saveAmount(price))} TK
                 </span>
              </>
            )}
          </div>
<div className="mt-3 text-[12px] tracking-[0.12em] text-silver-dim uppercase font-[Chakra_Petch]">
             ≈ <span className="font-[Inter] [font-variant-numeric:tabular-nums] font-semibold">{tk(perMonth(price))}</span> TK / month
           </div>
           <div className="mt-2 text-[12px] text-silver-dim">
             + {tk(ADMISSION_FEE_TK)} TK admission fee (one time, exclusive)
           </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <AngularButton
              variant={best ? "solid" : "primary"}
              onClick={() => onBuy({ branchSlug: branch, timeSlot: slot, duration, mode: "checkout" })}
            >
              Buy Now
            </AngularButton>
            <span className="self-center text-[11px] tracking-[0.2em] text-silver-dim uppercase">
              {BRANCHES.find((b) => b.slug === branch)?.name}
            </span>
          </div>
        </div>

        <ul className="space-y-3">
          {PACKAGE_FEATURES[duration].map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: EASE.fmBlade }}
              className="flex items-start gap-3 text-[14px] text-silver"
            >
              <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" fill="none" stroke="currentColor">
                <motion.path
                  d="M4 12.5 9.5 18 20 6"
                  strokeWidth="2.4"
                  strokeLinecap="square"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                />
              </svg>
              {f}
            </motion.li>
          ))}
        </ul>
      </div>
      {popular && <div className="mt-6 h-px bg-gradient-to-r from-violet-500/60 to-transparent" />}
    </SpotlightCard>
  );
}

/* --------------------------------------------------- 4x4 compare matrix */
function CompareTable() {
  return (
    <div className="mt-10 overflow-x-auto clip-corner border border-white/10">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="bg-gradient-to-r from-violet-800 to-violet-600">
            <th className="px-5 py-4 font-[Chakra_Petch] text-[11px] tracking-[0.25em] text-white uppercase">Duration</th>
            {TIME_SLOTS.map((s) => (
              <th key={s.id} className="px-5 py-4 font-[Chakra_Petch] text-[11px] tracking-[0.2em] text-white uppercase">
                {s.name}
                <div className="mt-1 text-[10px] font-normal tracking-[0.15em] text-violet-100/80">{s.timing}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DURATIONS.map((d, i) => (
            <tr key={d} className={i % 2 ? "bg-white/[0.02]" : ""}>
              <td className="px-5 py-5 font-[Syncopate] text-sm font-bold text-white">{d} MONTH</td>
              {TIME_SLOTS.map((s) => {
                const p = PRICE_MATRIX.find((x) => x.time_slot === s.id && x.duration_months === d)!;
                return (
                  <td key={s.id} className="px-5 py-5">
                    <div className="font-[Inter] [font-variant-numeric:tabular-nums] text-lg font-semibold text-white leading-[1.2]">
                      {tk(effectivePrice(p))} <span className="text-[11px] text-violet-300">TK</span>
                    </div>
                    {OFFER.active && (
                      <div className="text-[12px] text-silver-dim line-through">{tk(p.original_price_tk)} TK</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
