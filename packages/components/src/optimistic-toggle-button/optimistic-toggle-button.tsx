"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type OptimisticToggleSize = "sm" | "md" | "lg";

export type OptimisticToggleButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onToggle" | "onClick"
> & {
  /** Controlled active state. */
  pressed?: boolean;
  /** Uncontrolled initial state. Default `false`. */
  defaultPressed?: boolean;
  /**
   * Commit handler. The UI flips immediately (optimistic); if the returned
   * promise rejects, the flip is rolled back.
   */
  onToggle?: (next: boolean) => void | Promise<void>;
  size?: OptimisticToggleSize;
  /** Label in the inactive state. Default `"Follow"`. */
  labelOff?: React.ReactNode;
  /** Label in the active state. Default `"Following"`. */
  labelOn?: React.ReactNode;
  /** Label shown when hovering the active state (destructive intent), e.g. `"Unfollow"`. */
  labelActiveHover?: React.ReactNode;
};

const BUTTON_BASE =
  "relative inline-flex cursor-pointer select-none items-center justify-center gap-1.5 overflow-hidden rounded-[var(--button-radius)] border font-medium [outline-offset:4px] [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] [transition:background_200ms_ease,border-color_200ms_ease,color_200ms_ease,scale_120ms_ease] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const offClass =
  "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90";
const onClass = "border-border bg-background text-foreground hover:bg-accent";
const onHoverDestructive =
  "!border-destructive/40 !bg-destructive/10 !text-destructive";

const sizeClass: Record<OptimisticToggleSize, string> = {
  sm: "[--button-radius:var(--button-radius-sm)] px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "[--button-radius:var(--button-radius-md)] px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "[--button-radius:var(--button-radius-lg)] px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
};

const Check = ({ reduce }: { reduce: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="size-[1.05em]"
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
      transition={{ duration: 0.32, ease: "easeOut", delay: 0.04 }}
    />
  </svg>
);

// A lively spring gives the flip a confident, tactile pop.
const POP_SPRING = { type: "spring", stiffness: 520, damping: 30 } as const;
const LABEL_SPRING = { type: "spring", stiffness: 600, damping: 38 } as const;

const OptimisticToggleButton = React.forwardRef<
  HTMLButtonElement,
  OptimisticToggleButtonProps
>(
  (
    {
      pressed: controlled,
      defaultPressed = false,
      onToggle,
      size = "md",
      labelOff = "Follow",
      labelOn = "Following",
      labelActiveHover = "Unfollow",
      className,
      disabled,
      ...props
    },
    forwardedRef,
  ) => {
    const reduce = useReducedMotion() ?? false;
    const isControlled = controlled !== undefined;
    const [internal, setInternal] = React.useState(defaultPressed);
    const pressed = isControlled ? controlled : internal;
    const [hover, setHover] = React.useState(false);
    const [pending, setPending] = React.useState(false);
    const mounted = React.useRef(true);
    React.useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    }, []);

    const handleClick = async () => {
      if (pending) return;
      const next = !pressed;
      if (!isControlled) setInternal(next); // optimistic flip
      setPending(true);
      try {
        await onToggle?.(next);
      } catch {
        if (mounted.current && !isControlled) setInternal(!next); // rollback
      } finally {
        if (mounted.current) setPending(false);
      }
    };

    const showDestructive = pressed && hover && labelActiveHover != null;
    const label = !pressed
      ? labelOff
      : showDestructive
        ? labelActiveHover
        : labelOn;
    const labelKey = !pressed ? "off" : showDestructive ? "hover" : "on";

    return (
      <motion.button
        ref={forwardedRef}
        type="button"
        aria-pressed={pressed}
        data-pending={pending ? "true" : undefined}
        disabled={disabled || pending}
        onClick={handleClick}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        layout={!reduce}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        transition={POP_SPRING}
        className={`${BUTTON_BASE} ${pressed ? onClass : offClass} ${showDestructive ? onHoverDestructive : ""} ${sizeClass[size]} ${className ?? ""}`}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        <motion.span layout={!reduce} className="inline-flex items-center">
          <AnimatePresence initial={false} mode="popLayout">
            {pressed && !showDestructive && (
              <motion.span
                key="check"
                layout={!reduce}
                initial={
                  reduce
                    ? false
                    : { width: 0, opacity: 0, scale: 0.3, rotate: -45 }
                }
                animate={{ width: "auto", opacity: 1, scale: 1, rotate: 0 }}
                exit={
                  reduce
                    ? undefined
                    : { width: 0, opacity: 0, scale: 0.3, rotate: 45 }
                }
                transition={POP_SPRING}
                className="mr-1 inline-flex overflow-hidden"
              >
                <Check reduce={reduce} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>

        <motion.span layout={!reduce} className="overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={labelKey}
              initial={reduce ? false : { y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: "-100%", opacity: 0 }}
              transition={LABEL_SPRING}
              className="inline-block whitespace-nowrap"
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </motion.button>
    );
  },
);
OptimisticToggleButton.displayName = "OptimisticToggleButton";

export { OptimisticToggleButton };
