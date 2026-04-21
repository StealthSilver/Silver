"use client";

import dynamic from "next/dynamic";

const CinematicIntroShell = dynamic(
  () => import("./r3f-intro/CinematicIntroShell"),
  { ssr: false },
);

export function CinematicIntroLazy({
  onIntroEnd,
}: {
  onIntroEnd?: () => void;
}) {
  return <CinematicIntroShell onIntroEnd={onIntroEnd} />;
}
