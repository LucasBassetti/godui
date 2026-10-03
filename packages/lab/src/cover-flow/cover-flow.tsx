"use client";

import { motion, type PanInfo, useReducedMotion } from "framer-motion";
import * as React from "react";

export type CoverFlowProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> & {
  /** Slides, in order. The centered one faces front. */
  children?: React.ReactNode;
  /** Index shown at center on mount. */
  defaultIndex?: number;
  /** Fired when the centered slide settles on a new index. */
  onChange?: (index: number) => void;
  /** Slide width in px. */
  itemWidth?: number;
  /** Slide height in px. */
  itemHeight?: number;
  /** Extra px added between slide centers, on top of the overlap. */
  gap?: number;
  /** CSS perspective depth for the 3D stage. */
  perspective?: number;
  /** Render a fading floor reflection under each slide. */
  reflection?: boolean;
};

// SPRING.smooth — surfaces / shared-layout morph.
const MORPH_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
} as const;

const clampIndex = (v: number, count: number) =>
  Math.max(0, Math.min(count - 1, v));

type CoverItemProps = {
  offset: number;
  spacing: number;
  width: number;
  height: number;
  reflection: boolean;
  reduce: boolean;
  onSelect: () => void;
  children: React.ReactNode;
};

const CoverItem: React.FC<CoverItemProps> = ({
  offset,
  spacing,
  width,
  height,
  reflection,
  reduce,
  onSelect,
  children,
}) => {
  const sign = Math.sign(offset);
  const abs = Math.abs(offset);
  const near = Math.min(abs, 1);
  const far = Math.max(abs - 1, 0);
  // Neighbours sit a full pitch out; farther cards compress so the row
  // telescopes toward the edges instead of scrolling off-screen.
  const x = sign * (near * spacing + far * spacing * 0.55);
  const rotateY = reduce ? 0 : -Math.max(-1, Math.min(1, offset)) * 52;
  const z = reduce ? 0 : -Math.min(abs, 3) * 130;
  const scale = 1 - Math.min(abs, 3) * 0.08;
  const opacity =
    abs > 3.4 ? 0 : Math.max(0.15, 1 - Math.max(abs - 1, 0) * 0.28);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 cursor-pointer [transform-style:preserve-3d]"
      style={{
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        zIndex: Math.round(100 - abs * 10),
        transformPerspective: 1000,
      }}
      initial={false}
      animate={{ x, rotateY, z, scale, opacity }}
      transition={MORPH_SPRING}
      onTap={onSelect}
    >
      <div className="size-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {children}
      </div>
      {reflection && !reduce ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-full mt-1 h-1/2 overflow-hidden rounded-2xl opacity-30 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.6),transparent)] [transform:scaleY(-1)]"
        >
          <div className="size-full overflow-hidden rounded-2xl border border-border bg-card">
            {children}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};

const CoverFlow = React.forwardRef<HTMLDivElement, CoverFlowProps>(
  (
    {
      children,
      defaultIndex = 0,
      onChange,
      itemWidth = 240,
      itemHeight = 300,
      gap = 0,
      perspective = 1200,
      reflection = true,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const reduce = useReducedMotion() ?? false;
    const items = React.Children.toArray(children);
    const count = items.length;
    const spacing = itemWidth * 0.72 + gap;

    const [active, setActive] = React.useState(() =>
      clampIndex(defaultIndex, count),
    );
    const dragFrom = React.useRef(0);

    const onChangeRef = React.useRef(onChange);
    onChangeRef.current = onChange;

    const goTo = React.useCallback(
      (index: number) => {
        const next = clampIndex(index, count);
        setActive((prev) => {
          if (prev !== next) onChangeRef.current?.(next);
          return next;
        });
      },
      [count],
    );

    const handlePanStart = () => {
      dragFrom.current = active;
    };
    const handlePan = (_e: unknown, info: PanInfo) => {
      goTo(Math.round(dragFrom.current - info.offset.x / spacing));
    };
    const handlePanEnd = (_e: unknown, info: PanInfo) => {
      // A fast flick nudges one extra slide in the throw direction.
      if (Math.abs(info.velocity.x) > 600) {
        goTo(active - Math.sign(info.velocity.x));
      }
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
        data-slot="cover-flow"
        className={`flex flex-col items-center gap-5 ${className ?? ""}`}
        {...props}
      >
        <motion.div
          role="group"
          aria-roledescription="carousel"
          aria-label="Cover flow"
          className="relative cursor-grab touch-none overflow-hidden active:cursor-grabbing"
          style={{
            width: itemWidth * 3,
            maxWidth: "90vw",
            height: itemHeight * 1.7,
            perspective,
          }}
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
        >
          <div className="absolute inset-0 [transform-style:preserve-3d]">
            {items.map((child, i) => (
              <CoverItem
                // biome-ignore lint/suspicious/noArrayIndexKey: slides are positional
                key={i}
                offset={i - active}
                spacing={spacing}
                width={itemWidth}
                height={itemHeight}
                reflection={reflection}
                reduce={reduce}
                onSelect={() => goTo(i)}
              >
                {child}
              </CoverItem>
            ))}
          </div>
        </motion.div>

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
CoverFlow.displayName = "CoverFlow";

export { CoverFlow };
