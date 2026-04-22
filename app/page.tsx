"use client";

import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";
import ImmersiveZone from "@/components/immersive/ImmersiveZone";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import Certificates from "@/components/sections/Certificates";
import Separator from "@/components/ui/Separator";
import { cn } from "@/lib/utils";

export default function Home() {
  const { isImmersive } = useImmersiveMode();

  return (
    <>
      {!isImmersive && (
        <div className={cn("*:[[id]]:scroll-mt-22")}>
          <Hero />
          <About />
          <Separator />

          <Experience />
          <Separator />

          <Skills />
          <Separator />

          <Projects />
          <Separator />

          <Education />
          <Separator />

          <Certificates />
          <Separator />
        </div>
      )}

      {isImmersive && <ImmersiveZone />}
    </>
  );
}
