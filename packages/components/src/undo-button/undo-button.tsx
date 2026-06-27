"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import * as React from "react";

export type UndoButtonSize = "sm" | "md" | "lg";
export type UndoButtonStatus = "counting" | "committed" | "undone";

export type UndoButtonProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  /** Message describing the deferred action, e.g. `"Message archived"`. */
  label?: React.ReactNode;
  /** Text on the undo control. Default `"Undo"`. */
  undoLabel?: React.ReactNode;
  /** ms before the action auto-commits. Default `5000`. */
  duration?: number;
  /** Pause the countdown while hovered. Default `true`. */
  pauseOnHover?: boolean;
  size?: UndoButtonSize;
  /** Fires when the window elapses without an undo. */
  onCommit?: () => void;
  /** Fires when the user clicks undo. */
  onUndo?: () => void;
};

const ROOT_BASE =
  "inline-flex items-center gap-3 rounded-[var(--button-radius)] border border-border bg-popover text-popover-foreground shadow-md [transition:opacity_200ms_ease]";

const sizeClass: Record<UndoButtonSize, string> = {
  sm: "[--button-radius:var(--button-radius-sm)] px-3 py-1.5 text-[length:var(--button-text-sm)]",
  md: "[--button-radius:var(--button-radius-md)] px-4 py-2 text-[length:var(--button-text-md)]",
  lg: "[--button-radius:var(--button-radius-lg)] px-5 py-2.5 text-[length:var(--button-text-lg)]",
};

const RADIUS = 9;
const CIRC = 2 * Math.PI * RADIUS;

const UndoButton = React.forwardRef<HTMLDivElement, UndoButtonProps>(
  (
    {
      label = "Action queued",
      undoLabel = "Undo",
      duration = 5000,
      pauseOnHover = true,
      size = "md",
      onCommit,
      onUndo,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const reduce = useReducedMotion() ?? false;
    const [status, setStatus] = React.useState<UndoButtonStatus>("counting");
    const statusRef = React.useRef(status);
    statusRef.current = status;

    const t = useMotionValue(1);
    const playback = React.useRef<ReturnType<typeof animate> | null>(null);
    const mounted = React.useRef(true);

    // biome-ignore lint/correctness/useExhaustiveDependencies: the countdown is owned for this instance's lifetime and must run once
    React.useEffect(() => {
      mounted.current = true;
      const ctrl = animate(t, 0, {
        duration: duration / 1000,
        ease: "linear",
        onComplete: () => {
          if (!mounted.current || statusRef.current !== "counting") return;
          setStatus("committed");
          onCommit?.();
        },
      });
      playback.current = ctrl;
      return () => {
        mounted.current = false;
        ctrl.stop();
      };
    }, []);

    const handleUndo = () => {
      if (statusRef.current !== "counting") return;
      playback.current?.stop();
      setStatus("undone");
      onUndo?.();
    };

    const pause = () => {
      if (pauseOnHover && statusRef.current === "counting") {
        playback.current?.pause();
      }
    };
    const resume = () => {
      if (pauseOnHover && statusRef.current === "counting") {
        playback.current?.play();
      }
    };

    if (status !== "counting") {
      return (
        <div
          ref={forwardedRef}
          role="status"
          data-status={status}
          className={`${ROOT_BASE} ${sizeClass[size]} opacity-0 ${className ?? ""}`}
          {...props}
        >
          <span>{status === "undone" ? "Undone" : label}</span>
        </div>
      );
    }

    return (
      <div
        ref={forwardedRef}
        role="status"
        data-status={status}
        onPointerEnter={pause}
        onPointerLeave={resume}
        className={`${ROOT_BASE} ${sizeClass[size]} ${className ?? ""}`}
        {...props}
      >
        <span className="whitespace-nowrap">{label}</span>
        <button
          type="button"
          onClick={handleUndo}
          className="relative inline-flex cursor-pointer items-center gap-2 rounded-full pl-2 pr-1 font-medium text-primary [outline-offset:2px] [transition:color_150ms_ease] hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {undoLabel}
          <span className="relative inline-flex size-6 items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="size-6 -rotate-90"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r={RADIUS}
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-20"
              />
              <motion.circle
                cx="12"
                cy="12"
                r={RADIUS}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                style={reduce ? { pathLength: 1 } : { pathLength: t }}
              />
            </svg>
          </span>
        </button>
      </div>
    );
  },
);
UndoButton.displayName = "UndoButton";

export { UndoButton };
