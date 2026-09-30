import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { THREE_CFG, tlog } from "@/config/motion";

/**
 * Shared canvas shell:
 * - DPR capped at 2
 * - render loop paused whenever the canvas is off-screen (IntersectionObserver)
 * - logs init / cleanup with the [3D] prefix in dev
 */
export default function SceneCanvas({
  children,
  className,
  cameraPosition = THREE_CFG.camera.position,
  fov = THREE_CFG.camera.fov,
  label = "scene",
}: {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  label?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    tlog(`${label}: canvas init`);
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        tlog(`${label}: ${e.isIntersecting ? "resumed" : "paused (off-screen)"}`);
      },
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      tlog(`${label}: canvas cleanup`);
    };
  }, [label]);

  return (
    <div ref={wrap} className={className}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, THREE_CFG.dprCap]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: cameraPosition, fov }}
      >
        {children}
      </Canvas>
    </div>
  );
}
