"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type PaginationProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange" | "defaultValue"
> & {
  /** Total number of pages. */
  total: number;
  /** Controlled current page (1-based). */
  page?: number;
  /** Uncontrolled initial page (1-based). */
  defaultPage?: number;
  /** Pages shown at each edge. */
  boundaryCount?: number;
  /** Pages shown on each side of the current page. */
  siblingCount?: number;
  onPageChange?: (page: number) => void;
};

type Cell = number | "start-ellipsis" | "end-ellipsis";

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

function buildCells(
  page: number,
  total: number,
  boundaryCount: number,
  siblingCount: number,
): Cell[] {
  const startPages = range(1, Math.min(boundaryCount, total));
  const endPages = range(
    Math.max(total - boundaryCount + 1, boundaryCount + 1),
    total,
  );
  const siblingsStart = Math.max(
    Math.min(page - siblingCount, total - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : total - 1,
  );

  const cells: Cell[] = [...startPages];
  if (siblingsStart > boundaryCount + 2) {
    cells.push("start-ellipsis");
  } else if (boundaryCount + 1 < total - boundaryCount) {
    cells.push(boundaryCount + 1);
  }
  cells.push(...range(siblingsStart, siblingsEnd));
  if (siblingsEnd < total - boundaryCount - 1) {
    cells.push("end-ellipsis");
  } else if (total - boundaryCount > boundaryCount) {
    cells.push(total - boundaryCount);
  }
  cells.push(...endPages);
  return cells.filter(
    (c, i, arr) => typeof c !== "number" || arr.indexOf(c) === i,
  );
}

const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
  </svg>
);

let paginationSeed = 0;

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      total,
      page: pageProp,
      defaultPage = 1,
      boundaryCount = 1,
      siblingCount = 1,
      onPageChange,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const pillId = React.useMemo(
      () => `pagination-pill-${paginationSeed++}`,
      [],
    );
    const isControlled = pageProp !== undefined;
    const [internal, setInternal] = React.useState(defaultPage);
    const page = Math.min(
      Math.max(isControlled ? pageProp : internal, 1),
      total,
    );

    const goTo = (next: number) => {
      const clamped = Math.min(Math.max(next, 1), total);
      if (clamped === page) return;
      if (!isControlled) setInternal(clamped);
      onPageChange?.(clamped);
    };

    const cells = React.useMemo(
      () => buildCells(page, total, boundaryCount, siblingCount),
      [page, total, boundaryCount, siblingCount],
    );

    const spring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 480, damping: 34 } as const);

    const navBtn =
      "group inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground outline-none [transition:background-color_120ms_ease,color_120ms_ease] hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={`inline-flex items-center gap-1 ${className ?? ""}`}
        {...props}
      >
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
          className={navBtn}
        >
          <span className="[transition:transform_150ms_ease] group-hover:-translate-x-0.5">
            <Arrow dir="left" />
          </span>
        </button>

        <ul className="flex items-center gap-1">
          {cells.map((cell, i) => {
            if (cell === "start-ellipsis" || cell === "end-ellipsis") {
              return (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis cell position is its identity
                  key={`${cell}-${i}`}
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center text-muted-foreground"
                >
                  …
                </li>
              );
            }
            const active = cell === page;
            return (
              <li key={cell}>
                <button
                  type="button"
                  aria-label={`Page ${cell}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => goTo(cell)}
                  className={`relative inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 font-medium text-sm tabular-nums outline-none [transition:color_120ms_ease] focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={pillId}
                      transition={spring}
                      className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                    />
                  )}
                  <span className="relative">{cell}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          aria-label="Next page"
          disabled={page >= total}
          onClick={() => goTo(page + 1)}
          className={navBtn}
        >
          <span className="[transition:transform_150ms_ease] group-hover:translate-x-0.5">
            <Arrow dir="right" />
          </span>
        </button>
      </nav>
    );
  },
);
Pagination.displayName = "Pagination";

export { Pagination };
