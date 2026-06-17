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
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      data-mask={mask}
      data-variant={variant}
      data-size={size}
      className={`mask-button font-medium ${sizeClasses[size]} ${className ?? ""}`}
      {...props}
    >
      <span className="mask-button-label">{children}</span>
      <span className="mask-button-fill" aria-hidden="true">
        {children}
      </span>
    </button>
  ),
);
MaskButton.displayName = "MaskButton";

export { MaskButton };
