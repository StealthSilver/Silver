"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGalaxyShell } from "./GalaxyShellContext";

export function ScrollBridge() {
  const { scrollRef, scrollSmoothedRef } = useGalaxyShell();

  useFrame((_, dt) => {
    const el = scrollRef.current;
    let target = 0;
    if (el) {
      const max = el.scrollHeight - el.clientHeight;
      target = max > 0 ? el.scrollTop / max : 0;
    }
    const k = 6;
    const a = 1 - Math.exp(-k * Math.min(dt, 0.05));
    scrollSmoothedRef.current = THREE.MathUtils.lerp(
      scrollSmoothedRef.current,
      target,
      a,
    );
  });

  return null;
}
