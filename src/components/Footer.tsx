import { Link } from "react-router-dom";
import { WLogo, Marquee } from "./ui";
import { BRAND, MARQUEE_WORDS } from "@/config/content";
import { BRANCHES } from "@/config/branches";
import { FOUNDER } from "@/config/founder";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-[#07040f]">
      <Marquee words={MARQUEE_WORDS} baseDirection={-1} className="border-b border-white/10 opacity-70" />
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <WLogo className="h-9 w-10" />
            <span className="font-[Syncopate] text-[12px] tracking-[0.2em] text-white">THE WORKOUT CLUB</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-silver-dim">{BRAND.tagline} Three branches across Dhaka, one standard of training.</p>
        </div>
        <div>
          <h4 className="font-[Chakra_Petch] text-[11px] tracking-[0.3em] text-violet-300 uppercase">Branches</h4>
          <ul className="mt-4 space-y-2 text-sm text-silver-dim">
            {BRANCHES.map((b) => (
              <li key={b.slug}>
                <Link to={`/branches#${b.slug}`} className="hover:text-white">{b.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-[Chakra_Petch] text-[11px] tracking-[0.3em] text-violet-300 uppercase">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-silver-dim">
            <li><Link to="/packages" className="hover:text-white">Packages & Pricing</Link></li>
            <li><Link to="/trainers" className="hover:text-white">Trainers</Link></li>
            <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-[Chakra_Petch] text-[11px] tracking-[0.3em] text-violet-300 uppercase">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-silver-dim">
            <li><a href={`tel:${BRAND.phone}`} className="hover:text-white">{BRAND.phone}</a></li>
            <li><a href={`mailto:${BRAND.email}`} className="hover:text-white">{BRAND.email}</a></li>
            <li><a href={FOUNDER.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook — MubaFitness</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 text-[11px] tracking-[0.18em] text-silver-dim uppercase md:flex-row">
          <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
          <span>
            Founded by{" "}
            <a href={FOUNDER.facebook} target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:text-white">
              {FOUNDER.name}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
