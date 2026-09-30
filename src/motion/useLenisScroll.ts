import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { SCROLL, mlog } from "@/config/motion";
import { useMotionFlags } from "./MotionProvider";

/** Live scroll velocity (px/frame-ish), read by the marquees & 3D shards. */
export const scrollState = { velocity: 0, direction: 1 as 1 | -1, progress: 0 };

/**
 * Lenis inertial scrolling wired into GSAP's ticker so ScrollTrigger stays in sync.
 * Disabled cleanly when the `lenis` debug flag is off (native scroll takes over).
 */
export function useLenisScroll() {
  const { flags, reduced } = useMotionFlags();

  useEffect(() => {
    if (!flags.lenis) {
      mlog("Lenis disabled — native scroll");
      ScrollTrigger.refresh();
      return;
    }
    const lenis = new Lenis({
      duration: reduced ? SCROLL.lenis.duration * 0.5 : SCROLL.lenis.duration,
      lerp: SCROLL.lenis.lerp,
      wheelMultiplier: SCROLL.lenis.wheelMultiplier,
      touchMultiplier: SCROLL.lenis.touchMultiplier,
      smoothWheel: true,
    });
    mlog("Lenis init");

    lenis.on("scroll", (e: Lenis) => {
      scrollState.velocity = e.velocity;
      scrollState.direction = (e.direction || 1) as 1 | -1;
      scrollState.progress = e.progress;
      ScrollTrigger.update();
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      mlog("Lenis cleanup");
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [flags.lenis, reduced]);
}

export const scrollTo = (target: string | number) => {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) lenis.scrollTo(target as never, { offset: -70 });
  else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  } else window.scrollTo({ top: target, behavior: "smooth" });
};
