import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/data/project.data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="border-b border-line px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        ← Back
      </Link>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {project.title}
        </h1>
        <p className="mb-8 text-muted-foreground">{project.description}</p>

        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-lg border border-line bg-muted">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 42rem"
            priority
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {project.live ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              Live
            </a>
          ) : null}
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              GitHub
            </a>
          ) : null}
          {project.figma ? (
            <a
              href={project.figma}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line bg-background px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              Figma
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
