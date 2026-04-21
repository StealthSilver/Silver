"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function GalaxyPostFX() {
  return (
    <EffectComposer multisampling={4} autoClear={false}>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.25}
        mipmapBlur
        radius={0.8}
      />
      <Vignette
        blendFunction={BlendFunction.NORMAL}
        eskil={false}
        offset={0.18}
        darkness={0.42}
      />
    </EffectComposer>
  );
}
