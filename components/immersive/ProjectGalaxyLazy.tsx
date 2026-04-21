"use client";

import dynamic from "next/dynamic";

export const ProjectGalaxyLazy = dynamic(
  () =>
    import("./r3f-galaxy/ProjectGalaxyShell").then((mod) => ({
      default: mod.ProjectGalaxyShell,
    })),
  { ssr: false },
);
