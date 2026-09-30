import { BRANCHES, directionsUrl, hasAddress, mapEmbedUrl, FACILITIES } from "@/config/branches";
import Facilities from "@/components/Facilities";
import { AngularButton, MaskHeading, OutlineTitle, SafeImage, SectionLabel, SpotlightCard } from "@/components/ui";
import { useDiagonalWipe } from "@/motion/scenes";

export default function Branches() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-20">
      <SectionLabel>Three locations in Dhaka</SectionLabel>
      <OutlineTitle text="BRANCHES" className="mt-4 text-[clamp(2.2rem,11vw,9rem)]" />

      <div className="mt-14 space-y-20">
        {BRANCHES.map((b, i) => (
          <BranchBlock key={b.slug} index={i} branch={b} />
        ))}
      </div>

      <div className="mt-24">
        <MaskHeading className="font-[Syncopate] text-[clamp(1.2rem,3vw,2rem)] font-bold text-white">
          Every branch includes
        </MaskHeading>
        <Facilities className="mt-8" />
      </div>
    </div>
  );
}

function BranchBlock({ branch, index }: { branch: (typeof BRANCHES)[number]; index: number }) {
  const img = useDiagonalWipe<HTMLDivElement>();
  const open = hasAddress(branch);
  return (
    <section id={branch.slug} className="scroll-mt-28 grid gap-8 lg:grid-cols-2 lg:items-center">
      <div ref={img} className={`relative aspect-[16/11] overflow-hidden clip-portrait ${index % 2 ? "lg:order-2" : ""}`}>
        <SafeImage src={branch.photos[0]} alt={branch.name} label={branch.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div>
        <div className="font-[Chakra_Petch] text-[11px] tracking-[0.35em] text-violet-300 uppercase">
          Branch 0{index + 1}
        </div>
        <MaskHeading className="mt-3 font-[Syncopate] text-[clamp(1.5rem,4vw,2.6rem)] font-bold text-white">
          {branch.name}
        </MaskHeading>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-silver-dim">
          {open ? branch.address : "Address coming soon"}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-[12px] tracking-[0.2em] text-silver uppercase">
          <span>{branch.hours}</span>
          <a href={`tel:${branch.phone}`} className="text-violet-300 hover:text-white">{branch.phone}</a>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {branch.facilities.map((f) => (
            <span key={f} className="clip-btn border border-white/12 px-3 py-1.5 text-[10px] tracking-[0.2em] text-silver-dim uppercase">
              {FACILITIES.find((x) => x.id === f)?.short ?? f}
            </span>
          ))}
        </div>

        {open ? (
          <>
            <SpotlightCard className="mt-7 overflow-hidden p-1">
              <iframe
                title={`Map of ${branch.name}`}
                src={mapEmbedUrl(branch)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[260px] w-full grayscale-[0.4] contrast-125"
              />
            </SpotlightCard>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <AngularButton href={directionsUrl(branch)} variant="solid">Get Directions</AngularButton>
              <AngularButton to="/packages">See Packages</AngularButton>
            </div>
          </>
        ) : (
          <div className="mt-7 clip-notch border border-violet-400/30 bg-violet-500/5 p-5 text-[13px] text-silver-dim">
            We're finalising this location's address. Call {branch.phone} and our team will guide you in.
            <div className="mt-4">
              <AngularButton to="/contact">Contact Us</AngularButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
