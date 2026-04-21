"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PHASE_GALAXY_END, INTRO_DURATION } from "./intro-constants";

const tmpShake = new THREE.Vector2();

export function CinematicCamera() {
  const { camera } = useThree();

  useFrame((state) => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const t = state.clock.elapsedTime;

    const zBase = THREE.MathUtils.lerp(8, 5, THREE.MathUtils.clamp(t / INTRO_DURATION, 0, 1));
    let x = Math.sin(t * 0.2) * 0.1;
    let y = Math.cos(t * 0.15) * 0.1;
    let z = zBase;

    if (t >= PHASE_GALAXY_END) {
      const u = THREE.MathUtils.clamp((t - PHASE_GALAXY_END) / (INTRO_DURATION - PHASE_GALAXY_END), 0, 1);
      z = THREE.MathUtils.lerp(zBase, 4.35, u * u);
      tmpShake.set(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
      );
      x += tmpShake.x;
      y += tmpShake.y;
    }

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
