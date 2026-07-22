"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type GooeyFabSize = "sm" | "md" | "lg";
export type GooeyFabDirection = "up" | "down" | "left" | "right";

export type GooeyFabAction = {
  /** Icon node rendered inside the satellite button. */
  icon: React.ReactNode;
  /** Accessible label (also a tooltip target). */
  label: string;
  onClick?: () => void;
};

export type GooeyFabProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  actions: GooeyFabAction[];
  size?: GooeyFabSize;
  /** Direction the satellites extrude. Default `"up"`. */
  direction?: GooeyFabDirection;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. Default `false`. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Icon for the trigger. Defaults to a plus that rotates into a cross. */
  triggerIcon?: React.ReactNode;
  /** Accessible label for the trigger. Default `"Open actions"`. */
  triggerLabel?: string;
};

const triggerSize: Record<GooeyFabSize, number> = { sm: 44, md: 56, lg: 64 };
const satelliteSize: Record<GooeyFabSize, number> = { sm: 36, md: 44, lg: 50 };

const offsetFor = (
  direction: GooeyFabDirection,
  distance: number,
): { x: number; y: number } => {
  switch (direction) {
    case "down":
      return { x: 0, y: distance };
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    default:
      return { x: 0, y: -distance };
  }
};

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    className="size-[45%]"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const GooeyFab = React.forwardRef<HTMLDivElement, GooeyFabProps>(
  (
    {
      actions,
      size = "md",
      direction = "up",
      open: controlled,
      defaultOpen = false,
      onOpenChange,
      triggerIcon,
      triggerLabel = "Open actions",
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const reduce = useReducedMotion() ?? false;
    const filterId = React.useId().replace(/:/g, "");
    const isControlled = controlled !== undefined;
    const [internal, setInternal] = React.useState(defaultOpen);
    const open = isControlled ? controlled : internal;

    const setOpen = (next: boolean) => {
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    };

    const trigger = triggerSize[size];
    const sat = satelliteSize[size];
    const gap = 14;
    const step = sat + gap;

    return (
      <div
        ref={forwardedRef}
        data-open={open ? "true" : undefined}
        className={`relative inline-grid place-items-center ${className ?? ""}`}
        style={{ width: trigger, height: trigger }}
        {...props}
      >
        {/* Blob layer — solid circles fused by the goo filter. Rendered as
            native SVG (circles inside the filtered <g>) rather than filtered
            HTML: Safari promotes a transform-animated HTML child to its own
            compositing layer, which escapes an HTML `filter: url()` and breaks
            the merge. SVG shapes stay inside the filter, so it fuses on every
            engine. Origin is the container center; satellites overflow it. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0"
          style={{ overflow: "visible" }}
          width={trigger}
          height={trigger}
          viewBox={`${-trigger / 2} ${-trigger / 2} ${trigger} ${trigger}`}
        >
          <defs>
            <filter
              id={filterId}
              x="-400%"
              y="-400%"
              width="900%"
              height="900%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="6"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              />
            </filter>
          </defs>
          <g
            className="fill-primary"
            filter={reduce ? undefined : `url(#${filterId})`}
          >
            <circle cx={0} cy={0} r={trigger / 2} />
            {actions.map((action, i) => {
              const target = offsetFor(direction, step * (i + 1));
              return (
                <motion.circle
                  key={action.label}
                  cx={0}
                  cy={0}
                  r={sat / 2}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                  initial={false}
                  animate={
                    open
                      ? { x: target.x, y: target.y, scale: 1, opacity: 1 }
                      : { x: 0, y: 0, scale: 0.2, opacity: 0 }
                  }
                  transition={
                    reduce
                      ? { duration: 0.15 }
                      : {
                          type: "spring",
                          stiffness: 170,
                          damping: 12,
                          mass: 0.1,
                          delay: open ? i * 0.04 : (actions.length - i) * 0.02,
                        }
                  }
                />
              );
            })}
          </g>
        </svg>

        {/* Control layer: sharp, clickable icon buttons over the blobs. */}
        <div className="absolute inset-0 grid place-items-center">
          {actions.map((action, i) => {
            const target = offsetFor(direction, step * (i + 1));
            return (
              <motion.button
                key={action.label}
                type="button"
                aria-label={action.label}
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  action.onClick?.();
                  setOpen(false);
                }}
                className="absolute inline-flex items-center justify-center rounded-full text-primary-foreground [outline-offset:2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{
                  width: sat,
                  height: sat,
                  pointerEvents: open ? "auto" : "none",
                }}
                initial={false}
                animate={
                  open
                    ? { x: target.x, y: target.y, opacity: 1, scale: 1 }
                    : { x: 0, y: 0, opacity: 0, scale: 0.4 }
                }
                transition={
                  reduce
                    ? { duration: 0.15 }
                    : {
                        type: "spring",
                        stiffness: 170,
                        damping: 12,
                        mass: 0.1,
                        delay: open ? i * 0.04 + 0.03 : 0,
                      }
                }
              >
                {action.icon}
              </motion.button>
            );
          })}
        </div>

        {/* Trigger. */}
        <button
          type="button"
          aria-expanded={open}
          aria-label={triggerLabel}
          onClick={() => setOpen(!open)}
          className="relative z-10 inline-flex items-center justify-center rounded-full text-primary-foreground shadow-lg [outline-offset:2px] [transition:scale_120ms_ease] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          style={{ width: trigger, height: trigger }}
        >
          <motion.span
            className="flex size-full items-center justify-center"
            animate={{ rotate: open ? 135 : 0 }}
            transition={
              reduce
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 170, damping: 12, mass: 0.1 }
            }
          >
            {triggerIcon ?? <PlusIcon />}
          </motion.span>
        </button>
      </div>
    );
  },
);
GooeyFab.displayName = "GooeyFab";

export { GooeyFab };
