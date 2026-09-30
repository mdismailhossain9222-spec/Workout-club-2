import { useEffect, useRef, useState } from "react";
import { TEXT } from "@/config/motion";
import { useMotionFlags } from "./MotionProvider";

/**
 * DECODE / SCRAMBLE.
 * Each character cycles through random glyphs, then locks to its final letter.
 * Characters lock left-to-right with `lockStagger` ms between them.
 * Runs once when the element first enters the viewport.
 */
export function useScrambleText(final: string, opts?: { start?: boolean; delay?: number }) {
  const { flags, reduced } = useMotionFlags();
  const [out, setOut] = useState(final);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!flags.text) {
      setOut(final);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let timeout = 0;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const chars = final.split("");
      const cycles = reduced ? 3 : TEXT.scramble.cyclesPerChar;
      const startTime = performance.now();
      const lockAt = chars.map((_, i) => i * TEXT.scramble.lockStagger + cycles * TEXT.scramble.frameMs);
      let lastFrame = 0;

      const tick = (now: number) => {
        const t = now - startTime;
        if (now - lastFrame >= TEXT.scramble.frameMs) {
          lastFrame = now;
          setOut(
            chars
              .map((c, i) => {
                if (c === " ") return " ";
                if (t >= lockAt[i]) return c;
                return TEXT.scramble.glyphs[
                  Math.floor(Math.random() * TEXT.scramble.glyphs.length)
                ];
              })
              .join("")
          );
        }
        if (t < Math.max(...lockAt) + TEXT.scramble.frameMs) raf = requestAnimationFrame(tick);
        else setOut(final);
      };
      raf = requestAnimationFrame(tick);
    };

    if (opts?.start === false) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          timeout = window.setTimeout(run, opts?.delay ?? 0);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      io.disconnect();
    };
  }, [final, flags.text, reduced, opts?.start, opts?.delay]);

  return { ref, text: out };
}
