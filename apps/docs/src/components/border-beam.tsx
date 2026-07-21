"use client";

import { useLayoutEffect, useRef, useState } from "react";

type BorderBeamProps = {
  /** Bumps once per replay click; remounting on it restarts the animation. */
  play: number;
  /** Card corner radius in px (matches the card's rounded-* utility). */
  radius?: number;
};

/**
 * A double beam that races along the card's border, launching from the
 * top-right corner and converging at the bottom-left. Rendered as an absolute
 * overlay inside a `relative`, `overflow-hidden` card. The rounded-rect paths
 * are built in real pixels from the measured card size, so corners stay crisp
 * at any aspect ratio (no viewBox scaling distortion). Motion is a one-shot
 * stroke-dashoffset sweep — GPU-cheap and reduced-motion aware.
 */
export function BorderBeam({ play, radius = 16 }: BorderBeamProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const card = svgRef.current?.parentElement;
    if (!card || typeof ResizeObserver === "undefined") return;
    const update = () => setSize({ w: card.clientWidth, h: card.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  // Sit the beam just inside the border so overflow-hidden never clips it.
  const inset = 1;
  const r = Math.max(0, radius - inset);
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;

  // Both paths start at the top-right corner; one hugs the right+bottom edges,
  // the other the top+left edges. They meet at the bottom-left corner.
  const rightBottom = `M ${x1 - r} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y0 + r} L ${x1} ${y1 - r} A ${r} ${r} 0 0 1 ${x1 - r} ${y1} L ${x0 + r} ${y1} A ${r} ${r} 0 0 1 ${x0} ${y1 - r}`;
  const topLeft = `M ${x1 - r} ${y0} L ${x0 + r} ${y0} A ${r} ${r} 0 0 0 ${x0} ${y0 + r} L ${x0} ${y1 - r}`;

  return (
    <svg
      ref={svgRef}
      key={play}
      aria-hidden="true"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      className="pointer-events-none absolute inset-0 z-10 text-fd-primary/35 motion-reduce:hidden"
    >
      {w > 0 && play > 0 ? (
        <>
          <path
            d={rightBottom}
            pathLength={100}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="[animation:godui-replay-beam_500ms_cubic-bezier(0.4,0,0.2,1)_both] [stroke-dasharray:22_100]"
          />
          <path
            d={topLeft}
            pathLength={100}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="[animation:godui-replay-beam_500ms_cubic-bezier(0.4,0,0.2,1)_both] [stroke-dasharray:22_100]"
          />
        </>
      ) : null}
    </svg>
  );
}
