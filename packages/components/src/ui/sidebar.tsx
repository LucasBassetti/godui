"use client";

// GodUI Sidebar — mirrors shadcn/ui new-york-v4 components/ui/sidebar.tsx (registry snapshot 2026-10-01).
// Motion: no width animation. The gap and the container snap to their new
// widths and classes set each piece's new resting `translate`; what you see
// move is GPU-only, and all of it is one FLIP clock (WAAPI on the wrapper's
// spring and --godui-duration-base), so a reversal mid-way restarts every piece
// from where it's drawn and nothing parts:
// - offcanvas: the whole panel slides out/in;
// - icon: a `sidebar-surface` layer (the panel's background, and the border it
//   inherits from the box, call-site overrides included) slides
//   its edge to the icon rail while the box behind it has already snapped. The
//   floating card is cut in three (left cap, a middle that scales on x, right
//   cap that slides) so its corners, border and shadow never stretch;
// - the content beside the sidebar glides with the panel's edge. The wrapper
//   clips x overflow so the gliding content never adds a scrollbar, and lifts
//   that content above the panel while it moves, so labels that snap in before
//   the edge arrives are uncovered by the edge instead of drawn over the page;
// - inside the panel, rows that the icon layout moves (group labels sliding
//   up, the header button shrinking) glide there too, on the same clock;
// - icon mode's labels (menu text, group labels, badges, actions) fade out
//   fast as the panel collapses, tucking toward their icons, while the
//   content keeps its full width until the move ends (so the edge wipes past
//   faded labels; no box snaps and cuts them). Expanding, they fade in top
//   first as the edge uncovers them. (A label that's a bare text node, not
//   an element, can't fade: its button snaps to the rail as in shadcn, so
//   wrap labels in an element.) Sub-menus open and shut with the
//   Accordion's clip window: the box's edge rides the row below, the items
//   hold still with their own row. All of it starts from what's drawn.
// Mobile is GodUI's Sheet. Reduced motion: everything snaps.

import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import { Slot } from "radix-ui";
import * as React from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFlipGroup } from "@/hooks/use-flip-group";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

/** What moves beside the sidebar: everything after it in the wrapper. */
const CONTENT_SELECTOR = ':scope > [data-slot="sidebar"] ~ *';
/**
 * What the icon layout moves inside the panel: group labels (they slide up
 * under the row above), menu buttons (rows below a label or a shrinking
 * header button rise) and the badges and actions placed beside them.
 */
const ROWS_SELECTOR =
  '[data-sidebar="group-label"], [data-sidebar="menu-button"], [data-sidebar="menu-badge"], [data-sidebar="menu-action"], [data-sidebar="group-action"]';

/**
 * A large button's padding snaps to 0 in icon mode, so its leading icon moves
 * 8px inside it: track the icon, glide the button. Moving the box (not the
 * icon inside it) keeps the icon from being clipped by the snapped box.
 * Badges and actions are hidden in icon mode (nothing to measure there):
 * they're placed against their row or group, so track that.
 */
function trackRow(el: HTMLElement): Element {
  const kind = el.dataset.sidebar;
  if (kind === "menu-badge" || kind === "menu-action") {
    return el.closest('[data-sidebar="menu-item"]') ?? el;
  }
  if (kind === "group-action") {
    return el.closest('[data-sidebar="group"]') ?? el;
  }
  return el.dataset.size === "lg" ? (el.firstElementChild ?? el) : el;
}

/**
 * What the icon layout hides and the move fades: a menu button's label
 * (everything after its leading icon: text, chevrons), group labels, and the
 * badges and actions beside rows.
 */
const LABELS_SELECTOR =
  '[data-sidebar="menu-button"] > :not(:first-child), [data-sidebar="group-label"], [data-sidebar="menu-badge"], [data-sidebar="menu-action"], [data-sidebar="group-action"]';
const SUBS_SELECTOR = '[data-sidebar="menu-sub"]';
/** How far a label tucks toward its icon as it fades out, in px. */
const TUCK = 4;
const SVG_NS = "http://www.w3.org/2000/svg";

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * Publishes an element's border widths as `--sidebar-bt|br|bb|bl` on itself.
 * An absolutely positioned child is placed against the padding box, so the
 * surface offsets itself outward by these to cover the border box, as the
 * element's own background and border do in shadcn. CSS can't turn an
 * inherited border width into a length, so this reads it back: on every
 * render, and (one observer per element, made while `active`) whenever the box
 * resizes, which a border change does. `client*`/`offset*` are rounded to
 * whole pixels, and an `overflow-y: scroll` container's scrollbar counts as
 * border here (it inflates `--sidebar-br`/`--sidebar-bb`).
 */
function useBorderInsets(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
) {
  const publish = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { clientTop, clientLeft, clientWidth, clientHeight } = el;
    const values = {
      "--sidebar-bt": clientTop,
      "--sidebar-bl": clientLeft,
      "--sidebar-br": el.offsetWidth - clientWidth - clientLeft,
      "--sidebar-bb": el.offsetHeight - clientHeight - clientTop,
    };
    for (const [name, px] of Object.entries(values)) {
      const next = `${px}px`;
      if (el.style.getPropertyValue(name) !== next) {
        el.style.setProperty(name, next);
      }
    }
  }, [ref]);
  useIsoLayoutEffect(publish);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!active || !el || typeof ResizeObserver !== "function") return;
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, active, publish]);
}

/**
 * What moves in the panel when it collapses, for one sidebar in the wrapper.
 * Offcanvas: the whole container. Icon: the surface (the floating card's far
 * cap); on the right, the box grows leftwards, so the inner glides with the
 * surface's edge instead of jumping with the box's.
 */
function panelSelector(
  side: "left" | "right",
  variant: "sidebar" | "floating" | "inset",
  collapsible: "offcanvas" | "icon" | "none",
): string {
  const panel = `[data-slot="sidebar"][data-side="${side}"] > [data-slot="sidebar-container"]`;
  if (collapsible === "offcanvas") return panel;
  if (collapsible !== "icon") return ":not(*)";
  const surface = `${panel} > [data-slot="sidebar-surface"]`;
  const edge = variant === "floating" ? `${surface} > :last-child` : surface;
  return side === "right"
    ? `${edge}, ${panel} > [data-slot="sidebar-inner"]`
    : edge;
}

/** Running stretches of floating cards' middles. */
const STRETCHES = new WeakMap<Element, Animation>();

/**
 * The floating card's middle scales on x (0 in icon mode, from its outer
 * edge) while its far cap glides with the panel's FLIP: same frame, clock and
 * spring, from what's drawn, so the middle's end stays under the cap.
 */
function useFloatingStretch(
  innerRef: React.RefObject<HTMLElement | null>,
  state: "expanded" | "collapsed",
  active: boolean,
) {
  const last = React.useRef(state);
  useIsoLayoutEffect(() => {
    const before = last.current;
    last.current = state;
    const middle = innerRef.current?.parentElement?.querySelector<HTMLElement>(
      ':scope > [data-slot="sidebar-surface"] > :nth-child(2)',
    );
    const wrapper = innerRef.current?.closest<HTMLElement>(
      '[data-slot="sidebar-wrapper"]',
    );
    const view = middle?.ownerDocument.defaultView;
    if (!active || before === state || !middle || !wrapper || !view) return;
    if (typeof middle.animate !== "function") return;
    const running = STRETCHES.get(middle);
    const to = state === "collapsed" ? 0 : 1;
    let from = 1 - to;
    if (running) {
      from = Number.parseFloat(view.getComputedStyle(middle).scale) || 0;
      running.cancel();
      STRETCHES.delete(middle);
    }
    if (view.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const style = view.getComputedStyle(wrapper);
    const animation = middle.animate(
      [{ scale: `${from} 1` }, { scale: `${to} 1` }],
      {
        duration: toMs(style.getPropertyValue("--godui-duration-base")),
        easing: style.transitionTimingFunction,
      },
    );
    STRETCHES.set(middle, animation);
    animation.onfinish = () => {
      if (STRETCHES.get(middle) === animation) STRETCHES.delete(middle);
    };
  }, [innerRef, state, active]);
}

/** A CSS time (`260ms`, `0.3s`) in milliseconds; 260 when unset or invalid. */
function toMs(value: string | undefined, fallback = 260): number {
  const n = Number.parseFloat(value ?? "");
  if (!Number.isFinite(n)) return fallback;
  return /\ds\s*$/.test(value ?? "") ? n * 1000 : n;
}

/** One clock for a move, read off the wrapper (or the element itself). */
function clockOf(el: HTMLElement) {
  const view = el.ownerDocument.defaultView;
  const wrapper =
    el.closest<HTMLElement>('[data-slot="sidebar-wrapper"]') ?? el;
  const style = view?.getComputedStyle(wrapper);
  const spring = style?.transitionTimingFunction;
  const expo =
    style?.getPropertyValue("--ease-out-expo").trim() ||
    "cubic-bezier(0.16, 1, 0.3, 1)";
  return {
    ms: toMs(style?.getPropertyValue("--godui-duration-base")),
    fast: toMs(style?.getPropertyValue("--godui-duration-fast"), 150),
    ease: spring && spring !== "ease" ? spring : expo,
    reduce:
      typeof view?.matchMedia === "function" &&
      view.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

/** The element's opacity as drawn (1 when unknown). */
function opacityOf(el: Element): number {
  const value = el.ownerDocument.defaultView?.getComputedStyle(el).opacity;
  const n = Number.parseFloat(value ?? "");
  return Number.isFinite(n) ? n : 1;
}

/** The element's `translate` as drawn, as px [x, y] (unset: 0 0). */
function translateOf(el: Element): [number, number] {
  const value =
    el.ownerDocument.defaultView?.getComputedStyle(el).translate || "none";
  if (value === "none") return [0, 0];
  const [x = "0", y = "0"] = value.trim().split(/\s+/);
  return [Number.parseFloat(x) || 0, Number.parseFloat(y) || 0];
}

/** The y of a `translate` keyframe value (`"0px 12px"`), in px. */
function keyframeY(value: unknown): number {
  const y = String(value ?? "")
    .trim()
    .split(/\s+/)[1];
  return Number.parseFloat(y ?? "0") || 0;
}

/**
 * Where a sub-menu's row is drawn relative to its rest, at the start of the
 * move: the offset its menu button's FLIP (just started) begins from.
 */
function rowOffset(sub: HTMLElement): number {
  const button = sub
    .closest('[data-sidebar="menu-item"]')
    ?.querySelector<HTMLElement>('[data-sidebar="menu-button"]');
  if (!button || typeof button.getAnimations !== "function") return 0;
  for (const animation of button.getAnimations()) {
    if (animation.playState !== "running") continue;
    const effect = animation.effect as Partial<KeyframeEffect> | null;
    const frames =
      typeof effect?.getKeyframes === "function" ? effect.getKeyframes() : [];
    if (frames.length < 2 || !("translate" in frames[0])) continue;
    return (
      keyframeY(frames[0].translate) -
      keyframeY(frames[frames.length - 1].translate)
    );
  }
  return 0;
}

/**
 * When a curve first reaches each 5% of its progress, in ms: sampled off a
 * detached, paused animation on the same timing (any easing, `linear()`
 * springs included). Null where Web Animations can't be built (jsdom).
 */
function progressTimes(ms: number, easing: string): number[] | null {
  if (typeof Animation !== "function" || typeof KeyframeEffect !== "function") {
    return null;
  }
  try {
    const animation = new Animation(
      new KeyframeEffect(null, null, { duration: ms, easing }),
    );
    animation.pause();
    const steps = 60;
    const times: number[] = [];
    for (let i = 0; i <= steps; i++) {
      animation.currentTime = (ms * i) / steps;
      const progress = Number(
        animation.effect?.getComputedTiming().progress ?? 0,
      );
      while (times.length <= 20 && progress >= times.length / 20) {
        times.push((ms * i) / steps);
      }
    }
    while (times.length <= 20) times.push(ms);
    return times;
  } catch {
    return null;
  }
}

/** Running fades and sweeps of the icon move, by element. */
const MOVES = new WeakMap<Element, Animation[]>();

function stop(el: Element) {
  for (const animation of MOVES.get(el) ?? []) animation.cancel();
  MOVES.delete(el);
}

/**
 * Remember an element's move. One that isn't held at its end (expanding: the
 * element rests where it ends) is forgotten when it ends, or the next move
 * would take the element's class value for a drawn one mid-fade.
 */
function track(el: Element, animations: Animation[], held: boolean) {
  MOVES.set(el, animations);
  if (held) return;
  Promise.allSettled(animations.map((a) => a.finished)).then(() => {
    if (MOVES.get(el) === animations) MOVES.delete(el);
  });
}

/** Sub-menus out of the flow while they close: their saved inline styles. */
const OUT = new WeakMap<HTMLElement, string[]>();
const PLACED = ["position", "top", "left", "width"] as const;

/**
 * Take a closing sub-menu out of the flow where it's laid out (against its
 * menu item, which is `relative`), so the rows below rise at once and ride
 * its clip edge up. Returns false when it isn't drawn.
 */
function leaveFlow(sub: HTMLElement): boolean {
  if (OUT.has(sub)) return true;
  if (sub.offsetHeight === 0) return false;
  const { offsetTop, offsetLeft, offsetWidth } = sub;
  OUT.set(
    sub,
    PLACED.map((p) => sub.style.getPropertyValue(p)),
  );
  sub.style.setProperty("position", "absolute");
  sub.style.setProperty("top", `${offsetTop}px`);
  sub.style.setProperty("left", `${offsetLeft}px`);
  sub.style.setProperty("width", `${offsetWidth}px`);
  return true;
}

function rejoinFlow(sub: HTMLElement) {
  const saved = OUT.get(sub);
  if (!saved) return;
  OUT.delete(sub);
  PLACED.forEach((p, i) => {
    if (saved[i]) sub.style.setProperty(p, saved[i]);
    else sub.style.removeProperty(p);
  });
  endSweep(sub);
}

/** A sub-menu's sweep is over: its own line is back, its items' go. */
function endSweep(sub: HTMLElement) {
  sub.removeAttribute("data-sweeping");
  sub.style.removeProperty("--sidebar-sub-line");
  sub.style.removeProperty("--sidebar-sub-line-x");
}

/**
 * A menu button whose label is a bare text node (`<Icon /> Home`) has no
 * element to fade (opacity can't spare the icon, and a text node takes no
 * GPU property): collapsing, it isn't held at full width, so its label is
 * clipped by the rail on the click as in shadcn instead of being wiped at
 * full strength. Wrap the label in an element (`<span>`) to have it fade.
 */
function markBareLabels(inner: HTMLElement) {
  for (const button of inner.querySelectorAll<HTMLElement>(
    '[data-sidebar="menu-button"]',
  )) {
    const bare = [...button.childNodes].some(
      (node) => node.nodeType === 3 && node.textContent?.trim(),
    );
    if (bare) button.setAttribute("data-bare-label", "");
    else button.removeAttribute("data-bare-label");
  }
}

/**
 * Icon mode hides the sub-menus. Collapsing, each one that's drawn leaves the
 * flow before the rows are measured (so the rows below rise at once, riding
 * its clip edge), and buttons with a bare-text label are marked (they snap to
 * the rail); expanding, sub-menus are back in the flow before that. Runs
 * ahead of the rows' FLIP.
 */
function useSubMenuFlow(
  innerRef: React.RefObject<HTMLElement | null>,
  state: "expanded" | "collapsed",
  active: boolean,
) {
  const last = React.useRef(state);
  useIsoLayoutEffect(() => {
    const before = last.current;
    last.current = state;
    const inner = innerRef.current;
    if (!active || before === state || !inner) return;
    const subs = inner.querySelectorAll<HTMLElement>(SUBS_SELECTOR);
    if (state === "expanded" || clockOf(inner).reduce) {
      for (const sub of subs) rejoinFlow(sub);
      return;
    }
    markBareLabels(inner);
    for (const sub of subs) leaveFlow(sub);
  }, [innerRef, state, active]);
}

/**
 * The icon move's labels and sub-menus, on the panel's clock. Collapsing, the
 * labels (menu buttons' text, group labels, badges, actions) fade out fast and
 * tuck toward their icons, so the panel's edge never wipes across a label at
 * full strength; the panel's content keeps its full width until the move ends
 * (classes keyed on `data-moving`), so nothing is cut by a snapped box.
 * Expanding, they fade in as the edge uncovers them, top row first. A
 * sub-menu's box sweeps its clip edge with the row below it while its items
 * hold still with their own row (the Accordion's clip window), so it opens
 * and closes instead of popping. Every piece starts from what's drawn, so a
 * reversal mid-way carries on. Collapsed, the held fades are let go once the
 * move ends, in the commit that snaps the panel's content to the rail.
 */
function useIconMove(
  innerRef: React.RefObject<HTMLElement | null>,
  state: "expanded" | "collapsed",
  moving: "expanding" | "collapsing" | null,
  active: boolean,
) {
  const last = React.useRef(state);
  useIsoLayoutEffect(() => {
    const before = last.current;
    last.current = state;
    const inner = innerRef.current;
    if (!active || before === state || !inner) return;
    const t = clockOf(inner);
    const collapsing = state === "collapsed";
    const labels = [...inner.querySelectorAll<HTMLElement>(LABELS_SELECTOR)];
    const subs = [...inner.querySelectorAll<HTMLElement>(SUBS_SELECTOR)];
    if (t.reduce) {
      for (const el of [...labels, ...subs]) stop(el);
      for (const sub of subs) {
        for (const item of sub.children) stop(item);
        endSweep(sub);
      }
      return;
    }
    // Expanding, a label starts to fade in once the panel's edge reaches it
    // (read off the edge's own spring: where it's drawn now, where it rests)
    // and, a beat apart, top first (at most half the fast token down the
    // panel). Every fade still ends with the clock.
    const box = inner.getBoundingClientRect();
    const surface = inner.parentElement?.querySelector<HTMLElement>(
      ':scope > [data-slot="sidebar-surface"]',
    );
    const edgeEl =
      surface && surface.children.length > 0
        ? (surface.lastElementChild as HTMLElement)
        : surface;
    const left =
      inner.closest('[data-slot="sidebar"]')?.getAttribute("data-side") !==
      "right";
    const start = edgeEl?.getBoundingClientRect().right ?? 0;
    const times = collapsing ? null : progressTimes(t.ms, t.ease);
    /** When an edge moving on the clock has covered `share` of its way. */
    const when = (share: number) => {
      if (!times) return 0;
      const at = Math.min(Math.max(share, 0), 1);
      return times[Math.ceil(at * 20)] ?? 0;
    };
    /** When the panel's edge reaches `x` (a right panel's content rides it). */
    const reach = (x: number) =>
      left && box.right - start >= 1
        ? when((x - start) / (box.right - start))
        : 0;
    /**
     * An expanding label's delay: once the edge reaches it, and (fresh, not
     * a reversal) a beat down the panel, top first.
     */
    const wave = (el: Element, fresh: boolean, after = 0) => {
      if (collapsing) return 0;
      const rect = el.getBoundingClientRect();
      const at = box.height > 0 ? (rect.top - box.top) / box.height : 0;
      const down = fresh ? Math.min(Math.max(at, 0), 1) * (t.fast / 2) : 0;
      return Math.min(Math.max(down, reach(rect.left), after), t.ms);
    };
    const fade = (
      el: HTMLElement,
      opts: {
        from: number | null;
        tuck: boolean;
        drawnX: number | null;
        /** Expanding: not before this (a sub-menu's clip edge reaching it). */
        after?: number;
      },
    ) => {
      const rest = opacityOf(el);
      const from = opts.from ?? (collapsing ? rest : 0);
      const to = collapsing ? 0 : rest;
      if (from === to) return null;
      const delay = wave(el, opts.from === null, opts.after);
      const duration = collapsing ? t.fast : Math.max(0, t.ms - delay);
      const frames: Keyframe[] = [{ opacity: from }, { opacity: to }];
      // On the edge's spring, so a label's opacity keeps pace with the edge
      // (out on the quicker fast token).
      const easing = t.ease;
      if (opts.tuck) {
        const [ownX, ownY] = translateOf(el);
        const fromX = opts.drawnX ?? (collapsing ? 0 : -TUCK);
        const toX = collapsing ? -TUCK : 0;
        frames[0].translate = `${ownX + fromX}px ${ownY}px`;
        frames[1].translate = `${ownX + toX}px ${ownY}px`;
      }
      return el.animate(frames, {
        duration,
        delay,
        easing,
        fill: collapsing ? "forwards" : "backwards",
      });
    };
    for (const el of labels) {
      if (typeof el.animate !== "function") continue;
      const running = MOVES.has(el);
      const tuck =
        el.namespaceURI !== SVG_NS &&
        el.parentElement?.dataset.sidebar === "menu-button";
      // Read what's drawn before letting the running fade go.
      const drawn = running ? opacityOf(el) : null;
      const [x] = running && tuck ? translateOf(el) : [0];
      stop(el);
      const [ownX] = running && tuck ? translateOf(el) : [0];
      // A group label's own class hides it in icon mode already: collapsing
      // from rest, it was fully shown.
      const from =
        drawn ??
        (collapsing && el.dataset.sidebar === "group-label" ? 1 : null);
      const animation = fade(el, {
        from,
        tuck,
        drawnX: running && tuck ? x - ownX : null,
      });
      if (animation) track(el, [animation], collapsing);
    }
    for (const sub of subs) {
      if (typeof sub.animate !== "function") continue;
      const room = sub.offsetHeight;
      const items = [...sub.children] as HTMLElement[];
      const running = MOVES.has(sub);
      // How closed it's drawn (1: shut), read off its first item's
      // counter-move (it holds still with the row by moving `room · shut`).
      const shut =
        running && items[0] && room > 0
          ? Math.min(Math.max(translateOf(items[0])[1] / room, 0), 1)
          : collapsing
            ? 0
            : 1;
      const shown = items.map((item) =>
        MOVES.has(item) ? opacityOf(item) : null,
      );
      stop(sub);
      for (const item of items) stop(item);
      if (room === 0) continue;
      if (!sub.hasAttribute("data-sweeping")) {
        // Its items draw its line while it sweeps (so the line holds still
        // with them and is cut by the same edge).
        const view = sub.ownerDocument.defaultView;
        const line = view?.getComputedStyle(sub).borderLeftColor;
        if (line) sub.style.setProperty("--sidebar-sub-line", line);
        const first = items[0]?.getBoundingClientRect();
        if (first) {
          const x = sub.getBoundingClientRect().left - first.left;
          sub.style.setProperty("--sidebar-sub-line-x", `${x}px`);
        }
        sub.setAttribute("data-sweeping", "");
      }
      const row = rowOffset(sub);
      const [ownX, ownY] = translateOf(sub);
      const timing = {
        duration: t.ms,
        easing: t.ease,
        fill: collapsing ? ("forwards" as const) : ("backwards" as const),
      };
      // The box: its bottom edge rides the row below; its items ride their
      // own row (the box's move plus theirs is the row's).
      const boxFrom = row - room * shut;
      const boxTo = collapsing ? -room : 0;
      const animations = [
        sub.animate(
          [
            { translate: `${ownX}px ${ownY + boxFrom}px` },
            { translate: `${ownX}px ${ownY + boxTo}px` },
          ],
          timing,
        ),
      ];
      for (const [i, item] of items.entries()) {
        const glide = item.animate(
          [
            { translate: `0px ${room * shut}px` },
            { translate: `0px ${collapsing ? room : 0}px` },
          ],
          timing,
        );
        // Expanding, an item fades in once the box's clip edge (on the
        // same spring) reaches it: it has `room · shut` to go from where
        // it's drawn.
        const top = item.offsetTop - sub.offsetTop;
        const faded = fade(item, {
          from: shown[i],
          tuck: false,
          drawnX: null,
          after: shut > 0 ? when((top - room * (1 - shut)) / (room * shut)) : 0,
        });
        if (faded) track(item, [faded], collapsing);
        animations.push(glide);
      }
      track(sub, animations, collapsing);
      if (!collapsing) {
        Promise.allSettled(animations.map((a) => a.finished)).then(() => {
          if (!MOVES.has(sub)) endSweep(sub);
        });
      }
    }
  }, [innerRef, state, active]);
  // Collapsed and at rest: the content has snapped to the rail in this very
  // commit, so the held fades and sweeps can go (nothing they hid is drawn).
  useIsoLayoutEffect(() => {
    const inner = innerRef.current;
    if (!active || moving !== null || state !== "collapsed" || !inner) return;
    for (const el of inner.querySelectorAll(LABELS_SELECTOR)) stop(el);
    for (const sub of inner.querySelectorAll<HTMLElement>(SUBS_SELECTOR)) {
      stop(sub);
      for (const item of sub.children) stop(item);
      endSweep(sub);
      rejoinFlow(sub);
    }
  }, [innerRef, moving, state, active]);
}

/**
 * How far into its run an animation can be and still count as started by
 * this move: the effect that reads them runs in the same task as the toggle,
 * or a frame or so later for a non-discrete update.
 */
const FRESH_MS = 100;

/**
 * Which way the sidebar is moving (null at rest and on first paint). Set in
 * the same render as the new state, so CSS keyed on it applies in the commit
 * that snaps the layout. Cleared when the move's last animation in the
 * wrapper ends (the glides, the labels' fades, the sub-menus' sweeps), so the
 * clear lands in the frame the motion ends and cuts nothing —
 * or, if one never ends (paused), one `--godui-duration-slow` after the
 * longest of them should have.
 */
function useMoving(
  ref: React.RefObject<HTMLElement | null>,
  state: "expanded" | "collapsed",
) {
  const [last, setLast] = React.useState(state);
  const [moving, setMoving] = React.useState<"expanding" | "collapsing" | null>(
    null,
  );
  if (last !== state) {
    setLast(state);
    setMoving(state === "expanded" ? "expanding" : "collapsing");
  }
  React.useEffect(() => {
    const wrapper = ref.current;
    const view = wrapper?.ownerDocument.defaultView;
    if (!moving || !wrapper || !view) return;
    let live = true;
    // Committed synchronously, in the frame the motion ends: the wrapper's
    // clip and the lift go with the glides' own last layout, not a frame later.
    const clear = () => {
      if (live) flushSync(() => setMoving(null));
    };
    // The animations this move started: the glides, fades and sweeps
    // (created in the layout effects before this one). They're fresh — still
    // at their start. One already running in the page
    // content (a long entrance) isn't the sidebar's to wait for, and a looping
    // one (a skeleton's shimmer) never ends.
    const started = (wrapper.getAnimations?.({ subtree: true }) ?? []).flatMap(
      (animation) => {
        const timing = animation.effect?.getComputedTiming();
        const end = Number(timing?.endTime ?? Number.NaN);
        if (!Number.isFinite(end)) return [];
        if (Number(animation.currentTime ?? 0) > FRESH_MS) return [];
        const rate = animation.playbackRate;
        const left = end - Number(timing?.localTime ?? 0);
        return [{ animation, remaining: rate > 0 ? left / rate : left }];
      },
    );
    const running = started.map(({ animation }) => animation);
    const token = (name: string, fallback: number) =>
      toMs(view.getComputedStyle(wrapper).getPropertyValue(name), fallback);
    let timer: number | undefined;
    if (running.length > 0) {
      // Settled, not fulfilled: one cancelled along the way (a reversal, a
      // row re-glided by a Collapsible) still lets the flag clear. After a
      // reversal the new run owns the flag (`live`).
      Promise.allSettled(running.map((animation) => animation.finished)).then(
        clear,
      );
      // A paused animation (your CSS, a stalled tab) must not hold the clip
      // and lift: give up one slow token after the longest one should have
      // ended. Read off the animations themselves, so a retuned (or slowed)
      // clock still runs to its end.
      const remaining = Math.max(...started.map((run) => run.remaining));
      timer = view.setTimeout(
        clear,
        remaining + token("--godui-duration-slow", 380),
      );
    } else {
      timer = view.setTimeout(clear, token("--godui-duration-base", 260));
    }
    return () => {
      live = false;
      if (timer !== undefined) view.clearTimeout(timer);
    };
  }, [ref, moving]);
  return moving;
}

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

/** Which way the sidebar is moving (GodUI-only, not part of `useSidebar`). */
const SidebarMovingContext = React.createContext<
  "expanding" | "collapsing" | null
>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ref,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      // biome-ignore lint/suspicious/noDocumentCookie: shadcn persists the state in a cookie.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  // The content beside the sidebar keeps its old position for one frame and
  // glides to the new one on the panel's spring and clock (read off this
  // wrapper's `ease-spring-smooth` and `--godui-duration-base`).
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  useFlipGroup(wrapperRef, state, { selector: CONTENT_SELECTOR });
  const moving = useMoving(wrapperRef, state);
  const setWrapperRef = useMergedRef(wrapperRef, ref);

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <SidebarMovingContext.Provider value={moving}>
        <TooltipProvider delayDuration={0}>
          <div
            ref={setWrapperRef}
            data-slot="sidebar-wrapper"
            data-moving={moving ?? undefined}
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
              // While it glides, the content is drawn past the right edge: clip
              // x then (only then, so wide content still scrolls the page at
              // rest) rather than flash a scrollbar. It's also lifted above the
              // panel; z-20 deliberately pairs with shadcn's own z-10 container.
              "ease-spring-smooth data-moving:overflow-x-clip [&[data-moving]>[data-slot=sidebar]~*]:z-20",
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarMovingContext.Provider>
    </SidebarContext.Provider>
  );
}

/**
 * The panel's background and border, drawn behind its content. Offcanvas, it
 * rides along with the container. In icon mode it slides its edge to the rail
 * (the box behind it has already snapped). The floating card is a left cap, a
 * middle that scales on x (from its left) and a right cap that slides, so the
 * rounded corners, border and shadow are never stretched; the middle's right
 * edge and the cap's left edge move by the same amount every frame.
 */
function SidebarSurface({
  side,
  variant,
}: {
  side: "left" | "right";
  variant: "sidebar" | "floating" | "inset";
}) {
  if (variant !== "floating") {
    return (
      <div
        data-slot="sidebar-surface"
        className={cn(
          // -z-10: behind the inner, inside the container's own (z-10)
          // stacking context.
          // Positioned from the container's border edge (the box is offset
          // outward by its border widths, `--sidebar-b*`, set by
          // `useBorderInsets`), so any border class on Sidebar paints where
          // it does in shadcn: on the box edge, at rest and while sliding.
          "pointer-events-none absolute top-[calc(var(--sidebar-bt,0px)*-1)] bottom-[calc(var(--sidebar-bb,0px)*-1)] -z-10 w-(--sidebar-width) bg-sidebar group-data-[side=left]:left-[calc(var(--sidebar-bl,0px)*-1)] group-data-[side=right]:right-[calc(var(--sidebar-br,0px)*-1)]",
          "group-data-[collapsible=icon]:group-data-[side=left]:-translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon))] group-data-[collapsible=icon]:group-data-[side=right]:translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon))]",
          // The container's own border (shadcn's, plus any call-site
          // override such as border-r-0 or a color), painted here instead.
          "[border-width:inherit] [border-style:inherit] [border-color:inherit]",
        )}
      />
    );
  }

  const piece =
    "absolute inset-y-0 border-y border-sidebar-border bg-sidebar shadow-sm";
  return (
    <div
      data-slot="sidebar-surface"
      className="pointer-events-none absolute inset-y-2 -z-10 w-[calc(var(--sidebar-width)-(--spacing(4)))] group-data-[side=left]:left-2 group-data-[side=right]:right-2"
    >
      {/* The collapsed card minus its right cap; never moves. */}
      <div
        className={cn(
          piece,
          "w-[calc(var(--sidebar-width-icon)+2px-(--spacing(4)))]",
          side === "left"
            ? "left-0 rounded-l-lg border-l [clip-path:inset(-1rem_0_-1rem_-1rem)]"
            : "right-0 rounded-r-lg border-r [clip-path:inset(-1rem_-1rem_-1rem_0)]",
        )}
      />
      {/* The stretch between; 2px longer than the gap so no seam opens. */}
      <div
        className={cn(
          piece,
          "[clip-path:inset(-1rem_0)] group-data-[collapsible=icon]:scale-x-0",
          side === "left"
            ? "right-[calc(--spacing(4)-2px)] left-[calc(var(--sidebar-width-icon)+2px-(--spacing(4)))] origin-left"
            : "right-[calc(var(--sidebar-width-icon)+2px-(--spacing(4)))] left-[calc(--spacing(4)-2px)] origin-right",
        )}
      />
      {/* The far edge with its corners; slides with the middle's end. */}
      <div
        className={cn(
          piece,
          "w-4",
          side === "left"
            ? "right-0 rounded-r-lg border-r [clip-path:inset(-1rem_-1rem_-1rem_0)] group-data-[collapsible=icon]:-translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon)-(--spacing(4))-2px)]"
            : "left-0 rounded-l-lg border-l [clip-path:inset(-1rem_0_-1rem_-1rem)] group-data-[collapsible=icon]:translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon)-(--spacing(4))-2px)]",
        )}
      />
    </div>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ref,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  const moving = React.useContext(SidebarMovingContext);
  const iconMove = !isMobile && collapsible === "icon";
  // Rows the icon layout moves glide there on the panel's clock (measured in
  // the inner, so a move of the whole panel doesn't count).
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const setContainerRef = useMergedRef(containerRef, ref);
  useBorderInsets(containerRef, !isMobile && collapsible !== "none");
  // Before the rows are measured: closing sub-menus leave the flow.
  useSubMenuFlow(innerRef, state, iconMove);
  useFlipGroup(innerRef, state, {
    selector: ROWS_SELECTOR,
    measure: trackRow,
  });
  // The panel's moving pieces glide to their new rest (set by classes) with
  // the same FLIP, clock and spring as the content beside the sidebar, all
  // measured against the wrapper (it doesn't move). Reversed mid-way, every
  // piece restarts from where it's drawn, so edge and content never part.
  const frameRef = React.useRef<HTMLElement | null>(null);
  useIsoLayoutEffect(() => {
    frameRef.current =
      innerRef.current?.closest<HTMLElement>('[data-slot="sidebar-wrapper"]') ??
      null;
  });
  useFlipGroup(frameRef, state, {
    selector: panelSelector(side, variant, collapsible),
  });
  useFloatingStretch(
    innerRef,
    state,
    variant === "floating" && collapsible === "icon",
  );
  // After the FLIPs have started (a sub-menu's sweep reads its row's).
  useIconMove(innerRef, state, moving, iconMove);

  if (collapsible === "none") {
    return (
      <div
        ref={ref}
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        ref={setContainerRef}
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) md:flex",
          side === "left" ? "left-0" : "right-0",
          "group-data-[collapsible=offcanvas]:group-data-[side=left]:-translate-x-full group-data-[collapsible=offcanvas]:group-data-[side=right]:translate-x-full",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          // shadcn's border stays on the box (so a call site's border classes
          // apply as they do there) but isn't painted: the surface inherits
          // and draws it, sliding with the edge. A transparent border-image
          // hides it without changing the inherited color. (The floating
          // card draws its own border, so its box keeps painting one.)
          variant !== "floating" &&
            "[border-image:linear-gradient(transparent,transparent)_1]",
          className,
        )}
        {...props}
      >
        <SidebarSurface side={side} variant={variant} />
        <div
          ref={innerRef}
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          // Transparent: the surface behind it is the background. The floating
          // card's border moved to the surface; a clear one keeps the inset.
          className={cn(
            "flex h-full w-full flex-col ease-spring-smooth group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-transparent",
            // Collapsing to icons, the content keeps its expanded width until
            // the move ends: labels fade (and the edge wipes past them)
            // instead of being cut by a box that snapped to the rail, and
            // badges, actions and sub-menus stay drawn to fade and sweep.
            // Rows still take their icon-layout heights (and glide there);
            // a large button's two lines aren't clipped by its new height.
            // A button whose label is a bare text node snaps (see
            // markBareLabels): wrap the label in an element to fade it.
            // The snap lands in the commit that ends the move, when all of
            // it is faded out.
            collapsible === "icon" &&
              "motion-safe:in-data-[moving=collapsing]:shrink-0 motion-safe:[[data-moving=collapsing]_&_[data-sidebar=menu-button]:not([data-bare-label])]:w-full! motion-safe:[[data-moving=collapsing]_&_[data-sidebar=menu-button]:not([data-bare-label])]:overflow-visible motion-safe:[[data-moving=collapsing]_&_[data-sidebar=menu-badge]]:flex! motion-safe:[[data-moving=collapsing]_&_[data-sidebar=menu-action]]:flex! motion-safe:[[data-moving=collapsing]_&_[data-sidebar=group-action]]:flex! motion-safe:[[data-moving=collapsing]_&_[data-sidebar=menu-sub]]:flex! motion-safe:[[data-moving=collapsing]_&_[data-sidebar=menu-sub-button]]:flex!",
            collapsible === "icon" &&
              (variant === "floating" || variant === "inset"
                ? "motion-safe:in-data-[moving=collapsing]:w-[calc(var(--sidebar-width)-(--spacing(4))-var(--sidebar-bl,0px)-var(--sidebar-br,0px))]"
                : "motion-safe:in-data-[moving=collapsing]:w-[calc(var(--sidebar-width)-var(--sidebar-bl,0px)-var(--sidebar-br,0px))]"),
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-[translate] duration-(--godui-duration-base) ease-spring-smooth group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border motion-reduce:transition-none sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        // Lifted above a floating panel while it moves, it also covers the
        // gutter beside the card, where labels snapped in at full width would
        // otherwise peek out before the card's edge reaches them.
        "md:peer-data-[variant=floating]:in-data-[moving]:before:absolute md:peer-data-[variant=floating]:in-data-[moving]:before:inset-y-0 md:peer-data-[variant=floating]:in-data-[moving]:before:right-full md:peer-data-[variant=floating]:in-data-[moving]:before:w-1.5 md:peer-data-[variant=floating]:in-data-[moving]:before:bg-inherit",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full bg-background shadow-none", className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        // The margin snaps; the label (and the rows under it) glide up with
        // the panel's FLIP while it fades (on the move's clock, see Sidebar).
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  // Width, height and padding snap to the icon layout; the button glides to
  // its new row with the panel's FLIP.
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot.Root : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        // Icon mode hides it; the move sweeps it shut and open (see Sidebar).
        // While its edge sweeps it clips y, lets the pointer through, and its
        // items draw its line (so the line holds still and is cut too).
        "group-data-[collapsible=icon]:hidden data-sweeping:pointer-events-none data-sweeping:overflow-y-clip data-sweeping:has-[>[data-sidebar=menu-sub-item]]:border-l-transparent",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn(
        "group/menu-sub-item relative",
        // Its sub-menu's line while that sweeps (see SidebarMenuSub).
        "[[data-sidebar=menu-sub][data-sweeping]>&]:before:absolute [[data-sidebar=menu-sub][data-sweeping]>&]:before:inset-y-[-2px] [[data-sidebar=menu-sub][data-sweeping]>&]:before:left-(--sidebar-sub-line-x) [[data-sidebar=menu-sub][data-sweeping]>&]:before:w-px [[data-sidebar=menu-sub][data-sweeping]>&]:before:bg-(--sidebar-sub-line)",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
