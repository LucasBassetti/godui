"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type SegmentedOption = {
  label: React.ReactNode;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type SegmentedControlSize = "sm" | "md" | "lg";

export type SegmentedControlProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  size?: SegmentedControlSize;
  onChange?: (value: string) => void;
};

const sizeClasses: Record<SegmentedControlSize, string> = {
  sm: "h-8 text-xs gap-1",
  md: "h-10 text-sm gap-1.5",
  lg: "h-12 text-base gap-2",
};

let pillSeed = 0;

const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(
  (
    {
      options,
      value: valueProp,
      defaultValue,
      size = "md",
      onChange,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const layoutId = React.useMemo(() => `segmented-pill-${pillSeed++}`, []);
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState(
      () => defaultValue ?? options[0]?.value,
    );
    const value = isControlled ? valueProp : internal;

    const select = (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    return (
      <div
        ref={ref}
        role="tablist"
        className={`inline-flex items-center rounded-lg border border-border bg-muted p-1 ${sizeClasses[size]} ${
          className ?? ""
        }`}
        {...props}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={opt.disabled}
              onClick={() => select(opt.value)}
              className={`relative isolate inline-flex h-full items-center justify-center gap-1.5 rounded-md px-3 font-medium [transition:color_150ms_ease] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 520, damping: 32 }
                  }
                  className="absolute inset-0 z-0 rounded-md bg-background shadow-sm"
                />
              )}
              {opt.icon && (
                <span className="relative z-10 shrink-0 text-current [&_svg]:text-current">
                  {opt.icon}
                </span>
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  },
);
SegmentedControl.displayName = "SegmentedControl";

export { SegmentedControl };
