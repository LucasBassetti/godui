"use client";

import { useEffect, useRef } from "react";

export type WorkbenchShortcuts = {
  toggleDocs: () => void;
  toggleCode: () => void;
  replay: () => void;
  toggleFullscreen: () => void;
  toggleView: () => void;
  prevExample: () => void;
  nextExample: () => void;
  escape: () => void;
};

/**
 * Single-key shortcuts for the workbench chrome.
 *
 * The guard is the hard part, not the bindings: the stage runs real components —
 * comboboxes, command palettes, dialogs, editable surfaces — and those own the
 * keyboard whenever they have focus. Typing "code" into a demo's search field
 * must not toggle three panes. So we bail on anything that looks like text
 * entry, anything inside a composite widget, and any open dialog on the page.
 */
export function useWorkbenchShortcuts(handlers: WorkbenchShortcuts) {
  // Callers rebuild these closures every render; keep the listener registered
  // once and read the latest handlers through a ref that's refreshed after each
  // commit (writing it during render would be a render-phase ref access).
  const latest = useRef(handlers);
  useEffect(() => {
    latest.current = handlers;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Modifier combos belong to the browser and the OS; repeats are noise.
      if (e.defaultPrevented || e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.isContentEditable) return;
        if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
        if (target.closest("[role=textbox],[role=combobox],[role=dialog]")) {
          return;
        }
      }
      // A demo dialog is up — Escape and every letter belong to it.
      if (document.querySelector("[data-state=open][role=dialog]")) return;

      switch (e.key) {
        case "d":
          latest.current.toggleDocs();
          break;
        case "c":
          latest.current.toggleCode();
          break;
        case "r":
          latest.current.replay();
          break;
        case "f":
          latest.current.toggleFullscreen();
          break;
        case "v":
          latest.current.toggleView();
          break;
        case "[":
          latest.current.prevExample();
          break;
        case "]":
          latest.current.nextExample();
          break;
        case "Escape":
          latest.current.escape();
          return;
        default:
          return;
      }
      e.preventDefault();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
}
