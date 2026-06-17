import * as React from "react";

export type MagicButtonVariant = "default" | "secondary";
export type MagicButtonSize = "sm" | "md" | "lg";

export type MagicButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: MagicButtonVariant;
  size?: MagicButtonSize;
  /** Animate the 3D edge and shadow with a flowing rainbow gradient */
  rainbow?: boolean;
};

const sizeClasses: Record<MagicButtonSize, string> = {
  sm: "magic-button-front--sm",
  md: "magic-button-front--md",
  lg: "magic-button-front--lg",
};

const MagicButton = React.forwardRef<HTMLButtonElement, MagicButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      rainbow = true,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        data-variant={variant}
        data-rainbow={rainbow ? "true" : undefined}
        className={`magic-button font-medium ${className ?? ""}`}
        {...props}
      >
        <span className="magic-button-shadow" aria-hidden="true" />
        <span className="magic-button-edge" aria-hidden="true" />
        <span className={`magic-button-front ${sizeClasses[size]}`}>
          {children}
        </span>
      </button>
    );
  },
);
MagicButton.displayName = "MagicButton";

export { MagicButton };
