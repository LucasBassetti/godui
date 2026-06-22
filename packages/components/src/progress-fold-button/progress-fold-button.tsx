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

// `group` drives the fold + progress state from the button's data-* attributes.
const BUTTON_BASE =
  "group relative inline-flex cursor-pointer select-none whitespace-nowrap border-none p-0 bg-border font-medium [perspective:800px] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] focus-visible:[outline:2px_solid_var(--ring)] focus-visible:[outline-offset:4px] disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none";

const LAYERS_BASE = "absolute inset-0 -z-[1] overflow-hidden";

// Folding front face — tilts back on hover / focus / while loading.
const FRONT_BASE =
  "relative grid w-full place-items-center rounded-[inherit] [transform:rotateX(0deg)] [transform-origin:top_center] [transition:transform_0.2s] group-hover:[transform:rotateX(35deg)] group-focus-visible:[transform:rotateX(35deg)] group-data-[status=loading]:[transform:rotateX(35deg)] motion-reduce:[transition:none]";

// Progress bar: determinate fills to --progress-fold-fill (transition armed a
// frame after entering loading); indeterminate sweeps a fixed segment on a loop.
const BAR_BASE =
  "absolute top-0 left-0 h-full w-0 group-data-[determinate=true]:[width:var(--progress-fold-fill,0%)] group-[&[data-determinate=true][data-armed=true]]:[transition:width_0.25s_ease] group-[&[data-status=loading]:not([data-determinate=true])]:w-[40%] group-[&[data-status=loading]:not([data-determinate=true])]:animate-progress-fold-indeterminate motion-reduce:group-[&[data-determinate=true][data-armed=true]]:[transition:none] motion-reduce:group-[&[data-status=loading]:not([data-determinate=true])]:animate-none";

// Outer button + clip layer share the per-size radius (--button-radius-*).
const radiusClasses: Record<ProgressFoldButtonSize, string> = {
  sm: "rounded-[var(--button-radius-sm)]",
  md: "rounded-[var(--button-radius-md)]",
  lg: "rounded-[var(--button-radius-lg)]",
};

const frontSizeClasses: Record<ProgressFoldButtonSize, string> = {
  sm: "px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
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
        className={`${BUTTON_BASE} ${radiusClasses[size]} ${className ?? ""}`}
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
        <span
          className={`${LAYERS_BASE} ${radiusClasses[size]}`}
          aria-hidden="true"
        >
          <span className={`absolute inset-0 ${backClasses[variant]}`} />
          <span className={`${BAR_BASE} ${barClasses[variant]}`} />
        </span>
        <span
          data-slot="progress-fold-front"
          className={`${FRONT_BASE} ${frontSizeClasses[size]} ${frontClasses[variant]}`}
        >
          {children}
        </span>
        {isLoading ? (
          <span
            className="sr-only"
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
