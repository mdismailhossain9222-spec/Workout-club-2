import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useMagnetic, useSpotlightCard } from "@/motion/useMagnetic";
import { useMaskReveal, useWordReveal } from "@/motion/useMaskReveal";
import { useOutlineFill } from "@/motion/scenes";
import { useScrambleText } from "@/motion/useScrambleText";
import { TEXT, EASE, DUR } from "@/config/motion";
import { scrollState } from "@/motion/useLenisScroll";
import { useMotionFlags } from "@/motion/MotionProvider";

/* ---------------------------------------------------------------- W LOGO */
export function WLogo({ className = "h-8 w-8", animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" aria-hidden>
      <path
        d="M4 6 H34 L48 62 L58 26 L68 62 L82 6 H112 L88 94 H62 L58 78 L54 94 H28 Z"
        fill="url(#wgrad)"
        opacity={animated ? 1 : 0.95}
      />
      <defs>
        <linearGradient id="wgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#c8cbd6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------ MASK HEADING */
export function MaskHeading({
  children,
  as: Tag = "h2",
  className,
}: {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useMaskReveal<HTMLHeadingElement>();
  const T = Tag as "h2";
  return (
    <T ref={ref} data-mask-root className={className}>
      {children}
    </T>
  );
}

/* --------------------------------------------------------- BODY WORD REVEAL */
export function RevealText({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useWordReveal<HTMLParagraphElement>();
  return (
    <p ref={ref} style={{ opacity: 0 }} className={className}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------ OUTLINE TITLE */
export function OutlineTitle({ text, className }: { text: string; className?: string }) {
  const ref = useOutlineFill<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("relative select-none leading-[0.85]", className)}>
      <span className="outline-text font-[Syncopate] font-bold block">{text}</span>
      <span data-fill className="outline-fill font-[Syncopate] font-bold absolute inset-0 block" style={{ clipPath: "inset(0 100% 0 0)" }}>
        {text}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------- SCRAMBLE */
export function Scramble({ text, className, delay }: { text: string; className?: string; delay?: number }) {
  const { ref, text: out } = useScrambleText(text, { delay });
  return (
    <span ref={ref} className={cn("inline-block whitespace-pre", className)}>
      {out}
    </span>
  );
}

/* --------------------------------------------------------- ANGULAR BUTTON */
type BtnProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "solid";
  className?: string;
  full?: boolean;
  // Lets callers opt into native form behavior (e.g. submit inside <form>).
  // Defaults to "button" so stray clicks never trigger a form submission.
  type?: "button" | "submit";
};

export function AngularButton({ children, to, href, onClick, variant = "primary", className, full, type }: BtnProps) {
  const ref = useMagnetic<HTMLDivElement>();
  const base = cn(
    "relative inline-flex items-center justify-center gap-2 clip-btn px-7 min-h-[46px] text-[12px] font-[Chakra_Petch] font-semibold tracking-[0.22em] uppercase transition-colors duration-300 overflow-hidden group",
    full && "w-full",
    variant === "primary" && "border border-silver/30 text-white bg-white/[0.04]",
    variant === "ghost" && "border border-violet-400/40 text-violet-100",
    variant === "solid" && "text-white",
    className
  );

  const inner = (
    <>
      {variant === "solid" && <span className="absolute inset-0 bg-gradient-to-r from-violet-700 via-violet-500 to-fuchsia-600" />}
      <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0" />
      <span className="relative z-10">{children}</span>
    </>
  );

  const content = to ? (
    <Link to={to} className={base}>
      {inner}
    </Link>
  ) : href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
      {inner}
    </a>
  ) : (
    <button type={type ?? "button"} onClick={onClick} className={base}>
      {inner}
    </button>
  );

  return (
    <div ref={ref} className={cn("inline-block", full && "w-full")} data-cursor="link">
      {content}
    </div>
  );
}

/* ------------------------------------------------------- SPOTLIGHT CARD */
export function SpotlightCard({
  children,
  className,
  depth = 7,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useSpotlightCard<HTMLDivElement>(depth);
  return (
    <div ref={ref} className={cn("spotlight glass clip-corner", className)} {...rest}>
      {children}
    </div>
  );
}

/* ------------------------------------------------- SLOT MACHINE COUNTER */
function Digit({ value, delay }: { value: number; delay: number }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-bottom" style={{ width: "0.62em" }}>
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        initial={{ y: "0em" }}
        animate={{ y: `${-value}em` }}
        transition={{ duration: TEXT.counter.duration, ease: EASE.fmBlade, delay }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="h-[1em] leading-[1em] text-center">
            {i}
          </span>
        ))}
      </motion.span>
      <span className="invisible">0</span>
    </span>
  );
}

export function RollingNumber({ value, className, suffix = "" }: { value: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const digits = String(value).split("");
  return (
    <span ref={ref} className={cn("inline-flex items-end tabular-nums", className)}>
      {digits.map((d, i) =>
        d === "," ? (
          <span key={i}>,</span>
        ) : (
          <Digit key={i} value={inView ? Number(d) : 0} delay={i * TEXT.counter.digitStagger} />
        )
      )}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

/** Price that re-rolls smoothly whenever the value changes (packages cards) */
export function RollingPrice({ value, className }: { value: number; className?: string }) {
  const chars = value.toLocaleString("en-US").split("");
  return (
    <span className={cn("inline-flex items-end tabular-nums", className)}>
      {chars.map((c, i) =>
        c === "," ? (
          <span key={`c${i}`}>,</span>
        ) : (
          <PriceDigit key={`${i}-${c}`} digit={Number(c)} delay={i * 0.05} />
        )
      )}
    </span>
  );
}

function PriceDigit({ digit, delay }: { digit: number; delay: number }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-bottom" style={{ width: "0.62em" }}>
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: `${-digit}em` }}
        transition={{ duration: 0.75, ease: EASE.fmBlade, delay }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="h-[1em] leading-[1em] text-center">
            {i}
          </span>
        ))}
      </motion.span>
      <span className="invisible">0</span>
    </span>
  );
}

/* ----------------------------------------------------- KINETIC MARQUEE */
export function Marquee({
  words,
  className,
  baseDirection = 1,
  separator = "◆",
}: {
  words: string[];
  className?: string;
  baseDirection?: 1 | -1;
  separator?: string;
}) {
  const { flags } = useMotionFlags();
  const track = useRef<HTMLDivElement>(null);
  const x = useRef(0);

  useEffect(() => {
    if (!flags.marquee) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const vel = scrollState.velocity;
      const speed = Math.min(
        TEXT.marquee.baseSpeed + Math.abs(vel) * TEXT.marquee.velocityInfluence * 10,
        TEXT.marquee.maxSpeed
      );
      // scroll direction flips the travel direction
      const dir = (vel === 0 ? 1 : scrollState.direction) * baseDirection;
      x.current -= speed * dt * dir;
      const el = track.current;
      if (el) {
        const half = el.scrollWidth / 2;
        if (half > 0) {
          if (x.current <= -half) x.current += half;
          if (x.current > 0) x.current -= half;
          el.style.transform = `translate3d(${x.current}px,0,0)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [flags.marquee, baseDirection]);

  const items = [...words, ...words, ...words, ...words];
  return (
    <div className={cn("relative overflow-hidden py-4", className)}>
      <div ref={track} className="flex w-max gap-10 will-change-transform">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-10">
            {items.map((w, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-10 font-[Syncopate] text-[clamp(1.1rem,2.6vw,2.2rem)] font-bold tracking-tight whitespace-nowrap">
                <span className={i % 2 ? "outline-text" : "text-white"}>{w}</span>
                <span className="text-violet-400 text-base">{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- SECTION */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-[Chakra_Petch] tracking-[0.4em] text-violet-300/90 uppercase">
      <span className="inline-block h-[10px] w-[10px] rotate-45 bg-violet-500" />
      {children}
    </div>
  );
}

export function Chip({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="link"
      className={cn(
        "clip-btn px-5 py-2.5 min-h-[44px] text-[11px] font-[Chakra_Petch] tracking-[0.2em] uppercase transition-all duration-300 border",
        active
          ? "bg-gradient-to-r from-violet-700 to-fuchsia-600 border-violet-400 text-white"
          : "border-white/15 text-silver-dim hover:text-white hover:border-violet-400/60"
      )}
    >
      {children}
    </button>
  );
}

/* --------------------------------------------- IMAGE WITH SAFE FALLBACK */
export function SafeImage({
  src,
  alt,
  className,
  focal = "50% 50%",
  label,
}: {
  src: string;
  alt: string;
  className?: string;
  focal?: string;
  label?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={cn("relative grid place-items-center bg-gradient-to-br from-violet-950 via-[#12091f] to-black", className)}>
        <div className="grid-lines absolute inset-0 opacity-50" />
        <div className="relative text-center px-4">
          <WLogo className="mx-auto h-10 w-10 opacity-60" />
          <div className="mt-3 text-[10px] tracking-[0.35em] text-violet-200/70 font-[Chakra_Petch] uppercase">
            {label ?? alt}
          </div>
        </div>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
      style={{ objectPosition: focal }}
    />
  );
}

export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: DUR.base, ease: EASE.fmBlade },
};
