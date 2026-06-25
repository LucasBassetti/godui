"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type TiltCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Maximum tilt in degrees toward the pointer. */
  maxTilt?: number;
  /** Hover scale applied to the whole card. */
  scale?: number;
  /** Float the content layer toward the viewer (px) for parallax depth. */
  depth?: number;
  /** Render a specular glare that follows the pointer. */
  glare?: boolean;
};

const SPRING = { stiffness: 200, damping: 18, mass: 0.4 } as const;

const ROOT_BASE =
  "relative rounded-2xl border border-border bg-card text-card-foreground shadow-lg [transform-style:preserve-3d] [will-change:transform]";

const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  (
    {
      maxTilt = 12,
      scale = 1.03,
      depth = 40,
      glare = true,
      className,
      style,
      children,
      onPointerMove,
      onPointerLeave,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );
    const reduceMotion = useReducedMotion();

    // Pointer position normalized to -0.5..0.5 over the card.
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, SPRING);
    const sy = useSpring(py, SPRING);

    const rotateX = useTransform(sy, [-0.5, 0.5], [maxTilt, -maxTilt]);
    const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTilt, maxTilt]);
    const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!reduceMotion) {
        const el = ref.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          px.set((e.clientX - rect.left) / rect.width - 0.5);
          py.set((e.clientY - rect.top) / rect.height - 0.5);
        }
      }
      onPointerMove?.(e);
    };

    const handleLeave = (e: React.PointerEvent<HTMLDivElement>) => {
      px.set(0);
      py.set(0);
      onPointerLeave?.(e);
    };

    if (reduceMotion) {
      return (
        <div
          ref={ref}
          data-slot="tilt-card"
          className={`${ROOT_BASE} ${className ?? ""}`}
          style={style}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      // Outer wrapper owns the perspective so the tilt reads as real depth.
      <div className="[perspective:1000px]">
        <motion.div
          ref={ref}
          data-slot="tilt-card"
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          whileHover={{ scale }}
          style={{ rotateX, rotateY, ...style }}
          className={`${ROOT_BASE} ${className ?? ""}`}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          <div
            style={{
              transform: `translateZ(${depth}px)`,
              transformStyle: "preserve-3d",
            }}
          >
            {children}
          </div>
          {glare ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl [background:radial-gradient(circle_at_var(--gx)_var(--gy),color-mix(in_oklch,white_50%,transparent),transparent_45%)]"
              style={
                {
                  "--gx": glareX,
                  "--gy": glareY,
                  opacity: 0.35,
                } as React.CSSProperties
              }
            />
          ) : null}
        </motion.div>
      </div>
    );
  },
);
TiltCard.displayName = "TiltCard";

export { TiltCard };
