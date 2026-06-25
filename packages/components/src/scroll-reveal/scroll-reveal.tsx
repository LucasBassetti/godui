"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import * as React from "react";

export type ScrollRevealDirection = "up" | "down" | "left" | "right";

export type ScrollRevealProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Direction the content travels in from. */
  direction?: ScrollRevealDirection;
  /** Travel distance in pixels before settling. */
  distance?: number;
  /** Blur the content in as it reveals. */
  blur?: boolean;
  /** Delay in seconds before the reveal starts once in view. */
  delay?: number;
  /** Reveal only the first time it enters the viewport. */
  once?: boolean;
  /** Skew the content by scroll velocity for a fluid, reactive feel. */
  velocitySkew?: boolean;
};

const OFFSET: Record<ScrollRevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  (
    {
      direction = "up",
      distance = 40,
      blur = true,
      delay = 0,
      once = true,
      velocitySkew = false,
      className,
      style,
      children,
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
    const isInView = useInView(ref, { once, amount: 0.3 });

    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50,
      stiffness: 400,
    });
    const skew = useTransform(smoothVelocity, [-2000, 0, 2000], [6, 0, -6], {
      clamp: true,
    });

    const offset = OFFSET[direction];
    const hidden = reduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: offset.x * distance,
          y: offset.y * distance,
          filter: blur ? "blur(10px)" : "blur(0px)",
        };
    const visible = reduceMotion
      ? { opacity: 1 }
      : { opacity: 1, x: 0, y: 0, filter: "blur(0px)" };

    return (
      <motion.div
        ref={ref}
        data-slot="scroll-reveal"
        className={className}
        style={
          velocitySkew && !reduceMotion ? { skewY: skew, ...style } : style
        }
        initial={hidden}
        animate={isInView ? visible : hidden}
        transition={{
          type: "spring",
          damping: 24,
          stiffness: 180,
          delay,
        }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  },
);
ScrollReveal.displayName = "ScrollReveal";

export { ScrollReveal };
