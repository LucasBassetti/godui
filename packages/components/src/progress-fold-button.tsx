"use client";

import * as React from "react";

export type ProgressFoldButtonVariant = "primary" | "secondary";

export type ProgressFoldButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ProgressFoldButtonVariant;
  };

const frontClasses: Record<ProgressFoldButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

// Fold side: a faint tint at rest (back), a stronger one while the progress
// bar runs. Alpha utilities blend with the surrounding background so the
// effect adapts to light and dark themes.
const backClasses: Record<ProgressFoldButtonVariant, string> = {
  primary: "bg-primary/15",
  secondary: "bg-secondary-foreground/15",
};

const barClasses: Record<ProgressFoldButtonVariant, string> = {
  primary: "bg-primary/40",
  secondary: "bg-secondary-foreground/35",
};

const ProgressFoldButton = React.forwardRef<
  HTMLButtonElement,
  ProgressFoldButtonProps
>(({ className, children, onClick, variant = "primary", ...props }, ref) => {
  const [active, setActive] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setActive(true);
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type="button"
      data-variant={variant}
      data-active={active ? "true" : undefined}
      onClick={handleClick}
      className={`progress-fold-button text-sm font-medium ${className ?? ""}`}
      {...props}
    >
      <span className="progress-fold-button-layers" aria-hidden="true">
        <span className={`progress-fold-button-back ${backClasses[variant]}`} />
        <span
          className={`progress-fold-button-bar ${barClasses[variant]}`}
          onAnimationEnd={() => setActive(false)}
        />
      </span>
      <span className={`progress-fold-button-front ${frontClasses[variant]}`}>
        {children}
      </span>
    </button>
  );
});
ProgressFoldButton.displayName = "ProgressFoldButton";

export { ProgressFoldButton };
