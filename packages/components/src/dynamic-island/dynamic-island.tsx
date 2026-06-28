"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type DynamicIslandSize =
  | "compact"
  | "default"
  | "long"
  | "tall"
  | "large";

export type DynamicIslandProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Shape preset the island morphs to. */
  size?: DynamicIslandSize;
  /**
   * Identity of the current content. Change it to cross-fade the inner view;
   * defaults to `size` so each shape transitions its content.
   */
  presenceKey?: React.Key;
};

const SIZES: Record<
  DynamicIslandSize,
  { width: number; height: number; radius: number }
> = {
  compact: { width: 140, height: 36, radius: 18 },
  default: { width: 220, height: 44, radius: 22 },
  long: { width: 360, height: 52, radius: 26 },
  tall: { width: 260, height: 120, radius: 28 },
  large: { width: 360, height: 200, radius: 36 },
};

// Underdamped so the shell settles with the signature rubbery overshoot.
const SHELL_SPRING = {
  type: "spring" as const,
  stiffness: 520,
  damping: 32,
};

const DynamicIsland = React.forwardRef<HTMLDivElement, DynamicIslandProps>(
  (
    { size = "default", presenceKey, className, style, children, ...props },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const dims = SIZES[size];
    const key = presenceKey ?? size;

    return (
      <motion.div
        ref={ref}
        data-slot="dynamic-island"
        layout
        initial={false}
        animate={{
          width: dims.width,
          height: dims.height,
          borderRadius: dims.radius,
        }}
        transition={reduceMotion ? { duration: 0 } : SHELL_SPRING}
        className={`relative flex items-center justify-center overflow-hidden bg-black text-white shadow-xl ${className ?? ""}`}
        style={{ maxWidth: "100%", ...style }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={key}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, scale: 0.9, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={
              reduceMotion
                ? undefined
                : { opacity: 0, scale: 0.9, filter: "blur(4px)" }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex size-full items-center justify-center px-4"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  },
);
DynamicIsland.displayName = "DynamicIsland";

export { DynamicIsland };
