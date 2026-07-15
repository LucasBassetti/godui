import type { ComponentProps } from "react";

type GoduiLogoProps = Omit<ComponentProps<"svg">, "viewBox"> & {
  alt?: string;
};

// Centerline of the "G" track — a chunky geometric letterform: a thick ring
// open at the upper-right that sweeps around and turns into a crossbar ending
// near the center. The thick stroke's round terminal cradles the dot at rest;
// on hover the dot pops out and rides this exact path, 0% → 100%. Keep in sync
// with public/godui-logo-{light,dark}.svg and app/icon.svg.
const TRACK = "M361.5 153.6 A150 150 0 1 0 400 254 L272 254";

// GodUI mark. EXPERIMENT: fixed dark badge (does not invert with the theme) —
// dark rounded square, muted "G", white dot that stays white in dark mode. No
// dashed target ring. No SVG gradient/filter <defs> ids: colors are literal
// and the dot's lift is a CSS drop-shadow, so multiple instances never collide.
export function GoduiLogo({ alt = "GodUI", ...props }: GoduiLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label={alt}
      {...props}
      // The header's backdrop-blur composites a layer that can rasterize the
      // SVG at CSS px (aliased curves). Promote it to its own layer so it
      // rasterizes at device resolution → crisp edges.
      style={{ transform: "translateZ(0)", ...props.style }}
    >
      <title>{alt}</title>
      <style>{`
        .godui-mark .godui-dot {
          /* transform-box: view-box maps offset-path coords to SVG user space.
             Do NOT set offset-anchor: with a view-box box it would anchor the
             box center (256,256) and fling the dot off-mark. */
          transform-box: view-box;
          offset-path: path("${TRACK}");
          offset-distance: 0%;
          filter: drop-shadow(0 3px 5px rgb(0 0 0 / 0.4));
          transition: offset-distance 1.1s cubic-bezier(.65,.05,.36,1);
        }
        /* Animate on hover of the mark itself, OR of any ancestor tagged
           .godui-hover-group (e.g. the header's logo+wordmark link). Inline
           SVG style elements are document-scoped, so the ancestor selector
           resolves. */
        .godui-mark:hover .godui-dot,
        .godui-hover-group:hover .godui-dot { offset-distance: 100%; }
        @media (prefers-reduced-motion: reduce) {
          .godui-mark .godui-dot { transition: none; }
        }
      `}</style>

      <g className="godui-mark">
        {/* fixed dark rounded-square surface */}
        <rect x="0" y="0" width="512" height="512" rx="92" fill="#1c1c1c" />
        {/* hairline rim-light */}
        <rect
          x="3"
          y="3"
          width="506"
          height="506"
          rx="89"
          fill="none"
          stroke="rgb(255 255 255 / 0.12)"
          strokeWidth="3"
        />
        {/* the "G", drawn as a single thick rounded stroke = the track */}
        <path
          d={TRACK}
          fill="none"
          stroke="#8f8f8f"
          strokeWidth="82"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* moving dot — parks inside the stroke's round terminal, rides the
            "G" to the center */}
        <circle className="godui-dot" r="29" fill="#ffffff" />
      </g>
    </svg>
  );
}
