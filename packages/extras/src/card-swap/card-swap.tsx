"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type CardSwapProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  /** Cards to cycle through, front to back. Provide 2–5. */
  children?: React.ReactNode;
  /** Auto-advance interval in ms. Set `0` to disable. */
  interval?: number;
  /** Pause the auto-advance while the pointer is over the stack. */
  pauseOnHover?: boolean;
  /** Vertical offset (px) between stacked cards. */
  offsetY?: number;
  /** Horizontal offset (px) between stacked cards. */
  offsetX?: number;
  /** Scale step removed per card going back. */
  scaleStep?: number;
};

const CardSwap = React.forwardRef<HTMLDivElement, CardSwapProps>(
  (
    {
      children,
      interval = 3500,
      pauseOnHover = true,
      offsetY = 28,
      offsetX = 22,
      scaleStep = 0.06,
      className,
      onPointerMove,
      onPointerLeave,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );
    const reduce = useReducedMotion();
    const items = React.Children.toArray(children);
    const n = items.length;

    // `order[r]` is the item index sitting at rank `r` (0 = front).
    const [order, setOrder] = React.useState(() =>
      Array.from({ length: n }, (_, i) => i),
    );
    React.useEffect(() => {
      setOrder(Array.from({ length: n }, (_, i) => i));
    }, [n]);

    const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
    const [paused, setPaused] = React.useState(false);

    const advance = React.useCallback(() => {
      setOrder((o) => (o.length ? [...o.slice(1), o[0] as number] : o));
    }, []);
    const retreat = React.useCallback(() => {
      setOrder((o) =>
        o.length ? [o[o.length - 1] as number, ...o.slice(0, -1)] : o,
      );
    }, []);

    React.useEffect(() => {
      if (!interval || paused || n < 2) return;
      const t = setInterval(advance, interval);
      return () => clearInterval(t);
    }, [interval, paused, n, advance]);

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(e);
      if (reduce) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: -py * 12, y: px * 14 });
    };
    const handleLeave = (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(e);
      setTilt({ x: 0, y: 0 });
      if (pauseOnHover) setPaused(false);
    };

    // rank of each item index, so we can drive its slot from the item's position
    const rankOf = React.useMemo(() => {
      const m = new Array<number>(n);
      order.forEach((itemIndex, rank) => {
        m[itemIndex] = rank;
      });
      return m;
    }, [order, n]);

    return (
      <div
        ref={ref}
        data-slot="card-swap"
        onPointerMove={handleMove}
        onPointerEnter={() => pauseOnHover && setPaused(true)}
        onPointerLeave={handleLeave}
        className={`relative grid place-items-center [perspective:1200px] ${className ?? ""}`}
        {...props}
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{
            type: "spring",
            stiffness: 170,
            damping: 12,
            mass: 0.1,
          }}
        >
          {items.map((child, i) => {
            const r = rankOf[i] ?? 0;
            return (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: index identifies a stable card
                key={i}
                className="absolute inset-0 will-change-transform"
                style={{ zIndex: n - r, transformStyle: "preserve-3d" }}
                animate={{
                  x: r * offsetX,
                  y: -r * offsetY,
                  scale: 1 - r * scaleStep,
                  rotateZ: r * -2.5,
                  opacity: r > 3 ? 0 : 1,
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 320, damping: 32, mass: 0.9 }
                }
              >
                {child}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Controls — keyboard accessible, do not steal focus from card content. */}
        {n > 1 ? (
          <div className="absolute -bottom-12 flex items-center gap-2">
            <button
              type="button"
              onClick={retreat}
              aria-label="Previous card"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground shadow-sm [transition:background_150ms] hover:bg-accent"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={advance}
              aria-label="Next card"
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground shadow-sm [transition:background_150ms] hover:bg-accent"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
    );
  },
);
CardSwap.displayName = "CardSwap";

export { CardSwap };
