"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type MagneticButtonVariant = "default" | "secondary" | "outline";
export type MagneticButtonSize = "sm" | "md" | "lg";

export type MagneticButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "ref"
> & {
  variant?: MagneticButtonVariant;
  size?: MagneticButtonSize;
  /**
   * How strongly the button follows the cursor, 0–1. The label drifts a touch
   * further for a parallax feel. Defaults to `0.4`.
   */
  strength?: number;
  /**
   * Invisible sensor padding (px) around the button so the magnetic pull begins
   * before the pointer reaches the visual edge. Defaults to `0`.
   */
  range?: number;
  /**
   * Keep the label centered in the button (it rides with the shell, no parallax
   * drift). When `false` (default) the label drifts further for a parallax feel.
   */
  staticLabel?: boolean;
};

// The pull only feels alive with an overshooting spring — slightly underdamped
// so it settles with a hint of elasticity rather than easing in flatly.
const SPRING = { stiffness: 170, damping: 12, mass: 0.1 } as const;

const BUTTON_BASE =
  "relative inline-flex cursor-pointer select-none items-center justify-center rounded-[var(--button-radius)] font-medium [outline-offset:4px] [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] [transition:background_200ms_ease,box-shadow_200ms_ease,color_200ms_ease,scale_120ms_ease] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const variantClass: Record<MagneticButtonVariant, string> = {
  default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline:
    "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
};

const sizeClass: Record<MagneticButtonSize, string> = {
  sm: "[--button-radius:var(--button-radius-sm)] px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "[--button-radius:var(--button-radius-md)] px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "[--button-radius:var(--button-radius-lg)] px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
};

const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      strength = 0.4,
      range = 0,
      staticLabel = false,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => buttonRef.current as HTMLButtonElement,
    );

    const reduceMotion = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, SPRING);
    const springY = useSpring(y, SPRING);

    // `staticLabel` gives the label no offset of its own (factor 0) so it rides
    // with the shell, staying centered in the button; otherwise it drifts ~40%
    // further than the button for a layered parallax feel.
    const labelFactor = staticLabel ? 0 : 0.4;
    const labelX = useTransform(springX, (v) => v * labelFactor);
    const labelY = useTransform(springY, (v) => v * labelFactor);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const el = buttonRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    };

    const reset = () => {
      x.set(0);
      y.set(0);
    };

    return (
      // Sensor expands the hit-area so the pull engages before the visual edge.
      <div
        data-slot="magnetic-button-sensor"
        onPointerMove={handlePointerMove}
        onPointerLeave={reset}
        className="inline-flex"
        style={{ padding: range }}
      >
        <motion.button
          ref={buttonRef}
          data-slot="magnetic-button"
          type="button"
          style={reduceMotion ? undefined : { x: springX, y: springY }}
          className={`${BUTTON_BASE} ${variantClass[variant]} ${sizeClass[size]} ${className ?? ""}`}
          {...(props as React.ComponentProps<typeof motion.button>)}
        >
          <motion.span
            data-slot="magnetic-button-label"
            style={
              reduceMotion
                ? undefined
                : { x: labelX, y: labelY, display: "inline-flex" }
            }
            className="items-center gap-2"
          >
            {children}
          </motion.span>
        </motion.button>
      </div>
    );
  },
);
MagneticButton.displayName = "MagneticButton";

export { MagneticButton };
