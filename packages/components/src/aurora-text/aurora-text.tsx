"use client";

import * as React from "react";

export type AuroraTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  /** Gradient stops the aurora cycles through. Defaults to a rainbow spectrum. */
  colors?: string[];
  /** Speed multiplier — `1` ≈ 10s per cycle, higher is faster. */
  speed?: number;
};

// Full-spectrum rainbow, looped back to the first stop for a seamless cycle.
const RAINBOW_COLORS = [
  "#ff2d55",
  "#ff9500",
  "#ffd60a",
  "#34c759",
  "#00c7be",
  "#0a84ff",
  "#5e5ce6",
  "#bf5af2",
];

const AuroraText = React.forwardRef<HTMLSpanElement, AuroraTextProps>(
  (
    {
      children,
      className,
      colors = RAINBOW_COLORS,
      speed = 1,
      style,
      ...props
    },
    ref,
  ) => {
    const stops = [...colors, colors[0]].join(", ");

    return (
      <span
        ref={ref}
        data-slot="aurora-text"
        className={`relative inline-block ${className ?? ""}`}
        {...props}
      >
        <span className="sr-only">{children}</span>
        <span
          aria-hidden="true"
          className="animate-aurora-text bg-[length:200%_auto] bg-clip-text text-transparent motion-reduce:animate-none"
          style={
            {
              backgroundImage: `linear-gradient(135deg, ${stops})`,
              "--aurora-text-speed": `${10 / speed}s`,
              ...style,
            } as React.CSSProperties
          }
        >
          {children}
        </span>
      </span>
    );
  },
);
AuroraText.displayName = "AuroraText";

export { AuroraText };
