import { cn } from "@/lib/utils";

function Separator({ className }: { className?: string }) {
  return (
    <div className="relative w-full">
      {/* Top full-width line */}
      <div className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 bg-line" />

      {/* Separator */}
      <div
        className={cn(
          "relative flex h-8 w-full border-x border-line mt-4 pt-[1px] pb-20",
          "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56",
          className,
        )}
      />

      {/* Bottom full-width line with 2px gap */}
      <div className="absolute left-1/2 h-px w-screen -translate-x-1/2 bg-line" />
    </div>
  );
}

export default Separator;
export { Separator };
