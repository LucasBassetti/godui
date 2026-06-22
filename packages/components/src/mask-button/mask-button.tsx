"use client";

import * as React from "react";

export type MaskButtonMask = "nature" | "urban" | "forest";
export type MaskButtonVariant = "primary" | "secondary";
export type MaskButtonSize = "sm" | "md" | "lg";

export type MaskButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Sprite-sheet mask animated on hover to reveal the label */
  mask?: MaskButtonMask;
  /** Color of the masked face */
  variant?: MaskButtonVariant;
  size?: MaskButtonSize;
};

// Resolve the sprite sheets through the bundler. `new URL(..., import.meta.url)`
// returns a string URL in both Vite (Storybook) and Webpack/Turbopack (Next),
// avoiding the StaticImageData object a bare `import` yields under Next.
const MASK_ASSETS: Record<MaskButtonMask, string> = {
  nature: new URL("../assets/mask-nature.png", import.meta.url).href,
  urban: new URL("../assets/mask-urban.png", import.meta.url).href,
  forest: new URL("../assets/mask-forest.png", import.meta.url).href,
};

// Per-mask sprite geometry + flipbook step counts (static so the scanner can
// see the class names). `out` plays at rest, `in` on hover / focus-visible.
const maskConfig: Record<
  MaskButtonMask,
  { sizeClass: string; rest: string; hover: string }
> = {
  nature: {
    sizeClass: "[mask-size:2300%_100%] [-webkit-mask-size:2300%_100%]",
    rest: "animate-mask-nature-out",
    hover:
      "group-hover:animate-mask-nature-in group-focus-visible:animate-mask-nature-in",
  },
  urban: {
    sizeClass: "[mask-size:3000%_100%] [-webkit-mask-size:3000%_100%]",
    rest: "animate-mask-urban-out",
    hover:
      "group-hover:animate-mask-urban-in group-focus-visible:animate-mask-urban-in",
  },
  forest: {
    sizeClass: "[mask-size:7100%_100%] [-webkit-mask-size:7100%_100%]",
    rest: "animate-mask-forest-out",
    hover:
      "group-hover:animate-mask-forest-in group-focus-visible:animate-mask-forest-in",
  },
};

// Reduced motion: drop the flipbook, keep a static rest→hover position swap.
const REDUCED_MOTION_FILL =
  "motion-reduce:animate-none motion-reduce:group-hover:animate-none motion-reduce:group-focus-visible:animate-none motion-reduce:[mask-position:0_0] motion-reduce:[-webkit-mask-position:0_0] motion-reduce:group-hover:[mask-position:100%_0] motion-reduce:group-hover:[-webkit-mask-position:100%_0] motion-reduce:group-focus-visible:[mask-position:100%_0] motion-reduce:group-focus-visible:[-webkit-mask-position:100%_0]";

const fillVariant: Record<MaskButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

const sizeClasses: Record<MaskButtonSize, string> = {
  sm: "px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)] rounded-[var(--button-radius-sm)]",
  md: "px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)] rounded-[var(--button-radius-md)]",
  lg: "px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)] rounded-[var(--button-radius-lg)]",
};

const BUTTON_CLASS =
  "group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden border border-border bg-background font-medium text-foreground whitespace-nowrap select-none outline-none [-webkit-tap-highlight-color:transparent] [transition:transform_100ms_ease] focus-visible:[outline:2px_solid_var(--ring)] focus-visible:[outline-offset:4px] enabled:active:scale-[0.96] enabled:data-[pressed=true]:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none";

const FILL_BASE =
  "absolute inset-0 z-[1] flex items-center justify-center [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat] [mask-image:var(--mask-img)] [-webkit-mask-image:var(--mask-img)]";

const MaskButton = React.forwardRef<HTMLButtonElement, MaskButtonProps>(
  (
    {
      className,
      children,
      mask = "nature",
      variant = "primary",
      size = "md",
      onKeyDown,
      onKeyUp,
      ...props
    },
    ref,
  ) => {
    const [pressed, setPressed] = React.useState(false);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        setPressed(true);
      }
      onKeyDown?.(event);
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        setPressed(false);
      }
      onKeyUp?.(event);
    };

    const cfg = maskConfig[mask];

    return (
      <button
        ref={ref}
        type="button"
        data-mask={mask}
        data-variant={variant}
        data-size={size}
        data-pressed={pressed ? "true" : undefined}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className={`${BUTTON_CLASS} ${sizeClasses[size]} ${className ?? ""}`}
        {...props}
      >
        <span className="relative z-0">{children}</span>
        <span
          className={`${FILL_BASE} ${fillVariant[variant]} ${cfg.sizeClass} ${cfg.rest} ${cfg.hover} ${REDUCED_MOTION_FILL}`}
          style={
            {
              "--mask-img": `url("${MASK_ASSETS[mask]}")`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          {children}
        </span>
      </button>
    );
  },
);
MaskButton.displayName = "MaskButton";

export { MaskButton };
