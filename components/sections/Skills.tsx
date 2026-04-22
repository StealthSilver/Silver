"use client";

import Image from "next/image";
import { GeistSans } from "geist/font/sans";
import { TECH_STACK } from "../../data/tech.data";

export default function Skills() {
  return (
    <section id="skills" className="relative px-4 pb-3 pt-5 sm:px-6 sm:pt-6">
      <div className="px-1 pb-2 pt-1 sm:pt-1.5">
        <h2
          className={`${GeistSans.className} text-[22px] font-semibold leading-tight tracking-tight text-foreground sm:text-[24px]`}
        >
          Stack
        </h2>
        <div
          aria-hidden
          className="relative left-1/2 mt-1.5 h-px w-screen max-w-none -translate-x-1/2 bg-line sm:mt-2"
        />

        <div className="mt-1.5 grid grid-cols-4 gap-3 sm:mt-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
          {TECH_STACK.map((tech) => (
            <a
              key={tech.key}
              href={tech.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center"
              aria-label={tech.title}
            >
              <span className="pointer-events-none absolute -top-7 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="whitespace-nowrap border border-line bg-background px-2 py-0.5 text-[11px] text-foreground shadow-sm">
                  {tech.title}
                </span>
              </span>
              <span
                className="inline-flex size-10 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground transition-transform duration-200 group-hover:scale-105"
                aria-hidden
              >
                {tech.lightIcon ? (
                  <>
                    <Image
                      src={`/icons/${tech.lightIcon}`}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 object-contain dark:hidden"
                    />
                    <Image
                      src={`/icons/${tech.key}.svg`}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 object-contain hidden dark:block"
                    />
                  </>
                ) : (
                  <Image
                    src={`/icons/${tech.key}.svg`}
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 object-contain"
                  />
                )}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
