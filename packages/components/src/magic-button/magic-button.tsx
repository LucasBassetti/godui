"use client";

import * as React from "react";

export type MagicButtonVariant = "default" | "secondary";
export type MagicButtonSize = "sm" | "md" | "lg";

export type MagicButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: MagicButtonVariant;
  size?: MagicButtonSize;
  /** Animate the 3D edge and shadow with a flowing rainbow gradient */
  rainbow?: boolean;
};

// 3D push button: a static shadow + edge sit behind a front face that lifts on
// hover and dips on press. `group-*` variants drive the layered motion from the
// button's interaction state; variant/rainbow colors are resolved per-render.
const BUTTON_CLASS =
  "group relative cursor-pointer select-none border-none bg-transparent p-0 font-medium [outline-offset:4px] [-webkit-tap-highlight-color:transparent] [transition:filter_600ms] hover:brightness-110 hover:[transition:filter_250ms] focus:outline-none focus-visible:brightness-110 focus-visible:[transition:filter_250ms] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:filter-none";

const SHADOW_BASE =
  "absolute inset-0 rounded-xl translate-y-[2px] [will-change:translate] [transition:translate_600ms_cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-[4px] group-hover:[transition:translate_250ms_cubic-bezier(0.3,0.7,0.4,1.5)] group-focus-visible:translate-y-[4px] group-focus-visible:[transition:translate_250ms_cubic-bezier(0.3,0.7,0.4,1.5)] group-active:translate-y-[1px] group-active:[transition:translate_34ms] group-data-[pressed=true]:translate-y-[1px] group-data-[pressed=true]:[transition:translate_34ms] group-disabled:hidden";

const EDGE_BASE = "absolute inset-0 rounded-xl group-disabled:hidden";

const FRONT_BASE =
  "relative block rounded-xl [will-change:translate] -translate-y-[4px] [transition:translate_600ms_cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-[6px] group-hover:[transition:translate_250ms_cubic-bezier(0.3,0.7,0.4,1.5)] group-focus-visible:-translate-y-[6px] group-focus-visible:[transition:translate_250ms_cubic-bezier(0.3,0.7,0.4,1.5)] group-active:-translate-y-[2px] group-active:[transition:translate_34ms] group-data-[pressed=true]:-translate-y-[2px] group-data-[pressed=true]:[transition:translate_34ms] group-disabled:translate-y-0 group-disabled:[transition:none]";

const RAINBOW_FILL =
  "[background-image:linear-gradient(90deg,var(--rainbow-1),var(--rainbow-5),var(--rainbow-3),var(--rainbow-4),var(--rainbow-2))] [background-size:200%_100%] animate-magic-rainbow motion-reduce:animate-none";

const SOLID_SHADOW = "bg-[hsl(0deg_0%_0%_/_0.25)] blur-[4px]";
const RAINBOW_SHADOW = `${RAINBOW_FILL} blur-[12px] opacity-70`;

const edgeBg: Record<MagicButtonVariant, string> = {
  default:
    "[background:linear-gradient(to_left,color-mix(in_srgb,var(--primary)_50%,black)_0%,color-mix(in_srgb,var(--primary)_75%,black)_8%,color-mix(in_srgb,var(--primary)_75%,black)_92%,color-mix(in_srgb,var(--primary)_50%,black)_100%)]",
  secondary:
    "[background:linear-gradient(to_left,color-mix(in_srgb,var(--secondary)_50%,black)_0%,color-mix(in_srgb,var(--secondary)_75%,black)_8%,color-mix(in_srgb,var(--secondary)_75%,black)_92%,color-mix(in_srgb,var(--secondary)_50%,black)_100%)]",
};

const frontVariant: Record<MagicButtonVariant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

const frontSize: Record<MagicButtonSize, string> = {
  sm: "px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
};

const MagicButton = React.forwardRef<HTMLButtonElement, MagicButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      rainbow = true,
      children,
      onKeyDown,
      onKeyUp,
      ...props
    },
    ref,
  ) => {
    const [pressed, setPressed] = React.useState(false);

    // The rainbow edge/shadow run an infinite background-position keyframe
    // (main-thread paint). Pause it when the button is off screen so it costs
    // nothing while idle — resumes seamlessly on scroll-in.
    const rootRef = React.useRef<HTMLButtonElement>(null);
    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
            node;
      },
      [ref],
    );
    React.useEffect(() => {
      const root = rootRef.current;
      if (!rainbow || !root || typeof IntersectionObserver === "undefined")
        return;
      const io = new IntersectionObserver(
        ([entry]) => {
          for (const layer of root.querySelectorAll<HTMLElement>(
            ".animate-magic-rainbow",
          ))
            layer.style.animationPlayState = entry.isIntersecting
              ? ""
              : "paused";
        },
        { rootMargin: "128px" },
      );
      io.observe(root);
      return () => io.disconnect();
    }, [rainbow]);

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

    return (
      <button
        ref={setRefs}
        data-variant={variant}
        data-rainbow={rainbow ? "true" : undefined}
        data-pressed={pressed ? "true" : undefined}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className={`${BUTTON_CLASS} ${className ?? ""}`}
        {...props}
      >
        <span
          className={`${SHADOW_BASE} ${rainbow ? RAINBOW_SHADOW : SOLID_SHADOW}`}
          aria-hidden="true"
        />
        <span
          className={`${EDGE_BASE} ${rainbow ? RAINBOW_FILL : edgeBg[variant]}`}
          aria-hidden="true"
        />
        <span
          data-size={size}
          className={`${FRONT_BASE} ${frontVariant[variant]} ${frontSize[size]}`}
        >
          {children}
        </span>
      </button>
    );
  },
);
MagicButton.displayName = "MagicButton";

export { MagicButton };
