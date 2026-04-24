import { GeistMono } from "geist/font/mono";
import type { ProjectTag } from "@/data/project.data";
import { cn } from "@/lib/utils";

type ProjectTagListProps = {
  tags: ProjectTag[];
  className?: string;
};

export function ProjectTagList({ tags, className }: ProjectTagListProps) {
  if (tags.length === 0) return null;

  return (
    <ul
      className={cn(GeistMono.className, "flex flex-wrap gap-2", className)}
      aria-label="Project tags"
    >
      {tags.map((tag) => (
        <li key={tag}>
          <span className="inline-flex border border-line bg-muted/40 px-2 py-0.5 text-[11px] leading-snug text-muted-foreground sm:text-[12px]">
            {tag}
          </span>
        </li>
      ))}
    </ul>
  );
}
