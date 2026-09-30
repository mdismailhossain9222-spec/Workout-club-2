import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/motion/gsap";
import { THREE_CFG, tlog } from "@/config/motion";
import { sceneState } from "./webgl";

/**
 * The W emblem = TWO extruded "V" prisms (the logo's interlocking shapes).
 * - fly in from opposite directions on load, lock together with a soft flash
 * - scroll (sceneState.separate) pulls them apart + rotates them, then they
 *   reassemble as the value drops back toward 0
 * - both follow the cursor through a critically damped spring
 */
function vGeometry(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(-1.0, 1.1);
  s.lineTo(-0.48, 1.1);
  s.lineTo(0, -0.1);
  s.lineTo(0.48, 1.1);
  s.lineTo(1.0, 1.1);
  s.lineTo(0.25, -1.1);
  s.lineTo(-0.25, -1.1);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.045,
    bevelSegments: 3,
  });
  g.center();
  return g;
}

export default function Emblem({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.PointLight>(null);
  const spring = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  const geo = useMemo(() => vGeometry(), []);

  useEffect(() => {
    tlog("emblem mounted — fly-in");
    const d = THREE_CFG.emblem.flyInDistance;
    const dur = THREE_CFG.emblem.flyInDuration * (reduced ? 0.6 : 1);
    const ctx = gsap.context(() => {
      if (!left.current || !right.current) return;
      gsap.fromTo(
        left.current.position,
        { x: -d, y: d * 0.4, z: -3 },
        { x: -0.78, y: 0, z: 0, duration: dur, ease: "expo.out" }
      );
      gsap.fromTo(
        right.current.position,
        { x: d, y: -d * 0.4, z: 3 },
        { x: 0.78, y: 0, z: 0, duration: dur, ease: "expo.out" }
      );
      gsap.fromTo(
        [left.current.rotation, right.current.rotation],
        { z: (i: number) => (i === 0 ? -1.2 : 1.2) },
        { z: 0, duration: dur, ease: "expo.out" }
      );
      if (flash.current) {
        gsap.fromTo(
          flash.current,
          { intensity: 0 },
          { intensity: 26, duration: 0.18, delay: dur * 0.72, yoyo: true, repeat: 1, ease: "power2.out" }
        );
      }
    });
    return () => {
      tlog("emblem cleanup");
      ctx.revert();
      geo.dispose();
    };
  }, [geo, reduced]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const sep = sceneState.separate;
    const k = reduced ? 0.4 : 1;

    // cursor spring (frame-rate independent-ish)
    const s = spring.current;
    const targetX = sceneState.pointer.x * THREE_CFG.emblem.cursorInfluence * k;
    const targetY = sceneState.pointer.y * THREE_CFG.emblem.cursorInfluence * k;
    s.vx += (targetX - s.x) * THREE_CFG.emblem.springStiffness * (delta * 60);
    s.vy += (targetY - s.y) * THREE_CFG.emblem.springStiffness * (delta * 60);
    s.vx *= THREE_CFG.emblem.springDamping;
    s.vy *= THREE_CFG.emblem.springDamping;
    s.x += s.vx;
    s.y += s.vy;

    if (group.current) {
      group.current.rotation.y = s.x * 2.1 + Math.sin(t * 0.32) * 0.07;
      group.current.rotation.x = -s.y * 1.5 + Math.cos(t * 0.27) * 0.05;
      group.current.position.y = Math.sin(t * 0.5) * 0.06;
      group.current.scale.setScalar(1 - sep * 0.12);
    }
    if (left.current && right.current) {
      const off = sep * THREE_CFG.emblem.separateDistance;
      left.current.position.x = -0.78 - off;
      right.current.position.x = 0.78 + off;
      left.current.position.z = -off * 0.7;
      right.current.position.z = off * 0.7;
      left.current.rotation.y = -sep * THREE_CFG.emblem.rotationOnScroll;
      right.current.rotation.y = sep * THREE_CFG.emblem.rotationOnScroll;
      left.current.rotation.z = sep * 0.32;
      right.current.rotation.z = -sep * 0.32;
    }
  });

  return (
    <group ref={group} scale={1.05}>
      <pointLight ref={flash} color="#c4b5fd" intensity={0} distance={14} position={[0, 0, 2.2]} />
      {/* white / frosted prism */}
      <mesh ref={left} geometry={geo} position={[-0.78, 0, 0]} castShadow>
        <meshPhysicalMaterial
          color="#f6f4ff"
          metalness={0.28}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.06}
          transmission={0.28}
          thickness={1.1}
          ior={1.42}
          emissive="#7c3aed"
          emissiveIntensity={0.22}
          envMapIntensity={1.6}
        />
      </mesh>
      {/* brushed silver / chrome prism */}
      <mesh ref={right} geometry={geo} position={[0.78, 0, 0]} castShadow>
        <meshPhysicalMaterial
          color="#aab0c2"
          metalness={0.98}
          roughness={0.19}
          clearcoat={1}
          clearcoatRoughness={0.12}
          emissive="#5b21b6"
          emissiveIntensity={0.35}
          envMapIntensity={2.1}
        />
      </mesh>
    </group>
  );
}
