"use client";

import {
  animate,
  motion,
  type PanInfo,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type SwipeDirection = "left" | "right";

export type SwipeDeckProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onError"
> & {
  /** Cards, front first. */
  children?: React.ReactNode;
  /** Fired when the front card is swiped away. */
  onSwipe?: (index: number, direction: SwipeDirection) => void;
  /** Re-append swiped cards so the deck never empties. */
  loop?: boolean;
  /** Drag distance (px) past which a release dismisses the card. */
  threshold?: number;
  /** Labels for the left/right actions and the on-card intent badges. */
  actions?: { left: string; right: string };
};

const STACK_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

type Leaving = { dir: SwipeDirection; velocity: number } | null;

type FrontCardProps = {
  leaving: Leaving;
  threshold: number;
  onDecide: (dir: SwipeDirection, velocity: number) => void;
  onLeft: () => void;
  actions?: { left: string; right: string };
  children: React.ReactNode;
};

const FrontCard: React.FC<FrontCardProps> = ({
  leaving,
  threshold,
  onDecide,
  onLeft,
  actions,
  children,
}) => {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Pivot from below the card so rotation reads like it's hinged at the hand.
  const rotate = useTransform(x, [-320, 0, 320], [-18, 0, 18], { clamp: true });
  const likeOpacity = useTransform(x, [40, 160], [0, 1]);
  const nopeOpacity = useTransform(x, [-160, -40], [1, 0]);

  const onLeftRef = React.useRef(onLeft);
  onLeftRef.current = onLeft;

  // When a dismissal is committed (by drag, button, or key), fling the card off
  // along the throw direction — seeded with the release velocity so the exit
  // continues the gesture's momentum instead of restarting from zero.
  React.useEffect(() => {
    if (!leaving) return;
    if (reduce) {
      onLeftRef.current();
      return;
    }
    const sign = leaving.dir === "right" ? 1 : -1;
    const width = typeof window !== "undefined" ? window.innerWidth : 1000;
    const controls = animate(x, sign * (width * 0.9 + 360), {
      type: "spring",
      velocity: leaving.velocity,
      stiffness: 60,
      damping: 16,
      restDelta: 2,
      onComplete: () => onLeftRef.current(),
    });
    animate(y, y.get() + 36, { type: "spring", stiffness: 60, damping: 18 });
    return () => controls.stop();
  }, [leaving, reduce, x, y]);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (leaving) return;
    // Combine distance and velocity so a short, fast flick still commits.
    const power = info.offset.x + info.velocity.x * 0.2;
    if (power > threshold || info.velocity.x > 700) {
      onDecide("right", info.velocity.x);
    } else if (power < -threshold || info.velocity.x < -700) {
      onDecide("left", info.velocity.x);
    } else {
      // Snap back, carrying the release velocity into the spring.
      animate(x, 0, {
        type: "spring",
        stiffness: 600,
        damping: 34,
        velocity: info.velocity.x,
      });
      animate(y, 0, {
        type: "spring",
        stiffness: 600,
        damping: 34,
        velocity: info.velocity.y,
      });
    }
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-none [transform-origin:50%_130%] active:cursor-grabbing"
      style={{ x, y, rotate, zIndex: 40 }}
      drag={!leaving}
      dragElastic={0.7}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={false}
      whileDrag={{ scale: 1.03 }}
    >
      {children}
      {/* Whole-card intent wash + ring, fading in with the drag. */}
      <motion.div
        aria-hidden
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/20 ring-2 ring-primary/60 ring-inset"
      />
      <motion.div
        aria-hidden
        style={{ opacity: nopeOpacity }}
        className="pointer-events-none absolute inset-0 rounded-2xl bg-destructive/20 ring-2 ring-destructive/60 ring-inset"
      />
      <motion.span
        aria-hidden
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute top-5 left-5 rounded-md border-2 border-primary px-3 py-1 text-sm font-bold tracking-wide text-primary uppercase [transform:rotate(-12deg)]"
      >
        {actions?.right ?? "Yes"}
      </motion.span>
      <motion.span
        aria-hidden
        style={{ opacity: nopeOpacity }}
        className="pointer-events-none absolute top-5 right-5 rounded-md border-2 border-destructive px-3 py-1 text-sm font-bold tracking-wide text-destructive uppercase [transform:rotate(12deg)]"
      >
        {actions?.left ?? "No"}
      </motion.span>
    </motion.div>
  );
};

const BehindCard: React.FC<{ rank: number; children: React.ReactNode }> = ({
  rank,
  children,
}) => (
  <motion.div
    className="absolute inset-0"
    style={{ zIndex: 30 - rank, transformOrigin: "top center" }}
    initial={false}
    animate={{
      scale: 1 - rank * 0.05,
      y: rank * 16,
      opacity: rank > 2 ? 0 : 1,
    }}
    transition={STACK_SPRING}
  >
    {children}
  </motion.div>
);

const SwipeDeck = React.forwardRef<HTMLDivElement, SwipeDeckProps>(
  (
    {
      children,
      onSwipe,
      loop = false,
      threshold = 110,
      actions,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );
    const items = React.Children.toArray(children);
    const count = items.length;

    const [order, setOrder] = React.useState(() => items.map((_, i) => i));
    React.useEffect(() => {
      setOrder(Array.from({ length: count }, (_, i) => i));
    }, [count]);
    const [leaving, setLeaving] = React.useState<Leaving>(null);
    const leavingRef = React.useRef(false);

    // Commit a dismissal: fire the callback once, let the front card fly off, and
    // promote the card behind it. `handleLeft` drops it once the fling lands.
    const beginLeave = (dir: SwipeDirection, velocity: number) => {
      if (leavingRef.current || order.length === 0) return;
      leavingRef.current = true;
      onSwipe?.(order[0] as number, dir);
      setLeaving({ dir, velocity });
    };

    const handleLeft = React.useCallback(() => {
      setOrder((o) => {
        if (o.length === 0) return o;
        const [front, ...rest] = o;
        return loop ? [...rest, front as number] : rest;
      });
      setLeaving(null);
      leavingRef.current = false;
    }, [loop]);

    const handleKey = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        beginLeave("left", -1200);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        beginLeave("right", 1200);
      }
    };

    const visible = order.slice(0, 4);

    return (
      <div
        ref={ref}
        data-slot="swipe-deck"
        className={`flex flex-col items-center gap-6 ${className ?? ""}`}
        {...props}
      >
        <div className="relative aspect-[3/4] w-72 rounded-2xl">
          {visible.map((itemIndex, pos) => {
            if (pos === 0) {
              return (
                <FrontCard
                  key={itemIndex}
                  leaving={leaving}
                  threshold={threshold}
                  onDecide={beginLeave}
                  onLeft={handleLeft}
                  actions={actions}
                >
                  {items[itemIndex]}
                </FrontCard>
              );
            }
            // While the front card flies off, the rest rise one rank early.
            const rank = leaving ? pos - 1 : pos;
            return (
              <BehindCard key={itemIndex} rank={rank}>
                {items[itemIndex]}
              </BehindCard>
            );
          })}

          {order.length === 0 ? (
            <div className="absolute inset-0 grid place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
              No more cards
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => beginLeave("left", -1200)}
            onKeyDown={handleKey}
            disabled={order.length === 0 || leaving != null}
            aria-label={actions?.left ?? "Skip"}
            className="grid size-12 place-items-center rounded-full border border-border bg-card text-destructive shadow-sm [transition:transform_150ms,background_150ms] hover:bg-accent active:scale-95 disabled:opacity-40"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={() => beginLeave("right", 1200)}
            onKeyDown={handleKey}
            disabled={order.length === 0 || leaving != null}
            aria-label={actions?.right ?? "Like"}
            className="grid size-12 place-items-center rounded-full border border-border bg-card text-primary shadow-sm [transition:transform_150ms,background_150ms] hover:bg-accent active:scale-95 disabled:opacity-40"
          >
            ♥
          </button>
        </div>
      </div>
    );
  },
);
SwipeDeck.displayName = "SwipeDeck";

export { SwipeDeck };
