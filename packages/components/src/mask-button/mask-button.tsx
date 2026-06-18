"use client";

import * as React from "react";

export type MaskButtonMask = "nature" | "urban" | "forest";
export type MaskButtonVariant = "primary" | "secondary";
export type MaskButtonSize = "sm" | "md" | "lg";

export type MaskButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Sprite-sheet mask animated on hover to reveal the label */
  mask?: MaskButtonMask;
  /** Color of the masked face */
  variant?: MaskButtonVariant;
  size?: MaskButtonSize;
};

const sizeClasses: Record<MaskButtonSize, string> = {
  sm: "mask-button--sm",
  md: "mask-button--md",
  lg: "mask-button--lg",
};

const MaskButton = React.forwardRef<HTMLButtonElement, MaskButtonProps>(
  (
    {
      className,
      children,
      mask = "nature",
      variant = "primary",
      size = "md",
      onKeyDown,
      onKeyUp,
      ...props
    },
    ref,
  ) => {
    const [pressed, setPressed] = React.useState(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        setPressed(true);
      }
      onKeyDown?.(event);
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        setPressed(false);
      }
      onKeyUp?.(event);
    };

    return (
      <button
        ref={ref}
        type="button"
        data-mask={mask}
        data-variant={variant}
        data-size={size}
        data-pressed={pressed ? "true" : undefined}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className={`mask-button font-medium ${sizeClasses[size]} ${className ?? ""}`}
        {...props}
      >
        <span className="mask-button-label">{children}</span>
        <span className="mask-button-fill" aria-hidden="true">
          {children}
        </span>
      </button>
    );
  },
);
MaskButton.displayName = "MaskButton";

export { MaskButton };
