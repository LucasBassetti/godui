"use client";

// GodUI Hover Card — mirrors shadcn/ui new-york-v4 components/ui/hover-card.tsx (registry snapshot 2026-10-01).
// Motion: grows from the link (Radix transform-origin) and drifts 4px out of it on a spring; fades (godui-popover-*). GPU-only.

import { HoverCard as HoverCardPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:[--godui-enter-y:-0.25rem] data-[side=left]:[--godui-enter-x:0.25rem] data-[side=right]:[--godui-enter-x:-0.25rem] data-[side=top]:[--godui-enter-y:0.25rem] data-[state=open]:animate-godui-popover-in data-[state=closed]:animate-godui-popover-out",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
