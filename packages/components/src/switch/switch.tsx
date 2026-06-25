"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type SwitchSize = "sm" | "md" | "lg";

export type SwitchProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "type"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  size?: SwitchSize;
  onCheckedChange?: (checked: boolean) => void;
};

type Metrics = { track: string; thumb: number; travel: number; pad: number };

const sizeMetrics: Record<SwitchSize, Metrics> = {
  sm: { track: "h-5 w-9", thumb: 16, travel: 16, pad: 2 },
  md: { track: "h-6 w-11", thumb: 20, travel: 20, pad: 2 },
  lg: { track: "h-7 w-[3.25rem]", thumb: 24, travel: 24, pad: 2 },
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked: checkedProp,
      defaultChecked = false,
      size = "md",
      disabled = false,
      onCheckedChange,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const metrics = sizeMetrics[size];
    const isControlled = checkedProp !== undefined;
    const [internal, setInternal] = React.useState(defaultChecked);
    const checked = isControlled ? checkedProp : internal;
    const draggedRef = React.useRef(false);

    const setChecked = (next: boolean) => {
      if (next === checked) return;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    };

    const spring = reduceMotion
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 550, damping: 30 };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => {
          // Suppress the click synthesized at the end of a drag gesture.
          if (draggedRef.current) {
            draggedRef.current = false;
            return;
          }
          setChecked(!checked);
        }}
        className={`relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-[var(--switch-pad)] [transition:background-color_200ms_ease] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
          metrics.track
        } ${checked ? "bg-primary" : "bg-input"} ${className ?? ""}`}
        style={{ "--switch-pad": `${metrics.pad}px` } as React.CSSProperties}
        {...props}
      >
        <motion.span
          drag={disabled ? false : "x"}
          dragConstraints={{ left: 0, right: metrics.travel }}
          dragElastic={0.05}
          dragMomentum={false}
          onDragStart={() => {
            draggedRef.current = true;
          }}
          onDragEnd={(_, info) => {
            const midpoint = metrics.travel / 2;
            const projected = (checked ? metrics.travel : 0) + info.offset.x;
            setChecked(projected >= midpoint);
          }}
          animate={{ x: checked ? metrics.travel : 0 }}
          transition={spring}
          whileTap={reduceMotion ? undefined : { scaleX: 1.12 }}
          style={{ width: metrics.thumb, height: metrics.thumb }}
          className="rounded-full bg-background shadow-sm [transform-origin:center]"
        />
      </button>
    );
  },
);
Switch.displayName = "Switch";

export { Switch };
