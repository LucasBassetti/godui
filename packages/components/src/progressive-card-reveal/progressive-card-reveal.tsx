"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type ProgressiveCardRevealProps =
  React.HTMLAttributes<HTMLDivElement> & {
    /** Index of the currently expanded card (controlled). */
    activeIndex: number;
    /** Fired when a collapsed card is activated. The parent owns the state. */
    onActiveChange?: (index: number) => void;
    /**
     * Caps how far a collapsed card narrows. Cards farther than `maxDepth`
     * steps from the active one all share the width at `maxDepth`. Omit for
     * unbounded funneling.
     */
    maxDepth?: number;
  };

export type ProgressiveCardRevealCardProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
>;

type RevealContextValue = {
  activeIndex: number;
  onActiveChange?: (index: number) => void;
  maxDepth?: number;
};

const RevealContext = React.createContext<RevealContextValue | null>(null);
const CardIndexContext = React.createContext<number | null>(null);

// Size morph (height + position) and corner rounding. Kept near-critically
// damped (crit ≈ 2·√stiffness ≈ 35) so width/height settle without overshoot —
// underdamping makes the moving edges wobble, which reads as a flick on hover.
const LAYOUT_TRANSITION = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
} as const;
// Crossfade between the collapsed and expanded views. A touch slower than the
// layout spring so content settles into the new box instead of popping.
const FADE_TRANSITION = { duration: 0.2, ease: [0.65, 0, 0.35, 1] } as const;
const COLLAPSED_RADIUS = 9999;
const EXPANDED_RADIUS = 20;
const EXPANDED_WIDTH = "100%";
// Collapsed cards funnel inward: the farther a card is from the active one,
// the narrower it gets (distance is `|index - activeIndex|`).
const COLLAPSED_BASE_WIDTH = 90; // % at distance 1
const COLLAPSED_WIDTH_STEP = 7; // % narrower per extra step away
const COLLAPSED_MIN_WIDTH = 60;
// Hovering a collapsed card nudges it up via a transform scale (not a width
// change) so the content never reflows — a width change would re-lay-out the
// right-aligned values every spring frame, which reads as a flicker.
const HOVER_SCALE = 1.03;

function collapsedWidth(distance: number) {
  const base = COLLAPSED_BASE_WIDTH - (distance - 1) * COLLAPSED_WIDTH_STEP;
  const width = Math.max(base, COLLAPSED_MIN_WIDTH);
  return `${width}%`;
}

/**
 * Slot marker for a card's collapsed (pill) view. Never rendered directly —
 * `Card` extracts its children and renders them inside the collapsed trigger.
 */
function CardCollapsed(_props: { children?: React.ReactNode }) {
  return null;
}
CardCollapsed.displayName = "ProgressiveCardReveal.CardCollapsed";

/**
 * Slot marker for a card's expanded view. Never rendered directly — `Card`
 * extracts its children and renders them inside the expanded region.
 */
function CardExpanded(_props: { children?: React.ReactNode }) {
  return null;
}
CardExpanded.displayName = "ProgressiveCardReveal.CardExpanded";

function extractSlots(children: React.ReactNode) {
  let collapsed: React.ReactNode = null;
  let expanded: React.ReactNode = null;
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    if (child.type === CardCollapsed) {
      collapsed = (child.props as { children?: React.ReactNode }).children;
    } else if (child.type === CardExpanded) {
      expanded = (child.props as { children?: React.ReactNode }).children;
    }
  });
  return { collapsed, expanded };
}

const Card = React.forwardRef<HTMLDivElement, ProgressiveCardRevealCardProps>(
  ({ children, className, ...props }, ref) => {
    const reveal = React.useContext(RevealContext);
    const index = React.useContext(CardIndexContext);
    const reducedMotion = useReducedMotion() ?? false;

    if (reveal === null || index === null) {
      throw new Error(
        "ProgressiveCardReveal.Card must be rendered inside <ProgressiveCardReveal>.",
      );
    }

    const expanded = index === reveal.activeIndex;
    const distance = Math.abs(index - reveal.activeIndex);
    // Past `maxDepth`, every card shares the width at `maxDepth` instead of
    // funneling ever narrower.
    const depth =
      reveal.maxDepth != null ? Math.min(distance, reveal.maxDepth) : distance;
    const { collapsed, expanded: expandedView } = extractSlots(children);

    return (
      <motion.div
        ref={ref}
        layout={!reducedMotion}
        data-expanded={expanded}
        initial={false}
        transition={reducedMotion ? { duration: 0 } : LAYOUT_TRANSITION}
        // Hover lift is a `whileHover` scale — a transform, so it never reflows
        // the card's content (a width change would re-lay-out the right-aligned
        // values every spring frame, which reads as a flicker). Only collapsed
        // cards lift; the expanded one stays put. Width remains a state-driven
        // `style` value, so a later activeIndex change (new depth) still updates
        // it — scale and width are independent, so there's no stale-width bug.
        whileHover={
          reducedMotion || expanded ? undefined : { scale: HOVER_SCALE }
        }
        // borderRadius is set via `style` (not `animate`) on purpose: framer
        // only applies inverse-scale correction to radius when it's a style
        // value, so the corners stay crisp instead of warping as the box is
        // scaled during the layout morph. The value change tweens along with
        // the layout animation.
        style={{
          width: expanded ? EXPANDED_WIDTH : collapsedWidth(depth),
          borderRadius: expanded ? EXPANDED_RADIUS : COLLAPSED_RADIUS,
        }}
        className={`relative overflow-hidden border border-border bg-card text-card-foreground shadow-sm transform-gpu ${className ?? ""}`}
        {...props}
      >
        {/* popLayout pulls the exiting view out of flow so the height morph and
            crossfade run together instead of one-after-the-other. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {expanded ? (
            <motion.div
              key="expanded"
              // `layout="position"` keeps the content's own box unscaled while
              // the parent morphs size, so the text isn't stretched mid-morph.
              layout={reducedMotion ? false : "position"}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reducedMotion ? { duration: 0 } : FADE_TRANSITION}
              className="px-5 py-4"
            >
              {expandedView}
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              type="button"
              layout={reducedMotion ? false : "position"}
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              // No exit animation: on click the collapsed pill should vanish
              // instantly so the expanded view isn't crossfaded over a ghost.
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={reducedMotion ? { duration: 0 } : FADE_TRANSITION}
              onClick={() => reveal.onActiveChange?.(index)}
              aria-expanded={false}
              className="block w-full cursor-pointer px-5 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {collapsed}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);
Card.displayName = "ProgressiveCardReveal.Card";

const Root = React.forwardRef<HTMLDivElement, ProgressiveCardRevealProps>(
  (
    { activeIndex, onActiveChange, maxDepth, children, className, ...props },
    ref,
  ) => {
    const contextValue = React.useMemo<RevealContextValue>(
      () => ({ activeIndex, onActiveChange, maxDepth }),
      [activeIndex, onActiveChange, maxDepth],
    );

    // Assign each Card its position so consumers never pass an index manually.
    let cardIndex = 0;
    const indexedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === Card) {
        const index = cardIndex;
        cardIndex += 1;
        return (
          <CardIndexContext.Provider value={index}>
            {child}
          </CardIndexContext.Provider>
        );
      }
      return child;
    });

    return (
      <RevealContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={`flex flex-col items-center gap-2 ${className ?? ""}`}
          {...props}
        >
          {indexedChildren}
        </div>
      </RevealContext.Provider>
    );
  },
);
Root.displayName = "ProgressiveCardReveal";

const ProgressiveCardReveal = Object.assign(Root, {
  Card,
  CardCollapsed,
  CardExpanded,
});

export { ProgressiveCardReveal };
