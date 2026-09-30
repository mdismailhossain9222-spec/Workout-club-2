import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/motion/gsap";
import { SCROLL, EASE } from "@/config/motion";
import { FOUNDER } from "@/config/founder";
import { AngularButton, MaskHeading, OutlineTitle, RevealText, RollingNumber, SafeImage, Scramble, SectionLabel } from "./ui";
import { useDiagonalWipe } from "@/motion/scenes";
import { useBooking } from "./BookingProvider";
import { useMotionFlags } from "@/motion/MotionProvider";

/** HOME — full-width "Meet the Founder" block with parallax angular portrait. */
export default function FounderSection() {
  const wrap = useRef<HTMLDivElement>(null);
  const imgRef = useDiagonalWipe<HTMLDivElement>();
  const { open } = useBooking();
  const { flags } = useMotionFlags();

  useEffect(() => {
    const el = wrap.current;
    if (!el || !flags.text) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-founder-parallax]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: SCROLL.scrub },
      });
    }, el);
    return () => ctx.revert();
  }, [flags.text]);

  return (
    <section ref={wrap} className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_15%_40%,rgba(91,33,182,0.28),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* portrait */}
        <div ref={imgRef} className="relative">
          <div className="absolute -inset-3 clip-portrait bg-gradient-to-br from-violet-500/50 via-transparent to-silver/30 blur-[2px]" />
          <div data-founder-parallax className="relative clip-portrait aspect-[4/5] overflow-hidden">
            <SafeImage
              src={FOUNDER.photos[0]}
              alt={FOUNDER.name}
              focal={FOUNDER.focalPoint}
              label="Founder Portrait"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>
          <div className="pointer-events-none absolute -bottom-4 -right-3 clip-btn bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 py-3">
            <span className="font-[Chakra_Petch] text-[11px] tracking-[0.28em] text-white uppercase">
              {FOUNDER.programTagline}
            </span>
          </div>
        </div>

        {/* copy */}
        <div>
          <SectionLabel>Meet the Founder</SectionLabel>
          <OutlineTitle text="FOUNDER" className="mt-4 text-[clamp(3rem,9vw,7.5rem)] tracking-tight" />
          <h3 className="mt-2 font-[Syncopate] text-[clamp(1.2rem,3vw,2rem)] font-bold text-white">
            <Scramble text={FOUNDER.name.toUpperCase()} />
          </h3>
          <div className="mt-2 font-[Chakra_Petch] text-[12px] tracking-[0.28em] text-violet-300 uppercase">
            {FOUNDER.role} • {FOUNDER.titleLine}
          </div>

          <MaskHeading as="h4" className="mt-6 font-[Syncopate] text-[clamp(1.1rem,2.4vw,1.7rem)] leading-snug text-white">
            “{FOUNDER.quote}”
          </MaskHeading>

          <RevealText className="mt-5 max-w-xl text-[15px] leading-relaxed text-silver-dim">
            {FOUNDER.bio}
          </RevealText>

          <div className="mt-6 flex flex-wrap gap-2">
            {FOUNDER.services.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: EASE.fmBlade }}
                className="clip-btn border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-[11px] tracking-[0.2em] text-violet-100 uppercase font-[Chakra_Petch]"
              >
                {s}
              </motion.span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-6">
            <div>
              <div className="font-[Syncopate] text-3xl font-bold text-white">
                <RollingNumber value={51} suffix="K" />
              </div>
              <div className="text-[10px] tracking-[0.3em] text-silver-dim uppercase">Followers</div>
            </div>
            <div className="h-10 w-px bg-white/15" />
            <div>
              <div className="font-[Syncopate] text-3xl font-bold text-white">
                <RollingNumber value={3} />
              </div>
              <div className="text-[10px] tracking-[0.3em] text-silver-dim uppercase">Branches</div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AngularButton variant="solid" onClick={() => open({ trainer: FOUNDER.name })}>
              Book Personal Training
            </AngularButton>
            <AngularButton href={FOUNDER.facebook}>Follow on Facebook</AngularButton>
          </div>
        </div>
      </div>
    </section>
  );
}
