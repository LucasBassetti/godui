"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import * as React from "react";
import { getTextContent } from "../lib/text-utils";

/** How the copy is split for the scrubbed reveal. */
export type ScrollTextRevealBy = "word" | "character" | "line";

type Segment = { key: string; segment: string };

// Split into animatable segments, preserving whitespace tokens so `whitespace-pre`
// keeps the original spacing. Mirrors the text-animate splitter, inlined so the
// component stays self-contained on install.
function splitReveal(text: string, by: ScrollTextRevealBy): Segment[] {
  let raw: string[];
  switch (by) {
    case "character":
      raw = [...text];
      break;
    case "line":
      raw = text.split("\n");
      break;
    default:
      raw = text.split(/(\s+)/);
      break;
  }
  let offset = 0;
  return raw.map((segment) => {
    const item = { key: `${by}-${offset}-${segment}`, segment };
    offset += Math.max(segment.length, 1);
    return item;
  });
}

/** Elements the reveal can render as, matching the `text-animate` map. */
const elements = {
  div: "div",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  span: "span",
} as const;

export type ScrollTextRevealElement = keyof typeof elements;

export type ScrollTextRevealProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> & {
  /** The copy to reveal. Must be a plain string. */
  children: string;
  /** Element to render as. */
  as?: ScrollTextRevealElement;
  /** Split granularity for the reveal. */
  by?: ScrollTextRevealBy;
  /** Blur each segment in as it resolves. */
  blur?: boolean;
  /** Resting opacity of not-yet-revealed segments. */
  dimOpacity?: number;
  /** Keep each word lit once revealed instead of re-dimming on scroll-up. */
  keepRevealed?: boolean;
  /** Scroll offset that maps element position to progress (framer `useScroll`). */
  offset?: [string, string];
  /** Class applied to every segment span. */
  segmentClassName?: string;
};

type SegmentProps = {
  progress: MotionValue<number>;
  start: number;
  end: number;
  blur: boolean;
  dimOpacity: number;
  keepRevealed: boolean;
  segment: string;
  className: string;
};

// One segment maps its slice of scroll progress onto a 0..1 reveal factor, then
// onto opacity (and optional blur). Scrubbed, so it reverses cleanly on
// scroll-up — unless `keepRevealed` latches the factor at its peak.
function RevealSegment({
  progress,
  start,
  end,
  blur,
  dimOpacity,
  keepRevealed,
  segment,
  className,
}: SegmentProps) {
  const raw = useTransform(progress, [start, end], [0, 1]);
  const reveal = useMotionValue(raw.get());
  useMotionValueEvent(raw, "change", (v) => {
    reveal.set(keepRevealed ? Math.max(reveal.get(), v) : v);
  });
  const opacity = useTransform(reveal, [0, 1], [dimOpacity, 1]);
  const filter = useTransform(reveal, [0, 1], ["blur(6px)", "blur(0px)"]);
  return (
    <motion.span
      aria-hidden
      className={className}
      style={{ opacity, filter: blur ? filter : undefined }}
    >
      {segment}
    </motion.span>
  );
}

const ScrollTextReveal = React.forwardRef<HTMLElement, ScrollTextRevealProps>(
  (
    {
      children,
      as = "p",
      by = "word",
      blur = true,
      dimOpacity = 0.15,
      keepRevealed = false,
      offset = ["start 0.85", "end 0.35"],
      className,
      segmentClassName,
      ...props
    },
    forwardedRef,
  ) => {
    const reduceMotion = useReducedMotion();
    const localRef = React.useRef<HTMLElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => localRef.current as HTMLElement,
    );

    const text = getTextContent(children) ?? "";
    const segments = React.useMemo(() => splitReveal(text, by), [text, by]);

    const { scrollYProgress } = useScroll({
      target: localRef as React.RefObject<HTMLElement>,
      offset: offset as never,
    });

    const Component = elements[as];
    const rootClassName = `whitespace-pre-wrap ${className ?? ""}`.trim();

    // Reduced motion: static, fully legible copy — no scroll coupling.
    if (reduceMotion) {
      return React.createElement(
        Component,
        {
          ref: localRef as React.Ref<HTMLElement>,
          className: rootClassName,
          ...props,
        },
        text,
      );
    }

    const n = segments.length;
    const segmentBase =
      by === "line"
        ? "block"
        : by === "character"
          ? "inline-block"
          : "inline-block whitespace-pre";
    const segCls = segmentClassName
      ? `${segmentBase} ${segmentClassName}`
      : segmentBase;

    return React.createElement(
      Component,
      {
        ref: localRef as React.Ref<HTMLElement>,
        className: rootClassName,
        "aria-label": text || undefined,
        ...props,
      },
      <span
        key="sr"
        className="sr-only absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
      >
        {text}
      </span>,
      segments.map(({ key, segment }, i) => (
        <RevealSegment
          key={key}
          progress={scrollYProgress}
          start={i / n}
          end={(i + 1) / n}
          blur={blur}
          dimOpacity={dimOpacity}
          keepRevealed={keepRevealed}
          segment={segment}
          className={segCls}
        />
      )),
    );
  },
);

ScrollTextReveal.displayName = "ScrollTextReveal";

export { ScrollTextReveal };
