"use client";

import { useEffect, useRef } from "react";

/**
 * Dashed center-fade grid backdrop with a subtle pointer parallax. Split into
 * its own client component so the home page itself can stay a server component
 * (and fetch the star count server-side).
 */
export function HeroGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle parallax: nudge the grid a few px toward the pointer.
    const STRENGTH = 12; // max px offset in each axis
    let frame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        if (gridRef.current) {
          gridRef.current.style.transform = `translate3d(${x * STRENGTH}px, ${y * STRENGTH}px, 0) scale(1.04)`;
        }
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="pointer-events-none absolute inset-0 z-0 transition-transform duration-300 ease-out [transition-property:transform] will-change-transform"
      // Initial scale keeps the grid covering the viewport while it parallaxes.
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--color-fd-border) 1px, transparent 1px),
          linear-gradient(to bottom, var(--color-fd-border) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 0",
        maskImage: `
          repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
          radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)
        `,
        WebkitMaskImage: `
          repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
          radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)
        `,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
        transform: "translate3d(0, 0, 0) scale(1.04)",
      }}
    />
  );
}
