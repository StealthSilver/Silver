"use client";
import { useState } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Image from "next/image";
import { PROJECTS } from "@/data/project.data";

export default function Projects() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const initialVisibleProjects = 5;
  const hasHiddenProjects = PROJECTS.length > initialVisibleProjects;
  const primaryProjects = PROJECTS.slice(0, initialVisibleProjects);
  const extraProjects = PROJECTS.slice(initialVisibleProjects);

  const renderProject = (
    project: (typeof PROJECTS)[number],
    index: number,
    totalProjects: number,
  ) => {
    const liveLink = project.live ?? project.github ?? project.figma;

    return (
      <article key={project.id} className="pt-1">
        <div className="flex items-start gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-3">
              <a href={liveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-3">
                <span
                  className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden border border-line bg-muted/40 text-muted-foreground"
                  aria-hidden
                >
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    width={32}
                    height={32}
                    className="size-full object-cover"
                  />
                </span>
                <span
                  className={`${GeistSans.className} text-[17px] font-semibold tracking-tight text-foreground underline-offset-2 hover:underline`}
                >
                  {project.title}
                </span>
              </a>
            </div>
            <p className={`${GeistMono.className} mt-2 pl-11 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]`}>
              {project.description}
            </p>
          </div>
          {liveLink ? (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${GeistMono.className} inline-flex h-8 shrink-0 items-center justify-center border border-line bg-muted/40 px-3 text-[12px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-[13px]`}
            >
              Live
            </a>
          ) : null}
        </div>
        {index < totalProjects - 1 ? (
          <div
            aria-hidden
            className="relative left-1/2 mt-4 h-px w-screen max-w-none -translate-x-1/2 bg-line"
          />
        ) : null}
      </article>
    );
  };

  return (
    <section id="projects" className="relative px-4 pb-3 ">
      <div className="sm:pt-1.5">
        <h2
          className={`${GeistSans.className} text-[22px] font-semibold leading-tight tracking-tight text-foreground sm:text-[24px]`}
        >
          Projects
          <sup className={`${GeistMono.className} ml-1 align-super text-[12px] text-muted-foreground sm:text-[13px]`}>
            ({PROJECTS.length})
          </sup>
        </h2>
        <div
          aria-hidden
          className="relative left-1/2 mt-1.5 h-px w-screen max-w-none -translate-x-1/2 bg-line sm:mt-2"
        />
        <div className="mt-2.5 space-y-4 sm:mt-3 sm:space-y-5">
          {primaryProjects.map((project, index) => renderProject(project, index, primaryProjects.length))}
          {hasHiddenProjects ? (
            <div
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                showAllProjects ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
              aria-hidden={!showAllProjects}
              inert={!showAllProjects}
            >
              <div className="min-h-0 space-y-4 sm:space-y-5">
                {extraProjects.map((project, index) =>
                  renderProject(project, index, extraProjects.length),
                )}
              </div>
            </div>
          ) : null}
        </div>
        {hasHiddenProjects ? (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllProjects((prev) => !prev)}
              className={`${GeistMono.className} inline-flex items-center border border-line bg-muted/40 px-4 py-2 text-[12px] text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-[13px]`}
            >
              {showAllProjects ? "Show less" : `Show more (${PROJECTS.length - initialVisibleProjects})`}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
