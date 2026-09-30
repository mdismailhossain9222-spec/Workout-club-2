import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lazy3D from "@/components/Lazy3D";
import Facilities from "@/components/Facilities";
import FounderSection from "@/components/FounderSection";
import {
  AngularButton,
  MaskHeading,
  Marquee,
  OutlineTitle,
  RevealText,
  RollingNumber,
  SafeImage,
  Scramble,
  SectionLabel,
  SpotlightCard,
} from "@/components/ui";
import { MARQUEE_WORDS, PROGRAMS, STATS } from "@/config/content";
import { BRANCHES, hasAddress } from "@/config/branches";
import { OFFER, getPrice, tk, savePercent } from "@/config/pricing";
import { useHorizontalPin, useStaggerIn } from "@/motion/scenes";
import { EASE } from "@/config/motion";

export default function Home() {
  const { sectionRef, trackRef } = useHorizontalPin<HTMLElement>();
  const branchGrid = useStaggerIn<HTMLDivElement>();
  const best = getPrice("full_day", 12);

  return (
    <div>
      {/* ================= HERO + REASSEMBLE STAGE ================= */}
      <div className="relative">
        <div className="pointer-events-none sticky top-0 h-screen w-full">
          <Lazy3D scene="hero" fallbackLabel="The Workout Club" />
        </div>

        <section id="hero" className="relative -mt-[100vh] h-screen">
          <div className="mx-auto flex h-full max-w-[1400px] flex-col justify-center px-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
              <SectionLabel>Mirpur • Banani • Bashundhara</SectionLabel>
            </motion.div>
            <h1 className="mt-6 font-[Syncopate] text-[clamp(2.1rem,8.2vw,6.4rem)] font-bold leading-[0.95] text-white">
              <Scramble text="THE WORKOUT" delay={400} />
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-white to-violet-500 bg-clip-text text-transparent">
                <Scramble text="CLUB" delay={900} />
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8, ease: EASE.fmBlade }}
              className="mt-6 max-w-lg text-[15px] leading-relaxed text-silver-dim"
            >
              Sharp training. Serious equipment. A room that makes you show up again tomorrow.
              Three branches in Dhaka — one standard.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8, ease: EASE.fmBlade }}
              className="pointer-events-auto mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <AngularButton to="/packages" variant="solid">
                See 25% Off Packages
              </AngularButton>
              <AngularButton to="/branches">Find Your Branch</AngularButton>
            </motion.div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] text-silver-dim uppercase">
            Scroll
          </div>
        </section>

        <section id="reassemble" className="relative min-h-screen">
          <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-5 py-24">
            <div className="ml-auto max-w-xl">
              <SectionLabel>Two shapes, one mark</SectionLabel>
              <MaskHeading className="mt-5 font-[Syncopate] text-[clamp(1.5rem,4vw,3rem)] font-bold leading-[1.1] text-white">
                Built on angles. Two interlocking planes that only make sense together — exactly like coaching and consistency.
              </MaskHeading>
              <RevealText className="mt-6 text-[15px] leading-relaxed text-silver-dim">
                The Workout Club was built for people who want structure without the boredom. Strength floors,
                conditioning classes, recovery rooms and coaches who actually watch your set. Pick a time slot that
                fits your day, and we take care of the rest.
              </RevealText>
              <div className="mt-8">
                <AngularButton to="/about">Our Story</AngularButton>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ================= MARQUEE ================= */}
      <div className="relative z-10 border-y border-white/10 bg-[#0a0616]">
        <Marquee words={MARQUEE_WORDS} />
      </div>

      {/* ================= STATS ================= */}
      <section className="relative z-10 bg-[#06030d] py-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-5 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border-l border-violet-500/40 pl-5">
<div className="font-[Inter] [font-variant-numeric:tabular-nums] text-[clamp(1.8rem,4.5vw,3.2rem)] font-semibold text-white leading-[1.2]">
                 <RollingNumber value={s.value} suffix={s.suffix} />
               </div>
              <div className="mt-2 text-[10px] tracking-[0.12em] text-silver-dim uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FACILITIES ================= */}
      <section className="relative z-10 py-20">
        <div className="mx-auto max-w-[1400px] px-5">
          <SectionLabel>What's inside</SectionLabel>
          <OutlineTitle text="FACILITIES" className="mt-4 text-[clamp(2.2rem,10vw,8rem)]" />
          <Facilities className="mt-10" />
        </div>
      </section>

      {/* ================= PROGRAMS — PINNED HORIZONTAL ================= */}
      <section ref={sectionRef} className="relative z-10 overflow-hidden bg-[#08041199] py-16 md:h-screen md:py-0">
        <div className="flex h-full flex-col justify-center">
          <div className="mx-auto w-full max-w-[1400px] px-5">
            <SectionLabel>Programs</SectionLabel>
            <h2 className="mt-3 font-[Syncopate] text-[clamp(1.4rem,3.2vw,2.4rem)] font-bold text-white">
              SIX WAYS TO TRAIN
            </h2>
          </div>
          <div ref={trackRef} className="mt-10 flex gap-6 px-5 will-change-transform md:pl-[max(1.25rem,calc((100vw-1400px)/2))]">
            {PROGRAMS.map((p) => (
              <SpotlightCard
                key={p.id}
                className="w-[78vw] shrink-0 p-7 sm:w-[380px] md:w-[420px]"
              >
                <div className="font-[Chakra_Petch] text-[11px] tracking-[0.35em] text-violet-400">{p.kicker}</div>
                <h3 className="mt-3 font-[Syncopate] text-2xl font-bold text-white md:text-3xl">{p.title}</h3>
                <p className="mt-4 text-[14px] leading-relaxed text-silver-dim">{p.desc}</p>
                <ul className="mt-6 space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 text-[13px] text-silver">
                      <span className="h-2 w-2 rotate-45 bg-violet-500" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OFFER TEASER ================= */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-[1400px] px-5">
          <SpotlightCard className="relative overflow-hidden p-8 md:p-14" depth={4}>
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                {OFFER.active && (
                  <span className="clip-btn inline-block bg-gradient-to-r from-violet-700 to-fuchsia-600 px-4 py-2 text-[10px] tracking-[0.3em] text-white uppercase">
                    Limited Offer
                  </span>
                )}
                <h2 className="mt-5 font-[Syncopate] text-[clamp(2.4rem,7vw,5rem)] font-bold leading-none text-white">
                  25% OFF
                </h2>
                <p className="mt-4 max-w-md text-[15px] text-silver-dim">
                  Every time slot, every duration, all three branches. 12-month Full Day now{" "}
                  <span className="text-white">{tk(best.discounted_price_tk)} TK</span>{" "}
                  <span className="text-silver-dim line-through">{tk(best.original_price_tk)} TK</span> — save{" "}
                  {savePercent(best)}%. Admission fee 1,500 TK exclusive.
                </p>
                <div className="mt-7">
                  <AngularButton to="/packages" variant="solid">Explore Packages</AngularButton>
                </div>
              </div>
              <div className="relative h-[220px] md:h-[300px]">
                <div className="absolute inset-0 grid-lines opacity-40" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_60%_50%,rgba(139,92,246,0.35),transparent_70%)]" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="font-[Syncopate] text-[clamp(1rem,2.4vw,1.6rem)] tracking-[0.2em] text-violet-200">
                    TK {tk(best.discounted_price_tk)}
                  </div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* ================= BRANCHES ================= */}
      <section className="relative z-10 py-10">
        <div className="mx-auto max-w-[1400px] px-5">
          <SectionLabel>Where we are</SectionLabel>
          <OutlineTitle text="BRANCHES" className="mt-4 text-[clamp(2.2rem,10vw,8rem)]" />
          <div ref={branchGrid} className="mt-10 grid gap-6 md:grid-cols-3">
            {BRANCHES.map((b) => (
              <Link key={b.slug} to={`/branches#${b.slug}`} data-stagger data-cursor="link">
                <SpotlightCard className="h-full overflow-hidden">
                  <div className="relative h-48 overflow-hidden clip-notch">
                    <SafeImage src={b.photos[0]} alt={b.name} label={b.name} className="h-full w-full transition-transform duration-700 hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-[Syncopate] text-lg font-bold text-white">{b.name}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-silver-dim">
                      {hasAddress(b) ? b.address : "Address coming soon"}
                    </p>
                    <div className="mt-4 text-[11px] tracking-[0.25em] text-violet-300 uppercase">{b.hours}</div>
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOUNDER ================= */}
      <FounderSection />
    </div>
  );
}
