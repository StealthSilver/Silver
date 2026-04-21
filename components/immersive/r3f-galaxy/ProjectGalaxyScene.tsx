"use client";

import { AdaptiveDpr, Environment } from "@react-three/drei";
import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "../r3f-intro/intro-constants";
import { GalaxyAtmosphere } from "./GalaxyAtmosphere";
import { GalaxyCameraRig } from "./GalaxyCameraRig";
import { GalaxyDynamics } from "./GalaxyDynamics";
import { GalaxyPostFX } from "./GalaxyPostFX";
import { GalaxySpiralProjects } from "./GalaxySpiralProjects";

export function ProjectGalaxyScene() {
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
      <fogExp2 attach="fog" args={["#030308", 0.026]} />

      <Environment preset="city" environmentIntensity={0.45} />

      <ambientLight intensity={0.055} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={0.35}
        color="#b8cfff"
      />
      <pointLight
        position={[0, 1.5, 0]}
        intensity={0.65}
        color="#6fa8ff"
        distance={22}
        decay={2}
      />

      <GalaxyCameraRig />

      <GalaxyDynamics>
        <GalaxyAtmosphere />
        <GalaxySpiralProjects />
      </GalaxyDynamics>

      <GalaxyPostFX />
    </>
  );
}
