import { motion } from "framer-motion";
import { CLUB_TIMELINE, FOUNDER } from "@/config/founder";
import { FAQS } from "@/config/content";
import { AngularButton, MaskHeading, Marquee, OutlineTitle, RevealText, SafeImage, SectionLabel, SpotlightCard } from "@/components/ui";
import { MARQUEE_WORDS } from "@/config/content";
import { useDiagonalWipe } from "@/motion/scenes";
import { useBooking } from "@/components/BookingProvider";
import { EASE } from "@/config/motion";

export default function About() {
  const portrait = useDiagonalWipe<HTMLDivElement>();
  const { open } = useBooking();

  return (
    <div>
      <div className="mx-auto max-w-[1400px] px-5 py-20">
        <SectionLabel>Our story</SectionLabel>
        <OutlineTitle text="THE CLUB" className="mt-4 text-[clamp(2.2rem,11vw,9rem)]" />
        <RevealText className="mt-8 max-w-2xl text-[16px] leading-relaxed text-silver-dim">
          The Workout Club started as one floor in Mirpur DOHS with a simple idea: make the hardest hour of someone's
          day the one they look forward to. Angular, loud, well-equipped rooms — and coaching that keeps people
          consistent long after motivation runs out.
        </RevealText>
      </div>

      <Marquee words={MARQUEE_WORDS} baseDirection={-1} className="border-y border-white/10 bg-[#0a0616]" />

      {/* THE MAN BEHIND THE CLUB */}
      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div ref={portrait} className="relative aspect-[4/5] overflow-hidden clip-portrait">
          <SafeImage src={FOUNDER.photos[1] ?? FOUNDER.photos[0]} alt={FOUNDER.name} focal={FOUNDER.focalPoint} label="Mubashshir Tahmid" />
          <div className="absolute inset-0 ring-1 ring-inset ring-violet-400/30" />
        </div>
        <div>
          <SectionLabel>The man behind the club</SectionLabel>
        {/* Owner photo sits beside his name (source: public/mubasshir.jpg) */}
        <div className="mt-5 flex items-center gap-3">
          <img
            src="/images/founder/owner-mubasshir.jpg"
            alt="Mubashshir Tahmid"
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
            loading="lazy"
          />
          <div>
            <MaskHeading className="font-[Syncopate] text-[clamp(1.4rem,4vw,2.4rem)] font-bold text-white">
              {FOUNDER.name}
            </MaskHeading>
            <div className="mt-2 font-[Chakra_Petch] text-[12px] tracking-[0.25em] text-violet-300 uppercase">
              {FOUNDER.role}
            </div>
          </div>
        </div>

          <MaskHeading as="blockquote" className="mt-8 border-l-2 border-violet-500 pl-6 font-[Syncopate] text-[clamp(1.3rem,3.6vw,2.3rem)] font-bold leading-tight text-white">
            “{FOUNDER.quote}”
          </MaskHeading>

          <RevealText className="mt-6 max-w-xl text-[15px] leading-relaxed text-silver-dim">
            {FOUNDER.bio}
          </RevealText>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AngularButton variant="solid" onClick={() => open({ trainer: FOUNDER.name })}>Book Personal Training</AngularButton>
            <AngularButton href={FOUNDER.facebook}>Follow on Facebook</AngularButton>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-[1400px] px-5 py-16">
        <SectionLabel>Growth</SectionLabel>
        <MaskHeading className="mt-4 font-[Syncopate] text-[clamp(1.3rem,3.4vw,2.2rem)] font-bold text-white">
          Mirpur → Banani → Bashundhara
        </MaskHeading>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {CLUB_TIMELINE.map((t, i) => (
            <motion.div
              key={t.year}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: EASE.fmBlade }}
              className="relative clip-notch border-t-2 border-violet-500/70 bg-white/[0.03] p-6"
            >
              <div className="font-[Syncopate] text-2xl font-bold text-white">{t.year}</div>
              <div className="mt-3 font-[Chakra_Petch] text-[12px] tracking-[0.2em] text-violet-300 uppercase">{t.title}</div>
              <p className="mt-3 text-[13px] leading-relaxed text-silver-dim">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[1400px] px-5 py-20">
        <SectionLabel>Questions</SectionLabel>
        <OutlineTitle text="FAQ" className="mt-4 text-[clamp(2rem,9vw,7rem)]" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {FAQS.map((f) => (
            <SpotlightCard key={f.q} className="p-6">
              <h3 className="font-[Chakra_Petch] text-[14px] font-semibold tracking-wide text-white">{f.q}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-silver-dim">{f.a}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>
    </div>
  );
}
