"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

/**
 * Renders the demo inside an <iframe> so real CSS media queries fire against the
 * frame's width — the only way to simulate mobile for components that ship
 * viewport breakpoints (`md:` etc.) internally. Used for the "mobile" view only;
 * desktop renders in-page (cheaper). Parent stylesheets + theme class are cloned
 * into the frame and the demo is portaled into its body.
 */
export function PreviewFrame({
  children,
  fullWidth,
}: {
  children: ReactNode;
  fullWidth: boolean;
}) {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(440);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  // Set up the iframe in a ref callback (not an effect): the document mutation
  // and setState below are valid here, and `frame` is a local rather than a
  // useState value, so the strict react-hooks lint rules don't fire.
  const attach = useCallback((frame: HTMLIFrameElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = undefined;
    const doc = frame?.contentDocument;
    if (!doc) {
      setMount(null);
      return;
    }

    const syncTheme = () => {
      doc.documentElement.className = document.documentElement.className;
      doc.documentElement.setAttribute(
        "style",
        document.documentElement.getAttribute("style") ?? "",
      );
    };

    // Clone parent stylesheets (Tailwind, fonts) into the frame.
    for (const node of document.head.querySelectorAll(
      'style, link[rel="stylesheet"]',
    )) {
      doc.head.appendChild(node.cloneNode(true));
    }
    syncTheme();
    doc.body.style.margin = "0";
    doc.body.style.background = "transparent";
    setMount(doc.body);

    const ro = new ResizeObserver(() => {
      setHeight(Math.max(360, doc.body.scrollHeight));
    });
    ro.observe(doc.body);
    const mo = new MutationObserver(syncTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    cleanupRef.current = () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  return (
    <>
      <iframe
        ref={attach}
        title="Mobile preview"
        className="w-[360px] max-w-full overflow-hidden rounded-[28px] border-[6px] border-fd-border bg-fd-background shadow-md transition-[height] duration-200"
        style={{ height }}
      />
      {mount
        ? createPortal(
            <div
              className={cn(
                "flex w-full",
                fullWidth
                  ? "flex-col"
                  : "min-h-[440px] items-center justify-center p-4",
              )}
            >
              {children}
            </div>,
            mount,
          )
        : null}
    </>
  );
}
