"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";

const easeDiffuse = [0.22, 1, 0.36, 1] as const;

export default function ImmersiveTransitionOverlay() {
  const {
    sheet,
    onEnterCoverComplete,
    onEnterRevealComplete,
    onExitCoverComplete,
    onExitRevealComplete,
  } = useImmersiveMode();

  const handledRef = useRef(false);

  useEffect(() => {
    handledRef.current = false;
  }, [sheet]);

  const runOnce = (fn: () => void) => {
    if (handledRef.current) return;
    handledRef.current = true;
    fn();
  };

  return (
    <AnimatePresence>
      {sheet === "immersive-enter-cover" && (
        <motion.div
          key="immersive-enter-cover"
          aria-hidden
          className="pointer-events-auto fixed inset-0 z-[200]"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--background) 72%, var(--foreground) 8%)",
          }}
          initial={{ opacity: 0, filter: "blur(0px)" }}
          animate={{
            opacity: 1,
            filter: "blur(32px) saturate(1.2)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.78, ease: easeDiffuse }}
          onAnimationComplete={() =>
            runOnce(onEnterCoverComplete)
          }
        />
      )}

      {sheet === "immersive-enter-reveal" && (
        <motion.div
          key="immersive-enter-reveal"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[200]"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--background) 78%, var(--foreground) 6%)",
          }}
          initial={{ opacity: 1, filter: "blur(28px) saturate(1.15)" }}
          animate={{ opacity: 0, filter: "blur(0px) saturate(1)" }}
          transition={{ duration: 0.65, ease: easeDiffuse }}
          onAnimationComplete={() =>
            runOnce(onEnterRevealComplete)
          }
        />
      )}

      {sheet === "immersive-exit-cover" && (
        <motion.div
          key="immersive-exit-cover"
          aria-hidden
          className="pointer-events-auto fixed inset-0 z-[200]"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--background) 72%, var(--foreground) 8%)",
          }}
          initial={{ opacity: 0, filter: "blur(0px)" }}
          animate={{
            opacity: 1,
            filter: "blur(32px) saturate(1.2)",
          }}
          transition={{ duration: 0.72, ease: easeDiffuse }}
          onAnimationComplete={() =>
            runOnce(onExitCoverComplete)
          }
        />
      )}

      {sheet === "immersive-exit-reveal" && (
        <motion.div
          key="immersive-exit-reveal"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[200]"
          style={{
            backgroundColor:
              "color-mix(in oklab, var(--background) 78%, var(--foreground) 6%)",
          }}
          initial={{ opacity: 1, filter: "blur(28px) saturate(1.15)" }}
          animate={{ opacity: 0, filter: "blur(0px) saturate(1)" }}
          transition={{ duration: 0.65, ease: easeDiffuse }}
          onAnimationComplete={() =>
            runOnce(onExitRevealComplete)
          }
        />
      )}
    </AnimatePresence>
  );
}
