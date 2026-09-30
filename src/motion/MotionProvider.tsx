import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isDev, mlog } from "@/config/motion";

/**
 * Central switchboard for every motion system.
 * All flags default ON. The dev-only Motion Debug panel (Shift+M) flips them
 * so you can bisect which system causes a bug.
 */
export interface MotionFlags {
  three: boolean;
  lenis: boolean;
  cursor: boolean;
  pinned: boolean;
  text: boolean;
  marquee: boolean;
}

const DEFAULTS: MotionFlags = {
  three: true,
  lenis: true,
  cursor: true,
  pinned: true,
  text: true,
  marquee: true,
};

interface Ctx {
  flags: MotionFlags;
  toggle: (k: keyof MotionFlags) => void;
  panelOpen: boolean;
  setPanelOpen: (v: boolean) => void;
  reduced: boolean;
}

const MotionCtx = createContext<Ctx>({
  flags: DEFAULTS,
  toggle: () => {},
  panelOpen: false,
  setPanelOpen: () => {},
  reduced: false,
});

export const useMotionFlags = () => useContext(MotionCtx);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<MotionFlags>(DEFAULTS);
  const [panelOpen, setPanelOpen] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!isDev) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "M" || e.key === "m")) {
        setPanelOpen((o) => {
          mlog("debug panel", !o ? "opened" : "closed");
          return !o;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      flags,
      panelOpen,
      setPanelOpen,
      reduced,
      toggle: (k) =>
        setFlags((f) => {
          mlog("flag", k, "->", !f[k]);
          return { ...f, [k]: !f[k] };
        }),
    }),
    [flags, panelOpen, reduced]
  );

  return <MotionCtx.Provider value={value}>{children}</MotionCtx.Provider>;
}
