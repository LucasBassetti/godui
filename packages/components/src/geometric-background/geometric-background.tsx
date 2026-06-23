import * as React from "react";

export type GeometricBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
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
const GeometricBackground = React.forwardRef<
  HTMLDivElement,
  GeometricBackgroundProps
>(
  (
    {
      // @default-props:start
      background = "#ffffff",
      backgroundImage = "\n      linear-gradient(to right, #f0f0f0 1px, transparent 1px),\n      linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),\n      radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent)\n    ",
      backgroundSize = "96px 64px, 96px 64px, 100% 100%",
      // @default-props:end
      className,
      style,
      ...props
    },
    ref,
  ) => {
    // `background` is a CSS shorthand; mixing it with the longhand
    // backgroundImage/backgroundSize in one style object triggers React's
    // shorthand/longhand warning. When a longhand is present, `background`
    // is the color layer — apply it as backgroundColor instead.
    const hasLonghand =
      backgroundImage !== undefined || backgroundSize !== undefined;
    return (
      <div
        ref={ref}
        data-slot="geometric-background"
        aria-hidden="true"
        className={`absolute inset-0 z-base ${className ?? ""}`}
        style={
          hasLonghand
            ? {
                backgroundColor: background,
                backgroundImage,
                backgroundSize,
                ...style,
              }
            : { background, ...style }
        }
        {...props}
      />
    );
  },
);
GeometricBackground.displayName = "GeometricBackground";

export { GeometricBackground };
