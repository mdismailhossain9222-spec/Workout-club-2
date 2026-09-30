import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { SCROLL, DUR, EASE, STAGGER, mlog } from "@/config/motion";
import { useMotionFlags } from "./MotionProvider";

/**
 * OUTLINED TITLE FILL.
 * A stroke-only heading has a duplicate filled copy clipped to 0% width;
 * scrolling scrubs that clip from 0 -> 100%, so the word "fills" with colour.
 */
export function useOutlineFill<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const { flags } = useMotionFlags();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fill = el.querySelector<HTMLElement>("[data-fill]");
    if (!fill) return;
    if (!flags.text) {
      fill.style.clipPath = "inset(0 0% 0 0)";
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 45%", scrub: SCROLL.scrub },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [flags.text]);

  return ref;
}

/**
 * PINNED HORIZONTAL TRACK.
 * The section pins and vertical scroll distance is translated into an x-shift
 * of the inner track (total width - viewport width).
 */
export function useHorizontalPin<T extends HTMLElement>() {
  const sectionRef = useRef<T | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { flags } = useMotionFlags();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (!flags.pinned || window.innerWidth < 760) {
      track.style.transform = "none";
      return;
    }
    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth + 48;
      mlog("horizontal pin created, distance", distance());
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance() * SCROLL.horizontalEndMultiplier}`,
          pin: true,
          scrub: SCROLL.hardScrub,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);
    return () => {
      mlog("horizontal pin cleanup");
      ctx.revert();
    };
  }, [flags.pinned]);

  return { sectionRef, trackRef };
}

/**
 * STICKY STACKING CARDS.
 * Each card sticks at the same offset and the earlier cards scale down /
 * push back as later ones layer over them; at the end of the scene they
 * spread apart into the comparison grid.
 */
export function useStackingCards<T extends HTMLElement>(count: number) {
  const ref = useRef<T | null>(null);
  const { flags, reduced } = useMotionFlags();

  useEffect(() => {
    const el = ref.current;
    if (!el || count === 0) return;
    if (!flags.pinned) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", el);
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card, {
          scale: 1 - (cards.length - 1 - i) * SCROLL.stackScaleStep * (reduced ? 0.5 : 1),
          yPercent: -SCROLL.stackOffsetY * 0.35,
          filter: "brightness(0.62)",
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 96px",
            end: () => `+=${window.innerHeight * 0.75}`,
            scrub: SCROLL.scrub,
          },
        });
      });
      mlog("stacking cards:", cards.length);
    }, el);
    return () => ctx.revert();
  }, [count, flags.pinned, reduced]);

  return ref;
}

/**
 * DIAGONAL CLIP-PATH WIPE REVEAL (trainer portraits, image masks).
 * The image is revealed by animating a slanted polygon clip-path open.
 */
export function useDiagonalWipe<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T | null>(null);
  const { flags } = useMotionFlags();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!flags.text) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: DUR.slow,
          delay,
          ease: EASE.blade,
          scrollTrigger: { trigger: el, start: SCROLL.revealStart, once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [flags.text, delay]);

  return ref;
}

/** Generic staggered entrance for grids of cards/chips. */
export function useStaggerIn<T extends HTMLElement>(selector = "[data-stagger]") {
  const ref = useRef<T | null>(null);
  const { flags } = useMotionFlags();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!flags.text) return;
    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.toArray<HTMLElement>(selector, el), {
        y: 46,
        opacity: 0,
        duration: DUR.base,
        ease: EASE.blade,
        stagger: STAGGER.cards,
        scrollTrigger: { trigger: el, start: SCROLL.revealStart, once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [flags.text, selector]);

  return ref;
}

export { ScrollTrigger };
