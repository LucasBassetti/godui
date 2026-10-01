"use client";

import * as React from "react";

export type IndicatorBox = { x: number; y: number; w: number; h: number };

export interface ActiveIndicatorOptions {
  /** Matches the active element inside the container, e.g. '[role="tab"][data-state="active"]'. */
  active: string;
  /** Matches every candidate; each is observed for resizes, e.g. '[role="tab"]'. */
  items: string;
  /** Attributes whose change can move the active element. Default ["data-state"]. */
  attributes?: string[];
  /** Map the active element to the indicator's box. Default: its offset box. */
  box?: (el: HTMLElement, container: HTMLElement) => IndicatorBox;
  /** false → the indicator is hidden and `data-indicator` removed. Default true. */
  enabled?: boolean;
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const offsetBox = (el: HTMLElement): IndicatorBox => ({
  x: el.offsetLeft,
  y: el.offsetTop,
  w: el.offsetWidth,
  h: el.offsetHeight,
});

/** A CSS time (`260ms`, `0.3s`) in milliseconds; 260 when unset or invalid. */
function toMs(value: string | undefined): number {
  const n = Number.parseFloat(value ?? "");
  if (!Number.isFinite(n)) return 260;
  return /\ds\s*$/.test(value ?? "") ? n * 1000 : n;
}

/**
 * One indicator that follows the active element inside a container (tabs,
 * a single-select toggle group, a command list's selection). Its box snaps —
 * width, height and translate are set directly — and when the active element
 * changes by attribute, a FLIP plays `translate` + `scale` from the previous
 * box on the compositor. Item inserts/removals and resizes snap instead. A
 * slide in flight is cancelled and the next starts from where it is drawn; a
 * resize during a slide is applied when it finishes. The container gets
 * `data-indicator="ready"` once the indicator is placed, so components can
 * keep their own active styling until then (server render, first paint).
 *
 * The indicator's easing is read from its computed `transition-timing-function`
 * (give it an `ease-spring-*` class); duration from `--godui-duration-base`.
 */
export function useActiveIndicator(
  containerRef: React.RefObject<HTMLElement | null>,
  indicatorRef: React.RefObject<HTMLElement | null>,
  options: ActiveIndicatorOptions,
): void {
  const { active, items, enabled = true } = options;
  const attributes = (options.attributes ?? ["data-state"]).join(",");
  // `box` is usually an inline function; read the latest without re-subscribing.
  const boxRef = React.useRef(options.box);
  boxRef.current = options.box;

  useIsoLayoutEffect(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container) return;
    if (!enabled || !indicator) {
      container.removeAttribute("data-indicator");
      return;
    }
    const view = container.ownerDocument.defaultView;
    let shown: IndicatorBox | null = null;
    let running: Animation | null = null;
    let dirty = false;

    const place = (animate: boolean) => {
      const el = container.querySelector<HTMLElement>(active);
      if (!el) {
        container.removeAttribute("data-indicator");
        shown = null;
        return;
      }
      const box = (boxRef.current ?? offsetBox)(el, container);
      let from = shown;
      if (running) {
        const drawn = indicator.getBoundingClientRect();
        const origin = container.getBoundingClientRect();
        if (drawn.width > 0 && drawn.height > 0) {
          // offset* (the target) is scroll-independent; the drawn rect isn't.
          from = {
            x:
              drawn.left -
              origin.left -
              container.clientLeft +
              container.scrollLeft,
            y:
              drawn.top -
              origin.top -
              container.clientTop +
              container.scrollTop,
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
      container.setAttribute("data-indicator", "ready");
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
      const duration = toMs(style?.getPropertyValue("--godui-duration-base"));
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
        if (running !== animation) return;
        running = null;
        if (dirty) {
          dirty = false;
          place(false);
        }
      };
    };

    const resizes =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            if (running) dirty = true;
            else place(false);
          });
    // The container and every item: an item can change size (label, font
    // load, flex-1 in a resized container) while the container's box doesn't.
    const observeItems = () => {
      if (!resizes) return;
      resizes.disconnect();
      resizes.observe(container);
      for (const item of container.querySelectorAll(items)) {
        resizes.observe(item);
      }
    };

    place(false);
    observeItems();
    const mutations = new MutationObserver((records) => {
      // Selection moved → slide. Items added/removed (filtering) → snap.
      if (records.some((record) => record.type === "childList")) {
        observeItems();
        place(false);
      } else {
        place(true);
      }
    });
    mutations.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: attributes.split(","),
    });
    return () => {
      mutations.disconnect();
      resizes?.disconnect();
      running?.cancel();
    };
  }, [containerRef, indicatorRef, active, items, attributes, enabled]);
}
