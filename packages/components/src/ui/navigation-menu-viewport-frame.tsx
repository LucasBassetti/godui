"use client";

// GodUI Navigation Menu viewport frame — internal helper for navigation-menu.tsx (not part of shadcn's API).
// The positioning wrapper around the Radix viewport, as a client component so the main file can stay
// server-safe. It watches the viewport and replays the exit Radix drops (see keepExitingContent). GPU-only:
// the copy runs the content's own godui-slide-out keyframe.

import type * as React from "react";

/**
 * Radix NavigationMenu (1.2.22, still in 1.3.0-rc) loses the viewport
 * content's exit: the Presence around each content never receives its node,
 * so the content you leave is removed at once instead of after its slide-out.
 * This watches the viewport and, when Radix removes a content mid-switch
 * (`data-motion="to-start|to-end"`), puts an inert copy back in its place for
 * the length of its exit animation. A stable module-level callback ref with a
 * cleanup (React 19), so the observer is never torn down mid-switch.
 */
function keepExitingContent(wrapper: HTMLDivElement | null) {
  if (!wrapper) return;
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      const viewport = record.target as HTMLElement;
      if (viewport.dataset.slot !== "navigation-menu-viewport") continue;
      if (viewport.dataset.state !== "open") continue;
      for (const node of record.removedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.dataset.slot !== "navigation-menu-content") continue;
        if (node.hasAttribute("data-exiting")) continue;
        if (!node.dataset.motion?.startsWith("to-")) continue;
        const ghost = node.cloneNode(true) as HTMLElement;
        ghost.setAttribute("data-exiting", "");
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
        const remove = () => ghost.remove();
        if ((getComputedStyle(ghost).animationName || "none") === "none") {
          remove();
          continue;
        }
        ghost.addEventListener("animationend", remove, { once: true });
        ghost.addEventListener("animationcancel", remove, { once: true });
        window.setTimeout(remove, 1000);
      }
    }
  });
  observer.observe(wrapper, { childList: true, subtree: true });
  return () => observer.disconnect();
}

function NavigationMenuViewportFrame(props: React.ComponentProps<"div">) {
  return <div {...props} ref={keepExitingContent} />;
}

export { NavigationMenuViewportFrame };
