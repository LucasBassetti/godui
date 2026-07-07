"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type BeamDrawProps = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  /** SVG path `d` strings drawn along scroll progress. Sensible default beams if omitted. */
  paths?: string[];
  /** Stroke width of each beam. Defaults to 2. */
  strokeWidth?: number;
};

// SPRING.smooth — surfaces / shared-layout feel.
const SPRING = { stiffness: 320, damping: 32, mass: 0.9 } as const;

// A flowing default beam set on a 1000×400 canvas, fanning out from the left.
const DEFAULT_PATHS = [
  "M0 200 C 250 200, 350 60, 600 60 S 900 40, 1000 40",
  "M0 200 C 250 200, 350 140, 600 140 S 900 150, 1000 150",
  "M0 200 C 250 200, 350 260, 600 260 S 900 250, 1000 250",
  "M0 200 C 250 200, 350 340, 600 340 S 900 360, 1000 360",
];

const BeamDraw = React.forwardRef<SVGSVGElement, BeamDrawProps>(
  ({ paths = DEFAULT_PATHS, strokeWidth = 2, className, ...props }, ref) => {
    const reduce = useReducedMotion();
    const containerRef = React.useRef<SVGSVGElement>(null);
    React.useImperativeHandle(ref, () => containerRef.current as SVGSVGElement);

    const { scrollYProgress } = useScroll({
      // useScroll's target types expect an HTMLElement ref; the SVG root works
      // the same at runtime (getBoundingClientRect).
      target: containerRef as unknown as React.RefObject<HTMLElement>,
      offset: ["start end", "end start"],
    });
    const pathLength = useSpring(
      useTransform(scrollYProgress, [0.1, 0.8], [0, 1]),
      SPRING,
    );

    return (
      <svg
        ref={containerRef}
        data-slot="beam-draw"
        viewBox="0 0 1000 400"
        fill="none"
        aria-hidden="true"
        className={`w-full [filter:drop-shadow(0_0_8px_color-mix(in_oklch,var(--primary)_50%,transparent))] ${className ?? ""}`}
        {...props}
      >
        {paths.map((d, i) => (
          <motion.path
            // biome-ignore lint/suspicious/noArrayIndexKey: path list is positional and static.
            key={i}
            d={d}
            stroke="var(--primary)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ pathLength: reduce ? 1 : pathLength }}
          />
        ))}
      </svg>
    );
  },
);
BeamDraw.displayName = "BeamDraw";

export { BeamDraw };
