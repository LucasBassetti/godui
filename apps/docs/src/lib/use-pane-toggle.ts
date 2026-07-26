"use client";

import { useCallback, useSyncExternalStore } from "react";
import { writeWorkbenchPrefs } from "@/lib/workbench-prefs";

/**
 * `<html>` is the single source of truth for pane open/closed.
 *
 * CSS reads the attribute directly (that's what makes the pane correct on the
 * very first paint, set by the pre-hydration prefs script), so React must read
 * the same place rather than keeping a parallel copy that can disagree.
 * useSyncExternalStore gives us that with an SSR snapshot and no
 * set-state-in-effect.
 */
type PaneAttr = "wbPanel" | "wbCode";

const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!observer) {
    observer = new MutationObserver(() => {
      for (const listener of listeners) listener();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-wb-panel", "data-wb-code"],
    });
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}

export function usePaneToggle(
  attr: PaneAttr,
  { openValue, serverDefault }: { openValue: string; serverDefault: boolean },
): [open: boolean, setOpen: (open: boolean) => void] {
  const open = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset[attr] === openValue,
    () => serverDefault,
  );

  const setOpen = useCallback(
    (next: boolean) => {
      const root = document.documentElement;
      if (attr === "wbPanel") {
        root.dataset.wbPanel = next ? "open" : "closed";
        writeWorkbenchPrefs({ open: next });
      } else {
        if (next) root.dataset.wbCode = "open";
        else delete root.dataset.wbCode;
        writeWorkbenchPrefs({ codeOpen: next });
      }
    },
    [attr],
  );

  return [open, setOpen];
}

/** Docs pane — defaults closed; the stage owns the page until you ask for prose. */
export function useDocsPaneToggle() {
  return usePaneToggle("wbPanel", { openValue: "open", serverDefault: false });
}

/** Code pane — defaults to closed so full-bleed demos keep their height. */
export function useCodePaneToggle() {
  return usePaneToggle("wbCode", { openValue: "open", serverDefault: false });
}
