import * as React from "react";

export type EffectBackgroundProps = React.HTMLAttributes<HTMLDivElement>;

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
    "\n       radial-gradient(ellipse 85% 65% at 8% 8%, rgba(175, 109, 255, 0.42), transparent 60%),\n            radial-gradient(ellipse 75% 60% at 75% 35%, rgba(255, 235, 170, 0.55), transparent 62%),\n            radial-gradient(ellipse 70% 60% at 15% 80%, rgba(255, 100, 180, 0.40), transparent 62%),\n            radial-gradient(ellipse 70% 60% at 92% 92%, rgba(120, 190, 255, 0.45), transparent 62%),\n            linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)\n    ",
  backgroundSize: "100% 100%",
  backgroundColor: "#f7eaff",
  // @default-props:end
} as React.CSSProperties;

/**
 * Full-bleed background. Drop it as the first child of a `relative` container;
 * your content sits above it at `z-raised` or higher. Renders the baked pattern
 * by default; pass `style` to supply your own background.
 */
const EffectBackground = React.forwardRef<
  HTMLDivElement,
  EffectBackgroundProps
>(({ className, style, ...props }, ref) => {
  const ownsBackground =
    style != null && BACKGROUND_KEYS.some((key) => key in style);
  return (
    <div
      ref={ref}
      data-slot="effect-background"
      aria-hidden="true"
      className={`absolute inset-0 z-base ${className ?? ""}`}
      style={ownsBackground ? style : { ...baseStyle, ...style }}
      {...props}
    />
  );
});
EffectBackground.displayName = "EffectBackground";

export { EffectBackground };
