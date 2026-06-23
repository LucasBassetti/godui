import * as React from "react";

export type EffectBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
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
const EffectBackground = React.forwardRef<
  HTMLDivElement,
  EffectBackgroundProps
>(
  (
    {
      // @default-props:start
      background = "#f7eaff",
      backgroundImage = "\n       radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),\n            radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),\n            radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),\n            radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),\n            linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)\n    ",
      backgroundSize = "100% 100%",
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
        data-slot="effect-background"
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
EffectBackground.displayName = "EffectBackground";

export { EffectBackground };
