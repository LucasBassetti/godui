"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback } from "react";

/**
 * Keyboard behaviour for a composite widget (tablist / radiogroup): one stop in
 * the tab order, arrows move between options.
 *
 * Both roles carry that promise in ARIA — a `role="tab"` that you can only reach
 * by tabbing through every sibling is worse than a plain button, because the
 * announcement now claims an interaction model the widget doesn't implement.
 * Selection follows focus, which is correct for both roles here (every option is
 * cheap to activate; nothing is destructive).
 */
export function useRovingTabIndex({
  values,
  value,
  onChange,
  orientation = "horizontal",
}: {
  values: string[];
  value: string;
  onChange: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}) {
  const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
  const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLElement>) => {
      const index = values.indexOf(value);
      if (index === -1) return;

      let nextIndex: number | null = null;
      if (e.key === prevKey)
        nextIndex = (index - 1 + values.length) % values.length;
      else if (e.key === nextKey) nextIndex = (index + 1) % values.length;
      else if (e.key === "Home") nextIndex = 0;
      else if (e.key === "End") nextIndex = values.length - 1;
      if (nextIndex === null) return;

      e.preventDefault();
      const next = values[nextIndex];
      onChange(next);
      // Focus follows selection so the next arrow press continues from here.
      const container = e.currentTarget;
      container
        .querySelector<HTMLElement>(`[data-value="${CSS.escape(next)}"]`)
        ?.focus();
    },
    [nextKey, onChange, prevKey, value, values],
  );

  return {
    /** Spread on the track element. */
    containerProps: { onKeyDown },
    /** Spread on each option; only the selected one is in the tab order. */
    optionProps: (optionValue: string) => ({
      "data-value": optionValue,
      tabIndex: optionValue === value ? 0 : -1,
    }),
  };
}
