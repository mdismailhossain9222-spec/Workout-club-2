/** WebGL capability probe — the ONLY reason we ever show a static fallback. */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/** Shared scroll-scene state written by GSAP, read inside useFrame. */
export const sceneState = {
  separate: 0, // 0 = locked W, 1 = fully split & rotated
  reassemble: 0,
  pointer: { x: 0, y: 0 },
  velocity: 0,
};
