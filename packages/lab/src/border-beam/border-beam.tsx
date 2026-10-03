"use client";

import { motion, type Transition, useReducedMotion } from "framer-motion";
import * as React from "react";

export type BorderBeamProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color"
> & {
  /** Side length (px) of the square beam — larger reads as a longer streak. */
  size?: number;
  /** Seconds for one full loop around the border. */
  duration?: number;
  /** Seconds to delay the start of the loop. */
  delay?: number;
  /** Leading edge color of the beam gradient. */
  colorFrom?: string;
  /** Trailing edge color of the beam gradient. */
  colorTo?: string;
  /** Override the motion transition. */
  transition?: Transition;
  /** Border thickness (px) the beam rides along. */
  borderWidth?: number;
  /** Travel counter-clockwise instead of clockwise. */
  reverse?: boolean;
  /** Starting position along the border, as a percentage (0–100). */
  initialOffset?: number;
  /** Render a soft, blurred echo of the beam for a neon glow. */
  glow?: boolean;
  /** Use the flowing rainbow gradient (shared with MagicButton). Overrides `colorFrom`/`colorTo`. */
  rainbow?: boolean;
};

// Same hue order as the MagicButton rainbow edge, trailing off to transparent
// so the moving beam keeps its comet fade.
const RAINBOW_BEAM =
  "linear-gradient(to left, var(--rainbow-1), var(--rainbow-5), var(--rainbow-3), var(--rainbow-4), transparent)";

const BorderBeam = React.forwardRef<HTMLDivElement, BorderBeamProps>(
  (
    {
      className,
      style,
      size = 60,
      duration = 6,
      delay = 0,
      colorFrom = "var(--chart-1)",
      colorTo = "var(--chart-5)",
      transition,
      borderWidth = 1,
      reverse = false,
      initialOffset = 0,
      glow = false,
      rainbow = true,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();

    // A square rides the padding-box border path; animating `offset-distance`
    // sweeps it around, and the mask reveals only the border ring.
    const beamStyle = {
      width: size,
      offsetPath: `rect(0 auto auto 0 round ${size}px)`,
      "--color-from": colorFrom,
      "--color-to": colorTo,
      ...(rainbow ? { background: RAINBOW_BEAM } : null),
      ...style,
    } as React.CSSProperties;

    // The rainbow look paints via `background`; the two-color look via utilities.
    const beamGradient = rainbow
      ? ""
      : "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent";

    const animate = reduceMotion
      ? { offsetDistance: `${initialOffset}%` }
      : {
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        };
    const motionTransition: Transition = reduceMotion
      ? { duration: 0 }
      : {
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        };

    return (
      <div
        ref={ref}
        data-slot="border-beam"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
        style={
          { "--border-beam-width": `${borderWidth}px` } as React.CSSProperties
        }
        {...props}
      >
        {glow ? (
          <motion.div
            aria-hidden="true"
            className={`absolute aspect-square opacity-60 blur-md ${beamGradient}`}
            style={beamStyle}
            initial={{ offsetDistance: `${initialOffset}%` }}
            animate={animate}
            transition={motionTransition}
          />
        ) : null}
        <motion.div
          aria-hidden="true"
          className={`absolute aspect-square ${beamGradient} ${className ?? ""}`}
          style={beamStyle}
          initial={{ offsetDistance: `${initialOffset}%` }}
          animate={animate}
          transition={motionTransition}
        />
      </div>
    );
  },
);
BorderBeam.displayName = "BorderBeam";

export { BorderBeam };
