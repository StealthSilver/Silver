"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export const TextHoverEffect = ({
  text,
  duration,
}: {
  text: string;
  duration?: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
    >
      <defs>
        {/* Animated shimmer gradient */}
        <motion.linearGradient
          id="silverShimmer"
          gradientUnits="userSpaceOnUse"
          x1="-100%"
          y1="0%"
          x2="200%"
          y2="0%"
          animate={{ x1: ["-100%", "0%", "100%"], x2: ["0%", "100%", "200%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <stop offset="0%" stopColor="#a1a1aa" />
          <stop offset="50%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#d4d4d8" />
        </motion.linearGradient>

        {/* Hover mask */}
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="25%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0.3, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.6"
        className="
          fill-white/15 stroke-neutral-400
          font-[helvetica] text-8xl font-extrabold
          dark:stroke-neutral-500
        "
        style={{ opacity: 0.6 }}
      >
        {text}
      </text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#silverShimmer)"
        strokeWidth="0.9"
        className="fill-transparent font-[helvetica] text-8xl font-extrabold"
        mask="url(#textMask)"
        style={{ opacity: 0.9 }}
      >
        {text}
      </text>
    </svg>
  );
};
