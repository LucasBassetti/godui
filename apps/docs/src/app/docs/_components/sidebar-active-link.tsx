"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The Learn article lives at `<component>/learn`, a route with no sidebar node
 * (it's pruned — reachable only via the Docs|Learn tab). fumadocs therefore
 * marks the component's sidebar link inactive here. This keeps that link
 * selected by flipping its `data-active` flag while we're on the learn route.
 *
 * On leave we must clear the forced flag — otherwise the MutationObserver race
 * during client navigation leaves *two* sidebar items with `data-active="true"`.
 */
export function SidebarActiveLink({ href }: { href: string }) {
  const pathname = usePathname();
  const onLearn = pathname === `${href}/learn` || pathname === `${href}/learn/`;

  useEffect(() => {
    if (!onLearn) return;

    const select = () =>
      document.querySelectorAll<HTMLAnchorElement>(
        `#nd-sidebar a[href="${href}"]`,
      );

    let observer: MutationObserver | null = null;

    const apply = () => {
      // Bail if we've already navigated away — prevents fighting fumadocs
      // during the unmount window of a client transition.
      const path = window.location.pathname.replace(/\/$/, "") || "/";
      if (path !== `${href.replace(/\/$/, "")}/learn`) return;

      observer?.disconnect();
      for (const a of select()) {
        if (a.getAttribute("data-active") !== "true") {
          a.setAttribute("data-active", "true");
        }
      }
      observer?.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["data-active"],
      });
    };

    observer = new MutationObserver(apply);
    apply();

    return () => {
      observer?.disconnect();

      const clear = () => {
        for (const a of select()) {
          if (a.getAttribute("data-active") === "true") {
            a.setAttribute("data-active", "false");
          }
        }
      };

      // Fast path: another sidebar item is already active — drop ours now so
      // two pills never linger.
      const others = document.querySelectorAll(
        `#nd-sidebar a[data-active="true"]:not([href="${href}"])`,
      );
      if (others.length > 0) {
        clear();
        return;
      }

      // Slow path: wait a tick for the new route's active link to land, then
      // clear only if we've left this component (Docs tab of the same
      // component should stay selected — leave that to fumadocs).
      const hrefToClear = href;
      queueMicrotask(() => {
        const path = window.location.pathname.replace(/\/$/, "") || "/";
        const base = hrefToClear.replace(/\/$/, "");
        if (
          path === `${base}/learn` ||
          path === base ||
          path.startsWith(`${base}/`)
        ) {
          return;
        }
        for (const a of document.querySelectorAll<HTMLAnchorElement>(
          `#nd-sidebar a[href="${hrefToClear}"]`,
        )) {
          if (a.getAttribute("data-active") === "true") {
            a.setAttribute("data-active", "false");
          }
        }
      });
    };
  }, [href, onLearn]);

  return null;
}
