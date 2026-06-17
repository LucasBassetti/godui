"use client";

import {
  AnimatePresence,
  type MotionProps,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import * as React from "react";
import {
  getSegmentClassName,
  resolveTextAnimateVariants,
  STAGGER_BY_SPLIT,
  splitTextAnimate,
  type TextAnimateBy,
  type TextAnimatePreset,
} from "./text-animate-utils";
import { getTextContent } from "./text-utils";

export type {
  TextAnimateBy,
  TextAnimatePreset,
} from "./text-animate-utils";

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const;

export type TextAnimateElement = keyof typeof motionElements;

export type TextAnimateProps = Omit<MotionProps, "children"> & {
  children: React.ReactNode;
  className?: string;
  segmentClassName?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  variants?: Variants;
  as?: TextAnimateElement;
  by?: TextAnimateBy;
  startOnView?: boolean;
  once?: boolean;
  viewportAmount?: number | "some" | "all";
  animation?: TextAnimatePreset;
  accessible?: boolean;
};

const TextAnimate = React.forwardRef<HTMLElement, TextAnimateProps>(
  (
    {
      children,
      delay = 0,
      duration = 0.3,
      stagger,
      variants,
      className,
      segmentClassName,
      as: Component = "p",
      startOnView = true,
      once = true,
      viewportAmount = 0.3,
      by = "word",
      animation = "fadeIn",
      accessible = true,
      ...props
    },
    ref,
  ) => {
    const reducedMotion = useReducedMotion() ?? false;
    const MotionComponent = motionElements[Component];
    const textContent = getTextContent(children) ?? "";
    const segments = React.useMemo(
      () => splitTextAnimate(textContent, by),
      [textContent, by],
    );

    const staggerChildren =
      stagger ??
      (segments.length > 1 ? duration / segments.length : STAGGER_BY_SPLIT[by]);

    const finalVariants = React.useMemo(
      () =>
        resolveTextAnimateVariants({
          animation,
          delay,
          staggerChildren,
          customVariants: variants,
        }),
      [animation, delay, staggerChildren, variants],
    );

    const rootClassName = `whitespace-pre-wrap ${className ?? ""}`.trim();

    if (reducedMotion) {
      return React.createElement(
        Component,
        { ref, className: rootClassName },
        textContent,
      );
    }

    return (
      <AnimatePresence mode="popLayout">
        <MotionComponent
          ref={ref as never}
          variants={finalVariants.container}
          initial="hidden"
          whileInView={startOnView ? "show" : undefined}
          animate={startOnView ? undefined : "show"}
          exit="exit"
          className={rootClassName}
          viewport={{ once, amount: viewportAmount }}
          aria-label={accessible && textContent ? textContent : undefined}
          {...props}
        >
          {accessible && textContent ? (
            <span className="sr-only absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0">
              {textContent}
            </span>
          ) : null}
          {segments.map(({ key, segment }) => (
            <motion.span
              key={key}
              variants={finalVariants.item}
              className={getSegmentClassName(by, segmentClassName)}
              aria-hidden={accessible ? true : undefined}
            >
              {segment}
            </motion.span>
          ))}
        </MotionComponent>
      </AnimatePresence>
    );
  },
);

TextAnimate.displayName = "TextAnimate";

export { TextAnimate };
