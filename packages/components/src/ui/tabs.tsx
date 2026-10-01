"use client";

// GodUI Tabs — mirrors shadcn/ui new-york-v4 components/ui/tabs.tsx (registry snapshot 2026-10-01).
// Motion: one indicator slides between triggers — its box snaps, then a WAAPI
// FLIP plays translate + scale from the old box on a spring; panels fade in.
// Adds a `tabs-indicator` span inside TabsList. GPU-only.

import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import * as React from "react";
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

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

type Box = { x: number; y: number; w: number; h: number };

/** The active trigger's box inside the list (or shadcn's underline under it). */
function activeBox(list: HTMLElement): Box | null {
  const tab = list.querySelector<HTMLElement>(
    '[role="tab"][data-state="active"]',
  );
  if (!tab) return null;
  const x = tab.offsetLeft;
  const y = tab.offsetTop;
  const w = tab.offsetWidth;
  const h = tab.offsetHeight;
  if (list.dataset.variant !== "line") return { x, y, w, h };
  // shadcn's line variant draws a 2px `after:` bar just outside the trigger's
  // padding box (1px border): 5px below it, or 4px right of it when vertical.
  return list.getAttribute("aria-orientation") === "vertical"
    ? { x: x + w + 1, y: y + 1, w: 2, h: h - 2 }
    : { x: x + 1, y: y + h + 2, w: w - 2, h: 2 };
}

/**
 * Keeps the indicator on the active trigger. Its box snaps (width, height and
 * translate are set directly), then a FLIP plays `translate` + `scale` from
 * the previous box to the new one on the compositor. Watches `data-state`
 * rather than clicks, so controlled value changes move it too. A slide in
 * flight is cancelled and the next one starts from where it is drawn.
 */
function useTabsIndicator(
  listRef: React.RefObject<HTMLDivElement | null>,
  indicatorRef: React.RefObject<HTMLSpanElement | null>,
) {
  useIsoLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const view = list.ownerDocument.defaultView;
    let shown: Box | null = null;
    let running: Animation | null = null;

    const place = (animate: boolean) => {
      const box = activeBox(list);
      if (!box) {
        list.removeAttribute("data-indicator");
        shown = null;
        return;
      }
      let from = shown;
      if (running) {
        const drawn = indicator.getBoundingClientRect();
        const origin = list.getBoundingClientRect();
        if (drawn.width > 0 && drawn.height > 0) {
          from = {
            x: drawn.left - origin.left - list.clientLeft,
            y: drawn.top - origin.top - list.clientTop,
            w: drawn.width,
            h: drawn.height,
          };
        }
        running.cancel();
        running = null;
      }
      indicator.style.width = `${box.w}px`;
      indicator.style.height = `${box.h}px`;
      indicator.style.translate = `${box.x}px ${box.y}px`;
      list.setAttribute("data-indicator", "ready");
      shown = box;

      const moved =
        from != null &&
        (from.x !== box.x ||
          from.y !== box.y ||
          from.w !== box.w ||
          from.h !== box.h);
      if (!animate || !from || !moved || box.w === 0 || box.h === 0) return;
      if (typeof indicator.animate !== "function") return;
      if (view?.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
        return;
      const style = view?.getComputedStyle(indicator);
      const duration =
        Number.parseFloat(
          style?.getPropertyValue("--godui-duration-base") ?? "",
        ) || 260;
      // The indicator carries `ease-spring-snappy`; reuse the curve it resolves to.
      const easing = style?.transitionTimingFunction || "ease-out";
      const animation = indicator.animate(
        [
          {
            translate: `${from.x}px ${from.y}px`,
            scale: `${from.w / box.w} ${from.h / box.h}`,
          },
          { translate: `${box.x}px ${box.y}px`, scale: "1 1" },
        ],
        { duration, easing },
      );
      running = animation;
      animation.onfinish = () => {
        if (running === animation) running = null;
      };
    };

    place(false);
    const mutations = new MutationObserver(() => place(true));
    mutations.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state", "data-variant", "aria-orientation"],
    });
    const resizes =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            if (!running) place(false);
          });
    resizes?.observe(list);
    return () => {
      mutations.disconnect();
      resizes?.disconnect();
      running?.cancel();
    };
  }, [listRef, indicatorRef]);
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
  const setListRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  useTabsIndicator(listRef, indicatorRef);

  return (
    <TabsPrimitive.List
      ref={setListRef}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {/* Hidden until measured, so server/first paint keeps shadcn's styling. */}
      <span
        ref={indicatorRef}
        data-slot="tabs-indicator"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 hidden origin-top-left ease-spring-snappy group-data-[indicator=ready]/tabs-list:block group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:border group-data-[variant=default]/tabs-list:border-transparent group-data-[variant=default]/tabs-list:bg-background group-data-[variant=default]/tabs-list:shadow-sm group-data-[variant=line]/tabs-list:bg-foreground dark:group-data-[variant=default]/tabs-list:border-input dark:group-data-[variant=default]/tabs-list:bg-input/30"
      />
      {children}
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
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
        "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
        "group-data-[indicator=ready]/tabs-list:data-[state=active]:bg-transparent group-data-[indicator=ready]/tabs-list:data-[state=active]:shadow-none group-data-[indicator=ready]/tabs-list:after:hidden dark:group-data-[indicator=ready]/tabs-list:data-[state=active]:border-transparent dark:group-data-[indicator=ready]/tabs-list:data-[state=active]:bg-transparent",
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
