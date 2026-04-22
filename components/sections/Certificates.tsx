"use client";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Link2, ScrollText, Award } from "lucide-react";
import { CERTIFICATE } from "@/data/certificate.data";

export default function Certificates() {
  return (
    <section id="certificates" className="relative px-4 pb-3">
      <div className="px-1 pb-2 pt-1 sm:pt-1.5">
        <h2
          className={`${GeistSans.className} text-[22px] font-semibold leading-tight tracking-tight text-foreground sm:text-[24px]`}
        >
          Certificates
        </h2>
        <div
          aria-hidden
          className="relative left-1/2 mt-1.5 h-px w-screen max-w-none -translate-x-1/2 bg-line sm:mt-2"
        />
        <div className="mt-2.5 space-y-4 sm:mt-3 sm:space-y-5">
          {CERTIFICATE.map((certificate, index) => (
            <article key={`${certificate.company}-${index}`} className="pt-1">
              <div className="flex items-start gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <a
                      href={certificate.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline gap-3"
                    >
                      <span
                        className="inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground"
                        aria-hidden
                      >
                        <Award className="size-4" strokeWidth={1.7} />
                      </span>
                      <span
                        className={`${GeistSans.className} text-[17px] font-semibold tracking-tight text-foreground underline-offset-2 hover:underline`}
                      >
                        {certificate.company}
                      </span>
                    </a>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-3">
                    <span
                      className="inline-flex size-8 shrink-0 self-start items-center justify-center border border-line bg-muted/40 text-muted-foreground"
                      aria-hidden
                    >
                      <ScrollText className="size-4" strokeWidth={1.7} />
                    </span>
                    <p className={`${GeistMono.className} mt-2 text-[13px] text-muted-foreground`}>
                      Credential
                    </p>
                  </div>
                </div>
                <a
                  href={certificate.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Open certificate"
                >
                  <Link2 className="size-4" />
                </a>
              </div>
              {index < CERTIFICATE.length - 1 ? (
                <div
                  aria-hidden
                  className="relative left-1/2 mt-4 h-px w-screen max-w-none -translate-x-1/2 bg-line"
                />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
