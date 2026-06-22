"use client";

import type { CSSProperties } from "react";
import * as React from "react";

export type ShimmerButtonVariant = "primary" | "secondary" | "outline";
export type ShimmerButtonSize = "sm" | "md" | "lg";

export type ShimmerButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ShimmerButtonVariant;
    size?: ShimmerButtonSize;
    /** Animate the button with a shimmering border light effect */
    shimmer?: boolean;
    /** Color of the shimmering light effect */
    shimmerColor?: string;
    /** Inset size of the shimmer backdrop cut */
    shimmerSize?: string;
    /** Duration of the shimmer animation */
    shimmerDuration?: string;
    /** Border radius of the button */
    borderRadius?: string;
    /** Background color of the button */
    background?: string;
  };

const radiusBySize: Record<ShimmerButtonSize, string> = {
  sm: "var(--button-radius-sm)",
  md: "var(--button-radius-md)",
  lg: "var(--button-radius-lg)",
};

// Padding / font-size from the shared button size scale (--button-* tokens).
const sizeClasses: Record<ShimmerButtonSize, string> = {
  sm: "px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
};

// Decorative layers hide when shimmer is off or the button is disabled —
// replaces the `.shimmer-button:not([data-shimmer]) .layer` descendant rules.
const HIDDEN_WHEN_OFF =
  "group-[&:not([data-shimmer=true])]:hidden group-disabled:hidden";

const variantDefaults: Record<
  ShimmerButtonVariant,
  {
    background: string;
    shimmerColor: string;
    shimmerSpread: string;
    textClass: string;
    borderClass: string;
  }
> = {
  primary: {
    background: "var(--primary)",
    shimmerColor:
      "color-mix(in srgb, var(--primary-foreground) 80%, var(--primary))",
    shimmerSpread: "55deg",
    textClass: "text-primary-foreground",
    borderClass: "border-transparent",
  },
  secondary: {
    background: "var(--secondary)",
    shimmerColor: "var(--secondary-foreground)",
    shimmerSpread: "90deg",
    textClass: "text-secondary-foreground",
    borderClass: "border-secondary-foreground/20",
  },
  outline: {
    background: "var(--background)",
    shimmerColor: "var(--primary)",
    shimmerSpread: "90deg",
    textClass: "text-foreground",
    borderClass: "border-border",
  },
};

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      shimmer = true,
      shimmerColor,
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius,
      background,
      children,
      type = "button",
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
      onKeyUp,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const defaults = variantDefaults[variant];
    const sparkRef = React.useRef<HTMLDivElement>(null);
    const [pressed, setPressed] = React.useState(false);

    const style = {
      "--spread": defaults.shimmerSpread,
      "--shimmer-color": shimmerColor ?? defaults.shimmerColor,
      "--radius": borderRadius ?? radiusBySize[size],
      "--speed": shimmerDuration,
      "--cut": shimmerSize,
      "--bg": background ?? defaults.background,
    } as CSSProperties;

    const setSparkRate = (rate: number) => {
      sparkRef.current?.getAnimations({ subtree: true }).forEach((a) => {
        a.playbackRate = rate;
      });
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setSparkRate(3);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setSparkRate(1);
      onMouseLeave?.(e);
    };

    // Keyboard focus matches the hover speed-up; ignore non-visible focus
    // (programmatic / pointer) so it stays a keyboard affordance.
    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      if (e.target.matches(":focus-visible")) {
        setSparkRate(3);
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      setSparkRate(1);
      onBlur?.(e);
    };

    // Enter fires the native click but never sets :active, so mirror the
    // pointer press cue while the key is held.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        setPressed(true);
      }
      onKeyDown?.(e);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        setPressed(false);
      }
      onKeyUp?.(e);
    };

    return (
      <button
        ref={ref}
        type={type}
        data-variant={variant}
        data-size={size}
        data-shimmer={shimmer ? "true" : undefined}
        data-pressed={pressed ? "true" : undefined}
        style={style}
        className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border whitespace-nowrap [background:var(--bg)] transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px data-[pressed=true]:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${sizeClasses[size]} ${defaults.textClass} ${defaults.borderClass} ${className ?? ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        <div
          ref={sparkRef}
          className={`absolute inset-0 -z-30 overflow-visible blur-[2px] group-data-[variant=primary]:blur-[1px] [container-type:size] ${HIDDEN_WHEN_OFF}`}
          aria-hidden="true"
        >
          <div className="animate-shimmer-slide absolute inset-0 aspect-square h-[100cqh] rounded-none [mask:none]">
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [translate:0_0] [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>

        <span className="relative z-10">{children}</span>

        <div
          className={`pointer-events-none absolute inset-0 rounded-[inherit] [transition:box-shadow_300ms_ease-in-out] ${HIDDEN_WHEN_OFF}`}
          aria-hidden="true"
        />

        <div
          className={`absolute -z-20 [inset:var(--cut)] [border-radius:var(--radius)] [background:var(--bg)] ${HIDDEN_WHEN_OFF}`}
          aria-hidden="true"
        />
      </button>
    );
  },
);
ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
