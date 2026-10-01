"use client";

import * as React from "react";

export interface FlipGroupOptions {
  /** Children to animate, matched inside the container. */
  selector?: string;
  /** Milliseconds. Defaults to the `--godui-duration-base` token (260ms). */
  duration?: number;
  /**
   * Any CSS easing, incl. linear() springs. Defaults to the container's own
   * `transition-timing-function` (give it an `ease-spring-*` class), else an
   * ease-out-expo curve.
   */
  easing?: string;
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

type Point = { x: number; y: number };

/** The element's own `translate` as [x, y] CSS lengths ("0px" when unset). */
function ownTranslate(el: HTMLElement): [string, string] {
  const value =
    el.ownerDocument.defaultView?.getComputedStyle(el).translate ||
    el.style.translate ||
    "none";
  if (value === "none") return ["0px", "0px"];
  const [x = "0px", y = "0px"] = value.trim().split(/\s+/);
  return [x, y];
}

/** `length + offset px`, folded to a plain px value when possible. */
function plus(length: string, offset: number): string {
  const px = /^(-?[\d.]+)px$/.exec(length);
  if (px) return `${Number(px[1]) + offset}px`;
  return `calc(${length} + ${offset}px)`;
}

/** A CSS time (`260ms`, `0.3s`) in milliseconds; 260 when unset or invalid. */
function toMs(value: string | undefined): number {
  const n = Number.parseFloat(value ?? "");
  if (!Number.isFinite(n)) return 260;
  return /\ds\s*$/.test(value ?? "") ? n * 1000 : n;
}

/**
 * Running FLIPs by element, shared by every group: an element moved by one
 * group (e.g. a Collapsible) can be a candidate of another (its sibling
 * Collapsible). Any group cancels and carries it; nobody baselines it mid-flight.
 */
const RUNNING = new WeakMap<Element, Animation>();

/** Each matched child's position relative to the container. */
function measure(container: HTMLElement, selector: string) {
  const origin = container.getBoundingClientRect();
  const positions = new Map<Element, Point>();
  for (const el of container.querySelectorAll<HTMLElement>(selector)) {
    const rect = el.getBoundingClientRect();
    positions.set(el, { x: rect.left - origin.left, y: rect.top - origin.top });
  }
  return positions;
}

/**
 * FLIP for layout changes without animating layout: when `trigger` changes,
 * children (default `[data-flip]`) whose position moved play an inverse offset
 * back to rest via WAAPI on the individual `translate` property, added to the
 * element's own translate. Replace-composited `translate` runs on the
 * compositor (Chrome won't composite `composite: "add"`) and sits outside the
 * element's `scale`/`rotate`, so scaled children don't distort the distance.
 * Sizes snap; only translate animates.
 *
 * Positions are relative to the container (scrolling between triggers is
 * ignored). If a previous FLIP is still running, its current visual offset is
 * read before cancelling it and carried into the new animation, so an
 * interruption starts from where the element is drawn instead of jumping.
 * Layout changes that no trigger accounts for (content loading, reflow) are
 * picked up by a ResizeObserver and become the new baseline without
 * animating — once no FLIP (from this group or another) is running on the
 * candidates, so a baseline never includes an in-flight offset.
 */
export function useFlipGroup(
  containerRef: React.RefObject<HTMLElement | null>,
  trigger: unknown,
  { selector = "[data-flip]", duration, easing }: FlipGroupOptions = {},
): void {
  const last = React.useRef(new Map<Element, Point>());
  const dirty = React.useRef(false);
  const resizes = React.useRef<ResizeObserver | null>(null);
  const settle = React.useRef<() => void>(() => {});

  // Re-baseline on resizes no trigger caused, once nothing is mid-FLIP.
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    settle.current = () => {
      const busy: Array<[Element, Animation]> = [];
      for (const el of container.querySelectorAll(selector)) {
        const animation = RUNNING.get(el);
        if (animation) busy.push([el, animation]);
      }
      if (busy.length === 0) {
        dirty.current = false;
        last.current = measure(container, selector);
        return;
      }
      dirty.current = true;
      for (const [el, animation] of busy) {
        // `finished` can settle before `onfinish` runs; clear the entry here
        // too, or settle() would keep re-waiting on a resolved promise.
        const done = () => {
          if (RUNNING.get(el) === animation) RUNNING.delete(el);
          settle.current();
        };
        animation.finished?.then(done, done);
      }
    };
    const observer = new ResizeObserver(() => settle.current());
    resizes.current = observer;
    observer.observe(container);
    for (const el of container.querySelectorAll(selector)) observer.observe(el);
    return () => {
      observer.disconnect();
      resizes.current = null;
    };
  }, [containerRef, selector]);

  // `trigger` is in the deps purely as the signal to re-measure.
  useIsoLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const view = container.ownerDocument.defaultView;
    const origin = container.getBoundingClientRect();
    const reduce =
      view?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const containerEase =
      view?.getComputedStyle(container).transitionTimingFunction;
    const ease =
      easing ??
      (containerEase && containerEase !== "ease"
        ? containerEase
        : "cubic-bezier(0.16, 1, 0.3, 1)");
    const ms =
      duration ??
      toMs(
        view
          ?.getComputedStyle(container)
          .getPropertyValue("--godui-duration-base"),
      );
    const next = new Map<Element, Point>();
    for (const el of container.querySelectorAll<HTMLElement>(selector)) {
      resizes.current?.observe(el);
      let rect = el.getBoundingClientRect();
      let carry: Point = { x: 0, y: 0 };
      const active = RUNNING.get(el);
      if (active) {
        active.cancel();
        RUNNING.delete(el);
        const settled = el.getBoundingClientRect();
        carry = { x: rect.left - settled.left, y: rect.top - settled.top };
        rect = settled;
      }
      const now = { x: rect.left - origin.left, y: rect.top - origin.top };
      next.set(el, now);
      const prev = last.current.get(el);
      if (!prev || reduce || typeof el.animate !== "function") continue;
      const dx = prev.x - now.x + carry.x;
      const dy = prev.y - now.y + carry.y;
      if (dx === 0 && dy === 0) continue;
      const [ownX, ownY] = ownTranslate(el);
      const animation = el.animate(
        [
          { translate: `${plus(ownX, dx)} ${plus(ownY, dy)}` },
          { translate: `${ownX} ${ownY}` },
        ],
        { duration: ms, easing: ease },
      );
      RUNNING.set(el, animation);
      animation.onfinish = () => {
        if (RUNNING.get(el) === animation) RUNNING.delete(el);
        if (dirty.current) settle.current();
      };
    }
    last.current = next;
  }, [trigger, selector, duration, easing]);
}
