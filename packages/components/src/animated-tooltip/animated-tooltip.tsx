"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type AnimatedTooltipSide = "top" | "bottom";

export type AnimatedTooltipProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "content"
> & {
  /** Tooltip content shown on hover / focus. */
  content: React.ReactNode;
  /** Which side of the trigger the tooltip appears on. */
  side?: AnimatedTooltipSide;
  /** The trigger element the tooltip is attached to. */
  children: React.ReactNode;
};

const SPRING = { stiffness: 220, damping: 16 } as const;

const PANEL_BASE =
  "pointer-events-none absolute left-1/2 z-popover flex max-w-[16rem] -translate-x-1/2 flex-col items-center rounded-lg bg-foreground px-3 py-1.5 text-center text-xs font-medium text-background shadow-lg [transform-style:preserve-3d]";

const AnimatedTooltip = React.forwardRef<HTMLSpanElement, AnimatedTooltipProps>(
  ({ content, side = "top", className, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);

    const x = useMotionValue(0);
    const rotate = useSpring(useTransform(x, [-60, 60], [-14, 14]), SPRING);
    const translateX = useSpring(useTransform(x, [-60, 60], [-12, 12]), SPRING);

    const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      x.set(e.clientX - rect.left - rect.width / 2);
    };

    const isTop = side === "top";

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: hover/focus only reveals a tooltip; the wrapped child stays the interactive element
      <span
        ref={ref}
        data-slot="animated-tooltip"
        className={`relative inline-flex ${className ?? ""}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              role="tooltip"
              initial={{
                opacity: 0,
                y: isTop ? 8 : -8,
                scale: 0.85,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 260, damping: 18 },
              }}
              exit={{ opacity: 0, y: isTop ? 6 : -6, scale: 0.9 }}
              style={{ rotate, x: translateX }}
              className={`${PANEL_BASE} ${isTop ? "bottom-[calc(100%+0.625rem)] origin-bottom" : "top-[calc(100%+0.625rem)] origin-top"}`}
            >
              {content}
              <span
                aria-hidden
                className={`absolute left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground ${isTop ? "top-[calc(100%-0.25rem)]" : "bottom-[calc(100%-0.25rem)]"}`}
              />
            </motion.span>
          ) : null}
        </AnimatePresence>
        {children}
      </span>
    );
  },
);
AnimatedTooltip.displayName = "AnimatedTooltip";

export { AnimatedTooltip };
