import * as React from "react";

export type DecorativeBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
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
const DecorativeBackground = React.forwardRef<
  HTMLDivElement,
  DecorativeBackgroundProps
>(
  (
    {
      // @default-props:start
      background = "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
      backgroundImage,
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
      data-slot="decorative-background"
      aria-hidden="true"
      className={`absolute inset-0 z-base ${className ?? ""}`}
      style={{ background, backgroundImage, backgroundSize, ...style }}
      {...props}
    />
  ),
);
DecorativeBackground.displayName = "DecorativeBackground";

export { DecorativeBackground };
