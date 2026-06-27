"use client";

import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type ScrollStackProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The cards to stack. Provide 2–6 for the best effect. */
  children?: React.ReactNode;
  /**
   * When set (e.g. `"32rem"`), the stack becomes its own scroll viewport of
   * this height. When omitted, it stacks against the page/viewport scroll —
   * the right choice for a full landing-page section.
   */
  height?: string;
  /** Scale of the most-buried card at the back of the stack. */
  baseScale?: number;
  /** How far (px) each stacked card peeks below the one in front of it. */
  peek?: number;
  /** Blur buried cards as they recede. */
  blur?: boolean;
  /** Distance from the top of the scroller where cards pin, e.g. `"12vh"`. */
  pinTop?: string;
};

type CardProps = {
  index: number;
  total: number;
  progress: MotionValue<number>;
  baseScale: number;
  peek: number;
  blur: boolean;
  pinTop: string;
  trackClass: string;
  children: React.ReactNode;
};

// One card + its scroll track. Each card pins to the top of the scroller while
// the next card scrolls up over it; as it gets buried it eases down to a smaller
// scale, dims, and (optionally) blurs — so depth reads even on a flat stack.
const Card: React.FC<CardProps> = ({
  index,
  total,
  progress,
  baseScale,
  peek,
  blur,
  pinTop,
  trackClass,
  children,
}) => {
  const depth = total - 1 - index; // cards that end up stacked on top of this one
  const segmentEnd = total > 1 ? (index + 1) / total : 1;
  const finalScale = Math.max(baseScale, 1 - depth * (1 - baseScale) * 0.5);

  const buriedBrightness = Math.max(0.6, 1 - depth * 0.08);
  const buriedBlur = depth * (blur ? 2 : 0);

  const scale = useTransform(progress, [0, segmentEnd, 1], [1, 1, finalScale]);
  const filter = useTransform(
    progress,
    [0, segmentEnd, 1],
    [
      "brightness(1) blur(0px)",
      "brightness(1) blur(0px)",
      `brightness(${buriedBrightness}) blur(${buriedBlur}px)`,
    ],
  );

  return (
    <div
      className={`sticky flex items-center justify-center ${trackClass}`}
      style={{ top: pinTop }}
    >
      <motion.div
        className="w-full will-change-transform"
        style={{
          scale,
          filter,
          translateY: index * peek,
          transformOrigin: "center top",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ScrollStack = React.forwardRef<HTMLDivElement, ScrollStackProps>(
  (
    {
      children,
      height,
      baseScale = 0.86,
      peek = 16,
      blur = true,
      pinTop = "12vh",
      className,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );
    const reduce = useReducedMotion();
    const selfScroll = height != null;

    // Container-scroll when self-contained, otherwise track the page scroll.
    const { scrollYProgress } = useScroll(
      selfScroll
        ? { container: ref }
        : { target: ref, offset: ["start start", "end end"] },
    );

    const items = React.Children.toArray(children);
    const total = items.length;

    if (reduce) {
      return (
        <div
          ref={ref}
          data-slot="scroll-stack"
          className={`flex flex-col gap-6 ${selfScroll ? "overflow-y-auto" : ""} ${className ?? ""}`}
          style={height ? { height, ...style } : style}
          {...props}
        >
          {items.map((child, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: cards are positional in the stack
            <div key={i} className="flex items-center justify-center">
              {child}
            </div>
          ))}
        </div>
      );
    }

    const trackClass = selfScroll ? "h-full" : "h-screen";

    return (
      <div
        ref={ref}
        data-slot="scroll-stack"
        className={`relative ${selfScroll ? "overflow-y-auto" : ""} ${className ?? ""}`}
        style={height ? { height, ...style } : style}
        {...props}
      >
        {items.map((child, i) => (
          <Card
            // biome-ignore lint/suspicious/noArrayIndexKey: cards are positional in the stack
            key={i}
            index={i}
            total={total}
            progress={scrollYProgress}
            baseScale={baseScale}
            peek={peek}
            blur={blur}
            pinTop={pinTop}
            trackClass={trackClass}
          >
            {child}
          </Card>
        ))}
      </div>
    );
  },
);
ScrollStack.displayName = "ScrollStack";

export { ScrollStack };
