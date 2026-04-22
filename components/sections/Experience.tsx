"use client";

import { useState } from "react";
import Image from "next/image";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ChevronDown, ChevronUp, Code2 } from "lucide-react";
import { EXPERIENCES } from "@/data/experience.data";

const MONTH_MAP: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

function formatDurationMeta(duration: string, location: string) {
  const [rawStart, rawEnd] = duration.split("-").map((part) => part.trim());
  const [startMonthRaw, startYearRaw] = rawStart.split(" ");
  const startMonth = MONTH_MAP[startMonthRaw?.slice(0, 3).toLowerCase()];
  const startYear = Number(startYearRaw);

  const now = new Date();
  const isPresent = rawEnd?.toLowerCase() === "present";
  let endMonth = now.getMonth() + 1;
  let endYear = now.getFullYear();

  if (!isPresent && rawEnd) {
    const [endMonthRaw, endYearRaw] = rawEnd.split(" ");
    endMonth = MONTH_MAP[endMonthRaw?.slice(0, 3).toLowerCase()] ?? endMonth;
    endYear = Number(endYearRaw) || endYear;
  }

  if (!startMonth || !startYear) return `${location} | ${duration}`;

  const totalMonths = Math.max(0, (endYear - startYear) * 12 + (endMonth - startMonth));
  const formattedStart = `${String(startMonth).padStart(2, "0")}.${startYear}`;
  const formattedEnd = isPresent ? "<span class='text-[1.2em] leading-none align-[-0.02em]'>&infin;</span>" : `${String(endMonth).padStart(2, "0")}.${endYear}`;

  return `${location} | ${formattedStart} - ${formattedEnd} | ${totalMonths}m`;
}

export default function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="experience" className="relative px-4 pb-3 ">
      <div className="px-1 pb-2 pt-1 sm:pt-1.5">
        <h2
          className={`${GeistSans.className} max-sm:mt-2 text-[22px] font-semibold leading-tight tracking-tight text-foreground sm:text-[24px]`}
        >
          Experience
        </h2>
        <div
          aria-hidden
          className="relative left-1/2 mt-1.5 h-px w-screen max-w-none -translate-x-1/2 bg-line sm:mt-2"
        />
        <div className="mt-2.5 space-y-4 sm:mt-3 sm:space-y-5">
          {EXPERIENCES.map((experience, index) => (
            <article key={`${experience.company}-${experience.position}-${experience.duration}`} className="pt-1">
              <div className="flex items-start gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <a
                      href={experience.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline gap-3"
                    >
                      <span
                        className="inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground"
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
                      <span className="flex items-center gap-2">
                        <span
                          className={`${GeistSans.className} text-[17px] font-semibold tracking-tight text-foreground underline-offset-2 hover:underline`}
                        >
                          {experience.company}
                        </span>
                        {experience.company === "Eleken" ? (
                          <span className="relative inline-flex size-2" aria-label="Currently working here" title="Currently working here">
                            <span className="absolute inset-0 rounded-full bg-blue-400/80 animate-ping" />
                            <span className="relative inline-flex size-2 rounded-full bg-blue-500 ring-1 ring-blue-300/70" />
                          </span>
                        ) : null}
                      </span>
                    </a>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-3">
                    <span
                      className="inline-flex size-8 shrink-0 self-start items-center justify-center border border-line bg-muted/40 text-muted-foreground"
                      aria-hidden
                    >
                      <Code2 className="size-4" strokeWidth={1.7} />
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full text-left transition-colors hover:bg-muted/60 dark:hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label={openIndex === index ? "Collapse experience details" : "Expand experience details"}
                    >
                      <p className={`${GeistMono.className} mt-2 text-[13px] text-foreground`}>
                        {experience.position}
                      </p>
                      <p className={`${GeistMono.className} mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] leading-none text-muted-foreground sm:text-[13px]`}>
                        <span
                          dangerouslySetInnerHTML={{ __html: formatDurationMeta(experience.duration, experience.location) }}
                        />
                      </p>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={openIndex === index ? "Collapse experience details" : "Expand experience details"}
                >
                  {openIndex === index ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
              </div>
              <div
                className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  openIndex === index ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                }`}
              >
                <ul
                  className={`${GeistMono.className} min-h-0 list-disc space-y-1.5 pl-11 text-[13px] leading-relaxed text-muted-foreground`}
                >
                  {experience.details.map((detail, detailIndex) => (
                    <li key={`${experience.company}-detail-${detailIndex}`} dangerouslySetInnerHTML={{ __html: detail }} />
                  ))}
                </ul>
              </div>
              {experience.company !== "DRDO, Centre for AI & Robotics" ? (
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
