import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { THREE_CFG } from "@/config/motion";

/**
 * GLSL violet plasma / noise fog. Simplex-ish value noise with domain warping,
 * rendered on a screen-filling plane far behind the emblem.
 */
const plasmaFrag = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform float uIntensity;
uniform float uScale;
varying vec2 vUv;

vec3 hash3(vec2 p){
  vec3 q = vec3(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)), dot(p, vec2(419.2,371.9)));
  return fract(sin(q)*43758.5453);
}
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float a = hash3(i).x, b = hash3(i+vec2(1.0,0.0)).x;
  float c = hash3(i+vec2(0.0,1.0)).x, d = hash3(i+vec2(1.0,1.0)).x;
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float amp = 0.55;
  for(int i=0;i<5;i++){ v += amp*noise(p); p *= 2.02; amp *= 0.5; }
  return v;
}
void main(){
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uRes.x/uRes.y, 1.0) * uScale;
  float t = uTime;
  // domain warp for the slow flowing fog
  vec2 q = vec2(fbm(p + vec2(0.0, t*0.6)), fbm(p + vec2(5.2, -t*0.45)));
  vec2 r = vec2(fbm(p + 3.0*q + vec2(1.7, 9.2) + t*0.25), fbm(p + 3.0*q + vec2(8.3, 2.8) - t*0.2));
  float f = fbm(p + 2.4*r);

  vec3 deep = vec3(0.023, 0.012, 0.055);
  vec3 violet = vec3(0.35, 0.16, 0.78);
  vec3 glow = vec3(0.68, 0.52, 1.0);

  vec3 col = mix(deep, violet, clamp(f*f*1.9, 0.0, 1.0));
  col = mix(col, glow, clamp(pow(length(r)*0.85, 3.0), 0.0, 0.55));
  // vignette so the emblem reads on top
  float vig = smoothstep(1.15, 0.22, length(uv - 0.5) * 1.6);
  col *= vig * uIntensity + 0.02;
  gl_FragColor = vec4(col, 1.0);
}
`;

const vert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

export function PlasmaFog() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uIntensity: { value: THREE_CFG.plasma.intensity },
      uScale: { value: THREE_CFG.plasma.scale },
    }),
    []
  );

  useFrame((state, delta) => {
    uniforms.uTime.value += delta * THREE_CFG.plasma.speed * 10;
    uniforms.uRes.value.set(state.size.width, state.size.height);
  });

  return (
    <mesh position={[0, 0, -6]} scale={[viewport.width * 3.2, viewport.height * 3.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vert} fragmentShader={plasmaFrag} depthWrite={false} />
    </mesh>
  );
}

/**
 * Perspective light-grid floor with sweeping violet beams (shader, no geometry cost).
 */
const gridFrag = /* glsl */ `
precision highp float;
uniform float uTime;
varying vec2 vUv;

float line(float x, float w){
  float g = abs(fract(x) - 0.5);
  return smoothstep(w, 0.0, g);
}
void main(){
  vec2 uv = vUv;
  float depth = pow(1.0 - uv.y, 2.2);
  float scale = 1.0 / max(depth, 0.02);
  float gx = line(uv.x * 26.0, 0.035 * scale * 0.06 + 0.012);
  float gz = line((1.0/max(1.0-uv.y,0.03)) * 0.8 - uTime * 0.35, 0.03);
  float grid = max(gx, gz);

  // sweeping beams
  float beam = 0.0;
  for(int i=0;i<3;i++){
    float fi = float(i);
    float pos = fract(uTime * 0.13 + fi * 0.33);
    beam += smoothstep(0.16, 0.0, abs(uv.x - pos)) * 0.55;
  }
  float fade = smoothstep(0.0, 0.55, uv.y);
  vec3 col = mix(vec3(0.42,0.22,0.9), vec3(0.78,0.66,1.0), grid);
  float a = (grid * 0.55 + beam * 0.22) * fade;
  gl_FragColor = vec4(col, a);
}
`;

export function GridFloor() {
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, d) => {
    uniforms.uTime.value += d;
  });
  return (
    <mesh rotation={[-Math.PI / 2.06, 0, 0]} position={[0, -2.25, -1.5]}>
      <planeGeometry args={[34, 24, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={gridFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
