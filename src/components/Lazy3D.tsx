import { Suspense, lazy, useEffect, useState, type ComponentType } from "react";
import { hasWebGL } from "@/three/webgl";
import { useMotionFlags } from "@/motion/MotionProvider";
import { tlog } from "@/config/motion";
import { WLogo } from "./ui";

const HeroScene = lazy(() => import("@/three/HeroScene"));
const ShardsScene = lazy(() => import("@/three/ShardsScene"));
const GalleryScene = lazy(() => import("@/three/GalleryScene"));

const SCENES: Record<string, ComponentType<{ reduced?: boolean }>> = {
  hero: HeroScene,
  shards: ShardsScene,
  gallery: GalleryScene,
};

/**
 * Lazy-mounts a 3D scene AFTER first paint (requestIdleCallback / rAF),
 * respects the `three` debug flag, and shows the static fallback ONLY when
 * WebGL is unavailable.
 */
export default function Lazy3D({ scene, fallbackLabel }: { scene: keyof typeof SCENES; fallbackLabel?: string }) {
  const { flags, reduced } = useMotionFlags();
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(hasWebGL());
    const idle =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 220));
    const id = idle(() => {
      setReady(true);
      tlog(`${scene}: lazy mount after first paint`);
    });
    return () => clearTimeout(id as number);
  }, [scene]);

  if (!webgl || !flags.three) return <StaticFallback label={fallbackLabel ?? scene} />;
  if (!ready) return <StaticFallback label={fallbackLabel ?? scene} quiet />;

  const Scene = SCENES[scene];
  return (
    <Suspense fallback={<StaticFallback label={fallbackLabel ?? scene} quiet />}>
      <Scene reduced={reduced} />
    </Suspense>
  );
}

function StaticFallback({ label, quiet }: { label: string; quiet?: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(124,58,237,0.35),transparent_70%)]" />
      <div className="grid-lines absolute inset-0 opacity-40" />
      <div className="relative text-center">
        <WLogo className="mx-auto h-28 w-32 opacity-90" />
        {!quiet && (
          <div className="mt-4 text-[10px] tracking-[0.35em] text-violet-200/60 uppercase font-[Chakra_Petch]">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
