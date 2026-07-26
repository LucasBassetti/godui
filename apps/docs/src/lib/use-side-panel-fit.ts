"use client";

import { useEffect, useState } from "react";

/** Centered docs layout cap (90rem) — must match `#nd-docs-layout` max-width. */
const LAYOUT_MAX = 1440;
/** Docs rail width — must match `--wb-panel-w` (min(440px, 34vw)) in globals.css. */
function panelWidth(vw: number) {
  return Math.min(440, vw * 0.34);
}

/**
 * `true` when the viewport has enough free horizontal slack (outside the centered
 * 90rem content) to absorb the docs rail — i.e. the whole app can slide left by
 * the rail width without clipping or resizing. Otherwise the docs open as a
 * bottom sheet. Recomputed on resize. SSR-safe default `true` (desktop-first) so
 * the rail's docs render into the DOM for aeo.js before hydration corrects.
 */
export function useSidePanelFit() {
  const [fits, setFits] = useState(true);

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      setFits(vw - Math.min(vw, LAYOUT_MAX) >= panelWidth(vw));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return fits;
}
