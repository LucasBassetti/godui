// GodUI Skeleton — mirrors shadcn/ui new-york-v4 components/ui/skeleton.tsx (registry snapshot 2026-10-01).
// Motion: shadcn's animate-pulse (an opacity fade) becomes a soft band that
// sweeps across the block — an ::after layer moved with `translate` only, so
// it composites on the GPU. Reduced motion hides the band and brings the pulse
// back. `relative` is overridable: a call site's `absolute`/`fixed` wins via cn.
import type * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-accent after:pointer-events-none after:absolute after:inset-0 after:-translate-x-full after:bg-linear-to-r after:from-transparent after:via-foreground/[0.06] after:to-transparent after:animate-godui-shimmer motion-reduce:animate-pulse motion-reduce:after:hidden",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
