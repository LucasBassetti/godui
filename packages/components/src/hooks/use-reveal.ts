"use client";

// The engine behind GodUI's faked height animations (Accordion, Collapsible).
// A panel's height snaps; its box (clipped) slides from under what's above it
// while the box's content slides the other way by the same amount, so the
// content holds still and only the clip edge sweeps. Whatever comes after the
// panel FLIPs on the same clock (duration + curve), so it rides the edge. A
// closing panel leaves the flow at once and sweeps back up while the content
// below rises. Every piece starts from where it's drawn, so reversing mid-way
// never jumps. GPU-only: `translate` and `opacity`.

import * as React from "react";
import { flushSync } from "react-dom";

/** Reveal roots: each one watches every open-state change beneath it. */
const ROOTS = '[data-slot="accordion"], [data-slot="collapsible"]';
/** Elements whose `data-state` marks a panel opening or closing. */
const TOGGLES = new Set(["accordion-item", "collapsible"]);

/** One clock for every piece of a change. */
export interface RevealTiming {
  ms: number;
  /** The spring shared by the clip edges, the FLIPs and the glides. */
  ease: string;
  /** The fades' curve (`--ease-out-expo`). */
  fade: string;
  /** Delay between the content blocks fading in. */
  stagger: number;
  reduce: boolean;
}

/** A CSS time (`260ms`, `0.3s`) in milliseconds; `fallback` when unset. */
function toMs(value: string | undefined, fallback: number): number {
  const n = Number.parseFloat(value ?? "");
  if (!Number.isFinite(n)) return fallback;
  return /\ds\s*$/.test(value ?? "") ? n * 1000 : n;
}

/** `length + offset px`, folded to a plain px value when possible. */
function plus(length: string, offset: number): string {
  const px = /^(-?[\d.]+)px$/.exec(length);
  if (px) return `${Number(px[1]) + offset}px`;
  return `calc(${length} + ${offset}px)`;
}

/** The element's own `translate` as [x, y] lengths, or null when unset. */
function ownTranslate(el: Element): [string, string] | null {
  const value = el.ownerDocument.defaultView?.getComputedStyle(el).translate;
  if (!value || value === "none") return null;
  const [x = "0px", y = "0px"] = value.trim().split(/\s+/);
  return [x, y];
}

/** The element's current vertical `translate` in px (0 when unset). */
function drawnY(el: Element): number {
  const own = ownTranslate(el);
  return (own && Number.parseFloat(own[1])) || 0;
}

/** The element's opacity (1 when unknown). */
function opacityOf(el: Element): number {
  const value = el.ownerDocument.defaultView?.getComputedStyle(el).opacity;
  const n = Number.parseFloat(value ?? "");
  return Number.isFinite(n) ? n : 1;
}

/** The element's `filter: opacity()` level (1 when it has none). */
function filterOpacityOf(el: Element): number {
  const value = el.ownerDocument.defaultView?.getComputedStyle(el).filter;
  const n = Number.parseFloat(
    /opacity\(([^)]*)\)/.exec(value ?? "")?.[1] ?? "",
  );
  return Number.isFinite(n) ? n : 1;
}

/**
 * The clock for a change, read off a reveal root: opening takes
 * `--godui-duration-base`, a pure collapse the quicker `--godui-duration-fast`.
 * The spring is the root's `transition-timing-function` (its `ease-spring-*`
 * class), else ease-out-expo.
 */
export function revealTiming(
  root: HTMLElement,
  opening: boolean,
): RevealTiming {
  const view = root.ownerDocument.defaultView;
  const style = view?.getComputedStyle(root);
  const fast = toMs(style?.getPropertyValue("--godui-duration-fast"), 150);
  const ms = opening
    ? toMs(style?.getPropertyValue("--godui-duration-base"), 260)
    : fast;
  const ease = style?.transitionTimingFunction;
  const expo =
    style?.getPropertyValue("--ease-out-expo").trim() ||
    "cubic-bezier(0.16, 1, 0.3, 1)";
  return {
    ms,
    ease: ease && ease !== "ease" ? ease : expo,
    fade: expo,
    stagger: fast / 4,
    reduce:
      typeof view?.matchMedia === "function" &&
      view.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

/** Running sweeps (edge, counter-moves, fades) by panel box. */
const SWEEPS = new WeakMap<Element, Animation[]>();

export interface Sweep {
  /** Slides `-distance → 0` (opening) or back; clipped while it does. */
  box: HTMLElement;
  /** Slide the other way, so they hold still. None: the box doesn't move. */
  layers: HTMLElement[];
  /** Fade in (a beat apart on a fresh open) or out. */
  blocks: HTMLElement[];
  open: boolean;
  /** How far the edge travels: the room the panel takes in the layout. */
  distance: number;
}

/**
 * Sweep a panel's clip edge: the box moves `from → to` and its layers the
 * opposite way, so they hold still on screen while the edge travels. Opening,
 * the blocks fade in a beat apart; closing, they fade out ahead of the edge.
 * Mid-sweep, it carries on from what's drawn. Reduced motion: fades only.
 * While the box moves it has `data-sweeping` (clip it, let the pointer through
 * it): mid-sweep it overlaps whatever sits above the panel.
 */
export function sweepPanel(
  { box, layers, blocks, open, distance }: Sweep,
  t: RevealTiming,
) {
  if (typeof box.animate !== "function") return;
  const previous = SWEEPS.get(box) ?? [];
  // Read what's drawn before cancelling, so a reversal carries on from there.
  // A finished close (held by its fill) starts fresh.
  const running = previous.some((a) => a.playState !== "finished");
  const drawn = running ? drawnY(box) : null;
  // The box itself fades with `filter: opacity()`: its `opacity` belongs to
  // the hold keyframe, and Chrome won't composite two opacity animations on
  // one element.
  const level = (block: Element) =>
    block === box ? filterOpacityOf(block) : opacityOf(block);
  const shown = blocks.map((block) => (running ? level(block) : null));
  for (const animation of previous) animation.cancel();
  const fill: FillMode = open ? "backwards" : "forwards";
  const animations: Animation[] = blocks.map((block, i) => {
    const rest = level(block);
    const from = shown[i] ?? (open ? 0 : rest);
    const to = open ? rest : 0;
    // Fresh opens cascade (capped at 4 beats); reversals and exits move as
    // one. Every fade still ends with the edge: one clock, one last frame.
    const delay = open && !running ? Math.min(i, 3) * t.stagger : 0;
    const frames =
      block === box
        ? [{ filter: `opacity(${from})` }, { filter: `opacity(${to})` }]
        : [{ opacity: from }, { opacity: to }];
    return block.animate(frames, {
      duration: t.ms - delay,
      delay,
      easing: t.fade,
      fill,
    });
  });
  const own = ownTranslate(box);
  const ownY = own ? Number.parseFloat(own[1]) || 0 : 0;
  const from = drawn === null ? (open ? -distance : 0) : drawn - ownY;
  const to = open ? 0 : -distance;
  if (!t.reduce && from !== to && layers.length > 0) {
    box.setAttribute("data-sweeping", "");
    const timing = { duration: t.ms, easing: t.ease, fill };
    const at = (el: Element, y: number) => {
      const base = el === box ? own : ownTranslate(el);
      return base ? `${base[0]} ${plus(base[1], y)}` : `0 ${y}px`;
    };
    animations.push(
      box.animate(
        [{ translate: at(box, from) }, { translate: at(box, to) }],
        timing,
      ),
      ...layers.map((layer) =>
        layer.animate(
          [{ translate: at(layer, -from) }, { translate: at(layer, -to) }],
          timing,
        ),
      ),
    );
  }
  SWEEPS.set(box, animations);
  // A closed panel stays drawn as it ended (held by the forwards fills) until
  // it's hidden or reopened; an open lets go once it's done.
  if (open) {
    Promise.all(animations.map((a) => a.finished)).then(
      () => {
        if (SWEEPS.get(box) !== animations) return;
        SWEEPS.delete(box);
        box.removeAttribute("data-sweeping");
      },
      () => {},
    );
  }
}

/** Closing Collapsible panels out of the flow: the room each one took. */
const LEFT = new WeakMap<
  HTMLElement,
  { room: number; style: [string, string, string, string] }
>();
const PLACED = ["position", "top", "left", "width"] as const;

/** A Collapsible's own content (not a nested Collapsible's). */
export function contentOf(root: Element): HTMLElement | null {
  for (const el of root.querySelectorAll<HTMLElement>(
    '[data-slot="collapsible-content"]',
  )) {
    if (el.closest('[data-slot="collapsible"]') === root) return el;
  }
  return null;
}

/**
 * Take a closing panel out of the flow right where it's drawn (absolute, at
 * its measured offset and width), so what follows rises at once. Returns the
 * room it took in `root`. Idempotent: every reveal root above it sees the
 * same change, and whichever handles it first must measure the flow.
 */
export function leaveFlow(box: HTMLElement, root: HTMLElement): number {
  const known = LEFT.get(box);
  if (known) return known.room;
  if (box.hidden) return 0;
  const style = box.style;
  const saved = PLACED.map((p) => style.getPropertyValue(p)) as [
    string,
    string,
    string,
    string,
  ];
  const height = root.offsetHeight;
  const width = box.offsetWidth;
  // Offsets are taken against the containing block (the positioned root):
  // leaving the flow can move it (a parent that centers it re-centers).
  const anchor = (box.offsetParent as HTMLElement | null) ?? root;
  const was = anchor.getBoundingClientRect();
  const rect = box.getBoundingClientRect();
  const scale = width > 0 && rect.width > 0 ? rect.width / width : 1;
  style.setProperty("position", "absolute");
  style.setProperty("top", "0px");
  style.setProperty("left", "0px");
  style.setProperty("width", `${width}px`);
  const is = anchor.getBoundingClientRect();
  const origin = box.getBoundingClientRect();
  const top = rect.top - was.top - (origin.top - is.top);
  const left = rect.left - was.left - (origin.left - is.left);
  style.setProperty("top", `${top / scale}px`);
  style.setProperty("left", `${left / scale}px`);
  const room = height - root.offsetHeight;
  LEFT.set(box, { room, style: saved });
  return room;
}

/** Put a reopening panel back in the flow. */
export function rejoinFlow(box: HTMLElement) {
  const left = LEFT.get(box);
  if (!left) return;
  LEFT.delete(box);
  PLACED.forEach((p, i) => {
    const value = left.style[i];
    if (value) box.style.setProperty(p, value);
    else box.style.removeProperty(p);
  });
}

/** The room an in-flow panel takes in `root`: what it adds to its height. */
export function flowRoom(box: HTMLElement, root: HTMLElement): number {
  const height = root.offsetHeight;
  const position = box.style.getPropertyValue("position");
  box.style.setProperty("position", "absolute");
  const without = root.offsetHeight;
  if (position) box.style.setProperty("position", position);
  else box.style.removeProperty("position");
  return height - without;
}

/**
 * What a reveal root glides when a parent moves it (a stage that centers it
 * shifts it by half its new height in one step): an Accordion its own box; a
 * Collapsible its parent, which holds the content after it.
 */
function gliderOf(root: Element): HTMLElement | null {
  const el =
    root.getAttribute("data-slot") === "collapsible"
      ? root.parentElement
      : (root as HTMLElement);
  const doc = root.ownerDocument;
  // Never the page itself: a moved <body> would carry fixed layers with it.
  if (!el || el === doc.body || el === doc.documentElement) return null;
  return el;
}

/** The glider of the nearest reveal root around this one. */
function outerGliderOf(root: Element): HTMLElement | null {
  const outer = root.parentElement?.closest(ROOTS);
  return outer ? gliderOf(outer) : null;
}

/** Running glides by element. */
const GLIDES = new WeakMap<Element, Animation>();

interface Drawn {
  own: DOMRect;
  outer: DOMRect | null;
}

/**
 * Glide a root's glider from where it was drawn at the click back to rest, on
 * the panels' clock, so nothing above the panel jumps. Nested: the glider
 * moves by its own displacement minus the outer root's glider's — the outer
 * glide carries it that far — so a nested root that just rides along doesn't
 * move twice as far, and one its own stage re-centers still glides.
 */
function glide(root: HTMLElement, before: Drawn, t: RevealTiming) {
  const el = gliderOf(root);
  if (!el) return;
  GLIDES.get(el)?.cancel();
  GLIDES.delete(el);
  if (t.reduce || typeof el.animate !== "function") return;
  const now = el.getBoundingClientRect();
  let dx = before.own.left - now.left;
  let dy = before.own.top - now.top;
  const outer = before.outer && outerGliderOf(root)?.getBoundingClientRect();
  if (before.outer && outer) {
    dx -= before.outer.left - outer.left;
    dy -= before.outer.top - outer.top;
  }
  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
  const [x, y] = ownTranslate(el) ?? ["0px", "0px"];
  const animation = el.animate(
    [
      { translate: `${plus(x, dx)} ${plus(y, dy)}` },
      { translate: `${x} ${y}` },
    ],
    { duration: t.ms, easing: t.ease },
  );
  GLIDES.set(el, animation);
  animation.onfinish = () => {
    if (GLIDES.get(el) === animation) GLIDES.delete(el);
  };
}

export interface RevealOptions {
  /**
   * Re-measure and FLIP what the change moved, synchronously (it runs inside
   * `flushSync`, before the snapped layout is painted).
   */
  flip: (move: { ms: number; ease: string }) => void;
  /** Sweep the root's own panels among the changed toggles (true = opened). */
  sweep: (changed: Map<HTMLElement, boolean>, t: RevealTiming) => void;
}

/**
 * Watches every open state under a reveal root (nested Accordions and
 * Collapsibles too, so their height changes move this root's content as
 * well). On a change, in the same task as the click: closing Collapsible
 * panels leave the flow, `flip` runs, the root's glider glides if a parent
 * moved it, and `sweep` sweeps the root's own panels — all on one clock.
 */
export function useReveal(
  rootRef: React.RefObject<HTMLElement | null>,
  options: RevealOptions,
) {
  const latest = React.useRef(options);
  latest.current = options;
  React.useEffect(() => {
    const root = rootRef.current;
    const view = root?.ownerDocument.defaultView;
    if (!root || !view || typeof MutationObserver === "undefined") return;
    // Where the gliders are drawn just before a click toggles something
    // (capture runs before Radix's handler); a click that toggles nothing
    // forgets it. Programmatic changes have no baseline and don't glide.
    let before: Drawn | null = null;
    const remember = () => {
      const own = gliderOf(root);
      if (!own) return;
      before = {
        own: own.getBoundingClientRect(),
        outer: outerGliderOf(root)?.getBoundingClientRect() ?? null,
      };
      view.setTimeout(() => {
        before = null;
      });
    };
    root.addEventListener("click", remember, true);
    const observer = new MutationObserver((records) => {
      const changed = new Map<HTMLElement, boolean>();
      for (const record of records) {
        const el = record.target as HTMLElement;
        if (!TOGGLES.has(el.getAttribute("data-slot") ?? "")) continue;
        const state = el.getAttribute("data-state");
        if (state === record.oldValue) continue;
        changed.set(el, state === "open");
      }
      if (changed.size === 0) return;
      // Before anything measures: closing Collapsible panels leave the flow,
      // reopening ones come back (Accordion panels do it in CSS).
      for (const [el, open] of changed) {
        if (el.getAttribute("data-slot") !== "collapsible") continue;
        const box = contentOf(el);
        if (!box) continue;
        if (open) rejoinFlow(box);
        else leaveFlow(box, el);
      }
      const t = revealTiming(root, [...changed.values()].includes(true));
      flushSync(() => latest.current.flip({ ms: t.ms, ease: t.ease }));
      if (before) glide(root, before, t);
      before = null;
      latest.current.sweep(changed, t);
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
  }, [rootRef]);
}
