"use client";

import { useInView, useMotionValue, useSpring } from "framer-motion";
import * as React from "react";

export type NumberTickerProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  /** Target value the ticker animates to (or from, when `direction` is `"down"`). */
  value: number;
  /** Value the counter starts at. Defaults to `0`. */
  startValue?: number;
  /** `"up"` counts toward `value`, `"down"` counts from `value` to `startValue`. */
  direction?: "up" | "down";
  /** Delay in seconds before the animation begins once in view. */
  delay?: number;
  /** Number of decimal places to render. */
  decimalPlaces?: number;
  /** Spring damping — higher is less bouncy. */
  damping?: number;
  /** Spring stiffness — higher is faster. */
  stiffness?: number;
};

const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
  (
    {
      value,
      startValue = 0,
      direction = "up",
      delay = 0,
      decimalPlaces = 0,
      damping = 60,
      stiffness = 100,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(
      direction === "down" ? value : startValue,
    );
    const springValue = useSpring(motionValue, { damping, stiffness });
    const isInView = useInView(ref, { once: true, margin: "0px" });

    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLSpanElement,
    );

    React.useEffect(() => {
      if (!isInView) return;

      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }, [motionValue, isInView, delay, value, direction, startValue]);

    React.useEffect(
      () =>
        springValue.on("change", (latest) => {
          if (ref.current) {
            ref.current.textContent = Intl.NumberFormat("en-US", {
              minimumFractionDigits: decimalPlaces,
              maximumFractionDigits: decimalPlaces,
            }).format(Number(latest.toFixed(decimalPlaces)));
          }
        }),
      [springValue, decimalPlaces],
    );

    return (
      <span
        ref={ref}
        data-slot="number-ticker"
        className={`inline-block tabular-nums tracking-wider text-foreground ${className ?? ""}`}
        {...props}
      >
        {Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(direction === "down" ? value : startValue)}
      </span>
    );
  },
);
NumberTicker.displayName = "NumberTicker";

export { NumberTicker };
