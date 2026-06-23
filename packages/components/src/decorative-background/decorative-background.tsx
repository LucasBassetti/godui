import * as React from "react";

export type DecorativeBackgroundProps = React.HTMLAttributes<HTMLDivElement>;

// Background-defining keys. When the caller supplies any of these via `style`,
// they own the background and the baked default is dropped — merging a partial
// override with the default would mix CSS shorthand + longhand.
const BACKGROUND_KEYS = [
  "background",
  "backgroundColor",
  "backgroundImage",
  "backgroundSize",
  "backgroundPosition",
  "backgroundRepeat",
  "backgroundBlendMode",
] as const;

const baseStyle = {
  // @default-props:start
  background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
  // @default-props:end
} as React.CSSProperties;

/**
 * Full-bleed background. Drop it as the first child of a `relative` container;
 * your content sits above it at `z-raised` or higher. Renders the baked pattern
 * by default; pass `style` to supply your own background.
 */
const DecorativeBackground = React.forwardRef<
  HTMLDivElement,
  DecorativeBackgroundProps
>(({ className, style, ...props }, ref) => {
  const ownsBackground =
    style != null && BACKGROUND_KEYS.some((key) => key in style);
  return (
    <div
      ref={ref}
      data-slot="decorative-background"
      aria-hidden="true"
      className={`absolute inset-0 z-base ${className ?? ""}`}
      style={ownsBackground ? style : { ...baseStyle, ...style }}
      {...props}
    />
  );
});
DecorativeBackground.displayName = "DecorativeBackground";

export { DecorativeBackground };
