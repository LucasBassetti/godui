"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

export type TimelineEntry = {
  /** Heading for the entry, shown beside the node. */
  title: string;
  /** Optional secondary label (a date, phase, version…). */
  date?: string;
  /** Body content for the entry. */
  content: React.ReactNode;
};

export type ScrollTimelineProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TimelineEntry[];
};

const ScrollTimeline = React.forwardRef<HTMLDivElement, ScrollTimelineProps>(
  ({ data, className, ...props }, ref) => {
    const reduce = useReducedMotion();
    const rootRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);
    const trackRef = React.useRef<HTMLDivElement>(null);
    const [height, setHeight] = React.useState(0);

    React.useLayoutEffect(() => {
      const el = trackRef.current;
      if (!el) return;
      const measure = () => setHeight(el.getBoundingClientRect().height);
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const { scrollYProgress } = useScroll({
      target: trackRef,
      offset: ["start 10%", "end 60%"],
    });

    // Spring-smooth the scroll scrub, then drive the rail with a GPU `scaleY`
    // transform (not `height`) so growth stays buttery. SPRING.smooth.
    const progress = useSpring(scrollYProgress, {
      stiffness: 320,
      damping: 32,
      mass: 0.9,
    });
    const lineOpacity = useTransform(progress, [0, 0.05], [0, 1]);

    return (
      <div
        ref={rootRef}
        data-slot="scroll-timeline"
        className={`w-full ${className ?? ""}`}
        {...props}
      >
        <div ref={trackRef} className="relative mx-auto max-w-4xl pb-20">
          {data.map((item, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: entries are a static ordered list; titles may repeat.
              key={`${item.title}-${index}`}
              className="flex justify-start pt-10 md:gap-10 md:pt-24"
            >
              {/* Sticky node + date rail */}
              <div className="sticky top-24 z-base flex max-w-xs flex-col items-center self-start md:w-44 md:flex-row md:items-start">
                <div className="absolute left-3 flex size-8 items-center justify-center rounded-full bg-background md:left-3">
                  <div className="size-3 rounded-full border border-border bg-muted-foreground/30" />
                </div>
                <div className="hidden pl-16 md:block">
                  <h3 className="text-xl font-bold text-muted-foreground md:text-2xl">
                    {item.date ?? item.title}
                  </h3>
                  {item.date ? (
                    <p className="text-sm text-muted-foreground/70">
                      {item.title}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Entry content */}
              <motion.div
                className="relative w-full pr-4 pl-16 md:pl-4"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                }
              >
                <h3 className="mb-4 block text-left text-2xl font-bold text-muted-foreground md:hidden">
                  {item.date ?? item.title}
                </h3>
                {item.content}
              </motion.div>
            </div>
          ))}

          {/* The rail: a muted base line with a growing accent overlay. */}
          <div
            style={{ height }}
            className="absolute top-0 left-7 w-px overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] bg-border md:left-7"
          >
            <motion.div
              style={{
                scaleY: reduce ? 1 : progress,
                opacity: reduce ? 1 : lineOpacity,
              }}
              className="absolute inset-0 w-px origin-top rounded-full bg-[linear-gradient(to_top,var(--primary),color-mix(in_oklch,var(--primary)_0%,transparent))]"
            />
          </div>
        </div>
      </div>
    );
  },
);
ScrollTimeline.displayName = "ScrollTimeline";

export { ScrollTimeline };
