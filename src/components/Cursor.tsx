import { useEffect, useRef } from "react";
import { CURSOR } from "@/config/motion";
import { useMotionFlags } from "@/motion/MotionProvider";

/**
 * CUSTOM CURSOR — a rotated angular ring (echoing the W's diagonals) that
 * lerps toward the pointer, expands over links/images and switches to
 * mix-blend-mode: difference so it inverts over imagery.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const { flags } = useMotionFlags();

  useEffect(() => {
    if (!flags.cursor) {
      document.body.classList.remove("custom-cursor");
      return;
    }
    if (window.matchMedia("(hover: none)").matches) return;
    document.body.classList.add("custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as HTMLElement)?.closest("a,button,[data-cursor]");
      targetScale = el ? CURSOR.hoverScale : 1;
      if (ring.current) {
        ring.current.dataset.mode = el ? (el.getAttribute("data-cursor") ?? "link") : "default";
      }
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * CURSOR.lerp;
      pos.y += (target.y - pos.y) * CURSOR.lerp;
      scale += (targetScale - scale) * 0.14;
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%,-50%)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%,-50%) rotate(45deg) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("custom-cursor");
    };
  }, [flags.cursor]);

  if (!flags.cursor) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" style={{ mixBlendMode: "difference" }}>
      <div
        ref={ring}
        className="absolute left-0 top-0 border border-white/90"
        style={{ width: CURSOR.size * 2, height: CURSOR.size * 2 }}
      />
      <div className="absolute left-0 top-0" ref={dot}>
        <div className="h-1.5 w-1.5 rotate-45 bg-white" />
      </div>
    </div>
  );
}
