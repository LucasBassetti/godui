"use client";

import * as React from "react";

export interface FlipGroupOptions {
  /** Children to animate, matched inside the container. */
  selector?: string;
  /** Milliseconds. */
  duration?: number;
  /** Any CSS easing, incl. linear() springs. */
  easing?: string;
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

type Point = { x: number; y: number };

/**
 * FLIP for layout changes without animating layout: when `trigger` changes,
 * children (default `[data-flip]`) whose position moved play an inverse
 * `translate` back to rest via WAAPI (`composite: "add"`, so their own
 * transforms survive). Sizes snap; only transform animates.
 *
 * Positions are relative to the container (scrolling between triggers is
 * ignored). If a previous FLIP is still running, its current visual offset is
 * read before cancelling it and carried into the new animation, so an
 * interruption starts from where the element is drawn instead of jumping.
 */
export function useFlipGroup(
  containerRef: React.RefObject<HTMLElement | null>,
  trigger: unknown,
  {
    selector = "[data-flip]",
    duration = 260,
    easing = "cubic-bezier(0.16, 1, 0.3, 1)",
  }: FlipGroupOptions = {},
): void {
  const last = React.useRef(new Map<Element, Point>());
  const running = React.useRef(new Map<Element, Animation>());

  // `trigger` is in the deps purely as the signal to re-measure.
  useIsoLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const origin = container.getBoundingClientRect();
    const reduce =
      container.ownerDocument.defaultView?.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches ?? false;
    const next = new Map<Element, Point>();
    for (const el of container.querySelectorAll<HTMLElement>(selector)) {
      let rect = el.getBoundingClientRect();
      let carry: Point = { x: 0, y: 0 };
      const active = running.current.get(el);
      if (active) {
        active.cancel();
        running.current.delete(el);
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
      const animation = el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: "translate(0px, 0px)" },
        ],
        { duration, easing, composite: "add" },
      );
      running.current.set(el, animation);
      animation.onfinish = () => {
        if (running.current.get(el) === animation) running.current.delete(el);
      };
    }
    last.current = next;
  }, [trigger, selector, duration, easing]);
}
