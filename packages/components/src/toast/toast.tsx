"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import * as React from "react";
import { createPortal } from "react-dom";

export type ToastVariant = "default" | "success" | "error";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Overrides the provider default. */
  duration?: number;
  action?: ToastAction;
};

type ToastRecord = ToastOptions & { id: number };

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type ToastProviderProps = {
  /** Corner the stack is anchored to. */
  position?: ToastPosition;
  /** Default auto-dismiss delay in ms. */
  duration?: number;
};

// Minimal external store so `toast()` can be called from anywhere, no context needed.
let counter = 0;
let records: ToastRecord[] = [];
const listeners = new Set<(r: ToastRecord[]) => void>();

function emit() {
  for (const l of listeners) l(records);
}

function addToast(options: ToastOptions): number {
  const id = ++counter;
  records = [{ id, variant: "default", ...options }, ...records];
  emit();
  return id;
}

function dismissToast(id: number) {
  records = records.filter((r) => r.id !== id);
  emit();
}

type ToastFn = ((options: ToastOptions) => number) & {
  success: (options: ToastOptions) => number;
  error: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const toast = ((options: ToastOptions) => addToast(options)) as ToastFn;
toast.success = (options) => addToast({ ...options, variant: "success" });
toast.error = (options) => addToast({ ...options, variant: "error" });
toast.dismiss = dismissToast;

// Corner the stack is pinned to. Items are absolutely positioned against this edge.
const POSITION_CLASS: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
};

const VARIANT_CLASS: Record<ToastVariant, string> = {
  default: "border-border",
  success: "border-l-4 border-l-[oklch(0.72_0.15_150)]",
  error: "border-l-4 border-l-destructive",
};

// Stacking tuning.
const GAP = 14; // px between toasts when expanded
const PEEK = 16; // px each toast peeks out behind the front when collapsed
const SCALE_STEP = 0.05; // scale lost per depth when collapsed
const MAX_VISIBLE = 3; // toasts shown behind the front when collapsed

const TOAST_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
} as const;

function useMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

function ToastItem({
  record,
  index,
  total,
  expanded,
  isBottom,
  expandedOffset,
  onHeight,
  defaultDuration,
}: {
  record: ToastRecord;
  index: number;
  total: number;
  expanded: boolean;
  isBottom: boolean;
  expandedOffset: number;
  onHeight: (id: number, height: number) => void;
  defaultDuration: number;
}) {
  const ref = React.useRef<HTMLLIElement>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const report = () => onHeight(record.id, el.offsetHeight);
    report();
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, [record.id, onHeight]);

  // Pause the countdown while the stack is expanded (i.e. hovered).
  React.useEffect(() => {
    if (expanded) return;
    const id = setTimeout(
      () => dismissToast(record.id),
      record.duration ?? defaultDuration,
    );
    return () => clearTimeout(id);
  }, [expanded, record.id, record.duration, defaultDuration]);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) {
      dismissToast(record.id);
    }
  };

  const dir = isBottom ? -1 : 1; // stack grows away from the anchored edge
  const hidden = !expanded && index >= MAX_VISIBLE;

  const y = expanded ? dir * expandedOffset : dir * index * PEEK;
  const scale = expanded ? 1 : Math.max(0, 1 - index * SCALE_STEP);

  return (
    <motion.li
      ref={ref}
      data-slot="toast"
      initial={{ opacity: 0, y: dir * -40, scale: 0.9 }}
      animate={{ opacity: hidden ? 0 : 1, y, scale }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={TOAST_SPRING}
      drag={hidden ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      style={{
        zIndex: total - index,
        transformOrigin: isBottom ? "bottom center" : "top center",
        pointerEvents: hidden ? "none" : "auto",
      }}
      className={`absolute inset-x-0 flex w-full cursor-grab items-start gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-lg active:cursor-grabbing ${isBottom ? "bottom-0" : "top-0"} ${VARIANT_CLASS[record.variant ?? "default"]}`}
    >
      <div className="flex-1">
        {record.title ? (
          <div className="text-sm font-semibold text-foreground">
            {record.title}
          </div>
        ) : null}
        {record.description ? (
          <div className="mt-0.5 text-sm text-muted-foreground">
            {record.description}
          </div>
        ) : null}
      </div>
      {record.action ? (
        <button
          type="button"
          onClick={() => {
            record.action?.onClick();
            dismissToast(record.id);
          }}
          className="shrink-0 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground [transition:background_200ms_ease] hover:bg-accent"
        >
          {record.action.label}
        </button>
      ) : null}
    </motion.li>
  );
}

function ToastProvider({
  position = "bottom-right",
  duration = 4000,
}: ToastProviderProps) {
  const mounted = useMounted();
  const [items, setItems] = React.useState<ToastRecord[]>(records);
  const [expanded, setExpanded] = React.useState(false);
  const [heights, setHeights] = React.useState<Record<number, number>>({});

  React.useEffect(() => {
    listeners.add(setItems);
    setItems(records);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  // Forget heights for toasts that have been dismissed.
  React.useEffect(() => {
    setHeights((prev) => {
      const next: Record<number, number> = {};
      let changed = false;
      for (const item of items) {
        if (prev[item.id] != null) next[item.id] = prev[item.id];
      }
      for (const key of Object.keys(prev)) {
        if (next[Number(key)] == null) changed = true;
      }
      return changed ? next : prev;
    });
  }, [items]);

  const setHeight = React.useCallback((id: number, height: number) => {
    setHeights((prev) =>
      prev[id] === height ? prev : { ...prev, [id]: height },
    );
  }, []);

  if (!mounted) return null;

  const isBottom = position.startsWith("bottom");

  // Cumulative offset of each toast from the anchored edge when expanded.
  const offsets: number[] = [];
  let running = 0;
  for (let i = 0; i < items.length; i++) {
    offsets.push(running);
    running += (heights[items[i].id] ?? 0) + GAP;
  }

  const frontHeight = items.length ? (heights[items[0].id] ?? 0) : 0;
  const totalHeight = running > 0 ? running - GAP : 0;
  const collapsedHeight =
    frontHeight + Math.min(items.length - 1, MAX_VISIBLE - 1) * PEEK;
  const regionHeight = Math.max(0, expanded ? totalHeight : collapsedHeight);

  return createPortal(
    <motion.ol
      data-slot="toaster"
      aria-live="polite"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      animate={{ height: regionHeight }}
      transition={TOAST_SPRING}
      style={{ transformOrigin: isBottom ? "bottom" : "top" }}
      className={`fixed z-toast w-[min(24rem,calc(100vw-2rem))] ${items.length ? "pointer-events-auto" : "pointer-events-none"} ${POSITION_CLASS[position]}`}
    >
      <AnimatePresence initial={false}>
        {items.map((record, index) => (
          <ToastItem
            key={record.id}
            record={record}
            index={index}
            total={items.length}
            expanded={expanded}
            isBottom={isBottom}
            expandedOffset={offsets[index]}
            onHeight={setHeight}
            defaultDuration={duration}
          />
        ))}
      </AnimatePresence>
    </motion.ol>,
    document.body,
  );
}

export { ToastProvider, toast };
