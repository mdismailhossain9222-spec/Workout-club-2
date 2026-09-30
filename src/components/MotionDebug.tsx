import { useMotionFlags, type MotionFlags } from "@/motion/MotionProvider";
import { isDev } from "@/config/motion";

const LABELS: Record<keyof MotionFlags, string> = {
  three: "3D Canvases",
  lenis: "Lenis Smooth Scroll",
  cursor: "Custom Cursor / Magnetic",
  pinned: "Pinned & Stacking Scenes",
  text: "Text Animations",
  marquee: "Kinetic Marquees",
};

/** DEV ONLY — Shift+M toggles. Every system can be switched off to isolate bugs. */
export default function MotionDebug() {
  const { flags, toggle, panelOpen, setPanelOpen } = useMotionFlags();
  if (!isDev) return null;

  return (
    <>
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="fixed bottom-4 left-4 z-[9500] clip-btn border border-violet-500/50 bg-black/70 px-4 py-2 text-[10px] tracking-[0.25em] text-violet-200 uppercase font-[Chakra_Petch]"
        >
          Motion ⇧M
        </button>
      )}
      {panelOpen && (
        <div className="fixed bottom-4 left-4 z-[9500] w-[280px] clip-corner border border-violet-500/40 bg-black/90 p-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="font-[Syncopate] text-[11px] tracking-[0.2em] text-white">MOTION DEBUG</span>
            <button onClick={() => setPanelOpen(false)} className="text-violet-300 text-xs">
              ✕
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {(Object.keys(LABELS) as (keyof MotionFlags)[]).map((k) => (
              <label key={k} className="flex cursor-pointer items-center justify-between gap-3 text-[11px] text-silver-dim">
                <span>{LABELS[k]}</span>
                <button
                  onClick={() => toggle(k)}
                  className={`h-5 w-10 rounded-full transition-colors ${flags[k] ? "bg-violet-500" : "bg-white/15"}`}
                >
                  <span
                    className={`block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform ${
                      flags[k] ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </label>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-silver-dim/70">
            Dev only. All flags ON in production. Logs use [MOTION] / [3D] prefixes.
          </p>
        </div>
      )}
    </>
  );
}
