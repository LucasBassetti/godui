"use client";

// GodUI Navigation Menu viewport frame — internal helper for navigation-menu.tsx (not part of shadcn's API).
// The positioning wrapper around the Radix viewport, as a client component so the main file can stay
// server-safe. It watches the viewport and replays the exit Radix drops (see keepExitingContent), and
// anchors the viewport under the open trigger (see anchorToTrigger). Also hosts the click guard that
// keeps a hover-opened trigger open when it's then clicked (see guardHoverOpenedClicks). GPU-only: the
// copy runs the content's own godui-slide-out keyframe; the anchor moves on `translate`.

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

/**
 * shadcn pins the shared viewport to the menu's left edge, so a small panel
 * (a 200px list under the last trigger) opens far from its trigger. This
 * centers the viewport under the open trigger, clamped inside the menu (a
 * panel wider than the room left stays left-aligned, as in shadcn), via the
 * wrapper's `translate`. First open snaps into place; hopping to another
 * trigger glides on the wrapper's `transition-[translate]` while the size
 * snaps. The target width is the open content's own (Radix resizes the
 * viewport to it a frame later), so the first open lands in place at once.
 */
function anchorToTrigger(wrapper: HTMLDivElement | null) {
  const root = wrapper?.parentElement;
  if (!wrapper || !root || typeof ResizeObserver === "undefined") return;
  const view = wrapper.ownerDocument.defaultView;
  let wasOpen = false;
  let snapping = true;
  let frame = 0;

  const openTrigger = () =>
    [
      ...root.querySelectorAll<HTMLElement>(
        '[data-slot="navigation-menu-trigger"][data-state="open"]',
      ),
    ].find((t) => t.closest('[data-slot="navigation-menu"]') === root);

  const place = () => {
    const viewport = wrapper.querySelector<HTMLElement>(
      '[data-slot="navigation-menu-viewport"]',
    );
    const trigger = openTrigger();
    // Closing: stay where it is while the exit plays.
    if (!viewport || !trigger) {
      wasOpen = false;
      return;
    }
    if (!wasOpen) snapping = true;
    wasOpen = true;
    const rootBox = root.getBoundingClientRect();
    const box = trigger.getBoundingClientRect();
    // The open content's own width is known the moment it mounts; Radix only
    // resizes the viewport to it a frame later. Add the viewport's borders.
    // Content in the viewport carries no data-state; the trigger names it.
    const id = trigger.getAttribute("aria-controls");
    const content = [
      ...viewport.querySelectorAll<HTMLElement>(
        ':scope > [data-slot="navigation-menu-content"]:not([data-exiting])',
      ),
    ].find((el) => el.id === id);
    const borders = viewport.offsetWidth - viewport.clientWidth;
    const width = content
      ? content.offsetWidth + borders
      : viewport.offsetWidth;
    const center = box.left - rootBox.left + box.width / 2;
    const room = Math.max(0, root.clientWidth - width);
    const x = Math.round(Math.min(Math.max(center - width / 2, 0), room));
    if (snapping) {
      wrapper.style.transition = "none";
      wrapper.style.translate = `${x}px 0px`;
      // Keep snapping until the content is in (its width is the target).
      if (content && width > borders) {
        view?.cancelAnimationFrame(frame);
        frame =
          view?.requestAnimationFrame(() => {
            wrapper.style.transition = "";
            snapping = false;
          }) ?? 0;
      }
      return;
    }
    wrapper.style.translate = `${x}px 0px`;
  };

  const states = new MutationObserver(place);
  states.observe(root, {
    subtree: true,
    attributes: true,
    attributeFilter: ["data-state"],
  });
  const sizes = new ResizeObserver(place);
  sizes.observe(root);
  // The viewport mounts and unmounts with the menu; watch it whenever it's in.
  const mounts = new MutationObserver(() => {
    const viewport = wrapper.querySelector(
      '[data-slot="navigation-menu-viewport"]',
    );
    if (viewport) sizes.observe(viewport);
    place();
  });
  mounts.observe(wrapper, { childList: true });
  return () => {
    states.disconnect();
    sizes.disconnect();
    mounts.disconnect();
    view?.cancelAnimationFrame(frame);
  };
}

/** Both behaviours on one stable callback ref (React 19 cleanup). */
function frameRef(wrapper: HTMLDivElement | null) {
  const cleanups = [keepExitingContent(wrapper), anchorToTrigger(wrapper)];
  return () => {
    for (const cleanup of cleanups) cleanup?.();
  };
}

function NavigationMenuViewportFrame(props: React.ComponentProps<"div">) {
  return <div {...props} ref={frameRef} />;
}

/**
 * Radix opens a trigger on hover (after ~200ms) and toggles it on click, so
 * the natural "rest on it, then click" closes the menu the hover just opened
 * — it looks like the trigger doesn't work. This listens to clicks on the
 * menu in the capture phase (before Radix's handler) and keeps a hover-opened
 * trigger open; a click on a trigger you opened by clicking (or Enter) still
 * closes it. `preventDefault()` is what Radix checks to skip its toggle.
 */
function guardHoverOpenedClicks(marker: HTMLSpanElement | null) {
  const root = marker?.parentElement;
  if (!root) return;
  let clicked: Element | null = null;
  const onClick = (event: MouseEvent) => {
    const trigger = (event.target as Element | null)?.closest(
      '[data-slot="navigation-menu-trigger"]',
    );
    if (!trigger || trigger.closest('[data-slot="navigation-menu"]') !== root)
      return;
    if (trigger.getAttribute("data-state") !== "open") {
      clicked = trigger;
      return;
    }
    if (clicked === trigger) {
      clicked = null;
      return;
    }
    // Opened by hover (or by a click on another trigger): keep it open.
    event.preventDefault();
    clicked = trigger;
  };
  // Forget once nothing is open, so the next hover-open is guarded again.
  const states = new MutationObserver(() => {
    if (
      !root.querySelector(
        '[data-slot="navigation-menu-trigger"][data-state="open"]',
      )
    )
      clicked = null;
  });
  states.observe(root, {
    subtree: true,
    attributes: true,
    attributeFilter: ["data-state"],
  });
  root.addEventListener("click", onClick, true);
  return () => {
    states.disconnect();
    root.removeEventListener("click", onClick, true);
  };
}

/** Renders nothing visible; hosts the click guard on the menu root. */
function NavigationMenuClickGuard() {
  return <span hidden ref={guardHoverOpenedClicks} />;
}

export { NavigationMenuClickGuard, NavigationMenuViewportFrame };
