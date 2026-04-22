"use client";

import { motion } from "framer-motion";
import { GeistMono } from "geist/font/mono";

const BORDER_COLOR = "rgba(168, 172, 186, 0.85)";
const CORNER_BG = "#000000";

export default function Loader() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-black"
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-7 px-6">
        {/* Silver wordmark with a sweeping shimmer */}
        <div
          className="relative select-none"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          <span className="relative inline-block text-[44px] font-semibold uppercase leading-none tracking-[0.32em] sm:text-[56px]">
            <span
              aria-hidden
              className="block text-transparent"
              style={{
                WebkitTextStroke: "1px rgba(168, 172, 186, 0.55)",
                color: "transparent",
              }}
            >
              SILVER
            </span>
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent 0%, transparent 30%, #f5f5f5 45%, #ffffff 50%, #f5f5f5 55%, transparent 70%, transparent 100%)",
                backgroundSize: "250% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
              initial={{ backgroundPositionX: "150%" }}
              animate={{ backgroundPositionX: "-150%" }}
              transition={{
                repeat: Infinity,
                duration: 2.4,
                ease: "linear",
              }}
            >
              SILVER
            </motion.span>
          </span>
        </div>

        {/* Bordered progress tile with corner squares (matches immersive UI) */}
        <div className="relative">
          <div
            className="relative h-[6px] w-[240px] overflow-hidden border bg-black sm:w-[300px]"
            style={{ borderColor: BORDER_COLOR }}
          >
            <motion.span
              aria-hidden
              className="absolute top-0 bottom-0 w-1/3"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent 0%, rgba(161, 161, 170, 0.55) 20%, #e4e6ef 50%, rgba(161, 161, 170, 0.55) 80%, transparent 100%)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "400%" }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut",
              }}
            />
          </div>

          {[
            "top-[-3px] left-[-3px]",
            "top-[-3px] right-[-3px]",
            "bottom-[-3px] left-[-3px]",
            "bottom-[-3px] right-[-3px]",
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`absolute ${pos} size-1.5 border`}
              style={{ borderColor: BORDER_COLOR, backgroundColor: CORNER_BG }}
            />
          ))}
        </div>

        {/* LOADING label with animated dots */}
        <div
          className={`${GeistMono.className} flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.42em] text-neutral-400 sm:text-[12px]`}
        >
          <span>Loading</span>
          <span className="inline-flex w-5 justify-start">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="inline-block"
                initial={{ opacity: 0.15 }}
                animate={{ opacity: [0.15, 1, 0.15] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                  delay: i * 0.18,
                }}
              >
                .
              </motion.span>
            ))}
          </span>
        </div>
      </div>

      <span className="sr-only">Loading portfolio</span>
    </div>
  );
}
