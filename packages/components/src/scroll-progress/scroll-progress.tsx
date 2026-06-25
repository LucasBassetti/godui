"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type ScrollProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  /** `bar` pins a progress line; `circle` shows a fading back-to-top ring. */
  variant?: "bar" | "circle";
  /** Track a scrollable element instead of the page (pins within it). */
  container?: React.RefObject<HTMLElement>;
  /** Track scroll of a target element relative to the viewport. */
  target?: React.RefObject<HTMLElement>;
  /** Bar thickness in px (bar variant). */
  height?: number;
  /** Ring diameter in px (circle variant). */
  size?: number;
  /** Reveal the circle only after this progress fraction (0–1). */
  showAfter?: number;
  /** Corner the circle docks to (circle variant). */
  position?: "bottom-right" | "bottom-left";
};

const SPRING = { stiffness: 120, damping: 24, restDelta: 0.001 };

const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(
  (
    {
      variant = "bar",
      container,
      target,
      height = 3,
      size = 44,
      showAfter = 0.05,
      position = "bottom-right",
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll(
      container
        ? { container }
        : target
          ? { target, offset: ["start start", "end end"] }
          : undefined,
    );
    const progress = useSpring(
      scrollYProgress,
      reduceMotion ? { stiffness: 1000, damping: 100 } : SPRING,
    );
    // `container` pins within a scroll box (sticky); otherwise pin to the page.
    const pinned = container ? "sticky" : "fixed";

    if (variant === "circle") {
      return (
        <CircleProgress
          ref={ref}
          progress={progress}
          rawProgress={scrollYProgress}
          size={size}
          showAfter={showAfter}
          pinned={pinned}
          position={position}
          className={className}
          {...props}
        />
      );
    }

    return (
      <motion.div
        ref={ref}
        role="progressbar"
        aria-label="Scroll progress"
        style={{ scaleX: progress, height }}
        className={`${pinned} inset-x-0 top-0 left-0 z-sticky origin-left bg-primary ${
          className ?? ""
        }`}
        {...(props as React.ComponentProps<typeof motion.div>)}
      />
    );
  },
);
ScrollProgress.displayName = "ScrollProgress";

type CircleProps = ScrollProgressProps & {
  progress: ReturnType<typeof useSpring>;
  rawProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  pinned: "sticky" | "fixed";
  position?: "bottom-right" | "bottom-left";
};

const CircleProgress = React.forwardRef<HTMLDivElement, CircleProps>(
  (
    {
      progress,
      rawProgress,
      size = 44,
      showAfter = 0.05,
      pinned,
      position = "bottom-right",
      className,
    },
    ref,
  ) => {
    const left = position === "bottom-left";
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
      const update = (v: number) => setVisible(v > (showAfter ?? 0.05));
      update(rawProgress.get());
      const unsub = rawProgress.on("change", update);
      return unsub;
    }, [rawProgress, showAfter]);

    const r = (size - 6) / 2;
    const circumference = 2 * Math.PI * r;
    const dashoffset = useTransform(
      progress,
      (v) => circumference * (1 - Math.min(Math.max(v, 0), 1)),
    );

    const button = (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        aria-label="Back to top"
        onClick={(e) => {
          const scroller =
            (e.currentTarget.closest(
              "[data-scroll-container]",
            ) as HTMLElement | null) ?? null;
          if (scroller) {
            scroller.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{ width: size, height: size }}
        className="pointer-events-auto relative grid place-items-center rounded-full border border-border bg-background text-foreground shadow-lg"
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            className="text-border"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashoffset }}
            className="text-primary"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </motion.button>
    );

    return (
      <AnimatePresence>
        {visible &&
          (pinned === "sticky" ? (
            <div
              className={`pointer-events-none sticky bottom-6 z-sticky flex ${
                left ? "justify-start pl-6" : "justify-end pr-6"
              } ${className ?? ""}`}
            >
              {button}
            </div>
          ) : (
            <div
              className={`pointer-events-none fixed bottom-6 z-sticky ${
                left ? "left-6" : "right-6"
              } ${className ?? ""}`}
            >
              {button}
            </div>
          ))}
      </AnimatePresence>
    );
  },
);
CircleProgress.displayName = "CircleProgress";

export { ScrollProgress };
