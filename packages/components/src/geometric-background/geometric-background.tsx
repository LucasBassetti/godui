import * as React from "react";

export type GeometricBackgroundProps = React.HTMLAttributes<HTMLDivElement>;

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
  backgroundImage:
    "\n      linear-gradient(to right, #f0f0f0 1px, transparent 1px),\n      linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),\n      radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent)\n    ",
  backgroundSize: "96px 64px, 96px 64px, 100% 100%",
  backgroundColor: "#ffffff",
  // @default-props:end
} as React.CSSProperties;

/**
 * Full-bleed background. Drop it as the first child of a `relative` container;
 * your content sits above it at `z-raised` or higher. Renders the baked pattern
 * by default; pass `style` to supply your own background.
 */
const GeometricBackground = React.forwardRef<
  HTMLDivElement,
  GeometricBackgroundProps
>(({ className, style, ...props }, ref) => {
  const ownsBackground =
    style != null && BACKGROUND_KEYS.some((key) => key in style);
  return (
    <div
      ref={ref}
      data-slot="geometric-background"
      aria-hidden="true"
      className={`absolute inset-0 z-base ${className ?? ""}`}
      style={ownsBackground ? style : { ...baseStyle, ...style }}
      {...props}
    />
  );
});
GeometricBackground.displayName = "GeometricBackground";

export { GeometricBackground };
