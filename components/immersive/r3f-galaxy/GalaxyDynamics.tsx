"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useGalaxyShell } from "./GalaxyShellContext";

export function GalaxyDynamics({ children }: { children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scrollSmoothedRef } = useGalaxyShell();

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.y = scrollSmoothedRef.current * Math.PI * 2;
  });

  return <group ref={groupRef}>{children}</group>;
}
