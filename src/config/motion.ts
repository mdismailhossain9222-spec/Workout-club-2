/**
 * CENTRAL MOTION CONFIG — every duration, easing, stagger and scroll setting lives here.
 * No magic numbers inside components. Tweak here to retune the whole site.
 */

export const EASE = {
  /** Main brand ease — sharp out, like a blade cut */
  blade: "expo.out",
  power: "power3.out",
  inOut: "power2.inOut",
  back: "back.out(1.7)",
  /** cubic-bezier arrays for Framer Motion */
  fmBlade: [0.16, 1, 0.3, 1] as [number, number, number, number],
  fmInOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

export const DUR = {
  micro: 0.22,
  fast: 0.45,
  base: 0.8,
  slow: 1.2,
  reveal: 1.05,
  preloaderDraw: 1.5,
  preloaderSplit: 0.9,
  pageWipe: 0.75,
};

export const STAGGER = {
  lines: 0.11,
  words: 0.02,
  cards: 0.09,
  chips: 0.05,
};

export const SCROLL = {
  /** Lenis inertial scroll */
  lenis: {
    duration: 1.15,
    lerp: 0.09,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  },
  /** trigger position for entrance reveals */
  revealStart: "top 82%",
  /** scrub value used across scroll scenes */
  scrub: 1,
  hardScrub: 0.6,
  /** pinned horizontal programs track */
  horizontalEndMultiplier: 1.1,
  /** sticky stacking packages */
  stackOffsetY: 26,
  stackScaleStep: 0.04,
};

export const TEXT = {
  scramble: {
    glyphs: "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/\\<>*+-0123456789",
    /** ms per frame of the shuffle */
    frameMs: 32,
    /** frames each character shuffles before locking */
    cyclesPerChar: 7,
    /** ms delay between characters locking in */
    lockStagger: 42,
  },
  marquee: {
    baseSpeed: 60, // px / second
    velocityInfluence: 0.22,
    maxSpeed: 420,
  },
  counter: {
    duration: 1.7,
    digitStagger: 0.07,
  },
};

export const THREE_CFG = {
  dprCap: 2,
  camera: { fov: 42, position: [0, 0, 7.4] as [number, number, number] },
  emblem: {
    flyInDistance: 9,
    flyInDuration: 1.6,
    separateDistance: 2.6,
    rotationOnScroll: Math.PI * 0.9,
    /** cursor spring */
    springStiffness: 0.045,
    springDamping: 0.86,
    cursorInfluence: 0.28,
  },
  plasma: {
    speed: 0.055,
    scale: 2.1,
    intensity: 0.85,
  },
  grid: {
    beams: 3,
    beamSpeed: 0.22,
  },
  shards: { count: 14, scrollReactivity: 0.0016 },
};

export const CURSOR = {
  size: 18,
  hoverScale: 3.2,
  lerp: 0.18,
  magneticStrength: 0.36,
  magneticRadius: 90,
};

/** Angular language derived from the W logo */
export const ANGLE = {
  deg: 14,
  clipDiagonal: "polygon(0 0, 100% 0, 100% calc(100% - 3.5rem), 0 100%)",
  clipCorner: "polygon(0 0, calc(100% - 1.6rem) 0, 100% 1.6rem, 100% 100%, 1.6rem 100%, 0 calc(100% - 1.6rem))",
  clipBtn: "polygon(0.9rem 0, 100% 0, calc(100% - 0.9rem) 100%, 0 100%)",
  clipPortrait: "polygon(0 6%, 100% 0, 100% 94%, 0 100%)",
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Reduced motion softens (never removes) effects */
export const softFactor = () => (prefersReducedMotion() ? 0.45 : 1);

export const isDev =
  typeof process === "undefined" || process.env?.NODE_ENV !== "production";

export const mlog = (...args: unknown[]) => {
  if (isDev) console.log("%c[MOTION]", "color:#a855f7;font-weight:700", ...args);
};
export const tlog = (...args: unknown[]) => {
  if (isDev) console.log("%c[3D]", "color:#c4b5fd;font-weight:700", ...args);
};
