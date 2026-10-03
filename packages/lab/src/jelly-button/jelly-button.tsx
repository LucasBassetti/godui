"use client";

import * as React from "react";

export type JellyButtonVariant = "primary" | "secondary" | "outline";
export type JellyButtonSize = "sm" | "md" | "lg";

export type JellyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: JellyButtonVariant;
  size?: JellyButtonSize;
  /**
   * How hard the button squashes on press, `0`–`1`. Higher = more deform.
   * Drives the `--jelly-press` scale the button snaps to while held.
   * @default 0.6
   */
  squash?: number;
};

// Squishy/tactile button. The whole surface squashes on press (scaleX ↑,
// scaleY ↓ from `origin-bottom`) and springs back with a single overshoot via
// the `back` easing — a jelly wobble that never leaves the compositor. Only
// `scale` animates (MotionScore S); color/shadow differences between states are
// static, never transitioned. Reduced motion drops the deform entirely.
const BUTTON_CLASS =
  "group relative inline-flex origin-bottom cursor-pointer select-none items-center justify-center border-none font-medium [will-change:transform] [-webkit-tap-highlight-color:transparent] [transition:scale_300ms_cubic-bezier(0.3,0.7,0.4,1.5)] hover:[scale:1.04] focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:[scale:1.04] active:[scale:var(--jelly-press)] active:[transition:scale_120ms_cubic-bezier(0.3,0.7,0.4,1)] data-[pressed=true]:[scale:var(--jelly-press)] data-[pressed=true]:[transition:scale_120ms_cubic-bezier(0.3,0.7,0.4,1)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:[transition:none] motion-reduce:hover:[scale:1] motion-reduce:focus-visible:[scale:1] motion-reduce:active:[scale:1] motion-reduce:data-[pressed=true]:[scale:1]";

const variantClasses: Record<JellyButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-sm",
  secondary: "bg-secondary text-secondary-foreground shadow-sm",
  outline:
    "border border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground",
};

const sizeClasses: Record<JellyButtonSize, string> = {
  sm: "rounded-[var(--button-radius-sm)] px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "rounded-[var(--button-radius-md)] px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "rounded-[var(--button-radius-lg)] px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
};

/** Map the `squash` knob to the `scale: <x> <y>` the button snaps to on press. */
function pressScale(squash: number): string {
  const amount = Math.min(Math.max(squash, 0), 1) * 0.22;
  return `${(1 + amount).toFixed(3)} ${(1 - amount).toFixed(3)}`;
}

const JellyButton = React.forwardRef<HTMLButtonElement, JellyButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      squash = 0.6,
      style,
      children,
      onKeyDown,
      onKeyUp,
      ...props
    },
    ref,
  ) => {
    const [pressed, setPressed] = React.useState(false);

    // Keyboard activation (Enter/Space) mirrors the pointer squash so the
    // wobble reads the same for keyboard users.
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") setPressed(true);
      onKeyDown?.(event);
    };
    const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") setPressed(false);
      onKeyUp?.(event);
    };

    return (
      <button
        ref={ref}
        type="button"
        data-variant={variant}
        data-pressed={pressed ? "true" : undefined}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        style={
          {
            "--jelly-press": pressScale(squash),
            ...style,
          } as React.CSSProperties
        }
        className={`${BUTTON_CLASS} ${variantClasses[variant]} ${sizeClasses[size]} ${className ?? ""}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);
JellyButton.displayName = "JellyButton";

export { JellyButton };
