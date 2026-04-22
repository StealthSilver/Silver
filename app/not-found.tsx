import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { TextHoverEffect } from "@/components/ui/TextHoverEffect";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div
      className={cn(
        "flex h-[calc(100svh-5.5rem)] flex-col items-center justify-center px-4",
      )}
    >
      <div className="mb-12 w-full max-w-[min(92vw,720px)]">
        <div className="mx-auto aspect-[480/128] w-full">
          <TextHoverEffect text="Silver" duration={0.3} />
        </div>
      </div>

      <h1 className="mb-10 text-9xl font-medium tracking-tighter tabular-nums sm:text-[10rem]">
        404
      </h1>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md border border-line bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
      >
        Go to Home
        <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}
