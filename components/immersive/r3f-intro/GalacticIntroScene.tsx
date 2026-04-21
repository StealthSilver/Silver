"use client";

import { AdaptiveDpr } from "@react-three/drei";
import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CinematicCamera } from "./CinematicCamera";
import { EnergyCore } from "./EnergyCore";
import { GalaxySpiral } from "./GalaxySpiral";
import { IntroCompleteSignal } from "./IntroCompleteSignal";
import { IntroPostFX } from "./IntroPostFX";
import { Starfield } from "./Starfield";
import { COLORS } from "./intro-constants";

export function GalacticIntroScene({
  onIntroEnd,
}: {
  onIntroEnd?: () => void;
}) {
  const { gl } = useThree();

  useLayoutEffect(() => {
    const prevTM = gl.toneMapping;
    const prevExp = gl.toneMappingExposure;

    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;

    return () => {
      gl.toneMapping = prevTM;
      gl.toneMappingExposure = prevExp;
    };
  }, [gl]);

  return (
    <>
      <AdaptiveDpr />
      <color attach="background" args={[COLORS.void]} />
      <fogExp2 attach="fog" args={[COLORS.fog, 0.048]} />

      <CinematicCamera />
      <IntroCompleteSignal onComplete={onIntroEnd} />

      <ambientLight intensity={0.04} />
      <Starfield />
      <EnergyCore />
      <GalaxySpiral />

      <IntroPostFX />
    </>
  );
}
