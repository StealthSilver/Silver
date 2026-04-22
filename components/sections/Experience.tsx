"use client";

import Image from "next/image";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { EXPERIENCES } from "@/data/experience.data";

export default function Experience() {
  return (
    <section id="experience" className="relative px-4 pb-3 pt-5 sm:px-6 sm:pt-6">
      <div className="px-1 pb-2 pt-1 sm:pt-1.5">
        <h2
          className={`${GeistSans.className} text-[22px] font-semibold leading-tight tracking-tight text-foreground sm:text-[24px]`}
        >
          Experience
        </h2>
        <div
          aria-hidden
          className="relative left-1/2 mt-1.5 h-px w-screen max-w-none -translate-x-1/2 bg-line sm:mt-2"
        />
        <div className="mt-2.5 space-y-4 sm:mt-3 sm:space-y-5">
          {EXPERIENCES.map((experience) => (
            <article key={`${experience.company}-${experience.position}-${experience.duration}`} className="pt-1">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      className="mr-0.5 inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground"
                      aria-hidden
                    >
                      <Image
                        src={experience.logo}
                        alt={`${experience.company} logo`}
                        width={16}
                        height={16}
                        className="size-4 object-contain"
                      />
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={experience.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${GeistSans.className} text-[17px] font-semibold tracking-tight text-foreground underline-offset-2 hover:underline`}
                      >
                        {experience.company}
                      </a>
                      {experience.company === "Eleken" ? (
                        <span
                          className="inline-flex size-2 rounded-full bg-blue-500 animate-pulse"
                          aria-label="Currently working here"
                          title="Currently working here"
                        />
                      ) : null}
                    </div>
                  </div>
                  <p className={`${GeistMono.className} mt-1 text-[13px] text-muted-foreground`}>
                    {experience.position}
                  </p>
                </div>
                <p
                  className={`${GeistMono.className} text-right text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]`}
                >
                  {experience.duration}
                  <br />
                  {experience.location}
                </p>
              </div>
              <ul
                className={`${GeistMono.className} mt-3 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-muted-foreground`}
              >
                {experience.details.map((detail, index) => (
                  <li key={`${experience.company}-detail-${index}`} dangerouslySetInnerHTML={{ __html: detail }} />
                ))}
              </ul>
              <div
                aria-hidden
                className="relative left-1/2 mt-4 h-px w-screen max-w-none -translate-x-1/2 bg-line"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
