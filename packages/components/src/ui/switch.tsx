"use client";

// GodUI Switch — mirrors shadcn/ui new-york-v4 components/ui/switch.tsx (registry snapshot 2026-10-01).
// Motion: the thumb slides on a spring (translate); the checked color crossfades on a pseudo-element layer (opacity) instead of repainting the track. GPU-only.

import { Switch as SwitchPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent bg-input shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 dark:bg-input/80",
        "before:pointer-events-none before:absolute before:-inset-px before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity before:duration-(--godui-duration-fast) data-[state=checked]:before:opacity-100",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none relative block rounded-full bg-background ring-0 transition-[translate] duration-(--godui-duration-base) ease-spring-snappy motion-reduce:transition-none group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
