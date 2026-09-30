import { useEffect, useRef, useState } from "react";
import { gsap } from "@/motion/gsap";
import { DUR, EASE, mlog } from "@/config/motion";
import { useMotionFlags } from "@/motion/MotionProvider";

/**
 * PRELOADER.
 * The two V strokes of the W draw themselves (SVG stroke-dashoffset), fill
 * with the brand gradient, then two angled panels split open diagonally to
 * reveal the site.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const { reduced } = useMotionFlags();

  useEffect(() => {
    document.body.classList.add("no-scroll");
    const ctx = gsap.context(() => {
      const speed = reduced ? 0.55 : 1;
      const tl = gsap.timeline({
        onComplete: () => {
          mlog("preloader complete");
          document.body.classList.remove("no-scroll");
          setHidden(true);
          onDone();
        },
      });
      tl.set("[data-pl-path]", { strokeDasharray: 620, strokeDashoffset: 620, fillOpacity: 0 })
        .to("[data-pl-path]", {
          strokeDashoffset: 0,
          duration: DUR.preloaderDraw * speed,
          ease: "power2.inOut",
          stagger: 0.18,
        })
        .to("[data-pl-path]", { fillOpacity: 1, duration: 0.45 * speed, ease: EASE.power }, "-=0.25")
        .to("[data-pl-count]", { opacity: 0, duration: 0.3 }, "<")
        .to("[data-pl-logo]", { scale: 1.18, opacity: 0, duration: 0.5 * speed, ease: EASE.blade })
        .to("[data-pl-panel='top']", { yPercent: -102, duration: DUR.preloaderSplit * speed, ease: EASE.blade }, "-=0.2")
        .to("[data-pl-panel='bottom']", { yPercent: 102, duration: DUR.preloaderSplit * speed, ease: EASE.blade }, "<");
    }, root);
    return () => {
      ctx.revert();
      document.body.classList.remove("no-scroll");
    };
  }, [onDone, reduced]);

  if (hidden) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[10000]">
      <div
        data-pl-panel="top"
        className="absolute inset-x-0 top-0 h-[52%] bg-[#06030d]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 84%, 0 100%)" }}
      />
      <div
        data-pl-panel="bottom"
        className="absolute inset-x-0 bottom-0 h-[52%] bg-[#06030d]"
        style={{ clipPath: "polygon(0 16%, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div data-pl-logo className="text-center">
          <svg viewBox="0 0 120 100" className="h-28 w-32 md:h-36 md:w-44">
            <defs>
              <linearGradient id="plg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#c8cbd6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path data-pl-path d="M4 6 H34 L54 94 H28 Z" fill="url(#plg)" stroke="#e9e7f5" strokeWidth="1.6" />
            <path data-pl-path d="M112 6 H82 L62 94 H88 Z" fill="url(#plg)" stroke="#a78bfa" strokeWidth="1.6" />
            <path data-pl-path d="M40 6 H68 L58 52 Z" fill="url(#plg)" stroke="#c4b5fd" strokeWidth="1.6" />
          </svg>
          <div data-pl-count className="mt-6 font-[Chakra_Petch] text-[11px] tracking-[0.5em] text-violet-200/70 uppercase">
            The Workout Club
          </div>
        </div>
      </div>
    </div>
  );
}
