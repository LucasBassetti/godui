"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type ToolbarAction = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
};

export type FloatingToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  actions: ToolbarAction[];
  /** Controls mount/unmount with a spring entrance. */
  open?: boolean;
  /** Optional trailing content (e.g. a divider + extra controls). */
  children?: React.ReactNode;
};

const FloatingToolbar = React.forwardRef<HTMLDivElement, FloatingToolbarProps>(
  ({ actions, open = true, className, children, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            layout
            role="toolbar"
            aria-label="Floating toolbar"
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.92 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.95 }
            }
            transition={{ type: "spring", stiffness: 520, damping: 32 }}
            className={`inline-flex items-center gap-0.5 rounded-xl border border-border bg-popover/90 p-1 text-popover-foreground shadow-lg backdrop-blur-md ${
              className ?? ""
            }`}
            {...(props as React.ComponentProps<typeof motion.div>)}
          >
            {actions.map((action) => (
              <motion.button
                key={action.label}
                type="button"
                layout
                disabled={action.disabled}
                aria-label={action.label}
                aria-pressed={action.active}
                onClick={action.onClick}
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.08 }}
                whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                transition={{ type: "spring", stiffness: 520, damping: 32 }}
                className={`grid size-9 place-items-center rounded-lg [transition:background-color_150ms_ease,color_150ms_ease] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 ${
                  action.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {action.icon}
              </motion.button>
            ))}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);
FloatingToolbar.displayName = "FloatingToolbar";

export { FloatingToolbar };
