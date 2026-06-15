import * as React from "react";

export type ThreeDButtonVariant = "default" | "secondary";
export type ThreeDButtonSize = "default" | "sm" | "lg";

export type ThreeDButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ThreeDButtonVariant;
  size?: ThreeDButtonSize;
  /** Animate the 3D edge and shadow with a flowing rainbow gradient */
  rainbow?: boolean;
};

const sizeClasses: Record<ThreeDButtonSize, string> = {
  sm: "three-d-button-front--sm",
  default: "three-d-button-front--default",
  lg: "three-d-button-front--lg",
};

const ThreeDButton = React.forwardRef<HTMLButtonElement, ThreeDButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
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
        className={`three-d-button font-medium ${className ?? ""}`}
        {...props}
      >
        <span className="three-d-button-shadow" aria-hidden="true" />
        <span className="three-d-button-edge" aria-hidden="true" />
        <span className={`three-d-button-front ${sizeClasses[size]}`}>
          {children}
        </span>
      </button>
    );
  },
);
ThreeDButton.displayName = "ThreeDButton";

export { ThreeDButton };
