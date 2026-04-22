"use client";

import { GeistMono } from "geist/font/mono";
import { ArrowUpRight, GitCommitHorizontal } from "lucide-react";

type ContributionsData = {
  username: string;
  chartUrl: string;
  alt: string;
};

type GitHubContributionsProps = {
  contributions: ContributionsData;
  githubProfileUrl: string;
};

export function GitHubContributionsFallback() {
  return (
    <div className="border border-line bg-background p-3 sm:p-4" aria-hidden>
      <div className="mb-3 h-4 w-36 animate-pulse bg-muted/50" />
      <div className="h-28 w-full animate-pulse border border-line bg-muted/30 sm:h-32" />
    </div>
  );
}

export function GitHubContributions({ contributions, githubProfileUrl }: GitHubContributionsProps) {
  return (
    <a
      href={githubProfileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-line bg-background p-3 transition-colors hover:bg-muted/15 sm:p-4"
    >
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="inline-flex size-8 shrink-0 items-center justify-center border border-line bg-muted/40 text-muted-foreground"
            aria-hidden
          >
            <GitCommitHorizontal className="size-4" strokeWidth={1.7} />
          </span>
          <div className="min-w-0">
            <p className={`${GeistMono.className} text-[13px] text-foreground sm:text-[14px]`}>GitHub Commits</p>
            <p className={`${GeistMono.className} truncate text-[12px] text-muted-foreground`}>
              @{contributions.username}
            </p>
          </div>
        </div>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden
        />
      </div>

      <div className="overflow-hidden border border-line bg-muted/25 p-2 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--line)_35%,transparent)]">
        <img
          src={contributions.chartUrl}
          alt={contributions.alt}
          className="h-auto w-full object-cover grayscale contrast-[1.3] brightness-[0.72] saturate-0 dark:brightness-[0.52] dark:contrast-[1.45]"
          loading="lazy"
        />
      </div>
    </a>
  );
}
