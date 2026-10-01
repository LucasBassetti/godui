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
      const [ownX, ownY] = ownTranslate(el);
      const animation = el.animate(
        [
          { translate: `${plus(ownX, dx)} ${plus(ownY, dy)}` },
          { translate: `${ownX} ${ownY}` },
        ],
        { duration, easing },
      );
      running.current.set(el, animation);
      animation.onfinish = () => {
        if (running.current.get(el) === animation) running.current.delete(el);
      };
    }
    last.current = next;
  }, [trigger, selector, duration, easing]);
}
