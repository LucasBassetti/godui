"use client";

// GodUI Accordion — mirrors shadcn/ui new-york-v4 components/ui/accordion.tsx (registry snapshot 2026-10-01).
// Motion: a height animation, faked on the compositor. A panel's height snaps;
// its box (overflow-hidden) slides down from under the trigger while its
// content slides up by the same amount, so the text stays put and only the
// clip edge sweeps down. The items below glide with that edge (FLIP) on the
// same spring and clock, so edge and next row never part. On close the panel
// leaves the flow at once (absolute) and the edge sweeps back up while the
// rows rise. Every piece starts from where it's drawn, so reversing mid-way
// never jumps. If a parent centers the accordion, its own box glides to its
// new spot too, so nothing above the panel jumps (a nested one only by how
// far it moved relative to the outer one). The engine is `useReveal`, shared
// with Collapsible. Chevron rotates via
// `transform` (Chrome won't composite the individual `rotate` property on an
// <svg>). GPU-only.

import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import * as React from "react";
import { useFlipGroup } from "@/hooks/use-flip-group";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { type RevealTiming, sweepPanel, useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * The panel's content blocks: its element children when it has no loose text,
 * else the content itself.
 */
function blocksOf(content: HTMLElement): HTMLElement[] {
  const loose = [...content.childNodes].some(
    (node) => node.nodeType === 3 && node.textContent?.trim(),
  );
  const children = [...content.children] as HTMLElement[];
  return loose || children.length === 0 ? [content] : children;
}

/**
 * Sweep the clip edge of the root's own panels that changed: the box (the
 * panel) slides by its height while its content slides back, so the text
 * holds still.
 */
function sweepItems(
  root: HTMLElement | null,
  changed: Map<HTMLElement, boolean>,
  t: RevealTiming,
) {
  for (const [item, open] of changed) {
    if (item.parentElement !== root) continue;
    const panel = item.querySelector<HTMLElement>(
      ':scope > [data-slot="accordion-content"]',
    );
    const content = panel?.firstElementChild as HTMLElement | null;
    if (!panel || !content) continue;
    sweepPanel(
      {
        box: panel,
        layers: [content],
        blocks: blocksOf(content),
        open,
        distance: panel.offsetHeight,
      },
      t,
    );
  }
}

function Accordion({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [move, flip] = React.useReducer(
    (
      state: { version: number; ms?: number; ease?: string },
      next: { ms: number; ease: string },
    ) => ({ version: state.version + 1, ...next }),
    { version: 0 },
  );
  // Rows whose position changed play an inverse translate back to rest, on
  // the same clock as the panels' edges.
  useFlipGroup(rootRef, move.version, {
    selector: ':scope > [data-slot="accordion-item"]',
    duration: move.ms,
    easing: move.ease,
  });
  // Any open state below the root (nested Accordions and Collapsibles too)
  // FLIPs the rows in the click's task, before the snapped layout is painted,
  // and sweeps this root's own changed panels on the same clock.
  useReveal(rootRef, {
    flip,
    sweep: (changed, t) => sweepItems(rootRef.current, changed, t),
  });
  const setRootRef = useMergedRef(rootRef, ref);

  return (
    <AccordionPrimitive.Root
      ref={setRootRef}
      data-slot="accordion"
      // Rows and clip edges share this spring (read by useFlipGroup and the
      // panel sweep).
      className={cn("ease-spring-smooth", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      // shadcn draws dividers as border-b last:border-b-0; drawn as the next
      // item's border-t, the line rides with that row while it glides.
      // `relative` anchors a closing panel once it leaves the flow.
      className={cn("relative border-t first:border-t-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:[transform:rotate(180deg)]",
          className,
        )}
        {...props}
      >
        {children}
        {/* Turns on the panel's clock: base opening, fast closing. */}
        <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-[transform] duration-(--godui-duration-base) ease-spring-smooth motion-reduce:transition-none [[data-state=closed]>&]:duration-(--godui-duration-fast)" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      // While closing, the panel leaves the flow (so the rows below rise at
      // once) and a no-op hold keyframe keeps Radix from unmounting it until
      // its edge has swept up. The box ignores the pointer: mid-sweep it
      // overlaps the trigger; its content takes events back.
      className="pointer-events-none overflow-hidden text-sm data-[state=closed]:absolute data-[state=closed]:inset-x-0 data-[state=closed]:animate-godui-reveal-hold"
      {...props}
    >
      <div className={cn("pointer-events-auto pt-0 pb-4", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
