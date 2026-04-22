"use client";

import { useState } from "react";
import Image from "next/image";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { EDUCATION } from "@/data/education.data";

function formatEducationMeta(duration: string, location: string) {
  const [rawStart, rawEnd] = duration.split("-").map((part) => part.trim());
  const startYear = Number(rawStart);
  const endYear = Number(rawEnd);

  if (!Number.isNaN(startYear) && !Number.isNaN(endYear) && endYear >= startYear) {
    return `${location} | ${duration} | ${endYear - startYear}y`;
  }

  return `${location} | ${duration}`;
}

export default function Education() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="education" className="relative px-4 pb-3 ">
      <div className=" sm:pt-1.5">
        <h2
          className={`${GeistSans.className} text-[22px] font-semibold leading-tight tracking-tight text-foreground sm:text-[24px]`}
        >
          Education
        </h2>
        <div
          aria-hidden
          className="relative left-1/2 mt-1.5 h-px w-screen max-w-none -translate-x-1/2 bg-line sm:mt-2"
        />
        <div className="mt-2.5 space-y-4 sm:mt-3 sm:space-y-5">
          {EDUCATION.map((edu, index) => (
            <article key={`${edu.company}-${edu.position}-${edu.duration}`} className="pt-1">
              <div className="flex items-start gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <a
                      href={edu.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline gap-3"
                    >
                      <span
                        className="inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground"
                        aria-hidden
                      >
                        <Image
                          src="/companies/iitm.svg"
                          alt=""
                          width={16}
                          height={16}
                          className="size-4 object-contain rounded-none"
                        />
                      </span>
                      <span
                        className={`${GeistSans.className} text-[17px] font-semibold tracking-tight text-foreground underline-offset-2 hover:underline`}
                      >
                        {edu.company}
                      </span>
                    </a>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-3">
                    <span
                      className="inline-flex size-8 shrink-0 self-start items-center justify-center border border-line bg-muted/40 text-muted-foreground"
                      aria-hidden
                    >
                      <GraduationCap className="size-4" strokeWidth={1.7} />
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full text-left transition-colors hover:bg-muted/60 dark:hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      aria-label={openIndex === index ? "Collapse education details" : "Expand education details"}
                    >
                      <p className={`${GeistMono.className} mt-2 text-[13px] text-foreground`}>{edu.position}</p>
                      <p className={`${GeistMono.className} mt-1 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]`}>
                        {formatEducationMeta(edu.duration, edu.location)}
                      </p>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={openIndex === index ? "Collapse education details" : "Expand education details"}
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
                  {edu.details.map((point, detailIndex) => (
                    <li key={`${edu.company}-detail-${detailIndex}`} dangerouslySetInnerHTML={{ __html: point }} />
                  ))}
                </ul>
              </div>
              {index < EDUCATION.length - 1 ? (
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
