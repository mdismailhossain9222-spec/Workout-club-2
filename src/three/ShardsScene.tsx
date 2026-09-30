import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import SceneCanvas from "./SceneCanvas";
import { THREE_CFG } from "@/config/motion";
import { scrollState } from "@/motion/useLenisScroll";

/**
 * Floating angular shards (Packages background).
 * Rotation speed and drift are driven by live Lenis scroll velocity, so the
 * field "reacts" to how fast you're scrolling.
 */
function Shards({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.9);
    s.lineTo(0.55, 0.1);
    s.lineTo(0.22, -0.9);
    s.lineTo(-0.38, -0.5);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.09, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 1 });
  }, []);

  const shards = useMemo(
    () =>
      Array.from({ length: THREE_CFG.shards.count }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * 11,
          (Math.random() - 0.5) * 7,
          -1 - Math.random() * 5,
        ] as [number, number, number],
        rot: [Math.random() * 3, Math.random() * 3, Math.random() * 3] as [number, number, number],
        scale: 0.35 + Math.random() * 0.8,
        speed: 0.12 + Math.random() * 0.3,
        i,
      })),
    []
  );

  useFrame((state, delta) => {
    const vel = Math.min(Math.abs(scrollState.velocity), 60);
    const boost = 1 + vel * (reduced ? 0.4 : 1) * THREE_CFG.shards.scrollReactivity * 30;
    group.current?.children.forEach((c, i) => {
      c.rotation.x += delta * shards[i].speed * boost * 0.5;
      c.rotation.y += delta * shards[i].speed * boost;
      c.position.y = shards[i].pos[1] + Math.sin(state.clock.elapsedTime * 0.4 + i) * 0.35;
    });
    if (group.current) group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.12;
  });

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh key={i} geometry={geo} position={s.pos} rotation={s.rot} scale={s.scale}>
          <meshPhysicalMaterial
            color={i % 3 === 0 ? "#e9e7f5" : "#8b5cf6"}
            metalness={0.9}
            roughness={0.22}
            clearcoat={1}
            emissive="#4c1d95"
            emissiveIntensity={0.55}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ShardsScene({ reduced = false }: { reduced?: boolean }) {
  return (
    <SceneCanvas className="absolute inset-0 pointer-events-none" label="shards">
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 5]} intensity={40} color="#a78bfa" distance={22} />
      <pointLight position={[-4, -2, 3]} intensity={26} color="#ffffff" distance={18} />
      <Shards reduced={reduced} />
    </SceneCanvas>
  );
}
