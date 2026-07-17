"use client";

import { Reorder } from "framer-motion";
import * as React from "react";

// Snappy enough that neighbours flow out of the way instantly, but with a
// little spring so items settle rather than snap.
const REORDER_SPRING = {
  type: "spring" as const,
  stiffness: 520,
  damping: 32,
};

// Framer Motion redefines these drag/animation handlers with its own
// signatures, so drop the React DOM versions to avoid a type clash on spread.
type MotionConflicts =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

export type ReorderListProps<T> = Omit<
  React.HTMLAttributes<HTMLUListElement>,
  "onReorder" | MotionConflicts
> & {
  /** Ordered values rendered as items. Each must be referentially stable. */
  values: T[];
  /** Called with the next order while dragging. */
  onReorder: (values: T[]) => void;
  /** Drag axis. Defaults to `"y"`. */
  axis?: "x" | "y";
};

function ReorderListInner<T>(
  {
    values,
    onReorder,
    axis = "y",
    className,
    children,
    ...props
  }: ReorderListProps<T>,
  ref: React.Ref<HTMLUListElement>,
) {
  return (
    <Reorder.Group
      ref={ref}
      as="ul"
      axis={axis}
      values={values}
      onReorder={onReorder}
      data-slot="reorder-list"
      className={`flex ${axis === "y" ? "flex-col" : "flex-row"} gap-2 ${className ?? ""}`}
      {...props}
    >
      {children}
    </Reorder.Group>
  );
}

/** Drag-to-reorder list. Items spring to place and neighbours flow around them. */
const ReorderList = React.forwardRef(ReorderListInner) as <T>(
  props: ReorderListProps<T> & { ref?: React.Ref<HTMLUListElement> },
) => React.ReactElement;

export type ReorderItemProps<T> = Omit<
  React.LiHTMLAttributes<HTMLLIElement>,
  "value" | MotionConflicts
> & {
  /** The value this item represents within the parent list's `values`. */
  value: T;
};

function ReorderItemInner<T>(
  { value, className, children, ...props }: ReorderItemProps<T>,
  ref: React.Ref<HTMLLIElement>,
) {
  // biome-ignore lint/correctness/useHookAtTopLevel: this is a forwardRef render function; the generic signature hides that from the rule.
  const [dragging, setDragging] = React.useState(false);
  return (
    <Reorder.Item
      ref={ref}
      as="li"
      value={value}
      data-slot="reorder-item"
      data-dragging={dragging || undefined}
      transition={REORDER_SPRING}
      // The lift is driven by a `data-dragging` class, not framer's `whileDrag`:
      // a `whileDrag` scale/boxShadow can get stranded as an inline style when a
      // drop lands mid-reorder, leaving the row wider or shadowed afterwards.
      // Tailwind v4 emits `scale` as its own property (separate from framer's
      // layout `transform`), so it composes cleanly and resets via CSS transition
      // on drop. The lift shadow lives on a sibling overlay whose opacity animates
      // (GPU-composited) instead of transitioning `box-shadow` (main-thread paint).
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      className={`group relative flex origin-center cursor-grab touch-none select-none items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-card-foreground shadow-sm [transition:scale_150ms_ease] active:cursor-grabbing motion-reduce:transition-none data-[dragging]:z-raised data-[dragging]:scale-[1.03] ${className ?? ""}`}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 shadow-xl [transition:opacity_200ms_ease] group-data-[dragging]:opacity-100 motion-reduce:transition-none"
      />
      {children}
    </Reorder.Item>
  );
}

/** A single draggable row. Lifts and scales on grab, springs back on drop. */
const ReorderItem = React.forwardRef(ReorderItemInner) as <T>(
  props: ReorderItemProps<T> & { ref?: React.Ref<HTMLLIElement> },
) => React.ReactElement;

export { ReorderItem, ReorderList };
