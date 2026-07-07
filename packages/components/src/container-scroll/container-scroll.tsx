"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type ContainerScrollProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Headline block rendered above the device, rising as you scroll. */
  header?: React.ReactNode;
  /** The "screen" content — an image, video, or live UI. */
  children: React.ReactNode;
};

// SPRING.smooth — surfaces / shared-layout feel.
const SPRING = { stiffness: 320, damping: 32, mass: 0.9 } as const;

const ContainerScroll = React.forwardRef<HTMLDivElement, ContainerScrollProps>(
  ({ header, children, className, ...props }, ref) => {
    const reduce = useReducedMotion();
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    const { scrollYProgress } = useScroll({ target: containerRef });

    const rotateX = useSpring(
      useTransform(scrollYProgress, [0, 1], [20, 0]),
      SPRING,
    );
    const scale = useSpring(
      useTransform(scrollYProgress, [0, 1], [1.05, 1]),
      SPRING,
    );
    const translateY = useSpring(
      useTransform(scrollYProgress, [0, 1], [0, -100]),
      SPRING,
    );

    const frame = (
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-border bg-card p-2 shadow-2xl md:p-3">
        <div className="aspect-[16/10] size-full overflow-hidden rounded-xl bg-muted [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover">
          {children}
        </div>
      </div>
    );

    // Reduced motion: a calm, upright device with no scroll-driven transforms.
    if (reduce) {
      return (
        <div
          ref={containerRef}
          data-slot="container-scroll"
          className={`flex flex-col items-center px-4 py-16 ${className ?? ""}`}
          {...props}
        >
          {header ? <div className="mb-10 text-center">{header}</div> : null}
          {frame}
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        data-slot="container-scroll"
        className={`relative flex h-[60rem] items-center justify-center p-4 md:h-[80rem] md:p-20 ${className ?? ""}`}
        {...props}
      >
        <div className="relative w-full [perspective:1000px]">
          {header ? (
            <motion.div
              style={{ translateY }}
              className="mx-auto mb-10 max-w-3xl text-center"
            >
              {header}
            </motion.div>
          ) : null}
          <motion.div
            style={{ rotateX, scale }}
            className="[transform-style:preserve-3d]"
          >
            {frame}
          </motion.div>
        </div>
      </div>
    );
  },
);
ContainerScroll.displayName = "ContainerScroll";

export { ContainerScroll };
