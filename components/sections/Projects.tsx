"use client";
import { useEffect, useState } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ArrowUpRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { PROJECTS } from "@/data/project.data";

export default function Projects() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const initialVisibleProjects = 5;
  const hasHiddenProjects = PROJECTS.length > initialVisibleProjects;
  const primaryProjects = PROJECTS.slice(0, initialVisibleProjects);
  const extraProjects = PROJECTS.slice(initialVisibleProjects);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderProject = (
    project: (typeof PROJECTS)[number],
    index: number,
    totalProjects: number,
  ) => {
    const liveLink = project.live ?? project.github ?? project.figma;
    const projectLogo = mounted
      ? resolvedTheme === "dark"
        ? (project.darkLogo ?? project.logo)
        : (project.lightLogo ?? project.logo)
      : project.logo;

    return (
      <article key={project.id} className="w-full pt-1">
        <div className="flex w-full min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <a href={liveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5">
                <span
                  className="inline-flex size-7 shrink-0 items-center justify-center overflow-hidden border border-line bg-background text-muted-foreground"
                  aria-hidden
                >
                  <Image
                    src={projectLogo}
                    alt={`${project.title} logo`}
                    width={20}
                    height={20}
                    className="size-5 object-contain opacity-90"
                  />
                </span>
                <span
                  className={`${GeistSans.className} text-[17px] font-semibold tracking-tight text-foreground underline-offset-2 hover:underline`}
                >
                  {project.title}
                </span>
              </a>
            </div>
            <p className={`${GeistMono.className} mt-2 pl-10 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]`}>
              {project.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/${project.slug}`}
              className="group inline-flex size-8 items-center justify-center border border-line bg-muted/40 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={`Read more about ${project.title}`}
            >
              <FileText
                className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            {liveLink ? (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex size-8 items-center justify-center border border-line bg-muted/40 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Open ${project.title} live link in new tab`}
              >
                <ArrowUpRight
                  className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            ) : null}
          </div>
        </div>
        {index < totalProjects - 1 ? (
          <div aria-hidden className="relative mt-4 h-px w-full">
            <div className="absolute left-1/2 h-px w-screen -translate-x-1/2 bg-line" />
          </div>
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
              className={`grid w-full transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                showAllProjects ? "grid-rows-[1fr] overflow-visible opacity-100" : "grid-rows-[0fr] overflow-hidden opacity-0"
              }`}
              aria-hidden={!showAllProjects}
              inert={!showAllProjects}
            >
              <div className="relative min-h-0 w-full">
                <div
                  aria-hidden
                  className={`pointer-events-none absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-line transition-opacity duration-300 ${
                    showAllProjects ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div className="space-y-4 pt-4 sm:space-y-5 sm:pt-5">
                  {extraProjects.map((project, index) =>
                    renderProject(project, index, extraProjects.length),
                  )}
                </div>
              </div>
            </div>
          ) : null}
          <div aria-hidden className="relative h-px w-full">
            <div className="absolute left-1/2 h-px w-screen -translate-x-1/2 bg-line" />
          </div>
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
