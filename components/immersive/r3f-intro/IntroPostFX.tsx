"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function IntroPostFX() {
  return (
    <EffectComposer multisampling={4} autoClear={false}>
      <Bloom
        intensity={0.95}
        luminanceThreshold={0.48}
        luminanceSmoothing={0.28}
        mipmapBlur={false}
        radius={0.42}
      />
      <Vignette
        blendFunction={BlendFunction.NORMAL}
        eskil={false}
        offset={0.22}
        darkness={0.48}
      />
    </EffectComposer>
  );
}
