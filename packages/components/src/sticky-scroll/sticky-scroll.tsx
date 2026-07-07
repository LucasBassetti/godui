"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type StickyScrollItem = {
  title: string;
  description: React.ReactNode;
  /** The visual shown in the pinned panel while this item is active. */
  content: React.ReactNode;
};

export type StickyScrollProps = React.HTMLAttributes<HTMLDivElement> & {
  items: StickyScrollItem[];
};

// SPRING.smooth — surfaces / shared-layout feel.
const SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
} as const;

const StickyScroll = React.forwardRef<HTMLDivElement, StickyScrollProps>(
  ({ items, className, ...props }, ref) => {
    const reduce = useReducedMotion();
    // The component is its own scroll container. That keeps `position: sticky`
    // and the active-item detection self-contained — they work regardless of
    // where it's mounted (including inside `overflow: hidden` ancestors, which
    // would break window-scroll-based sticky).
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );
    const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const [active, setActive] = React.useState(0);

    // Active item = whichever section crosses the scroller's middle (a center
    // line drawn by the -50%/-50% root margin against the scroll container).
    React.useEffect(() => {
      const root = containerRef.current;
      if (!root) return;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const index = itemRefs.current.indexOf(
                entry.target as HTMLDivElement,
              );
              if (index !== -1) setActive(index);
            }
          }
        },
        { root, rootMargin: "-50% 0px -50% 0px", threshold: 0 },
      );
      for (const el of itemRefs.current) {
        if (el) observer.observe(el);
      }
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={containerRef}
        data-slot="sticky-scroll"
        className={`relative mx-auto h-[30rem] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-card px-6 [scrollbar-width:thin] md:px-10 ${className ?? ""}`}
        {...props}
      >
        <div className="grid gap-x-10 md:grid-cols-2">
          <div>
            {items.map((item, i) => {
              const isActive = i === active;
              return (
                <div
                  key={item.title}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-active={isActive}
                  className="flex min-h-[22rem] flex-col justify-center py-10 md:h-[30rem] md:min-h-0 md:py-0"
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      animate={{
                        scaleY: isActive ? 1 : 0.4,
                        opacity: isActive ? 1 : 0.3,
                      }}
                      transition={reduce ? { duration: 0 } : SPRING}
                      className="h-7 w-1 origin-center rounded-full bg-primary"
                    />
                    <motion.h3
                      animate={{ opacity: isActive ? 1 : 0.4 }}
                      transition={reduce ? { duration: 0 } : SPRING}
                      className="text-xl font-bold text-foreground md:text-2xl"
                    >
                      {item.title}
                    </motion.h3>
                  </div>
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0.4 }}
                    transition={reduce ? { duration: 0 } : SPRING}
                    className="mt-3 max-w-md pl-4 text-sm text-muted-foreground md:text-base"
                  >
                    {item.description}
                  </motion.div>

                  {/* No pinned panel on narrow screens — show each item's visual
                      inline beneath its copy instead. */}
                  <div className="mt-6 h-52 overflow-hidden rounded-xl border border-border bg-background shadow-sm md:hidden">
                    <div className="flex size-full items-center justify-center">
                      {item.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden md:block">
            <div className="sticky top-0 flex h-[30rem] items-center py-6">
              <div className="relative size-full overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: 8 }}
                    transition={reduce ? { duration: 0 } : SPRING}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {items[active]?.content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
StickyScroll.displayName = "StickyScroll";

export { StickyScroll };
