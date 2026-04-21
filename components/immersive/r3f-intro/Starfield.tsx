"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "./intro-constants";

const COUNT = 5200;
const SPREAD = 100;
const STAR_VERTEX = /* glsl */ `
precision highp float;
uniform float uTime;
attribute float aPhase;
attribute float aSize;
varying float vOpacity;

void main() {
  vOpacity = 0.42 + 0.38 * sin(uTime * 0.9 + aPhase);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (320.0 / max(-mvPosition.z, 0.1));
  gl_Position = projectionMatrix * mvPosition;
}
`;

const STAR_FRAGMENT = /* glsl */ `
precision highp float;
varying float vOpacity;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = dot(c, c);
  if (d > 0.18) discard;
  float soft = 1.0 - smoothstep(0.12, 0.34, d);
  gl_FragColor = vec4(0.9, 0.93, 1.0, vOpacity * soft);
}
`;

export function Starfield() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  const { geometry, material } = useMemo(() => {
    const rnd = mulberry32(90210);
    const positions = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const u = rnd() * 2 - 1;
      const v = rnd() * 2 - 1;
      const w = rnd() * 2 - 1;
      const len = Math.cbrt(rnd()) * SPREAD / Math.max(Math.hypot(u, v, w), 0.001);
      positions[i * 3] = u * len;
      positions[i * 3 + 1] = v * len;
      positions[i * 3 + 2] = w * len;
      phases[i] = rnd() * Math.PI * 2;
      sizes[i] = 0.45 + rnd() * 0.35;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: STAR_VERTEX,
      fragmentShader: STAR_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geom, material: mat };
  }, [uniforms]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    const p = pointsRef.current;
    if (p) {
      p.rotation.y = state.clock.elapsedTime * 0.012;
    }
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}
