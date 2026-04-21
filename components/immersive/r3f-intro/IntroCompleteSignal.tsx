"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { INTRO_DURATION } from "./intro-constants";

export function IntroCompleteSignal({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const fired = useRef(false);
  const cb = useRef(onComplete);
  useEffect(() => {
    cb.current = onComplete;
  }, [onComplete]);

  useFrame((state) => {
    if (fired.current) return;
    if (state.clock.elapsedTime >= INTRO_DURATION) {
      fired.current = true;
      cb.current?.();
    }
  });

  return null;
}
