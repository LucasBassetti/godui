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
import { clamp, getTextContent, lerp } from "../lib/text-utils";

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
  /** Start the `auto` sweep only once the text scrolls into view. */
  startOnView?: boolean;
  /** Pointer influence radius in px (`hover` mode). */
  radius?: number;
};

const SPRING = { stiffness: 150, damping: 18, mass: 1 } as const;
const AUTO_SPREAD = 2.5;
const VIEW_THRESHOLD = 0.3;

// Uses the theme sans font (Geist is a variable font with a `wght` axis); on a
// non-variable font the weight steps to the nearest available cut.
const CONTAINER_CLASS =
  "inline-block font-sans leading-[1.1] text-inherit [font-optical-sizing:auto] [font-variation-settings:'wght'_400]";
const SEGMENT_CLASS =
  "inline-block whitespace-pre [font-variation-settings:'wght'_var(--et-wght,400)] [will-change:font-variation-settings] motion-reduce:[will-change:auto]";

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
        className={SEGMENT_CLASS}
        data-elastic-segment=""
        style={{ "--et-wght": minWeight } as React.CSSProperties}
      >
        {segment}
      </span>
    );
  }

  return (
    <motion.span
      className={SEGMENT_CLASS}
      data-elastic-segment=""
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
      startOnView = true,
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

    // Start off the left edge so the first paint is uniform normal weight — at
    // position 0 the leading character would render at max weight (a "big P"
    // flash) before the sweep effect runs.
    const spotlight = useMotionValue(-AUTO_SPREAD);
    const pointerX = useMotionValue(0);
    const pointerActive = useMotionValue(0);
    const centersRef = React.useRef<number[]>([]);
    const getCenter = React.useCallback(
      (index: number) => centersRef.current[index] ?? 0,
      [],
    );

    // Auto mode: sweep the spotlight across the characters. When `startOnView`
    // is set, hold off until the text scrolls into view via IntersectionObserver.
    React.useEffect(() => {
      if (reducedMotion || mode !== "auto" || !segments) {
        return;
      }
      const last = Math.max(segments.length - 1, 1);
      // Rest off the left edge so every character sits at normal weight until
      // the sweep actually starts (no leading-character flash while waiting).
      spotlight.set(-AUTO_SPREAD);

      const start = () =>
        loop
          ? // Loop: sweep back and forth forever.
            animate(spotlight, [0, last], {
              duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              ease: "easeInOut",
            })
          : // Once: a single pass that starts and ends off the text (padded by
            // AUTO_SPREAD on both sides) so the weight settles back to normal
            // everywhere instead of leaving the leading characters emphasized.
            animate(spotlight, [-AUTO_SPREAD, last + AUTO_SPREAD], {
              duration,
              ease: "easeInOut",
            });

      const node = containerRef.current;
      if (
        !startOnView ||
        !node ||
        typeof IntersectionObserver === "undefined"
      ) {
        const controls = start();
        return () => controls.stop();
      }

      let controls: ReturnType<typeof animate> | undefined;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              controls = start();
              observer.disconnect();
              break;
            }
          }
        },
        { threshold: VIEW_THRESHOLD },
      );
      observer.observe(node);
      return () => {
        observer.disconnect();
        controls?.stop();
      };
    }, [duration, loop, mode, reducedMotion, segments, spotlight, startOnView]);

    const updateCenters = React.useCallback(() => {
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const spans = container.querySelectorAll("[data-elastic-segment]");
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
          data-slot="elastic-text"
          className={`${CONTAINER_CLASS} ${className ?? ""}`}
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
        data-slot="elastic-text"
        className={`${CONTAINER_CLASS} ${className ?? ""}`}
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
