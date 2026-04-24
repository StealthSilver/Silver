"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ArrowUpRight, Check, ChevronDown, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { PROJECTS, PROJECT_TAGS, type ProjectTag } from "@/data/project.data";

export default function Projects() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const sortPanelRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const initialVisibleProjects = 5;

  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) return PROJECTS;
    return PROJECTS.filter((p) => p.tags.some((t) => selectedTags.includes(t)));
  }, [selectedTags]);

  const hasHiddenProjects = filteredProjects.length > initialVisibleProjects;
  const primaryProjects = filteredProjects.slice(0, initialVisibleProjects);
  const extraProjects = filteredProjects.slice(initialVisibleProjects);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setShowAllProjects(false);
  }, [selectedTags]);

  useEffect(() => {
    if (!sortOpen) return;
    function handlePointerDown(e: MouseEvent | PointerEvent) {
      if (!sortPanelRef.current?.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [sortOpen]);

  function toggleTag(tag: ProjectTag) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function selectAll() {
    setSelectedTags([]);
  }

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

  const isAllSelected = selectedTags.length === 0;
  const sortLabel =
    selectedTags.length === 0 ? "Sort" : `Sort (${selectedTags.length})`;

  return (
    <section id="projects" className="relative px-4 pb-3 ">
      <div className="sm:pt-1.5">
        <div className="flex flex-wrap items-start justify-between gap-3 max-sm:mt-2">
          <h2
            className={`${GeistSans.className} text-[22px] font-semibold leading-tight tracking-tight text-foreground sm:text-[24px]`}
          >
            Projects
            <sup className={`${GeistMono.className} ml-1 align-super text-[12px] text-muted-foreground sm:text-[13px]`}>
              ({filteredProjects.length})
            </sup>
          </h2>
          <div className="relative shrink-0" ref={sortPanelRef}>
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              className={`${GeistMono.className} inline-flex items-center gap-1.5 border border-line bg-muted/40 px-3 py-1.5 text-[12px] text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-[13px]`}
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
              aria-label="Filter projects by category"
            >
              {sortLabel}
              <ChevronDown
                className={`size-3.5 shrink-0 transition-transform duration-200 ease-out ${sortOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            <AnimatePresence>
              {sortOpen ? (
                <motion.div
                  role="listbox"
                  aria-multiselectable="true"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 z-20 mt-1.5 min-w-[11.5rem] origin-top-right border border-line bg-background py-1 shadow-md"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={isAllSelected}
                    onClick={() => selectAll()}
                    className={`${GeistMono.className} flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-foreground hover:bg-muted/50 sm:text-[13px]`}
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center border border-line bg-muted/30">
                      {isAllSelected ? <Check className="size-3" strokeWidth={2.5} aria-hidden /> : null}
                    </span>
                    All
                  </button>
                  <div aria-hidden className="mx-2 my-1 h-px bg-line" />
                  {PROJECT_TAGS.map((tag) => {
                    const checked = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        role="option"
                        aria-selected={checked}
                        onClick={() => toggleTag(tag)}
                        className={`${GeistMono.className} flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-foreground hover:bg-muted/50 sm:text-[13px]`}
                      >
                        <span className="flex size-4 shrink-0 items-center justify-center border border-line bg-muted/30">
                          {checked ? <Check className="size-3" strokeWidth={2.5} aria-hidden /> : null}
                        </span>
                        {tag}
                      </button>
                    );
                  })}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div
          aria-hidden
          className="relative left-1/2 mt-1.5 h-px w-screen max-w-none -translate-x-1/2 bg-line sm:mt-2"
        />
        <div className="mt-2.5 space-y-4 sm:mt-3 sm:space-y-5">
          {filteredProjects.length === 0 ? (
            <p className={`${GeistMono.className} text-[12px] text-muted-foreground sm:text-[13px]`}>
              No projects match the selected filters.
            </p>
          ) : (
            <>
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
            </>
          )}
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
              {showAllProjects ? "Show less" : `Show more (${filteredProjects.length - initialVisibleProjects})`}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
