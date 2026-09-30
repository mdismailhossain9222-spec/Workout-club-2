import { TRAINERS } from "@/config/content";
import { FOUNDER } from "@/config/founder";
import { AngularButton, MaskHeading, OutlineTitle, RevealText, SafeImage, SectionLabel, SpotlightCard } from "@/components/ui";
import { useBooking } from "@/components/BookingProvider";
import { useDiagonalWipe, useStaggerIn } from "@/motion/scenes";

export default function Trainers() {
  const { open } = useBooking();
  const grid = useStaggerIn<HTMLDivElement>();
  const founder = TRAINERS.find((t) => t.isFounder)!;
  const rest = TRAINERS.filter((t) => !t.isFounder).sort((a, b) => a.sort - b.sort);
  const founderImg = useDiagonalWipe<HTMLDivElement>();

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-20">
      <SectionLabel>The team</SectionLabel>
      <OutlineTitle text="TRAINERS" className="mt-4 text-[clamp(2.2rem,11vw,9rem)]" />
      <RevealText className="mt-6 max-w-xl text-[15px] leading-relaxed text-silver-dim">
        Coaches who watch your set, fix your form and build a plan you will actually follow. Book a free intro session
        at any branch, or train online.
      </RevealText>

      {/* FEATURED FOUNDER CARD */}
      <SpotlightCard className="mt-12 overflow-hidden p-0" depth={5}>
        <div className="grid gap-0 md:grid-cols-[0.8fr_1.2fr]">
          <div ref={founderImg} className="relative aspect-[4/5] md:aspect-auto md:min-h-[440px] clip-portrait overflow-hidden">
            <SafeImage src={founder.photo} alt={founder.name} focal={FOUNDER.focalPoint} label="Founder" />
          </div>
          <div className="p-7 md:p-10">
            <span className="clip-btn inline-block bg-gradient-to-r from-violet-700 to-fuchsia-600 px-4 py-1.5 text-[10px] tracking-[0.3em] text-white uppercase">
              Founder
            </span>
            <MaskHeading as="h2" className="mt-5 font-[Syncopate] text-[clamp(1.4rem,4vw,2.6rem)] font-bold text-white">
              {founder.name}
            </MaskHeading>
            <div className="mt-2 font-[Chakra_Petch] text-[12px] tracking-[0.25em] text-violet-300 uppercase">
              {founder.role} • {FOUNDER.titleLine}
            </div>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-silver-dim">{FOUNDER.bio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {FOUNDER.services.map((s) => (
                <span key={s} className="clip-btn border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-[10px] tracking-[0.2em] text-violet-100 uppercase">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AngularButton variant="solid" onClick={() => open({ trainer: founder.name })}>Book Now</AngularButton>
              <AngularButton href={FOUNDER.facebook}>{FOUNDER.followersLabel} on Facebook</AngularButton>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* OTHER TRAINERS */}
      <div ref={grid} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((t) => (
          <SpotlightCard key={t.id} data-stagger className="overflow-hidden">
            <div className="relative h-64 overflow-hidden clip-notch">
              <SafeImage src={t.photo} alt={t.name} label={t.name} className="transition-transform duration-700 hover:scale-105" />
            </div>
            <div className="p-6">
              <h3 className="font-[Syncopate] text-base font-bold text-white">{t.name}</h3>
              <div className="mt-2 text-[11px] tracking-[0.22em] text-violet-300 uppercase">{t.role}</div>
              <p className="mt-3 text-[13px] text-silver-dim">{t.specialty}</p>
              <div className="mt-3 text-[10px] tracking-[0.2em] text-silver-dim uppercase">{t.modes.join(" • ")}</div>
              <div className="mt-5">
                <AngularButton onClick={() => open({ trainer: t.name })}>Book Now</AngularButton>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
