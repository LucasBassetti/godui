"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type CopyButtonVariant = "default" | "secondary" | "outline" | "ghost";
export type CopyButtonSize = "sm" | "md" | "lg";
export type CopyButtonStatus = "idle" | "copied" | "error";

export type CopyButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onCopy" | "value"
> & {
  /** The text written to the clipboard. */
  value: string;
  variant?: CopyButtonVariant;
  size?: CopyButtonSize;
  /** ms before reverting from the copied state to idle. Default `1800`. */
  timeout?: number;
  /** Label in the idle state. Omit for an icon-only button. */
  children?: React.ReactNode;
  /** Label in the copied state. Default `"Copied"`. */
  copiedLabel?: React.ReactNode;
  /** Fires after a successful copy with the value written. */
  onCopy?: (value: string) => void;
};

const BUTTON_BASE =
  "relative inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-[var(--button-radius)] font-medium [outline-offset:4px] [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] [transition:background_200ms_ease,box-shadow_200ms_ease,color_200ms_ease,scale_120ms_ease] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const variantClass: Record<CopyButtonVariant, string> = {
  default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  outline:
    "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
  ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
};

const sizeClass: Record<CopyButtonSize, string> = {
  sm: "[--button-radius:var(--button-radius-sm)] px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "[--button-radius:var(--button-radius-md)] px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "[--button-radius:var(--button-radius-lg)] px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
};

async function writeClipboard(value: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  // Fallback for non-secure contexts / older browsers.
  const el = document.createElement("textarea");
  el.value = value;
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  try {
    const ok = document.execCommand("copy");
    if (!ok) throw new Error("copy command rejected");
  } finally {
    document.body.removeChild(el);
  }
}

const ClipboardIcon = () => (
  <svg
    className="size-[1.15em]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" />
  </svg>
);

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      variant = "outline",
      size = "md",
      timeout = 1800,
      copiedLabel = "Copied",
      onCopy,
      onClick,
      className,
      children,
      "aria-label": ariaLabel,
      ...props
    },
    forwardedRef,
  ) => {
    const reduce = useReducedMotion() ?? false;
    const [status, setStatus] = React.useState<CopyButtonStatus>("idle");

    const mounted = React.useRef(true);
    const revertTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    React.useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
        clearTimeout(revertTimer.current);
      };
    }, []);

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      try {
        await writeClipboard(value);
        if (!mounted.current) return;
        setStatus("copied");
        onCopy?.(value);
      } catch {
        if (mounted.current) setStatus("error");
      }
      clearTimeout(revertTimer.current);
      revertTimer.current = setTimeout(() => {
        if (mounted.current) setStatus("idle");
      }, timeout);
    };

    const isDone = status === "copied";

    return (
      <button
        ref={forwardedRef}
        type="button"
        data-status={status}
        aria-label={ariaLabel ?? (children ? undefined : "Copy")}
        onClick={handleClick}
        className={`${BUTTON_BASE} ${variantClass[variant]} ${isDone ? "!text-emerald-600 dark:!text-emerald-400" : ""} ${sizeClass[size]} ${className ?? ""}`}
        {...props}
      >
        <span className="relative inline-flex size-[1.15em] items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isDone ? (
              <motion.span
                key="check"
                className="absolute inset-0"
                initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={reduce ? undefined : { scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-full"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M5 12.5 10 17.5 19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </svg>
              </motion.span>
            ) : (
              <motion.span
                key="clipboard"
                className="absolute inset-0"
                initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={reduce ? undefined : { scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <ClipboardIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        {children != null && (
          <motion.span layout={!reduce} className="overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={isDone ? "copied" : "idle"}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="inline-block whitespace-nowrap"
              >
                {isDone ? copiedLabel : children}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        )}
      </button>
    );
  },
);
CopyButton.displayName = "CopyButton";

export { CopyButton };
