import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger } from "./gsap";
import { DUR, EASE, STAGGER, SCROLL, mlog } from "@/config/motion";
import { useMotionFlags } from "./MotionProvider";

/**
 * LINE-BY-LINE MASK REVEAL.
 * SplitType splits the heading into lines, each line gets an overflow-hidden
 * parent, then the inner line slides up from behind that mask on scroll-in.
 */
export function useMaskReveal<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T | null>(null);
  const { flags, reduced } = useMotionFlags();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!flags.text) {
      el.style.opacity = "1";
      return;
    }
    const ctx = gsap.context(() => {
      const split = new SplitType(el, { types: "lines", lineClass: "st-line" });
      const lines = split.lines ?? [];
      lines.forEach((line) => {
        const wrap = document.createElement("span");
        wrap.className = "st-line-mask";
        line.parentNode?.insertBefore(wrap, line);
        wrap.appendChild(line);
      });
      gsap.set(el, { opacity: 1 });
      gsap.from(lines, {
        yPercent: 118,
        rotate: reduced ? 0 : 2.5,
        duration: DUR.reveal,
        ease: EASE.blade,
        stagger: STAGGER.lines,
        scrollTrigger: { trigger: el, start: SCROLL.revealStart, once: true },
      });
      mlog("maskReveal lines:", lines.length);
      return () => split.revert();
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flags.text, reduced, ...deps]);

  return ref;
}

/**
 * WORD-BY-WORD OPACITY REVEAL for body copy — words brighten as the paragraph
 * crosses the viewport centre (scrubbed, so it tracks the scrollbar exactly).
 */
export function useWordReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const { flags, reduced } = useMotionFlags();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!flags.text) {
      el.style.opacity = "1";
      return;
    }
    const ctx = gsap.context(() => {
      const split = new SplitType(el, { types: "words" });
      gsap.set(el, { opacity: 1 });
      gsap.fromTo(
        split.words,
        { opacity: reduced ? 0.45 : 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.35,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "bottom 55%",
            scrub: SCROLL.scrub,
          },
        }
      );
      return () => split.revert();
    }, el);
    return () => ctx.revert();
  }, [flags.text, reduced]);

  return ref;
}
