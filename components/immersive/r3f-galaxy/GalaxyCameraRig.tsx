"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useGalaxyShell } from "./GalaxyShellContext";

const tmpFrom = new THREE.Vector3();
const tmpTo = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

export function GalaxyCameraRig() {
  const { camera, size } = useThree();
  const { scrollSmoothedRef } = useGalaxyShell();
  const enterRef = useRef(0);
  const phaseRef = useRef(0);

  const isNarrow = size.width < 640;

  const fromPos = useMemo(() => new THREE.Vector3(0, 0.12, 5.55), []);
  const floatPhase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state, dt) => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    phaseRef.current += dt;
    const enterTarget = Math.min(1, state.clock.elapsedTime / 2.35);
    enterRef.current += (enterTarget - enterRef.current) * (1 - Math.exp(-4 * dt));

    const scroll = scrollSmoothedRef.current;
    const restZ = isNarrow ? 10.4 : 8;
    const restY = THREE.MathUtils.lerp(1, -3, scroll);

    tmpTo.set(0, restY, restZ);
    tmpFrom.copy(fromPos);
    camera.position.lerpVectors(tmpFrom, tmpTo, THREE.MathUtils.smoothstep(enterRef.current, 0, 1));

    const t = phaseRef.current;
    camera.position.x += Math.sin(t * 0.31 + floatPhase) * 0.04;
    camera.position.y += Math.cos(t * 0.27 + floatPhase) * 0.03;
    camera.position.z += Math.sin(t * 0.19) * 0.025;

    tmpLook.set(
      0,
      THREE.MathUtils.lerp(0, -0.6, scroll),
      0,
    );
    camera.lookAt(tmpLook);
  });

  return null;
}
