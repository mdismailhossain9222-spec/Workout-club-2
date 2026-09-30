import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import SceneCanvas from "./SceneCanvas";
import { GALLERY } from "@/config/content";

/**
 * 3D TILTED GALLERY CAROUSEL.
 * Panels sit on a circle, the whole ring is tilted; drag (or the arrow keys /
 * auto-drift) spins it. Each panel is an angular shard-shaped plane.
 */
function Ring({ target }: { target: { v: number } }) {
  const ring = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const radius = 4.6;

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.15, -1.5);
    s.lineTo(1.15, -1.32);
    s.lineTo(1.15, 1.5);
    s.lineTo(-1.15, 1.32);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);

  useFrame((state, delta) => {
    if (!ring.current) return;
    target.v += delta * 0.12;
    ring.current.rotation.y += (target.v - ring.current.rotation.y) * Math.min(1, delta * 3.2);
    ring.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.05;
  });

  return (
    <group ref={ring} rotation={[0.16, 0, -0.1]}>
      {GALLERY.map((g, i) => {
        const a = (i / GALLERY.length) * Math.PI * 2;
        const x = Math.sin(a) * radius;
        const z = Math.cos(a) * radius;
        return (
          <group key={g.id} position={[x, 0, z]} rotation={[0, a, 0]}>
            <mesh
              geometry={shape}
              onPointerOver={() => setHovered(i)}
              onPointerOut={() => setHovered(null)}
              scale={hovered === i ? 1.07 : 1}
            >
              <meshBasicMaterial
                color={new THREE.Color(`hsl(${g.hue}, ${hovered === i ? 70 : 48}%, ${hovered === i ? 48 : 26}%)`)}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh geometry={shape} scale={1.035} position={[0, 0, -0.02]}>
              <meshBasicMaterial color="#cbd5e1" side={THREE.DoubleSide} transparent opacity={0.28} />
            </mesh>
            <Html center distanceFactor={9} position={[0, 0, 0.05]} pointerEvents="none">
              <div className="w-[190px] text-center select-none">
                <div className="font-[Syncopate] text-[13px] tracking-[0.2em] text-white">{g.title.toUpperCase()}</div>
                <div className="mt-1 text-[10px] tracking-[0.3em] text-violet-200/80">{g.branch.toUpperCase()}</div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function GalleryScene() {
  const target = useRef({ v: 0 });
  return (
    <div
      className="absolute inset-0"
      onPointerDown={(e) => {
        const startX = e.clientX;
        const start = target.current.v;
        const move = (ev: PointerEvent) => {
          target.current.v = start + (ev.clientX - startX) * 0.006;
        };
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
    >
      <SceneCanvas className="absolute inset-0" label="gallery" cameraPosition={[0, 0.4, 8.6]} fov={45}>
        <ambientLight intensity={1.1} />
        <pointLight position={[0, 3, 6]} intensity={50} color="#a78bfa" distance={26} />
        <Ring target={target.current} />
      </SceneCanvas>
    </div>
  );
}
