"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-interactive-logotype";

function Separator({ className }: { className?: string }) {
  return <div className={cn("flex h-11 w-px bg-line", className)} />;
}

export function SiteFooter() {
  const { isImmersive } = useImmersiveMode();

  if (isImmersive) {
    return null;
  }

  return (
    <footer className="max-w-screen overflow-x-hidden px-2">
      <div className="mx-auto md:max-w-3xl">
        <div
          className="screen-line-top relative border-x pt-4"
          style={{ borderColor: "var(--line)" }}
        >
          
          <p className="mb-4 px-4 text-center font-mono text-sm text-balance text-muted-foreground">
            Built by{" "}
            <a
              className="font-medium hover:underline"
              href="https://www.linkedin.com/in/rajat-saraswat-0491a3259/"
              target="_blank"
              rel="noopener"
            >
              Rajat Saraswat
            </a>
            . Check out the source code on{" "}
            <a
              className="font-medium hover:underline"
              href="https://github.com/StealthSilver"
              target="_blank"
              rel="noopener"
            >
              GitHub
            </a>
            .
          </p>

          <div className="screen-line-top screen-line-bottom relative flex w-full before:z-1 after:z-1">
            <div
              className="mx-auto flex items-center justify-center gap-3 border-x bg-background px-4"
              style={{ borderColor: "var(--line)" }}
            >
              <a
                className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
                href="https://x.com/Rajat_0409"
                target="_blank"
                rel="noopener"
                aria-label="X"
              >
                <FaXTwitter className="size-4" />
              </a>

              <Separator />

              <a
                className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
                href="https://github.com/StealthSilver?utm_source=silver.com"
                target="_blank"
                rel="noopener"
                aria-label="GitHub"
              >
                <Github className="size-4" />
              </a>

              <Separator />

              <a
                className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
                href="https://www.linkedin.com/in/rajat-saraswat-0491a3259/?utm_source=silver.com"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-4" />
              </a>

              <Separator />

              <a
                className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
                href="mailto:rajat.saraswat.work@gmail.com"
                aria-label="Email"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          <div className="*:absolute *:z-2 *:flex *:size-2 *:border *:bg-background">
            <div
              className="bottom-[-3.5px] left-[-4.5px]"
              style={{ borderColor: "var(--line)" }}
            />
            <div
              className="right-[-4.5px] bottom-[-3.5px]"
              style={{ borderColor: "var(--line)" }}
            />
          </div>
        </div>

        <div className="pb-[env(safe-area-inset-bottom,0px)]">
          <SiteFooterInteractiveLogotype />
          <div className="flex h-8 sm:h-2" />
        </div>
      </div>
    </footer>
  );
}
