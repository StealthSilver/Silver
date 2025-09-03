"use client";
import React from "react";
import { motion } from "framer-motion";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  lightGradientFirst?: string;
  lightGradientSecond?: string;
  lightGradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
  theme?: "light" | "dark" | "auto";
};

export const Spotlight = ({
  // Dark mode gradients
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 100%, .08) 0, hsla(0, 0%, 70%, .02) 50%, hsla(0, 0%, 40%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .06) 0, hsla(0, 0%, 70%, .02) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .04) 0, hsla(0, 0%, 40%, .02) 80%, transparent 100%)",
  // Light mode gradients
  lightGradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 80%, .12) 0, hsla(0, 0%, 55%, .05) 50%, hsla(0, 0%, 35%, 0) 80%)",
  lightGradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 78%, .10) 0, hsla(0, 0%, 50%, .04) 80%, transparent 100%)",
  lightGradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 75%, .08) 0, hsla(0, 0%, 40%, .03) 80%, transparent 100%)",

  translateY = -250,
  width = 500,
  height = 1200,
  smallWidth = 250,
  duration = 7,
  xOffset = 60,
  theme = "auto",
}: SpotlightProps = {}) => {
  // Detect theme
  const isDark =
    theme === "dark" ||
    (theme === "auto" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const first = isDark ? gradientFirst : lightGradientFirst;
  const second = isDark ? gradientSecond : lightGradientSecond;
  const third = isDark ? gradientThird : lightGradientThird;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden"
    >
      <motion.div
        animate={{ x: [0, xOffset, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-full h-full z-40"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: first,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0"
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: second,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: third,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
      </motion.div>

      <motion.div
        animate={{ x: [0, -xOffset, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-full h-full z-40"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: first,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0"
        />
        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: second,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: third,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
      </motion.div>
    </motion.div>
  );
};
