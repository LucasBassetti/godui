"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type TabBarTab = {
  value: string;
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
};

export type TabBarProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange" | "defaultValue"
> & {
  tabs: TabBarTab[];
  value?: string;
  defaultValue?: string;
  /** Reveal the label only on the active tab. */
  labelsOnActiveOnly?: boolean;
  /** Add bottom safe-area padding (for mobile home indicators). */
  safeArea?: boolean;
  onChange?: (value: string) => void;
};

let tabBarSeed = 0;

const TabBar = React.forwardRef<HTMLElement, TabBarProps>(
  (
    {
      tabs,
      value: valueProp,
      defaultValue,
      labelsOnActiveOnly = true,
      safeArea = false,
      onChange,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const blobId = React.useMemo(() => `tab-bar-blob-${tabBarSeed++}`, []);
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState(
      () => defaultValue ?? tabs[0]?.value,
    );
    const value = isControlled ? valueProp : internal;

    const select = (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const spring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 420, damping: 32 } as const);

    return (
      <nav
        ref={ref}
        aria-label="Bottom navigation"
        className={`inline-flex items-center gap-1 rounded-full border border-border bg-background/80 p-1.5 shadow-lg backdrop-blur-xl ${
          safeArea ? "pb-[max(0.375rem,env(safe-area-inset-bottom))]" : ""
        } ${className ?? ""}`}
        {...props}
      >
        {tabs.map((tab) => {
          const active = tab.value === value;
          return (
            <button
              key={tab.value}
              type="button"
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              onClick={() => select(tab.value)}
              className={`relative inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId={blobId}
                  transition={spring}
                  className="absolute inset-0 rounded-full bg-primary shadow-sm"
                />
              )}
              <motion.span
                className="relative flex h-5 w-5 items-center justify-center"
                animate={
                  reduceMotion || !active
                    ? { scale: 1 }
                    : { scale: [1, 1.18, 1] }
                }
                transition={{ duration: 0.32, ease: "easeOut" }}
              >
                {tab.icon}
                {tab.badge !== undefined && (
                  <span className="-right-1.5 -top-1.5 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-semibold text-[10px] text-white ring-2 ring-background">
                    {tab.badge}
                  </span>
                )}
              </motion.span>
              {(!labelsOnActiveOnly || active) && (
                <motion.span
                  layout
                  initial={
                    labelsOnActiveOnly && !reduceMotion
                      ? { opacity: 0, width: 0 }
                      : false
                  }
                  animate={{ opacity: 1, width: "auto" }}
                  transition={spring}
                  className="relative overflow-hidden whitespace-nowrap"
                >
                  {tab.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>
    );
  },
);
TabBar.displayName = "TabBar";

export { TabBar };
