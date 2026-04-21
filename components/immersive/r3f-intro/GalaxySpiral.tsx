"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  COLORS,
  PHASE_CORE_END,
  PHASE_GALAXY_END,
  INTRO_DURATION,
  mulberry32,
  smoothstep,
} from "./intro-constants";

const COUNT = 10_000;
const BRANCHES = 4;
const SPIN = 1.25;
const MAX_R = 3;

const GALAXY_VERTEX = /* glsl */ `
precision highp float;
uniform float uReveal;
uniform float uRadialDrift;
uniform float uMaxRadius;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = aColor;
  float radial = length(position.xz) / uMaxRadius;
  vec3 pos = position * (1.0 + uRadialDrift * radial * 0.35);
  vAlpha = uReveal * mix(0.85, 1.0, radial);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  float size = mix(2.8, 5.2, 1.0 - radial);
  gl_PointSize = size * (280.0 / max(-mvPosition.z, 0.15)) * mix(0.2, 1.0, uReveal);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const GALAXY_FRAGMENT = /* glsl */ `
precision highp float;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.48) discard;
  float core = 1.0 - smoothstep(0.28, 0.46, d);
  float a = core * vAlpha;
  gl_FragColor = vec4(vColor, a);
}
`;

function mixColors(
  inner: THREE.Color,
  mid: THREE.Color,
  outer: THREE.Color,
  t: number,
) {
  if (t < 0.35) return inner.clone().lerp(mid, t / 0.35);
  return mid.clone().lerp(outer, (t - 0.35) / 0.65);
}

export function GalaxySpiral() {
  const root = useRef<THREE.Group>(null);
  const driftAcc = useRef(0);
  const uniforms = useMemo(
    () => ({
      uReveal: { value: 0 },
      uRadialDrift: { value: 0 },
      uMaxRadius: { value: MAX_R },
    }),
    [],
  );

  const { geometry, material } = useMemo(() => {
    const rnd = mulberry32(44103);
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const radius = rnd() * MAX_R;
      const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const spinAngle = radius * SPIN;
      const x = Math.cos(branchAngle + spinAngle) * radius;
      const z = Math.sin(branchAngle + spinAngle) * radius;
      const y = (rnd() - 0.5) * 0.3;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const t = radius / MAX_R;
      const c = mixColors(
        COLORS.explosionInner,
        COLORS.explosionMid,
        COLORS.explosionOuter,
        t,
      );
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: GALAXY_VERTEX,
      fragmentShader: GALAXY_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    return { geometry: geom, material: mat };
  }, [uniforms]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const g = root.current;
    if (!g) return;

    const reveal = smoothstep(PHASE_CORE_END + 0.15, PHASE_GALAXY_END - 0.4, t);
    uniforms.uReveal.value = THREE.MathUtils.clamp(reveal, 0, 1);

    if (t >= PHASE_GALAXY_END && t < INTRO_DURATION) {
      driftAcc.current += delta * 0.05;
    }
    const driftEase = smoothstep(PHASE_GALAXY_END, INTRO_DURATION, t);
    uniforms.uRadialDrift.value = THREE.MathUtils.clamp(
      driftAcc.current * 2.2 * driftEase,
      0,
      0.48,
    );

    const rotSpeed =
      t < PHASE_GALAXY_END ? 0.052 : THREE.MathUtils.lerp(0.052, 0.095, (t - PHASE_GALAXY_END) / 3);
    g.rotation.y = t * rotSpeed;

    const exp = t < PHASE_GALAXY_END ? 0 : smoothstep(PHASE_GALAXY_END, INTRO_DURATION, t);
    const scale = THREE.MathUtils.lerp(1, 2.5, exp);
    g.scale.setScalar(scale);
  });

  return (
    <group ref={root} frustumCulled={false}>
      <points geometry={geometry} material={material} />
    </group>
  );
}
