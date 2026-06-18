"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type ProgressiveCardRevealProps =
  React.HTMLAttributes<HTMLDivElement> & {
    /** Index of the currently expanded card (controlled). */
    activeIndex: number;
    /** Fired when a collapsed card is activated. The parent owns the state. */
    onActiveChange?: (index: number) => void;
  };

export type ProgressiveCardRevealCardProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
>;

type RevealContextValue = {
  activeIndex: number;
  onActiveChange?: (index: number) => void;
};

const RevealContext = React.createContext<RevealContextValue | null>(null);
const CardIndexContext = React.createContext<number | null>(null);

// Size morph (height + position) and corner rounding.
const LAYOUT_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 30,
} as const;
// Crossfade between the collapsed and expanded views.
const FADE_TRANSITION = { duration: 0.18, ease: "easeOut" } as const;
const COLLAPSED_RADIUS = 9999;
const EXPANDED_RADIUS = 20;
const EXPANDED_WIDTH = "100%";
// Collapsed cards funnel inward: the farther a card is from the active one,
// the narrower it gets (distance is `|index - activeIndex|`).
const COLLAPSED_BASE_WIDTH = 90; // % at distance 1
const COLLAPSED_WIDTH_STEP = 7; // % narrower per extra step away
const COLLAPSED_MIN_WIDTH = 60;

function collapsedWidth(distance: number) {
  const width = COLLAPSED_BASE_WIDTH - (distance - 1) * COLLAPSED_WIDTH_STEP;
  return `${Math.max(width, COLLAPSED_MIN_WIDTH)}%`;
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
    const { collapsed, expanded: expandedView } = extractSlots(children);

    return (
      <motion.div
        ref={ref}
        layout={!reducedMotion}
        data-expanded={expanded}
        initial={false}
        animate={{
          borderRadius: expanded ? EXPANDED_RADIUS : COLLAPSED_RADIUS,
        }}
        transition={reducedMotion ? { duration: 0 } : LAYOUT_TRANSITION}
        // `layout` animates the width/height delta when these change, so the
        // active card grows wider at the same time the others shrink.
        style={{
          width: expanded ? EXPANDED_WIDTH : collapsedWidth(distance),
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
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
  ({ activeIndex, onActiveChange, children, className, ...props }, ref) => {
    const contextValue = React.useMemo<RevealContextValue>(
      () => ({ activeIndex, onActiveChange }),
      [activeIndex, onActiveChange],
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
