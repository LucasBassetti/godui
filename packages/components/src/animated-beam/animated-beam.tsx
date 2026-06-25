"use client";

import { motion } from "framer-motion";
import * as React from "react";

export type AnimatedBeamProps = {
  /** The element the SVG overlays — both refs must live inside it. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Element the beam starts from. */
  fromRef: React.RefObject<HTMLElement | null>;
  /** Element the beam ends at. */
  toRef: React.RefObject<HTMLElement | null>;
  /** Bow of the curve in pixels (positive bends upward). */
  curvature?: number;
  /** Animate from the end toward the start. */
  reverse?: boolean;
  /** Seconds for one travel of the gradient. */
  duration?: number;
  /** Delay before the first travel, in seconds. */
  delay?: number;
  /** Color of the static resting path. */
  pathColor?: string;
  /** Width of the path in pixels. */
  pathWidth?: number;
  /** Opacity of the static resting path. */
  pathOpacity?: number;
  /**
   * SVG `stroke-dasharray` for the resting path — e.g. `"4 5"` for dashes or
   * `"0.1 8"` (with the round cap) for dots. Omit for a solid line.
   */
  pathDashArray?: string;
  /** Leading color of the travelling gradient. */
  gradientStartColor?: string;
  /** Trailing color of the travelling gradient. */
  gradientStopColor?: string;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
  className?: string;
};

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  pathColor = "var(--border)",
  pathWidth = 2,
  pathOpacity = 0.2,
  pathDashArray,
  gradientStartColor = "var(--primary)",
  gradientStopColor = "color-mix(in oklch, var(--primary) 40%, transparent)",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  className,
}: AnimatedBeamProps) {
  const id = React.useId();
  const [path, setPath] = React.useState("");
  const [box, setBox] = React.useState({ width: 0, height: 0 });

  const gradient = reverse
    ? { x1: ["90%", "-10%"], x2: ["100%", "0%"] }
    : { x1: ["10%", "110%"], x2: ["0%", "100%"] };

  React.useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return;

      const c = container.getBoundingClientRect();
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();

      setBox({ width: c.width, height: c.height });

      const startX = a.left - c.left + a.width / 2 + startXOffset;
      const startY = a.top - c.top + a.height / 2 + startYOffset;
      const endX = b.left - c.left + b.width / 2 + endXOffset;
      const endY = b.top - c.top + b.height / 2 + endYOffset;
      const controlX = (startX + endX) / 2;
      const controlY = (startY + endY) / 2 - curvature;

      setPath(
        `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`,
      );
    };

    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  return (
    <svg
      fill="none"
      width={box.width}
      height={box.height}
      viewBox={`0 0 ${box.width} ${box.height}`}
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none absolute left-0 top-0 [transform:translateZ(0)] ${className ?? ""}`}
    >
      <path
        d={path}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeDasharray={pathDashArray}
        strokeLinecap="round"
      />
      <path
        d={path}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
          animate={{
            x1: gradient.x1,
            x2: gradient.x2,
            y1: ["0%", "0%"],
            y2: ["0%", "0%"],
          }}
          transition={{
            duration,
            delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
