"use client";

import { motion, useReducedMotion } from "framer-motion";
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

// SPRING.liquid — slow, no-overshoot morph so the goo neck stays readable as
// it forms and releases (a snappier spring blows through the merge too fast to
// see). See motion/tokens.ts.
const SPRING = {
  type: "spring",
  stiffness: 130,
  damping: 24,
  mass: 1.2,
} as const;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

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

    // The goo SVG surface is the SOLE visible card surface whenever motion is
    // allowed: it renders every card's fill + border itself, always opaque, and
    // fuses them into the liquid neck as they approach. There is deliberately no
    // second (native) bordered surface underneath, because a goo filter dilates
    // its output more on WebKit than on Blink — so any always-opaque native card
    // beneath the goo would show a mismatched ghost/double border on Safari
    // wherever the two edges failed to coincide. One border source = no double.
    // The native `<div>` cards below are shown ONLY under prefers-reduced-motion
    // (goo hidden), where there is no filter and they are the crisp fallback.

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
            <filter
              id={filterId}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={gooeyness}
                result="blur"
              />
              {/* Fused silhouette: razor-steep threshold at the α=0.5 level. That
                  level set sits on the ORIGINAL edge for a straight run (so the
                  card sides keep their native width) and only bulges where two
                  cards' blur halos overlap — i.e. the concave liquid neck. One
                  crisp shape, hard edge, almost no anti-aliasing. */}
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 80 -40"
                result="goo"
              />
              {/* Fill the whole fused shape with the card color. On the straight
                  sides this lands exactly on the native cards; across the gap it
                  paints the connecting neck. */}
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
              {/* One continuous outline tracing the ENTIRE fused silhouette —
                  card sides AND the neck curves — as a single uniform stroke, so
                  the border flows from card into neck with no seam. Built as an
                  INNER 1px ring (goo minus a 1px-eroded goo) so it sits exactly
                  where a CSS border-box border sits: coincident with the native
                  side borders (no double line), continuous around the waist. */}
              <feGaussianBlur in="goo" stdDeviation="1.1" result="edge" />
              <feColorMatrix
                in="edge"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -41"
                result="eroded"
              />
              <feComposite in="goo" in2="eroded" operator="out" result="ring" />
              <feFlood
                style={{ floodColor: "var(--border)" }}
                result="borderColor"
              />
              <feComposite
                in="borderColor"
                in2="ring"
                operator="in"
                result="borderLayer"
              />
              <feMerge result="surface">
                <feMergeNode in="fillLayer" />
                <feMergeNode in="borderLayer" />
              </feMerge>
              {/* Sub-pixel anti-aliasing back after the steep thresholds. */}
              <feGaussianBlur in="surface" stdDeviation="0.4" />
            </filter>
          </defs>
        </svg>

        {/* Reduced-motion fallback surface: real DOM cards with crisp CSS
            borders. Shown ONLY when motion is off (the goo surface is hidden
            then), so it never coexists with the goo — no double border. When
            motion is on it is fully transparent and the goo below carries every
            card's fill + border as the single source. */}
        <div className="absolute inset-0" style={{ opacity: reduce ? 1 : 0 }}>
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
        </div>

        {/* Card surface (the single source of every card's fill + border): the
            full-size silhouettes fuse under the goo filter into card-color fill
            + one continuous outline tracing the whole fused shape (card sides
            AND the neck waist). Always fully opaque, so it is the ONLY bordered
            surface on screen — nothing underneath to double against. At rest the
            rects are separate → two crisp rounded cards; as the gap shrinks they
            neck into one liquid shape.

            Rendered as native SVG rects (not filtered HTML divs): Safari
            composites a transform-animated HTML child onto its own compositing
            layer, which escapes an HTML `filter: url()` so the cards never neck
            together there. SVG shapes stay inside the filter and fuse on every
            engine. Hidden entirely under prefers-reduced-motion (the native
            fallback above shows instead). */}
        <motion.svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible [transform:translateZ(0)]"
          width="100%"
          height="100%"
          style={{ opacity: reduce ? 0 : 1 }}
        >
          <g filter={reduce ? undefined : `url(#${filterId})`}>
            {items.map((_, i) => {
              const s = stateOf(i);
              // Rest-position top edge (SVG y is top-down); `y` below then
              // slides it exactly like the native card's translateY. No `scale`
              // here: it only bites once the silhouette has faded out, and
              // `transform-box: fill-box` (needed to scale about center)
              // flickers the filtered border in WebKit — so the goo surface
              // translates only, keeping the border rock-steady on every engine.
              const top =
                (expandedTotal || 0) - bottomOf(i) - (heights[i] ?? 0);
              return (
                <motion.rect
                  // biome-ignore lint/suspicious/noArrayIndexKey: index identifies a stable card slot
                  key={i}
                  x={0}
                  y={top}
                  width="100%"
                  height={heights[i] || 0}
                  rx={radius}
                  fill="#000"
                  initial={false}
                  animate={{ y: s.y, opacity: s.silOpacity }}
                  transition={transition}
                />
              );
            })}
          </g>
        </motion.svg>

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
