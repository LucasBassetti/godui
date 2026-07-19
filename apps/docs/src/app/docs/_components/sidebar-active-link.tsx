"use client";

import { useEffect } from "react";

/**
 * The Learn article lives at `<component>/learn`, a route with no sidebar node
 * (it's pruned — reachable only via the Docs|Learn tab). fumadocs therefore
 * marks the component's sidebar link inactive here. This keeps that link
 * selected by flipping its `data-active` flag, re-asserting if fumadocs
 * re-renders the tree.
 */
export function SidebarActiveLink({ href }: { href: string }) {
  useEffect(() => {
    let observer: MutationObserver | null = null;
    const apply = () => {
      observer?.disconnect();
      for (const a of document.querySelectorAll<HTMLAnchorElement>(
        `a[data-active][href="${href}"]`,
      )) {
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
    return () => observer?.disconnect();
  }, [href]);

  return null;
}
