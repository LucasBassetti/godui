"use client";

// GodUI Progress — mirrors shadcn/ui new-york-v4 components/ui/progress.tsx (registry snapshot 2026-10-01).
// Motion: the fill keeps shadcn's inline translateX and glides to each new
// value on the smooth spring — the bar never resizes. With no value it is
// indeterminate: a 40%-wide bar sweeps across the track on a loop. GPU-only.
// Additive fix: `value` is also passed to Radix (shadcn drops it), so
// aria-valuenow and data-state are correct and only a null/undefined value
// reads as indeterminate.

import { Progress as ProgressPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className,
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-[transform] duration-(--godui-duration-slow) ease-spring-smooth motion-reduce:transition-none data-[state=indeterminate]:w-2/5 data-[state=indeterminate]:animate-godui-progress-indeterminate motion-reduce:data-[state=indeterminate]:w-full motion-reduce:data-[state=indeterminate]:transform-none! motion-reduce:data-[state=indeterminate]:animate-pulse"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
