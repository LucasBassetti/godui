"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type ThreeDMarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Image URLs to tile across the grid (best with 8+). */
  images: string[];
  /** Number of columns. Defaults to 4. */
  columns?: 3 | 4;
};

// EASE.inOut — symmetric curve for looping traversals.
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

const columnCountClass: Record<3 | 4, string> = {
  3: "grid-cols-3",
  4: "grid-cols-4",
};

/** Split a flat list into `count` sequential columns. */
function toColumns<T>(items: T[], count: number): T[][] {
  const columns: T[][] = Array.from({ length: count }, () => []);
  const perColumn = Math.ceil(items.length / count);
  items.forEach((item, i) => {
    columns[Math.min(count - 1, Math.floor(i / perColumn))].push(item);
  });
  return columns;
}

const ThreeDMarquee = React.forwardRef<HTMLDivElement, ThreeDMarqueeProps>(
  ({ images, columns = 4, className, ...props }, ref) => {
    const reduce = useReducedMotion();
    const cols = toColumns(images, columns);

    const grid = (
      <div
        className={`grid size-full origin-center gap-4 [transform:rotateX(55deg)_rotateZ(-45deg)] ${columnCountClass[columns]}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {cols.map((col, colIndex) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional and static.
            key={colIndex}
            className="flex flex-col gap-4"
            animate={
              reduce
                ? undefined
                : { y: colIndex % 2 === 0 ? [0, -40, 0] : [0, 40, 0] }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 10 + colIndex,
                    ease: EASE_IN_OUT,
                    repeat: Number.POSITIVE_INFINITY,
                  }
            }
          >
            {col.map((src, i) => (
              <img
                // biome-ignore lint/suspicious/noArrayIndexKey: image list is positional.
                key={i}
                src={src}
                alt=""
                draggable={false}
                className="aspect-square w-full rounded-lg object-cover shadow-lg [outline:1px_solid_color-mix(in_oklch,var(--border)_60%,transparent)] [outline-offset:-1px]"
              />
            ))}
          </motion.div>
        ))}
      </div>
    );

    return (
      <div
        ref={ref}
        data-slot="three-d-marquee"
        className={`relative mx-auto flex size-full items-center justify-center overflow-hidden [perspective:1200px] ${className ?? ""}`}
        {...props}
      >
        <div className="w-[140%] scale-110">{grid}</div>
      </div>
    );
  },
);
ThreeDMarquee.displayName = "ThreeDMarquee";

export { ThreeDMarquee };
