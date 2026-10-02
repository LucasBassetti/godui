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
// new spot too, so nothing above the panel jumps. Chevron rotates via
// `transform` (Chrome won't composite the individual `rotate` property on an
// <svg>). GPU-only.

import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import * as React from "react";
import { flushSync } from "react-dom";
import { useFlipGroup } from "@/hooks/use-flip-group";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { cn } from "@/lib/utils";

/** Running panel animations (edge, content, fades), cancelled together. */
const SLIDES = new WeakMap<Element, Animation[]>();

/** The element's current vertical `translate` in px (0 when unset). */
function drawnY(el: Element): number {
  const value = el.ownerDocument.defaultView?.getComputedStyle(el).translate;
  if (!value || value === "none") return 0;
  return Number.parseFloat(value.trim().split(/\s+/)[1] ?? "0") || 0;
}

/** A CSS time (`260ms`, `0.3s`) in milliseconds; `fallback` when unset. */
function toMs(value: string | undefined, fallback: number): number {
  const n = Number.parseFloat(value ?? "");
  if (!Number.isFinite(n)) return fallback;
  return /\ds\s*$/.test(value ?? "") ? n * 1000 : n;
}

/**
 * The panel's content blocks: its element children when it has no loose text
 * (capped at 4 — later ones share the 4th's beat), else the content itself.
 */
function blocksOf(content: HTMLElement): HTMLElement[] {
  const loose = [...content.childNodes].some(
    (node) => node.nodeType === 3 && node.textContent?.trim(),
  );
  const children = [...content.children] as HTMLElement[];
  return loose || children.length === 0 ? [content] : children;
}

/** Running slides of an accordion root that moved in its parent's layout. */
const ROOT_SLIDES = new WeakMap<Element, Animation>();

/** `length + offset px`, folded to a plain px value when possible. */
function plus(length: string, offset: number): string {
  const px = /^(-?[\d.]+)px$/.exec(length);
  if (px) return `${Number(px[1]) + offset}px`;
  return `calc(${length} + ${offset}px)`;
}

/**
 * The accordion's own box can move when it grows: a parent that centers it
 * (a flex/grid stage, a dialog) shifts it by half the new height in one step.
 * Glide it from where it was drawn at the click (`from`) back to rest, on the
 * panels' clock, so the rows above the panel don't jump either.
 */
function glideRoot(root: HTMLElement, from: DOMRect, t: PanelTiming) {
  ROOT_SLIDES.get(root)?.cancel();
  ROOT_SLIDES.delete(root);
  if (t.reduce || typeof root.animate !== "function") return;
  const now = root.getBoundingClientRect();
  const dx = from.left - now.left;
  const dy = from.top - now.top;
  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
  const own = root.ownerDocument.defaultView?.getComputedStyle(root).translate;
  const [x = "0px", y = "0px"] =
    own && own !== "none" ? own.trim().split(/\s+/) : [];
  const animation = root.animate(
    [
      { translate: `${plus(x, dx)} ${plus(y, dy)}` },
      { translate: `${x} ${y}` },
    ],
    { duration: t.ms, easing: t.ease },
  );
  ROOT_SLIDES.set(root, animation);
  animation.onfinish = () => {
    if (ROOT_SLIDES.get(root) === animation) ROOT_SLIDES.delete(root);
  };
}

interface PanelTiming {
  ms: number;
  /** The rows' spring, shared by the edge. */
  ease: string;
  /** The fades' curve (`--ease-out-expo`). */
  fade: string;
  stagger: number;
  reduce: boolean;
}

/**
 * Sweep a panel's clip edge: the box moves `from → to` and its content the
 * opposite way, so the text holds still on screen while the edge travels.
 * Opening, the content's blocks fade in a beat apart; closing, the body fades
 * out ahead of the edge. Reduced motion: no movement, only the fades.
 */
function slidePanel(panel: HTMLElement, open: boolean, t: PanelTiming) {
  const content = panel.firstElementChild as HTMLElement | null;
  if (!content || typeof panel.animate !== "function") return;
  const view = panel.ownerDocument.defaultView;
  const previous = SLIDES.get(panel) ?? [];
  // Mid-sweep, read what's drawn before cancelling so a reversal carries on
  // from there. A finished close (held by its fill) starts fresh.
  const running = previous.some((a) => a.playState !== "finished");
  const current = running ? drawnY(panel) : null;
  const blocks = blocksOf(content);
  const opacities = blocks.map((block) =>
    running ? Number(view?.getComputedStyle(block).opacity ?? 1) : open ? 0 : 1,
  );
  for (const animation of previous) animation.cancel();
  const fill: FillMode = open ? "backwards" : "forwards";
  const animations: Animation[] = blocks.map((block, i) =>
    block.animate([{ opacity: opacities[i] }, { opacity: open ? 1 : 0 }], {
      duration: t.ms,
      // Fresh opens cascade; reversals and exits move as one.
      delay: open && !running ? Math.min(i, 3) * t.stagger : 0,
      easing: t.fade,
      fill,
    }),
  );
  const height = panel.offsetHeight;
  const from = current ?? (open ? -height : 0);
  const to = open ? 0 : -height;
  if (!t.reduce && from !== to) {
    const timing = { duration: t.ms, easing: t.ease, fill };
    animations.push(
      panel.animate(
        [{ translate: `0 ${from}px` }, { translate: `0 ${to}px` }],
        timing,
      ),
      content.animate(
        [{ translate: `0 ${-from}px` }, { translate: `0 ${-to}px` }],
        timing,
      ),
    );
  }
  SLIDES.set(panel, animations);
  // Radix keeps a closed panel's element (hidden, children dropped), so a
  // close keeps its forwards fill until the reopen cancels it; an open lets
  // go once it's done.
  if (open) {
    Promise.all(animations.map((a) => a.finished)).then(
      () => SLIDES.get(panel) === animations && SLIDES.delete(panel),
      () => {},
    );
  }
}

/**
 * Watches every item's open state under the root (nested accordions too, so
 * their height changes glide this root's rows as well). On a change it FLIPs
 * the rows in the same task — before the snapped layout is painted — and
 * sweeps the clip edge of this root's own panels on the same clock. Opening
 * takes `--godui-duration-base`; a pure collapse the quicker
 * `--godui-duration-fast`. One clock per change keeps every edge and row glued.
 */
function useAccordionMotion(
  rootRef: React.RefObject<HTMLElement | null>,
  flip: (ms: number) => void,
) {
  React.useEffect(() => {
    const root = rootRef.current;
    const view = root?.ownerDocument.defaultView;
    if (!root || !view || typeof MutationObserver === "undefined") return;
    // Where the root is drawn just before a click toggles an item (capture
    // runs before Radix's handler); a click that toggles nothing forgets it.
    let before: DOMRect | null = null;
    const remember = () => {
      before = root.getBoundingClientRect();
      view.setTimeout(() => {
        before = null;
      });
    };
    root.addEventListener("click", remember, true);
    const observer = new MutationObserver((records) => {
      const changed = new Map<HTMLElement, boolean>();
      for (const record of records) {
        const item = record.target as HTMLElement;
        if (item.getAttribute("data-slot") !== "accordion-item") continue;
        const state = item.getAttribute("data-state");
        if (state === record.oldValue) continue;
        changed.set(item, state === "open");
      }
      if (changed.size === 0) return;
      const style = view.getComputedStyle(root);
      const fast = toMs(style.getPropertyValue("--godui-duration-fast"), 150);
      const opening = [...changed.values()].includes(true);
      const ms = opening
        ? toMs(style.getPropertyValue("--godui-duration-base"), 260)
        : fast;
      flushSync(() => flip(ms));
      const ease = style.transitionTimingFunction;
      const expo =
        style.getPropertyValue("--ease-out-expo").trim() ||
        "cubic-bezier(0.16, 1, 0.3, 1)";
      const timing: PanelTiming = {
        ms,
        ease: ease && ease !== "ease" ? ease : expo,
        fade: expo,
        stagger: fast / 4,
        reduce:
          view.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
          false,
      };
      if (before) glideRoot(root, before, timing);
      before = null;
      for (const [item, open] of changed) {
        if (item.parentElement !== root) continue;
        const panel = item.querySelector<HTMLElement>(
          ':scope > [data-slot="accordion-content"]',
        );
        if (panel) slidePanel(panel, open, timing);
      }
    });
    observer.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
      attributeOldValue: true,
    });
    return () => {
      observer.disconnect();
      root.removeEventListener("click", remember, true);
    };
  }, [rootRef, flip]);
}

function Accordion({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [move, flip] = React.useReducer(
    (state: { version: number; ms?: number }, ms: number) => ({
      version: state.version + 1,
      ms,
    }),
    { version: 0 },
  );
  // Rows whose position changed play an inverse translate back to rest, on
  // the same clock as the panels' edges.
  useFlipGroup(rootRef, move.version, {
    selector: ':scope > [data-slot="accordion-item"]',
    duration: move.ms,
  });
  useAccordionMotion(rootRef, flip);
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
      className="pointer-events-none overflow-hidden text-sm data-[state=closed]:absolute data-[state=closed]:inset-x-0 data-[state=closed]:animate-godui-accordion-hold"
      {...props}
    >
      <div className={cn("pointer-events-auto pt-0 pb-4", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
