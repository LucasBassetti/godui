"use client";

import * as React from "react";

export type ProgressFoldButtonVariant = "primary" | "secondary";
export type ProgressFoldButtonSize = "sm" | "md" | "lg";
export type ProgressFoldButtonStatus = "idle" | "loading";

export type ProgressFoldButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ProgressFoldButtonVariant;
    size?: ProgressFoldButtonSize;
    /**
     * Loading lifecycle. `loading` folds the front face open and runs the
     * progress bar behind it. Fully controlled.
     */
    status?: ProgressFoldButtonStatus;
    /**
     * 0–100. With `status="loading"` a value makes the bar determinate (fills
     * to that percentage); omitting it makes the bar indeterminate (a segment
     * sweeps across).
     */
    progress?: number;
  };

const sizeClasses: Record<ProgressFoldButtonSize, string> = {
  sm: "progress-fold-button--sm",
  md: "progress-fold-button--md",
  lg: "progress-fold-button--lg",
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

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

const ProgressFoldButton = React.forwardRef<
  HTMLButtonElement,
  ProgressFoldButtonProps
>(
  (
    {
      className,
      style,
      children,
      variant = "primary",
      size = "md",
      status = "idle",
      progress,
      ...props
    },
    ref,
  ) => {
    const isLoading = status === "loading";
    const isDeterminate = isLoading && progress != null;
    const clamped = progress != null ? clampPercent(progress) : undefined;

    // Snap the fill to 0 on entering loading, then arm the smooth transition a
    // frame later so progress animates without the entry flashing from full.
    const [armed, setArmed] = React.useState(false);
    React.useEffect(() => {
      if (!isLoading) {
        setArmed(false);
        return;
      }
      setArmed(false);
      const id = requestAnimationFrame(() => setArmed(true));
      return () => cancelAnimationFrame(id);
    }, [isLoading]);

    return (
      <button
        ref={ref}
        type="button"
        data-variant={variant}
        data-size={size}
        data-status={isLoading ? "loading" : undefined}
        data-determinate={isDeterminate ? "true" : undefined}
        data-armed={armed ? "true" : undefined}
        aria-busy={isLoading || undefined}
        className={`progress-fold-button font-medium ${sizeClasses[size]} ${className ?? ""}`}
        style={
          clamped != null
            ? ({
                ...style,
                "--progress-fold-fill": `${clamped}%`,
              } as React.CSSProperties)
            : style
        }
        {...props}
      >
        <span className="progress-fold-button-layers" aria-hidden="true">
          <span
            className={`progress-fold-button-back ${backClasses[variant]}`}
          />
          <span className={`progress-fold-button-bar ${barClasses[variant]}`} />
        </span>
        <span className={`progress-fold-button-front ${frontClasses[variant]}`}>
          {children}
        </span>
        {isLoading ? (
          <span
            className="progress-fold-button-sr"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={isDeterminate ? clamped : undefined}
            aria-valuetext={isDeterminate ? `${clamped}%` : "Loading"}
          />
        ) : null}
      </button>
    );
  },
);
ProgressFoldButton.displayName = "ProgressFoldButton";

export { ProgressFoldButton };
