"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type SlideConfirmVariant = "default" | "destructive";
export type SlideConfirmSize = "sm" | "md" | "lg";
export type SlideConfirmStatus = "idle" | "confirmed";

export type SlideConfirmButtonProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onClick"
> & {
  /** Fires once the thumb is dragged past the threshold. */
  onConfirm?: () => void;
  variant?: SlideConfirmVariant;
  size?: SlideConfirmSize;
  /** Fraction of the track (0–1) the thumb must pass to confirm. Default `0.9`. */
  threshold?: number;
  /** Track label. Default `"Slide to confirm"`. */
  label?: React.ReactNode;
  /** Label shown after confirming. Default `"Confirmed"`. */
  confirmedLabel?: React.ReactNode;
  disabled?: boolean;
};

const TRACK_BASE =
  "relative isolate flex select-none items-center overflow-hidden rounded-full border [touch-action:none] [transition:opacity_200ms_ease]";

const trackVariant: Record<SlideConfirmVariant, string> = {
  default: "border-border bg-muted",
  destructive: "border-destructive/30 bg-destructive/10",
};

const fillVariant: Record<SlideConfirmVariant, string> = {
  default: "bg-primary/20",
  destructive: "bg-destructive/25",
};

const thumbVariant: Record<SlideConfirmVariant, string> = {
  default: "bg-primary text-primary-foreground",
  destructive: "bg-destructive text-white",
};

const sizeMap: Record<
  SlideConfirmSize,
  { track: string; thumb: number; pad: number; text: string }
> = {
  sm: { track: "h-10 w-56", thumb: 32, pad: 4, text: "text-sm" },
  md: { track: "h-12 w-72", thumb: 40, pad: 4, text: "text-sm" },
  lg: { track: "h-14 w-80", thumb: 48, pad: 5, text: "text-base" },
};

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="size-5"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const SlideConfirmButton = React.forwardRef<
  HTMLDivElement,
  SlideConfirmButtonProps
>(
  (
    {
      onConfirm,
      variant = "default",
      size = "md",
      threshold = 0.9,
      label = "Slide to confirm",
      confirmedLabel = "Confirmed",
      disabled = false,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const reduce = useReducedMotion() ?? false;
    const dims = sizeMap[size];
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [maxX, setMaxX] = React.useState(0);
    const [status, setStatus] = React.useState<SlideConfirmStatus>("idle");
    const statusRef = React.useRef(status);
    statusRef.current = status;

    const x = useMotionValue(0);
    const labelOpacity = useTransform(x, [0, Math.max(1, maxX * 0.6)], [1, 0]);
    // Fill is a rounded pill the same height as the thumb, trailing it from the
    // left. At rest it sits exactly under the thumb (width === thumb), so the
    // thumb keeps a clean circular silhouette with no block bleeding around it.
    const fillWidth = useTransform(x, (v) => v + dims.thumb);

    React.useLayoutEffect(() => {
      const el = trackRef.current;
      if (!el) return;
      const measure = () => {
        const usable = el.clientWidth - dims.thumb - dims.pad * 2;
        setMaxX(Math.max(0, usable));
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, [dims.thumb, dims.pad]);

    const confirm = () => {
      setStatus("confirmed");
      animate(x, maxX, { type: "spring", stiffness: 500, damping: 40 });
      onConfirm?.();
    };

    const settleBack = () => {
      animate(
        x,
        0,
        reduce
          ? { duration: 0.2 }
          : { type: "spring", stiffness: 400, damping: 35 },
      );
    };

    const handleDragEnd = () => {
      if (statusRef.current === "confirmed") return;
      if (maxX > 0 && x.get() >= maxX * threshold) confirm();
      else settleBack();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || statusRef.current === "confirmed") return;
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
        confirm();
      }
    };

    const confirmed = status === "confirmed";

    return (
      <div
        ref={forwardedRef}
        data-status={status}
        className={`${TRACK_BASE} ${trackVariant[variant]} ${dims.track} ${dims.text} ${disabled ? "pointer-events-none opacity-50" : ""} ${className ?? ""}`}
        {...props}
      >
        <div ref={trackRef} className="absolute inset-0" aria-hidden="true" />

        {/* Fill trailing the thumb — a rounded pill matching the thumb height. */}
        <motion.div
          aria-hidden="true"
          className={`absolute rounded-full ${fillVariant[variant]}`}
          style={{
            top: dims.pad,
            bottom: dims.pad,
            left: dims.pad,
            width: fillWidth,
          }}
        />

        {/* Centered label. */}
        <motion.span
          style={{ opacity: confirmed ? 0 : labelOpacity }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-medium text-muted-foreground"
        >
          {label}
        </motion.span>
        {confirmed && (
          <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-medium text-foreground">
            {confirmedLabel}
          </span>
        )}

        {/* Draggable thumb. */}
        <motion.button
          type="button"
          aria-label={typeof label === "string" ? label : "Slide to confirm"}
          disabled={disabled}
          drag={confirmed || disabled ? false : "x"}
          dragConstraints={{ left: 0, right: maxX }}
          dragElastic={0.04}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          onKeyDown={handleKeyDown}
          style={{ x, width: dims.thumb, height: dims.thumb, margin: dims.pad }}
          className={`relative z-20 inline-flex shrink-0 cursor-grab items-center justify-center rounded-full shadow-sm active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${thumbVariant[variant]}`}
        >
          {confirmed ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
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
          ) : (
            <ArrowIcon />
          )}
        </motion.button>
      </div>
    );
  },
);
SlideConfirmButton.displayName = "SlideConfirmButton";

export { SlideConfirmButton };
