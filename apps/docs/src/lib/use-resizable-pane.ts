"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { readWorkbenchPrefs, writeWorkbenchPrefs } from "@/lib/workbench-prefs";

const KEY_STEP = 16;
const KEY_STEP_LARGE = 64;

export type ResizableAxis = "x" | "y";

export type SeparatorProps = {
  role: "separator";
  "aria-orientation": "vertical" | "horizontal";
  "aria-valuenow": number;
  "aria-valuemin": number;
  "aria-valuemax": number;
  "aria-label": string;
  tabIndex: 0;
  onPointerDown: (e: ReactPointerEvent) => void;
  onDoubleClick: () => void;
  onKeyDown: (e: ReactKeyboardEvent) => void;
};

/**
 * Drag-to-resize for a pane whose size lives in a CSS custom property on
 * <html> — not in React state.
 *
 * Writing the size as a var on the document element is what lets three
 * producers agree on one value: the pre-hydration prefs script (so the first
 * paint is already correct), this drag, and the CSS default. It also survives
 * client-side navigation between component pages without a re-write, and both
 * consumers (`grid-template-columns` and the pane's own `min-width`) read it by
 * inheritance.
 *
 * React state holds only the settled size, updated once per gesture, so
 * `aria-valuenow` stays honest without re-rendering the stage 60×/second.
 */
export function useResizablePane({
  axis,
  cssVar,
  storageKey,
  defaultPx,
  clamp,
  invert = false,
  containerRef,
  label,
}: {
  axis: ResizableAxis;
  /** Custom property written on document.documentElement, e.g. `--wb-panel-user`. */
  cssVar: `--${string}`;
  /** Field inside the `godui:workbench:v1` blob. */
  storageKey: "panelW" | "codeH";
  defaultPx: number;
  /** Bounds, recomputed per move from the live container size. */
  clamp: (containerPx: number) => [min: number, max: number];
  /**
   * Handle sits on the pane's leading edge (left for `x`, top for `y`), so
   * dragging toward the origin grows the pane.
   */
  invert?: boolean;
  /** The element the pane sizes against (the split container). */
  containerRef: RefObject<HTMLElement | null>;
  label: string;
}): { separatorProps: SeparatorProps; size: number; dragging: boolean } {
  const [size, setSize] = useState(defaultPx);
  const [dragging, setDragging] = useState(false);
  const [bounds, setBounds] = useState<[number, number]>(() =>
    clamp(Number.POSITIVE_INFINITY),
  );

  // Live drag values, deliberately outside React so a move never re-renders.
  const frame = useRef(0);
  const pending = useRef(defaultPx);
  const start = useRef({ coord: 0, px: defaultPx });

  const measure = useCallback(() => {
    const container = containerRef.current;
    const containerPx = container
      ? axis === "x"
        ? container.getBoundingClientRect().width
        : container.getBoundingClientRect().height
      : Number.POSITIVE_INFINITY;
    return clamp(containerPx);
  }, [axis, clamp, containerRef]);

  const apply = useCallback(
    (next: number) => {
      document.documentElement.style.setProperty(cssVar, `${next}px`);
    },
    [cssVar],
  );

  const commit = useCallback(
    (next: number) => {
      apply(next);
      setSize(next);
      writeWorkbenchPrefs({ [storageKey]: next });
    },
    [apply, storageKey],
  );

  // The prefs script applies the stored size before paint, but it can't know the
  // live container: a width saved on a wide monitor would leave no stage on a
  // laptop. Re-clamp on mount and whenever the container resizes, and adopt the
  // result so aria-valuenow matches what's rendered.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reclamp = () => {
      // A drag owns the value while it lasts; don't fight it.
      if (document.documentElement.dataset.wbResizing !== undefined) return;
      const [min, max] = measure();
      const stored = readWorkbenchPrefs()[storageKey] ?? defaultPx;
      const next = Math.min(max, Math.max(min, stored));
      setBounds([min, max]);
      setSize(next);
      // Only pin an override when the stored value actually needed correcting —
      // otherwise leave the CSS default in charge so a reset stays a reset.
      if (next !== stored) apply(next);
    };

    reclamp();
    const observer = new ResizeObserver(reclamp);
    observer.observe(container);
    return () => observer.disconnect();
  }, [apply, containerRef, defaultPx, measure, storageKey]);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture(e.pointerId);

      const paneRect = (
        el.closest("[data-wb-pane]") ?? el.parentElement
      )?.getBoundingClientRect();
      start.current = {
        coord: axis === "x" ? e.clientX : e.clientY,
        px: paneRect
          ? axis === "x"
            ? paneRect.width
            : paneRect.height
          : defaultPx,
      };
      pending.current = start.current.px;
      setBounds(measure());
      setDragging(true);
      document.documentElement.dataset.wbResizing = "";
    },
    [axis, defaultPx, measure],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const [min, max] = measure();
      const delta =
        (axis === "x" ? e.clientX : e.clientY) - start.current.coord;
      const raw = start.current.px + (invert ? -delta : delta);
      pending.current = Math.min(max, Math.max(min, raw));
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        apply(pending.current);
      });
    },
    [apply, axis, invert, measure],
  );

  const endDrag = useCallback(() => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    delete document.documentElement.dataset.wbResizing;
    setDragging(false);
    commit(pending.current);
  }, [commit]);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [dragging, onPointerMove, endDrag]);

  // Reset: drop the override entirely and let the CSS default win, so the
  // transition animates it back instead of snapping.
  const onDoubleClick = useCallback(() => {
    document.documentElement.style.removeProperty(cssVar);
    setSize(defaultPx);
    writeWorkbenchPrefs({ [storageKey]: undefined });
  }, [cssVar, defaultPx, storageKey]);

  // role="separator" promises keyboard resizing; deliver it.
  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      const [min, max] = measure();
      const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
      const grow = axis === "x" ? "ArrowLeft" : "ArrowUp";
      const shrink = axis === "x" ? "ArrowRight" : "ArrowDown";

      let next: number | null = null;
      if (e.key === grow) next = size + (invert ? step : -step);
      else if (e.key === shrink) next = size + (invert ? -step : step);
      else if (e.key === "Home") next = min;
      else if (e.key === "End") next = max;
      if (next === null) return;

      e.preventDefault();
      setBounds([min, max]);
      pending.current = Math.min(max, Math.max(min, next));
      commit(pending.current);
    },
    [axis, commit, invert, measure, size],
  );

  return {
    size,
    dragging,
    separatorProps: {
      role: "separator",
      "aria-orientation": axis === "x" ? "vertical" : "horizontal",
      "aria-valuenow": Math.round(size),
      "aria-valuemin": Math.round(bounds[0]),
      "aria-valuemax": Math.round(bounds[1]),
      "aria-label": label,
      tabIndex: 0,
      onPointerDown,
      onDoubleClick,
      onKeyDown,
    },
  };
}
