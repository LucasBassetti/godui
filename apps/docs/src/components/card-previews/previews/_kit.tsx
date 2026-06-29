import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Shared primitives for the unified card-preview skeletons. Every card is built
// from muted gray blocks (`Sk`) plus a single accent highlight (`Ac`) on a
// dotted background (applied by the preview zone), keeping one visual language
// across the whole component index. Callers set shape/size via className.

/** Muted skeleton block. */
export function Sk({ className }: { className?: string }) {
  return <div className={cn("bg-[var(--muted-foreground)]/20", className)} />;
}

/** Accent block — the single highlight color shared by every card. */
export function Ac({ className }: { className?: string }) {
  return <div className={cn("bg-primary", className)} />;
}

/** Framed surface (card / panel / window). */
export function Panel({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      {children}
    </div>
  );
}
