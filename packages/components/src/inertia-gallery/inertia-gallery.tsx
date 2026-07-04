"use client";

import {
  animate,
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type InertiaGalleryProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> & {
  /** Slides, in order. */
  children?: React.ReactNode;
  /** Slide width in px. */
  itemWidth?: number;
  /** Gap between slides in px. */
  gap?: number;
  /** Snap the nearest slide to center when the throw settles. */
  snap?: boolean;
  /** 0 disables the distance-from-center scale/blur/opacity falloff. */
  falloff?: number;
  /** Slide centered on mount. */
  defaultIndex?: number;
  /** Fired when a new slide reaches center. */
  onChange?: (index: number) => void;
};

// SPRING.smooth — surfaces / settle.
const SETTLE_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
} as const;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

type ItemProps = {
  offset: number;
  pitch: number;
  x: MotionValue<number>;
  falloff: number;
  reduce: boolean;
  width: number;
  children: React.ReactNode;
};

const InertiaItem: React.FC<ItemProps> = ({
  offset,
  pitch,
  x,
  falloff,
  reduce,
  width,
  children,
}) => {
  // Normalised distance of this slide's center from the viewport center.
  const nd = useTransform(x, (xv) =>
    Math.min(Math.abs(offset + xv) / pitch, 2.4),
  );
  const scale = useTransform(nd, (d) => 1 - d * 0.14 * falloff);
  const opacity = useTransform(nd, (d) => clamp(1 - d * 0.3 * falloff, 0.4, 1));
  const blurPx = useTransform(nd, (d) =>
    reduce ? 0 : Math.min(d * 3.2, 5) * falloff,
  );
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.div
      className="relative shrink-0"
      style={{ width, scale, opacity, filter }}
    >
      <div className="aspect-[3/4] size-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {children}
      </div>
    </motion.div>
  );
};

const InertiaGallery = React.forwardRef<HTMLDivElement, InertiaGalleryProps>(
  (
    {
      children,
      itemWidth = 200,
      gap = 24,
      snap = false,
      falloff = 1,
      defaultIndex = 0,
      onChange,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const reduce = useReducedMotion() ?? false;
    const items = React.Children.toArray(children);
    const count = items.length;
    const pitch = itemWidth + gap;
    const effFalloff = reduce ? 0 : falloff;
    const start = Math.max(0, Math.min(count - 1, defaultIndex));

    const x = useMotionValue(-start * pitch);
    const [active, setActive] = React.useState(start);
    const [pad, setPad] = React.useState(0);
    const viewportRef = React.useRef<HTMLDivElement>(null);

    const onChangeRef = React.useRef(onChange);
    onChangeRef.current = onChange;

    // Center the first/last slide by padding the track by half the free space.
    React.useEffect(() => {
      const el = viewportRef.current;
      if (!el) return;
      const measure = () =>
        setPad(Math.max(0, (el.clientWidth - itemWidth) / 2));
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, [itemWidth]);

    const commit = React.useCallback(
      (index: number) => {
        const next = clamp(index, 0, count - 1);
        setActive((prev) => {
          if (prev !== next) onChangeRef.current?.(next);
          return next;
        });
        return next;
      },
      [count],
    );

    const goTo = React.useCallback(
      (index: number) => {
        const next = commit(index);
        animate(x, -next * pitch, SETTLE_SPRING);
      },
      [commit, pitch, x],
    );

    const nearest = React.useCallback(
      () => clamp(Math.round(-x.get() / pitch), 0, count - 1),
      [count, pitch, x],
    );

    const handleDragEnd = () => {
      if (snap) goTo(nearest());
      else commit(nearest());
    };

    const handleKey = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(active - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(active + 1);
      }
    };

    return (
      <div
        ref={forwardedRef}
        data-slot="inertia-gallery"
        className={`flex flex-col items-center gap-5 ${className ?? ""}`}
        {...props}
      >
        {/* biome-ignore lint/a11y/useSemanticElements: composite carousel widget */}
        <div
          ref={viewportRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Gallery"
          className="relative w-full max-w-full touch-pan-y overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <motion.div
            className="flex cursor-grab items-center active:cursor-grabbing"
            style={{ x, gap, paddingLeft: pad, paddingRight: pad }}
            drag="x"
            dragConstraints={{ left: -(count - 1) * pitch, right: 0 }}
            dragElastic={0.16}
            onDragEnd={handleDragEnd}
          >
            {items.map((child, i) => (
              <InertiaItem
                // biome-ignore lint/suspicious/noArrayIndexKey: slides are positional
                key={i}
                offset={i * pitch}
                pitch={pitch}
                x={x}
                falloff={effFalloff}
                reduce={reduce}
                width={itemWidth}
              >
                {child}
              </InertiaItem>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            onKeyDown={handleKey}
            disabled={active === 0}
            aria-label="Previous"
            className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm [transition:transform_150ms,background_150ms] hover:bg-accent active:scale-95 disabled:opacity-40"
          >
            ‹
          </button>
          <span className="text-sm tabular-nums text-muted-foreground">
            {active + 1} / {count}
          </span>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            onKeyDown={handleKey}
            disabled={active === count - 1}
            aria-label="Next"
            className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm [transition:transform_150ms,background_150ms] hover:bg-accent active:scale-95 disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    );
  },
);
InertiaGallery.displayName = "InertiaGallery";

export { InertiaGallery };
