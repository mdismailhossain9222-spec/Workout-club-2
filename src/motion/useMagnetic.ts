import { useEffect, useRef } from "react";
import { gsap } from "./gsap";
import { CURSOR, EASE } from "@/config/motion";
import { useMotionFlags } from "./MotionProvider";

/**
 * MAGNETIC BUTTON.
 * While the pointer is within `magneticRadius` of the element bounds, the
 * element is pulled a fraction of the pointer offset toward the cursor,
 * springing back on leave. Pure transform => GPU friendly.
 */
export function useMagnetic<T extends HTMLElement>(strength = CURSOR.magneticStrength) {
  const ref = useRef<T | null>(null);
  // Tracks whether the element is currently away from its rest position, so the
  // elastic reset tween only fires once per settle instead of on every distant
  // pointermove (avoids hundreds of redundant GSAP tweens per second).
  const atRest = useRef(true);
  const { flags, reduced } = useMotionFlags();

  useEffect(() => {
    const el = ref.current;
    if (!el || !flags.cursor) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const s = reduced ? strength * 0.4 : strength;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const max = Math.max(r.width, r.height) / 2 + CURSOR.magneticRadius;
      if (dist < max) {
        atRest.current = false;
        gsap.to(el, { x: dx * s, y: dy * s, duration: 0.5, ease: EASE.power });
      } else if (!atRest.current) {
        atRest.current = true;
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
      }
    };
    const leave = () => {
    atRest.current = true;
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
  };

    window.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [flags.cursor, reduced, strength]);

  return ref;
}

/**
 * CURSOR SPOTLIGHT + 3D DEPTH for cards.
 * Writes --mx/--my custom props (used by a radial-gradient border glow) and
 * applies a depth-weighted rotation that is stronger near the card edges.
 */
export function useSpotlightCard<T extends HTMLElement>(depth = 7) {
  const ref = useRef<T | null>(null);
  const { reduced } = useMotionFlags();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const d = reduced ? depth * 0.35 : depth;
    let raf = 0;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        const edge = Math.max(Math.abs(px - 0.5), Math.abs(py - 0.5)) * 2;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * d * edge}deg) rotateY(${(px - 0.5) * d * edge}deg) translateZ(0)`;
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "-20%");
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [depth, reduced]);

  return ref;
}
