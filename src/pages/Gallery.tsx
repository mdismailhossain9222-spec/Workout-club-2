import Lazy3D from "@/components/Lazy3D";
import { GALLERY } from "@/config/content";
import { OutlineTitle, RevealText, SafeImage, SectionLabel, SpotlightCard } from "@/components/ui";
import { useStaggerIn } from "@/motion/scenes";

export default function Gallery() {
  const grid = useStaggerIn<HTMLDivElement>();
  return (
    <div>
      <section className="relative h-[72vh] min-h-[520px] overflow-hidden">
        <Lazy3D scene="gallery" fallbackLabel="Gallery" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06030d] to-transparent p-5 pb-10">
          <div className="mx-auto max-w-[1400px]">
            <SectionLabel>Drag to spin</SectionLabel>
            <OutlineTitle text="GALLERY" className="mt-3 text-[clamp(2rem,10vw,8rem)]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16">
        <RevealText className="max-w-xl text-[15px] leading-relaxed text-silver-dim">
          Inside the three floors: strength racks, conditioning turf, class studios, the recovery room and the
          women-only second floor.
        </RevealText>
        <div ref={grid} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((g, i) => (
            <SpotlightCard key={g.id} data-stagger className={`overflow-hidden ${i % 5 === 0 ? "lg:row-span-2" : ""}`}>
              <div className={`relative overflow-hidden clip-notch ${i % 5 === 0 ? "h-[420px]" : "h-[230px]"}`}>
                <SafeImage src={g.src} alt={g.title} label={g.title} className="transition-transform duration-700 hover:scale-[1.06]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="font-[Syncopate] text-[13px] font-bold text-white">{g.title.toUpperCase()}</div>
                  <div className="mt-1 text-[10px] tracking-[0.28em] text-violet-300 uppercase">{g.branch}</div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>
    </div>
  );
}
