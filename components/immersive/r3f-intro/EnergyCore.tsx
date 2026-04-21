"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PHASE_CORE_END, PHASE_GALAXY_END, smoothstep } from "./intro-constants";

const CORE_HEX = "#1e4976";
const CORE_EMISSIVE = "#2563a8";

export function EnergyCore() {
  const group = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    const mesh = meshRef.current;
    if (!g || !mesh) return;

    const grow = smoothstep(0, PHASE_CORE_END, t);
    const base = THREE.MathUtils.lerp(0.05, 0.25, grow);
    const pulse = Math.sin(t * 3) * 0.02;
    g.scale.setScalar(Math.max(0.001, base + pulse));

    const fadeOut = 1 - smoothstep(PHASE_CORE_END, PHASE_CORE_END + 1.1, t);
    const mat = mesh.material as THREE.MeshStandardMaterial;
    mat.opacity = THREE.MathUtils.clamp(fadeOut, 0, 1);
    mat.transparent = true;

    const light = g.children.find((c) => c instanceof THREE.PointLight) as
      | THREE.PointLight
      | undefined;
    if (light) {
      light.intensity = THREE.MathUtils.lerp(2, 0.2, smoothstep(PHASE_CORE_END, PHASE_GALAXY_END, t));
    }
  });

  return (
    <group ref={group}>
      <pointLight color={CORE_EMISSIVE} intensity={2} distance={6} decay={2} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshStandardMaterial
          color={CORE_HEX}
          emissive={CORE_EMISSIVE}
          emissiveIntensity={3.2}
          roughness={0.28}
          metalness={0.35}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
