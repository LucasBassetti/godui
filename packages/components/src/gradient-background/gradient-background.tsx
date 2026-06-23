import * as React from "react";

export type GradientBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
  /** CSS `background` shorthand. */
  background?: string;
  /** CSS `background-image` (gradients, grids, masks). */
  backgroundImage?: string;
  /** CSS `background-size`. */
  backgroundSize?: string;
};

/**
 * Full-bleed background. Drop it as the first child of a `relative` container;
 * your content sits above it at `z-raised` or higher. Pass any of the three
 * background props to override the baked default.
 */
const GradientBackground = React.forwardRef<
  HTMLDivElement,
  GradientBackgroundProps
>(
  (
    {
      // @default-props:start
      background = "#020617",
      backgroundImage = "radial-gradient(circle 500px at 50% 200px, #3e3e3e, transparent)",
      backgroundSize,
      // @default-props:end
      className,
      style,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-slot="gradient-background"
      aria-hidden="true"
      className={`absolute inset-0 z-base ${className ?? ""}`}
      style={{ background, backgroundImage, backgroundSize, ...style }}
      {...props}
    />
  ),
);
GradientBackground.displayName = "GradientBackground";

export { GradientBackground };
