"use client";

// GodUI Navigation Menu viewport frame — internal helper for navigation-menu.tsx (not part of shadcn's API).
// The positioning wrapper around the Radix viewport, as a client component so the main file can stay
// server-safe. It watches the viewport and replays the exit Radix drops (see keepExitingContent). GPU-only:
// the copy runs the content's own godui-slide-out keyframe.

import type * as React from "react";

/** Longest `duration + delay` of a computed `animation-*` list, in ms. */
function animationMs(style: CSSStyleDeclaration): number {
  const toMs = (value: string) =>
    value.trim().endsWith("ms")
      ? Number.parseFloat(value)
      : Number.parseFloat(value) * 1000;
  const durations = (style.animationDuration || "").split(",");
  const delays = (style.animationDelay || "").split(",");
  let longest = Number.NaN;
  durations.forEach((duration, i) => {
    const total = toMs(duration) + (toMs(delays[i] ?? "0s") || 0);
    if (Number.isFinite(total)) longest = Math.max(longest || 0, total);
  });
  return longest;
}

const CONTENT = "navigation-menu-content";

/**
 * Radix NavigationMenu (1.2.22, still in 1.3.0-rc) loses the viewport
 * content's exit: the Presence around each content never receives its node,
 * so the content you leave is removed at once instead of after its slide-out.
 * This watches the viewport and, when Radix removes a content mid-switch
 * (`data-motion="to-start|to-end"`) whose exit never started, puts an inert
 * copy back in its place for the length of that exit animation.
 *
 * - Once Radix keeps the node through its exit, the capturing `animationstart`
 *   listener marks it `data-exit-played`, and its later removal is ignored,
 *   so the exit never plays twice.
 * - A copy carries `data-ghost-of` (the content's id) and is dropped as soon
 *   as that content comes back (A → B → A), so two copies never show.
 * - A stable module-level callback ref with a cleanup (React 19), so the
 *   observer is never torn down mid-switch; cleanup clears timers and copies.
 */
function keepExitingContent(wrapper: HTMLDivElement | null) {
  if (!wrapper) return;
  const timers = new Set<number>();
  const ghosts = new Set<HTMLElement>();

  const markExitPlayed = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.slot !== CONTENT) return;
    if (target.hasAttribute("data-exiting")) return;
    if (target.dataset.motion?.startsWith("to-")) {
      target.setAttribute("data-exit-played", "");
    }
  };
  wrapper.addEventListener("animationstart", markExitPlayed, true);

  const dropGhostsOf = (viewport: HTMLElement, id: string) => {
    for (const ghost of viewport.querySelectorAll<HTMLElement>(
      "[data-ghost-of]",
    )) {
      if (ghost.getAttribute("data-ghost-of") === id) {
        ghosts.delete(ghost);
        ghost.remove();
      }
    }
  };

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      const viewport = record.target as HTMLElement;
      if (viewport.dataset.slot !== "navigation-menu-viewport") continue;
      for (const node of record.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.dataset.slot !== CONTENT || node.hasAttribute("data-exiting"))
          continue;
        node.removeAttribute("data-exit-played");
        if (node.id) dropGhostsOf(viewport, node.id);
      }
      if (viewport.dataset.state !== "open") continue;
      for (const node of record.removedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.dataset.slot !== CONTENT) continue;
        if (node.hasAttribute("data-exiting")) continue;
        if (node.hasAttribute("data-exit-played")) continue;
        if (!node.dataset.motion?.startsWith("to-")) continue;
        // Still mounted again (re-entered in the same batch): nothing to replay.
        if (node.isConnected) continue;
        const ghost = node.cloneNode(true) as HTMLElement;
        ghost.setAttribute("data-exiting", "");
        if (node.id) ghost.setAttribute("data-ghost-of", node.id);
        ghost.setAttribute("aria-hidden", "true");
        ghost.inert = true;
        for (const el of [ghost, ...ghost.querySelectorAll("[id]")]) {
          el.removeAttribute("id");
        }
        // Overlay the incoming content at every breakpoint (below `md` the
        // content is in flow, which would push the new one down).
        ghost.style.position = "absolute";
        ghost.style.pointerEvents = "none";
        // First child, so the incoming content paints over the exiting one.
        viewport.insertBefore(ghost, viewport.firstChild);
        const style = getComputedStyle(ghost);
        if ((style.animationName || "none") === "none") {
          ghost.remove();
          continue;
        }
        ghosts.add(ghost);
        let timer = 0;
        const remove = (event?: Event) => {
          if (event && event.target !== ghost) return;
          window.clearTimeout(timer);
          timers.delete(timer);
          ghosts.delete(ghost);
          ghost.remove();
        };
        ghost.addEventListener("animationend", remove);
        ghost.addEventListener("animationcancel", remove);
        // Fallback in case no end event arrives (e.g. the tab is hidden).
        const ms = animationMs(style);
        timer = window.setTimeout(
          () => remove(),
          (Number.isFinite(ms) ? ms : 1000) + 100,
        );
        timers.add(timer);
      }
    }
  });
  observer.observe(wrapper, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    wrapper.removeEventListener("animationstart", markExitPlayed, true);
    for (const timer of timers) window.clearTimeout(timer);
    for (const ghost of ghosts) ghost.remove();
    timers.clear();
    ghosts.clear();
  };
}

function NavigationMenuViewportFrame(props: React.ComponentProps<"div">) {
  return <div {...props} ref={keepExitingContent} />;
}

export { NavigationMenuViewportFrame };
