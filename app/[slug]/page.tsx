import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ArrowUpRight, Figma, Github } from "lucide-react";
import { PROJECTS, getProjectBySlug } from "@/data/project.data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <section className="relative px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-6">
      <div className="sm:pt-1.5">
        <Link
          href="/#projects"
          className={`${GeistMono.className} inline-flex items-center gap-1 text-[12px] text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline sm:text-[13px]`}
        >
          Back to projects
        </Link>

        <div
          aria-hidden
          className="relative left-1/2 mt-4 h-px w-screen max-w-none -translate-x-1/2 bg-line"
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <h1 className={`${GeistSans.className} text-[24px] font-semibold leading-tight tracking-tight text-foreground sm:text-[28px]`}>
            {project.title}
          </h1>
          <div className="flex items-center gap-2">
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex size-8 items-center justify-center border border-line bg-muted/40 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={`Open ${project.title} GitHub repository`}
              >
                <Github
                  className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            ) : null}
            {project.figma ? (
              <a
                href={project.figma}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex size-8 items-center justify-center border border-line bg-muted/40 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={`Open ${project.title} Figma file`}
              >
                <Figma
                  className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            ) : null}
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex size-8 items-center justify-center border border-line bg-muted/40 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={`Open ${project.title} live site`}
              >
                <ArrowUpRight
                  className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            ) : null}
          </div>
        </div>

        <div
          aria-hidden
          className="relative left-1/2 mt-2 h-px w-screen max-w-none -translate-x-1/2 bg-line"
        />

        <p className={`${GeistMono.className} mt-4 text-[13px] leading-relaxed text-muted-foreground sm:text-[14px]`}>
          {project.description}
        </p>

        <div className="relative mt-5 aspect-video w-full overflow-hidden border border-line bg-muted/30">
          {project.lightImage ? (
            <>
              <Image
                src={project.lightImage}
                alt={`${project.title} preview`}
                fill
                className="object-cover dark:hidden"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
              <Image
                src={project.image}
                alt={`${project.title} preview`}
                fill
                className="hidden object-cover dark:block"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </>
          ) : (
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          )}
        </div>
        {project.story || project.storyPoints?.length ? (
          <div className="mt-5 space-y-4">
            {project.story ? (
              <p className={`${GeistMono.className} text-[12px] leading-8 text-muted-foreground sm:text-[13px]`}>
                {project.story}
              </p>
            ) : null}
            {project.storyPoints?.length ? (
              <div className="space-y-2">
                <h2 className={`${GeistSans.className} text-[14px] font-semibold text-foreground sm:text-[15px]`}>
                  Case Study Highlights
                </h2>
                <ul className={`${GeistMono.className} list-disc space-y-2 pl-5 text-[12px] leading-7 text-muted-foreground sm:text-[13px]`}>
                  {project.storyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
