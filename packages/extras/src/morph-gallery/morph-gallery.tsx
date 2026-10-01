"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type MorphGalleryItem = {
  /** Image URL. */
  src: string;
  /** Alt text — also used as the caption title when `caption` is omitted. */
  alt: string;
  /** Optional caption shown under the image in the detail view. */
  caption?: string;
};

export type MorphGalleryProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  /** Images to display in the grid. */
  items: MorphGalleryItem[];
  /** Grid column count. */
  columns?: 2 | 3 | 4 | 5;
  /** Fired when the detail view opens or closes. */
  onOpenChange?: (index: number | null) => void;
};

// SPRING.smooth — shared-layout morph.
const MORPH_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
} as const;

const columnClasses: Record<
  NonNullable<MorphGalleryProps["columns"]>,
  string
> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-3 sm:grid-cols-5",
};

const MorphGallery = React.forwardRef<HTMLDivElement, MorphGalleryProps>(
  ({ items, columns = 3, onOpenChange, className, ...props }, forwardedRef) => {
    const reduce = useReducedMotion() ?? false;
    const uid = React.useId();
    const [open, setOpen] = React.useState<number | null>(null);
    const count = items.length;

    const dialogRef = React.useRef<HTMLDivElement>(null);
    const closeRef = React.useRef<HTMLButtonElement>(null);
    const restoreRef = React.useRef<HTMLElement | null>(null);

    const onOpenChangeRef = React.useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;

    const change = React.useCallback((next: number | null) => {
      setOpen(next);
      onOpenChangeRef.current?.(next);
    }, []);

    const openAt = (i: number) => {
      restoreRef.current = document.activeElement as HTMLElement;
      change(i);
    };
    const close = React.useCallback(() => change(null), [change]);
    const step = React.useCallback(
      (delta: number) =>
        setOpen((o) => (o === null ? o : (o + delta + count) % count)),
      [count],
    );

    // Focus the dialog on open; restore focus to the originating tile on close.
    React.useEffect(() => {
      if (open === null) {
        restoreRef.current?.focus?.();
        return;
      }
      closeRef.current?.focus();
    }, [open]);

    const onDialogKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Tab") {
        // Simple focus trap across the three controls.
        const focusables = [
          dialogRef.current?.querySelector<HTMLElement>("[data-morph-prev]"),
          dialogRef.current?.querySelector<HTMLElement>("[data-morph-next]"),
          closeRef.current,
        ].filter((el): el is HTMLElement => el != null);
        if (focusables.length === 0) return;
        const idx = focusables.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        const dir = e.shiftKey ? -1 : 1;
        const nextIdx = (idx + dir + focusables.length) % focusables.length;
        focusables[nextIdx]?.focus();
      }
    };

    const current = open === null ? null : items[open];

    return (
      <div
        ref={forwardedRef}
        data-slot="morph-gallery"
        className={`w-full ${className ?? ""}`}
        {...props}
      >
        <div className={`grid gap-3 ${columnClasses[columns]}`}>
          {items.map((item, i) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: tiles are positional
              key={i}
              type="button"
              onClick={() => openAt(i)}
              aria-label={`Open ${item.alt}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <motion.img
                layoutId={reduce ? undefined : `${uid}-${i}`}
                src={item.src}
                alt={item.alt}
                transition={MORPH_SPRING}
                className="size-full object-cover"
                draggable={false}
              />
              {/* Hover feedback lives on an overlay so it never fights the
                  shared-layout transform on the image itself. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-foreground/0 [transition:background_200ms] group-hover:bg-foreground/10"
              />
            </button>
          ))}
        </div>

        <AnimatePresence>
          {open !== null && current ? (
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-modal grid place-items-center bg-background/80 p-4 backdrop-blur-sm sm:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            >
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={current.caption ?? current.alt}
                tabIndex={-1}
                onKeyDown={onDialogKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-full w-full max-w-3xl flex-col items-center gap-4 outline-none"
              >
                <motion.img
                  layoutId={reduce ? undefined : `${uid}-${open}`}
                  src={current.src}
                  alt={current.alt}
                  transition={MORPH_SPRING}
                  initial={reduce ? { opacity: 0 } : false}
                  animate={reduce ? { opacity: 1 } : undefined}
                  className="max-h-[70vh] w-auto max-w-full rounded-2xl border border-border object-contain shadow-2xl"
                  draggable={false}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={open}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="text-center"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {current.caption ?? current.alt}
                    </p>
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {open + 1} / {count}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  data-morph-prev
                  onClick={() => step(-1)}
                  aria-label="Previous"
                  className="absolute top-1/2 left-0 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/90 text-foreground shadow-sm [transition:transform_150ms,background_150ms] hover:bg-accent active:scale-95 sm:-left-4"
                >
                  ‹
                </button>
                <button
                  type="button"
                  data-morph-next
                  onClick={() => step(1)}
                  aria-label="Next"
                  className="absolute top-1/2 right-0 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/90 text-foreground shadow-sm [transition:transform_150ms,background_150ms] hover:bg-accent active:scale-95 sm:-right-4"
                >
                  ›
                </button>
                <button
                  type="button"
                  ref={closeRef}
                  onClick={close}
                  aria-label="Close"
                  className="absolute -top-2 right-0 grid size-9 place-items-center rounded-full border border-border bg-card/90 text-foreground shadow-sm [transition:transform_150ms,background_150ms] hover:bg-accent active:scale-95 sm:-top-4 sm:-right-12"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);
MorphGallery.displayName = "MorphGallery";

export { MorphGallery };
