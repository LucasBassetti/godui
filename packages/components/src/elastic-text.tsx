"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";
import { clamp, getTextContent, lerp } from "./text-utils";

/**
 * How the weight emphasis is driven:
 * - `auto`  — a spotlight sweeps across the text on its own (default).
 * - `hover` — the emphasis follows the pointer while it's over the text.
 */
export type ElasticTextMode = "auto" | "hover";

export type ElasticTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  mode?: ElasticTextMode;
  /** Resting (lightest) font weight. */
  minWeight?: number;
  /** Peak (heaviest) font weight under the spotlight / pointer. */
  maxWeight?: number;
  /** Seconds for one full `auto` sweep across the text. */
  duration?: number;
  /** Repeat the `auto` sweep. */
  loop?: boolean;
  /** Pointer influence radius in px (`hover` mode). */
  radius?: number;
};

const SPRING = { stiffness: 150, damping: 18, mass: 1 } as const;
const AUTO_SPREAD = 2.5;

type SegmentProps = {
  segment: string;
  index: number;
  minWeight: number;
  maxWeight: number;
  reducedMotion: boolean;
  mode: ElasticTextMode;
  spotlight: ReturnType<typeof useMotionValue<number>>;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerActive: ReturnType<typeof useMotionValue<number>>;
  getCenter: (index: number) => number;
  radius: number;
};

function Segment({
  segment,
  index,
  minWeight,
  maxWeight,
  reducedMotion,
  mode,
  spotlight,
  pointerX,
  pointerActive,
  getCenter,
  radius,
}: SegmentProps) {
  const autoWeight = useTransform(spotlight, (position) => {
    const distance = Math.abs(index - position);
    const influence = clamp(1 - distance / AUTO_SPREAD, 0, 1);
    return lerp(minWeight, maxWeight, influence);
  });

  const hoverWeight = useTransform([pointerX, pointerActive], (latest) => {
    const [x, active] = latest as [number, number];
    if (!active) {
      return minWeight;
    }
    const distance = Math.abs(x - getCenter(index));
    const influence = clamp(1 - distance / radius, 0, 1);
    return lerp(minWeight, maxWeight, influence);
  });

  const rawWeight = mode === "hover" ? hoverWeight : autoWeight;
  const weight = useSpring(rawWeight, SPRING);

  if (reducedMotion) {
    return (
      <span
        className="elastic-text-segment"
        style={{ "--et-wght": minWeight } as React.CSSProperties}
      >
        {segment}
      </span>
    );
  }

  return (
    <motion.span
      className="elastic-text-segment"
      style={{ "--et-wght": weight } as React.CSSProperties}
      aria-hidden={segment.trim() === "" ? true : undefined}
    >
      {segment}
    </motion.span>
  );
}

const ElasticText = React.forwardRef<HTMLSpanElement, ElasticTextProps>(
  (
    {
      children,
      className,
      mode = "auto",
      minWeight = 300,
      maxWeight = 900,
      duration = 2,
      loop = true,
      radius = 120,
      ...props
    },
    ref,
  ) => {
    const reducedMotion = useReducedMotion() ?? false;
    const containerRef = React.useRef<HTMLSpanElement>(null);
    const mergedRef = React.useCallback(
      (node: HTMLSpanElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const textContent = getTextContent(children);
    const segments = React.useMemo(
      () => (textContent ? [...textContent] : null),
      [textContent],
    );

    const spotlight = useMotionValue(0);
    const pointerX = useMotionValue(0);
    const pointerActive = useMotionValue(0);
    const centersRef = React.useRef<number[]>([]);
    const getCenter = React.useCallback(
      (index: number) => centersRef.current[index] ?? 0,
      [],
    );

    // Auto mode: sweep the spotlight back and forth across the characters.
    React.useEffect(() => {
      if (reducedMotion || mode !== "auto" || !segments) {
        return;
      }
      const controls = animate(
        spotlight,
        [0, Math.max(segments.length - 1, 1)],
        {
          duration,
          // Infinite: sweep forever. Finite: one sweep out and back to rest.
          repeat: loop ? Number.POSITIVE_INFINITY : 1,
          repeatType: "mirror",
          ease: "easeInOut",
        },
      );
      return () => controls.stop();
    }, [duration, loop, mode, reducedMotion, segments, spotlight]);

    const updateCenters = React.useCallback(() => {
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const spans = container.querySelectorAll(".elastic-text-segment");
      centersRef.current = Array.from(spans).map((span) => {
        const rect = span.getBoundingClientRect();
        return rect.left + rect.width / 2;
      });
    }, []);

    React.useLayoutEffect(() => {
      if (mode !== "hover") {
        return;
      }
      updateCenters();
      if (typeof window === "undefined") {
        return;
      }
      window.addEventListener("resize", updateCenters);
      return () => window.removeEventListener("resize", updateCenters);
    }, [mode, updateCenters]);

    const handleMouseMove = React.useCallback(
      (event: React.MouseEvent<HTMLSpanElement>) => {
        if (mode !== "hover") {
          return;
        }
        pointerX.set(event.clientX);
        updateCenters();
      },
      [mode, pointerX, updateCenters],
    );

    const interactionProps =
      mode === "hover" && !reducedMotion
        ? {
            onMouseEnter: () => pointerActive.set(1),
            onMouseLeave: () => pointerActive.set(0),
            onMouseMove: handleMouseMove,
          }
        : undefined;

    if (!segments) {
      return (
        <span
          ref={mergedRef}
          className={`elastic-text ${className ?? ""}`}
          style={{ "--et-wght": minWeight } as React.CSSProperties}
          {...props}
        >
          {children}
        </span>
      );
    }

    return (
      <span
        ref={mergedRef}
        className={`elastic-text ${className ?? ""}`}
        {...interactionProps}
        {...props}
      >
        {segments.map((segment, index) => (
          <Segment
            // biome-ignore lint/suspicious/noArrayIndexKey: characters are positional
            key={index}
            segment={segment}
            index={index}
            minWeight={minWeight}
            maxWeight={maxWeight}
            reducedMotion={reducedMotion}
            mode={mode}
            spotlight={spotlight}
            pointerX={pointerX}
            pointerActive={pointerActive}
            getCenter={getCenter}
            radius={radius}
          />
        ))}
      </span>
    );
  },
);
ElasticText.displayName = "ElasticText";

export { ElasticText };
