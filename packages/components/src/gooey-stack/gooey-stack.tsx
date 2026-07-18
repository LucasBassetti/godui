"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type GooeyStackProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  /**
   * The inner content of each card, top to bottom — the last is the anchor.
   * GooeyStack renders the fused `bg-card` surface itself, so children should
   * be transparent content (padding + text/controls), not their own cards.
   * Provide 2+.
   */
  children?: React.ReactNode;
  /**
   * Controlled vertical gap (px) between cards. Negative values overlap and
   * merge them. When set, this overrides `collapsed` — drive it from a slider
   * for the full continuous effect.
   */
  gap?: number;
  /** Convenience toggle: springs between `expandedGap` and `collapsedGap`. Default `false`. */
  collapsed?: boolean;
  /** Resting gap (px) when expanded. Default `18`. */
  expandedGap?: number;
  /** Gap (px) the `collapsed` toggle merges to. Default `-48`. */
  collapsedGap?: number;
  /** Blur radius feeding the goo filter — larger fuses cards from further. Default `10`. */
  gooeyness?: number;
  /** Corner radius (px) of the fused silhouettes. Match your cards. Default `28`. */
  radius?: number;
};

// SPRING.smooth — surfaces / morph (see motion/tokens.ts).
const SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
} as const;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

// How much the cards are *necking* at a given gap: a band-pass that is 0 at both
// rest ends (fanned out, or fully merged) and peaks while surfaces are close.
const nearnessAt = (
  g: number,
  expandedGap: number,
  collapsedGap: number,
): number =>
  clamp((expandedGap - g) / Math.max(1, expandedGap - 4), 0, 1) *
  clamp((g - collapsedGap) / 20, 0, 1);

const GooeyStack = React.forwardRef<HTMLDivElement, GooeyStackProps>(
  (
    {
      children,
      gap,
      collapsed = false,
      expandedGap = 18,
      collapsedGap = -48,
      gooeyness = 10,
      radius = 28,
      className,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const reduce = useReducedMotion() ?? false;
    const filterId = React.useId().replace(/:/g, "");

    const items = React.Children.toArray(children);
    const n = items.length;

    // The effective gap: an explicit `gap` wins, else the toggle picks a preset.
    const g = gap ?? (collapsed ? collapsedGap : expandedGap);

    // Measure each card so silhouettes and content stay registered.
    const contentRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const [heights, setHeights] = React.useState<number[]>(() =>
      items.map(() => 0),
    );
    // biome-ignore lint/correctness/useExhaustiveDependencies: re-observe when the child count changes
    React.useLayoutEffect(() => {
      const measure = () => {
        setHeights(contentRefs.current.map((el) => el?.offsetHeight ?? 0));
      };
      measure();
      if (typeof ResizeObserver === "undefined") return;
      const ro = new ResizeObserver(measure);
      for (const el of contentRefs.current) {
        if (el) ro.observe(el);
      }
      return () => ro.disconnect();
    }, [n]);

    // The stack keeps a constant height (the expanded extent) and the anchor
    // (last child) stays pinned to the bottom, so it never moves while the
    // others slide down into it.
    const heightsBelow = (i: number) => {
      let d = 0;
      for (let j = i + 1; j < n; j++) d += heights[j] ?? 0;
      return d;
    };
    const cardsBelow = (i: number) => n - 1 - i;

    const expandedTotal =
      heights.reduce((s, h) => s + h, 0) + Math.max(0, n - 1) * expandedGap;

    // How far into "merged" territory the current gap is (0 while g ≥ 0, ramps
    // to 1 at collapsedGap). Recede effects only kick in once cards overlap, so
    // through the small positive-gap zone the cards stay sharp and only their
    // silhouettes neck together via the goo filter.
    const merge = clamp(-g / -Math.min(collapsedGap, -1), 0, 1);

    // Cross-fade the crisp native surface (rest → pixel-perfect borders) with the
    // soft goo-fused surface (mid-transition → the liquid neck). This MUST follow
    // the *live* animating gap, not the target `g` — at both endpoints necking is
    // 0, so deriving it from `g` alone would make the goo never appear during the
    // toggle. Spring a motion value toward `g` and read necking off it live.
    const gapTarget = useMotionValue(g);
    React.useEffect(() => {
      gapTarget.set(g);
    }, [g, gapTarget]);
    const gapSpring = useSpring(gapTarget, {
      stiffness: 320,
      damping: 32,
      mass: 0.9,
    });
    const nearness = useTransform(gapSpring, (live) =>
      nearnessAt(live, expandedGap, collapsedGap),
    );
    const gooOpacity = useTransform(nearness, (v) => (reduce ? 0 : v));
    const nativeOpacity = useTransform(nearness, (v) => (reduce ? 1 : 1 - v));

    // Target transform for card `i`. rank = distance from the anchor.
    const stateOf = (i: number) => {
      const rank = cardsBelow(i);
      // Bottom offset for this card at the current gap; anchor stays at 0.
      const bottomExpanded = heightsBelow(i) + rank * expandedGap;
      const bottomNow = heightsBelow(i) + rank * g;
      const y = bottomExpanded - bottomNow; // slide down as the gap shrinks
      if (rank === 0) {
        return { y: 0, scale: 1, opacity: 1, silOpacity: 1, blur: 0 };
      }
      return {
        y,
        scale: 1 - rank * 0.05 * merge,
        // Reach 0 before full collapse so a receded card leaves no ghost.
        opacity: Math.max(0, 1 - rank * 1.1 * merge),
        // The silhouette stays solid through the neck zone, then fades as the
        // card merges deep so it doesn't poke out behind the anchor.
        silOpacity: Math.max(0, 1 - merge),
        blur: Math.min(16, rank * 13 * merge),
      };
    };

    const bottomOf = (i: number) =>
      heightsBelow(i) + cardsBelow(i) * expandedGap;
    const transition = reduce ? { duration: 0 } : SPRING;

    return (
      <div
        ref={forwardedRef}
        data-slot="gooey-stack"
        data-collapsed={g < expandedGap ? "true" : undefined}
        className={`relative w-full ${className ?? ""}`}
        style={{ height: expandedTotal || undefined, ...style }}
        {...props}
      >
        {/* Goo filter — fuses the card silhouettes into liquid metaballs. */}
        <svg aria-hidden="true" className="pointer-events-none absolute size-0">
          <defs>
            <filter id={filterId}>
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={gooeyness}
                result="blur"
              />
              {/* Hard-edged contour of the blur (razor-steep threshold), so the
                  fused shape has a crisp edge with almost no anti-aliasing. */}
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 80 -40"
                result="goo"
              />
              {/* Border: offset the fused shape outward with a *small isotropic*
                  blur + threshold. A Gaussian is radially symmetric, so the ring
                  stays round and constant-width at corners and the neck — unlike
                  box morphology (square corners) or a band off the main blur
                  (width tracks curvature). */}
              <feGaussianBlur in="goo" stdDeviation="1.2" result="edge" />
              <feColorMatrix
                in="edge"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -9"
                result="grown"
              />
              <feFlood
                style={{ floodColor: "var(--border)" }}
                result="borderColor"
              />
              <feComposite
                in="borderColor"
                in2="grown"
                operator="in"
                result="borderLayer"
              />
              {/* Fill: flat theme card color, masked by `goo` — uniform, opaque,
                  never darkened by blur anti-aliasing. */}
              <feFlood
                style={{ floodColor: "var(--card)" }}
                result="cardColor"
              />
              <feComposite
                in="cardColor"
                in2="goo"
                operator="in"
                result="fillLayer"
              />
              <feMerge result="surface">
                <feMergeNode in="borderLayer" />
                <feMergeNode in="fillLayer" />
              </feMerge>
              {/* Re-introduce sub-pixel anti-aliasing. The steep threshold above
                  makes a crisp shape but with a hard, aliased (stair-stepped)
                  edge; a tiny blur smooths the edge back to pixel-perfect without
                  softening the shape. */}
              <feGaussianBlur in="surface" stdDeviation="0.5" />
            </filter>
          </defs>
        </svg>

        {/* Merge surface (behind): full-size silhouettes fuse under the goo
            filter into the liquid neck + border. Only faded in while the cards
            are necking (`nearness`), so its soft filtered edge is never seen at
            rest — the crisp native surface below covers it there. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: gooOpacity,
            filter: reduce ? undefined : `url(#${filterId})`,
          }}
        >
          {items.map((_, i) => {
            const s = stateOf(i);
            return (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: index identifies a stable card slot
                key={i}
                className="absolute inset-x-0 bg-card"
                style={{
                  bottom: bottomOf(i),
                  height: heights[i] || undefined,
                  borderRadius: radius,
                  zIndex: i,
                }}
                initial={false}
                animate={{ y: s.y, scale: s.scale, opacity: s.silOpacity }}
                transition={transition}
              />
            );
          })}
        </motion.div>

        {/* Native surface: real DOM cards with CSS borders — pixel-perfect at
            every zoom. Shown at rest; cross-faded out (`1 - nearness`) into the
            goo surface above while cards neck, so borders stay crisp at rest and
            fuse seamlessly during the merge. */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: nativeOpacity }}
        >
          {items.map((_, i) => {
            const s = stateOf(i);
            return (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: index identifies a stable card slot
                key={i}
                className="absolute inset-x-0 border border-border bg-card"
                style={{
                  bottom: bottomOf(i),
                  height: heights[i] || undefined,
                  borderRadius: radius,
                  zIndex: i,
                }}
                initial={false}
                animate={{ y: s.y, scale: s.scale, opacity: s.opacity }}
                transition={transition}
              />
            );
          })}
        </motion.div>

        {/* Content: children on top of whichever surface is showing. Stays crisp
            and readable — only recedes/frosts, never cross-faded by the neck. */}
        <div className="absolute inset-0">
          {items.map((child, i) => {
            const s = stateOf(i);
            return (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: index identifies a stable card slot
                key={i}
                ref={(el) => {
                  contentRefs.current[i] = el;
                }}
                className="absolute inset-x-0"
                style={{ bottom: bottomOf(i), zIndex: i }}
                initial={false}
                animate={{
                  y: s.y,
                  scale: s.scale,
                  opacity: s.opacity,
                  filter: reduce ? "blur(0px)" : `blur(${s.blur}px)`,
                }}
                transition={transition}
              >
                {child}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  },
);
GooeyStack.displayName = "GooeyStack";

export { GooeyStack };
