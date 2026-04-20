"use client";

import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import Awards from "@/components/sections/Awards";
import Certificates from "@/components/sections/Certificates";
import CTA from "@/components/sections/CTA";
import Separator from "@/components/ui/Separator";
import { cn } from "@/lib/utils";

export default function Home() {
  const { isImmersive } = useImmersiveMode();

  if (isImmersive) {
    return <main>{/* Immersive mode content */}</main>;
  }

  return (
    <>
      <div className={cn("*:[[id]]:scroll-mt-22")}>
        <Hero />
        <Separator />

        <Skills />
        <Separator />

        <Experience />
        <Separator />

        <Education />
        <Separator />

        <Certificates />
        <Separator />

        <Projects />
        <Separator />

        <Awards />
        <Separator />

        <CTA />
        <Separator />
      </div>
    </>
  );
}
