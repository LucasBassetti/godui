"use client";

import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

type DockContextValue = {
  mouseX: MotionValue<number>;
  baseSize: number;
  magnification: number;
  distance: number;
};

const DockContext = React.createContext<DockContextValue | null>(null);

function useDock() {
  const ctx = React.useContext(DockContext);
  if (!ctx) {
    throw new Error("DockItem must be used within a <Dock>.");
  }
  return ctx;
}

export type DockProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Resting size of each item in pixels. */
  baseSize?: number;
  /** Maximum magnified size in pixels at the pointer. */
  magnification?: number;
  /** Pointer distance in pixels over which items are affected. */
  distance?: number;
};

export type DockItemProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Label shown above the item on hover. */
  label?: React.ReactNode;
};

const PANEL_BASE =
  "mx-auto flex h-16 items-end gap-3 rounded-2xl border border-border bg-card/70 px-3 pb-3 shadow-lg backdrop-blur-md";

const ITEM_BASE =
  "group relative flex aspect-square items-center justify-center rounded-xl bg-muted text-foreground shadow-sm";

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      baseSize = 44,
      magnification = 72,
      distance = 140,
      className,
      children,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

    return (
      <DockContext.Provider
        value={{ mouseX, baseSize, magnification, distance }}
      >
        <div
          ref={ref}
          data-slot="dock"
          role="toolbar"
          aria-label="Dock"
          className={`${PANEL_BASE} ${className ?? ""}`}
          onMouseMove={(e) => {
            mouseX.set(e.clientX);
            onMouseMove?.(e);
          }}
          onMouseLeave={(e) => {
            mouseX.set(Number.POSITIVE_INFINITY);
            onMouseLeave?.(e);
          }}
          {...props}
        >
          {children}
        </div>
      </DockContext.Provider>
    );
  },
);
Dock.displayName = "Dock";

const DockItem = React.forwardRef<HTMLDivElement, DockItemProps>(
  ({ label, className, children, ...props }, forwardedRef) => {
    const { mouseX, baseSize, magnification, distance } = useDock();
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );

    const distanceFromMouse = useTransform(mouseX, (val) => {
      const bounds = ref.current?.getBoundingClientRect();
      if (!bounds) return distance + 1;
      return val - bounds.x - bounds.width / 2;
    });

    const sizeTarget = useTransform(
      distanceFromMouse,
      [-distance, 0, distance],
      [baseSize, magnification, baseSize],
    );
    const size = useSpring(sizeTarget, {
      mass: 0.1,
      stiffness: 170,
      damping: 12,
    });

    return (
      <motion.div
        ref={ref}
        data-slot="dock-item"
        style={{ width: size, height: size }}
        className={`${ITEM_BASE} ${className ?? ""}`}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        <AnimatePresence>
          {label ? (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow group-hover:block"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
        {children}
      </motion.div>
    );
  },
);
DockItem.displayName = "DockItem";

export { Dock, DockItem };
