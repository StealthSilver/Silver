"use client";

import { Canvas } from "@react-three/fiber";
import { GeistSans } from "geist/font/sans";
import { GalacticIntroScene } from "./GalacticIntroScene";

type Props = {
  onIntroEnd?: () => void;
};

export default function CinematicIntroShell({ onIntroEnd }: Props) {
  return (
    <div className="absolute inset-0 z-[5] bg-[#030711]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.05, far: 260 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <GalacticIntroScene onIntroEnd={onIntroEnd} />
      </Canvas>

      <p className={`intro-tagline ${GeistSans.className}`}>
        Everything starts in chaos
      </p>

      <style jsx>{`
        .intro-tagline {
          pointer-events: none;
          position: absolute;
          bottom: min(22%, 9rem);
          left: 50%;
          z-index: 6;
          width: min(92vw, 28rem);
          transform: translateX(-50%);
          text-align: center;
          font-size: clamp(0.85rem, 2.6vw, 1.05rem);
          font-weight: 500;
          line-height: 1.45;
          letter-spacing: 0.04em;
          color: #ffffff;
          opacity: 0;
          text-shadow:
            0 0 20px rgba(37, 99, 168, 0.4),
            0 0 40px rgba(15, 31, 53, 0.55);
          animation: introTaglineKf 1.6s ease-out 4s forwards;
        }
        @keyframes introTaglineKf {
          from {
            opacity: 0;
            filter: blur(4px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
}
