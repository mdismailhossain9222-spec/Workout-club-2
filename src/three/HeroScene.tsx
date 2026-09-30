import { useEffect } from "react";
import { Environment, Lightformer } from "@react-three/drei";
import SceneCanvas from "./SceneCanvas";
import Emblem from "./Emblem";
import { PlasmaFog, GridFloor } from "./Backdrop";
import { sceneState } from "./webgl";
import { gsap, ScrollTrigger } from "@/motion/gsap";
import { SCROLL, tlog } from "@/config/motion";

/**
 * HERO 3D SCENE.
 * ScrollTrigger scrubs `sceneState.separate` 0 -> 1 across the hero, and back
 * toward 0 over the next section, which the Emblem reads in useFrame
 * (separating + rotating, then reassembling).
 */
export default function HeroScene({ reduced = false }: { reduced?: boolean }) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const proxy = { v: 0 };
      tlog("hero scroll scene created");
      ScrollTrigger.create({
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: SCROLL.scrub,
        onUpdate: (self) => {
          proxy.v = self.progress;
          sceneState.separate = self.progress;
        },
      });
      ScrollTrigger.create({
        trigger: "#reassemble",
        start: "top 85%",
        end: "center center",
        scrub: SCROLL.scrub,
        onUpdate: (self) => {
          sceneState.separate = 1 - self.progress;
        },
      });
    });

    const onPointer = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      tlog("hero scroll scene cleanup");
      ctx.revert();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <SceneCanvas className="absolute inset-0" label="hero">
      <color attach="background" args={["#06030d"]} />
      <PlasmaFog />
      <GridFloor />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={1.5} color="#e9e5ff" />
      <pointLight position={[-5, -1, 3]} intensity={38} color="#7c3aed" distance={18} />
      <pointLight position={[5, 3, -2]} intensity={26} color="#c4b5fd" distance={18} />
      <Emblem reduced={reduced} />
      {/* procedural environment map — no network fetch */}
      <Environment resolution={192}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#8b5cf6" position={[-5, 0, 2]} scale={[5, 6, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#c4b5fd" position={[5, -1, 1]} scale={[5, 6, 1]} />
        <Lightformer form="circle" intensity={2} color="#ffffff" position={[0, -4, 2]} scale={[4, 4, 1]} />
      </Environment>
    </SceneCanvas>
  );
}
