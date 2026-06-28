"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import * as React from "react";

export type HoldConfirmButtonVariant = "destructive" | "default";
export type HoldConfirmButtonSize = "sm" | "md" | "lg";
export type HoldConfirmButtonStatus = "idle" | "holding" | "confirmed";

export type HoldConfirmButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> & {
  /** Fires once the hold completes. */
  onConfirm?: () => void;
  variant?: HoldConfirmButtonVariant;
  size?: HoldConfirmButtonSize;
  /** ms the user must hold to confirm. Default `900`. */
  duration?: number;
  /** Label shown while holding. Default `"Hold to confirm"`. */
  holdingLabel?: React.ReactNode;
  /** Label shown after confirming. Default `"Confirmed"`. */
  confirmedLabel?: React.ReactNode;
};

const BUTTON_BASE =
  "relative inline-flex cursor-pointer select-none items-center justify-center gap-2 overflow-hidden rounded-[var(--button-radius)] font-medium [outline-offset:4px] [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [transition:scale_120ms_ease] active:scale-[0.99] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const variantClass: Record<HoldConfirmButtonVariant, string> = {
  destructive: "bg-destructive text-white shadow-sm",
  default: "bg-primary text-primary-foreground shadow-sm",
};

// The fill that sweeps in from the left as the hold progresses.
const fillClass: Record<HoldConfirmButtonVariant, string> = {
  destructive: "bg-black/25",
  default: "bg-black/20",
};

const sizeClass: Record<HoldConfirmButtonSize, string> = {
  sm: "[--button-radius:var(--button-radius-sm)] px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "[--button-radius:var(--button-radius-md)] px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "[--button-radius:var(--button-radius-lg)] px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
};

const HoldConfirmButton = React.forwardRef<
  HTMLButtonElement,
  HoldConfirmButtonProps
>(
  (
    {
      onConfirm,
      variant = "destructive",
      size = "md",
      duration = 900,
      holdingLabel = "Confirming…",
      confirmedLabel = "Confirmed",
      className,
      children = "Hold to confirm",
      disabled,
      onKeyDown,
      onKeyUp,
      ...props
    },
    forwardedRef,
  ) => {
    const [status, setStatus] = React.useState<HoldConfirmButtonStatus>("idle");
    const statusRef = React.useRef(status);
    statusRef.current = status;

    const progress = useMotionValue(0);
    const playback = React.useRef<ReturnType<typeof animate> | null>(null);
    const resetTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const mounted = React.useRef(true);
    React.useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
        playback.current?.stop();
        clearTimeout(resetTimer.current);
      };
    }, []);

    const complete = () => {
      if (!mounted.current) return;
      setStatus("confirmed");
      onConfirm?.();
      resetTimer.current = setTimeout(() => {
        if (!mounted.current) return;
        setStatus("idle");
        animate(progress, 0, { duration: 0.2 });
      }, 1100);
    };

    const start = () => {
      if (statusRef.current !== "idle" || disabled) return;
      setStatus("holding");
      playback.current = animate(progress, 1, {
        duration: duration / 1000,
        ease: "linear",
        onComplete: complete,
      });
    };

    const cancel = () => {
      if (statusRef.current !== "holding") return;
      playback.current?.stop();
      setStatus("idle");
      animate(progress, 0, {
        type: "spring",
        stiffness: 320,
        damping: 32,
        mass: 0.9,
      });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if ((event.key === " " || event.key === "Enter") && !event.repeat) {
        event.preventDefault();
        start();
      }
    };
    const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyUp?.(event);
      if (event.key === " " || event.key === "Enter") cancel();
    };

    const label =
      status === "confirmed"
        ? confirmedLabel
        : status === "holding"
          ? holdingLabel
          : children;

    return (
      <button
        ref={forwardedRef}
        type="button"
        data-status={status}
        aria-label={typeof children === "string" ? children : undefined}
        disabled={disabled}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className={`${BUTTON_BASE} ${variantClass[variant]} ${status === "confirmed" ? "saturate-150" : ""} ${sizeClass[size]} ${className ?? ""}`}
        {...props}
      >
        <motion.span
          aria-hidden="true"
          style={{ scaleX: progress }}
          className={`absolute inset-0 origin-left ${fillClass[variant]}`}
        />
        <span className="relative inline-flex items-center gap-2">
          {status === "confirmed" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-[1.15em]"
              aria-hidden="true"
            >
              <motion.path
                d="M5 12.5 10 17.5 19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            </svg>
          )}
          <span className="whitespace-nowrap">{label}</span>
        </span>
      </button>
    );
  },
);
HoldConfirmButton.displayName = "HoldConfirmButton";

export { HoldConfirmButton };
