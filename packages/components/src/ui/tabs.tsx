"use client";

// GodUI Tabs — mirrors shadcn/ui new-york-v4 components/ui/tabs.tsx (registry snapshot 2026-10-01).
// Motion: one indicator slides between triggers — its box snaps, then a WAAPI
// FLIP plays translate + scale from the old box on a spring; panels fade in.
// Adds a `tabs-indicator` span inside TabsList. GPU-only.

import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";
import {
  type IndicatorBox,
  useActiveIndicator,
} from "@/hooks/use-active-indicator";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { cn } from "@/lib/utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * The indicator's box: the active trigger's, or shadcn's line-variant
 * underline. That's a 2px `after:` bar just outside the trigger's padding box
 * (1px border): 5px below it, or 4px right of it when vertical.
 */
function indicatorBox(tab: HTMLElement, list: HTMLElement): IndicatorBox {
  const x = tab.offsetLeft;
  const y = tab.offsetTop;
  const w = tab.offsetWidth;
  const h = tab.offsetHeight;
  if (list.dataset.variant !== "line") return { x, y, w, h };
  return list.getAttribute("aria-orientation") === "vertical"
    ? { x: x + w + 1, y: y + 1, w: 2, h: h - 2 }
    : { x: x + 1, y: y + h + 2, w: w - 2, h: 2 };
}

function TabsList({
  className,
  variant = "default",
  ref,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const setListRef = useMergedRef(listRef, ref);
  // One indicator follows the active trigger: its box snaps, then a FLIP
  // plays translate + scale from the old box. Controlled values, inserted
  // triggers and resizes are covered (see useActiveIndicator).
  useActiveIndicator(listRef, indicatorRef, {
    active: '[role="tab"][data-state="active"]',
    items: '[role="tab"]',
    attributes: ["data-state", "data-variant", "aria-orientation"],
    box: indicatorBox,
  });

  return (
    <TabsPrimitive.List
      ref={setListRef}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {/* Hidden until measured, so server/first paint keeps shadcn's styling.
          Skipped with asChild: Slot needs a single child (shadcn styling stays). */}
      {props.asChild ? (
        children
      ) : (
        <>
          <span
            ref={indicatorRef}
            data-slot="tabs-indicator"
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 hidden origin-top-left ease-spring-snappy group-data-[indicator=ready]/tabs-list:block group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:bg-background group-data-[variant=default]/tabs-list:shadow-sm group-data-[variant=line]/tabs-list:bg-foreground dark:group-data-[variant=default]/tabs-list:border-input dark:group-data-[variant=default]/tabs-list:bg-input/30"
          />
          {children}
        </>
      )}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:group-not-data-[indicator=ready]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        // shadcn's active chrome, kept only until the indicator is measured
        // (server render / first paint). Afterwards the indicator draws it;
        // a call site's own data-[state=active]:bg-* still applies on top.
        "group-data-[variant=default]/tabs-list:group-not-data-[indicator=ready]/tabs-list:data-[state=active]:bg-background data-[state=active]:text-foreground dark:group-data-[variant=default]/tabs-list:group-not-data-[indicator=ready]/tabs-list:data-[state=active]:border-input dark:group-data-[variant=default]/tabs-list:group-not-data-[indicator=ready]/tabs-list:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
        "group-data-[indicator=ready]/tabs-list:after:hidden",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none data-[state=active]:animate-godui-fade-in",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
