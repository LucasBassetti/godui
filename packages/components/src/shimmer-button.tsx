import * as React from "react";
import type { CSSProperties } from "react";

export type ShimmerButtonVariant = "primary" | "secondary" | "outline";
export type ShimmerButtonSize = "default" | "sm" | "lg";

export type ShimmerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
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

const sizeClasses: Record<ShimmerButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  default: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

const radiusBySize: Record<ShimmerButtonSize, string> = {
  sm: "var(--radius-md)",
  default: "var(--radius-lg)",
  lg: "var(--radius-xl)",
};

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
    shimmerColor: "color-mix(in srgb, var(--primary-foreground) 80%, var(--primary))",
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
      size = "default",
      shimmer = true,
      shimmerColor,
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius,
      background,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const defaults = variantDefaults[variant];

    const style = {
      "--spread": defaults.shimmerSpread,
      "--shimmer-color": shimmerColor ?? defaults.shimmerColor,
      "--radius": borderRadius ?? radiusBySize[size],
      "--speed": shimmerDuration,
      "--cut": shimmerSize,
      "--bg": background ?? defaults.background,
    } as CSSProperties;

    return (
      <button
        ref={ref}
        type={type}
        data-variant={variant}
        data-size={size}
        data-shimmer={shimmer ? "true" : undefined}
        style={style}
        className={`group shimmer-button relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border whitespace-nowrap [background:var(--bg)] transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${defaults.textClass} ${defaults.borderClass} ${sizeClasses[size]} ${className ?? ""}`}
        {...props}
      >
        <div
          className="shimmer-button-spark absolute inset-0 -z-30 overflow-visible blur-[2px] [container-type:size]"
          aria-hidden="true"
        >
          <div className="animate-shimmer-slide absolute inset-0 aspect-square h-[100cqh] rounded-none [mask:none]">
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [translate:0_0] [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>

        <span className="relative z-10">{children}</span>

        <div className="shimmer-button-highlight" aria-hidden="true" />

        <div
          className="shimmer-button-backdrop absolute -z-20 [inset:var(--cut)] [border-radius:var(--radius)] [background:var(--bg)]"
          aria-hidden="true"
        />
      </button>
    );
  },
);
ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
