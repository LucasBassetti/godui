"use client";

import { motion, type Variants } from "framer-motion";
import * as React from "react";

export type BentoGridProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Number of columns on large screens. */
  columns?: 2 | 3 | 4;
};

export type BentoCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Columns the card spans on large screens. */
  colSpan?: 1 | 2 | 3;
  /** Rows the card spans on large screens. */
  rowSpan?: 1 | 2;
  /** Optional leading icon / media. */
  icon?: React.ReactNode;
  /** Card heading. */
  title?: React.ReactNode;
  /** Supporting copy under the title. */
  description?: React.ReactNode;
  /** Call-to-action rendered at the bottom of the card. */
  cta?: React.ReactNode;
};

// Static class maps — the Tailwind scanner can't see interpolated class names.
const GRID_COLS: Record<NonNullable<BentoGridProps["columns"]>, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

const COL_SPAN: Record<NonNullable<BentoCardProps["colSpan"]>, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
};

const ROW_SPAN: Record<NonNullable<BentoCardProps["rowSpan"]>, string> = {
  1: "md:row-span-1",
  2: "md:row-span-2",
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 22, stiffness: 200 },
  },
};

const CARD_BASE =
  "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm [transition:translate_300ms_cubic-bezier(0.3,0.7,0.4,1),box-shadow_300ms_ease] hover:-translate-y-1 hover:shadow-lg motion-reduce:[transition:none] motion-reduce:hover:translate-y-0";

const CARD_GLOW =
  "pointer-events-none absolute inset-0 opacity-0 [transition:opacity_400ms_ease] group-hover:opacity-100 motion-reduce:[transition:none] [background:radial-gradient(280px_circle_at_var(--x,50%)_var(--y,50%),color-mix(in_oklch,var(--primary)_18%,transparent),transparent_70%)]";

const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ columns = 3, className, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      data-slot="bento-grid"
      className={`grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 ${GRID_COLS[columns]} ${className ?? ""}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  ),
);
BentoGrid.displayName = "BentoGrid";

const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  (
    {
      colSpan = 1,
      rowSpan = 1,
      icon,
      title,
      description,
      cta,
      className,
      children,
      onPointerMove,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }
      onPointerMove?.(e);
    };

    return (
      <motion.div
        ref={ref}
        data-slot="bento-card"
        variants={itemVariants}
        onPointerMove={handlePointerMove}
        className={`${CARD_BASE} ${COL_SPAN[colSpan]} ${ROW_SPAN[rowSpan]} ${className ?? ""}`}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        <div aria-hidden className={CARD_GLOW} />
        <div className="relative z-raised flex h-full flex-col">
          {icon ? (
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              {icon}
            </div>
          ) : null}
          {title ? (
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
          {children}
          {cta ? <div className="mt-auto pt-4">{cta}</div> : null}
        </div>
      </motion.div>
    );
  },
);
BentoCard.displayName = "BentoCard";

export { BentoCard, BentoGrid };
