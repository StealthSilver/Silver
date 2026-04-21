"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "../r3f-intro/intro-constants";

const COUNT = 520;

export function GalaxyAtmosphere() {

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const rnd = mulberry32(90210);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.2 + rnd() * 14;
      const theta = rnd() * Math.PI * 2;
      const u = rnd() * 2 - 1;
      const phi = Math.acos(THREE.MathUtils.clamp(u, -1, 1));
      const sinP = Math.sin(phi);
      positions[i * 3] = r * sinP * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.85 - 1.2;
      positions[i * 3 + 2] = r * sinP * Math.sin(theta);
      sizes[i] = 0.012 + rnd() * 0.028;
    }
    return { positions, sizes };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, sizes]);

  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#6a8eb8") },
      },
      vertexShader: `
        attribute float aSize;
        varying float vAlpha;
        void main() {
          vAlpha = 0.35 + aSize * 8.0;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (160.0 * aSize) / (-mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d) * vAlpha;
          gl_FragColor = vec4(uColor, a);
        }
      `,
    });
  }, []);

  const dust = useMemo(() => new THREE.Points(geom, mat), [geom, mat]);

  useFrame((state) => {
    if (mat.uniforms.uTime) {
      mat.uniforms.uTime.value = state.clock.elapsedTime;
    }
    dust.rotation.y = state.clock.elapsedTime * 0.018;
  });

  useLayoutEffect(() => {
    return () => {
      geom.dispose();
      mat.dispose();
    };
  }, [geom, mat]);

  return (
    <>
      <primitive object={dust} />
      <mesh position={[0, -0.4, 0]} renderOrder={0}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#1e4068"
          emissiveIntensity={1.85}
          toneMapped={false}
          transparent
          opacity={0.92}
        />
      </mesh>
    </>
  );
}
