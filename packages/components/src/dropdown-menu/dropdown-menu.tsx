"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type DropdownMenuItem =
  | { type: "separator" }
  | { type: "label"; label: React.ReactNode }
  | {
      type?: "item";
      label: React.ReactNode;
      icon?: React.ReactNode;
      shortcut?: string;
      disabled?: boolean;
      href?: string;
      onSelect?: () => void;
      submenu?: DropdownMenuItem[];
    };

export type DropdownSide = "top" | "bottom" | "left" | "right";
export type DropdownAlign = "start" | "center" | "end";

export type DropdownMenuProps = {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  side?: DropdownSide;
  align?: DropdownAlign;
  className?: string;
};

const sideClasses: Record<DropdownSide, string> = {
  bottom: "top-full mt-2",
  top: "bottom-full mb-2",
  right: "left-full top-0 ml-2",
  left: "right-full top-0 mr-2",
};

const alignClasses: Record<DropdownSide, Record<DropdownAlign, string>> = {
  bottom: {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  },
  top: { start: "left-0", center: "left-1/2 -translate-x-1/2", end: "right-0" },
  right: {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0",
  },
  left: { start: "top-0", center: "top-1/2 -translate-y-1/2", end: "bottom-0" },
};

const originClasses: Record<DropdownSide, Record<DropdownAlign, string>> = {
  bottom: {
    start: "origin-top-left",
    center: "origin-top",
    end: "origin-top-right",
  },
  top: {
    start: "origin-bottom-left",
    center: "origin-bottom",
    end: "origin-bottom-right",
  },
  right: {
    start: "origin-top-left",
    center: "origin-left",
    end: "origin-bottom-left",
  },
  left: {
    start: "origin-top-right",
    center: "origin-right",
    end: "origin-bottom-right",
  },
};

const SubArrow = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="ml-auto h-4 w-4 opacity-60"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const MenuPanel = ({
  items,
  side,
  align,
  onClose,
  reduceMotion,
  isSub,
}: {
  items: DropdownMenuItem[];
  side: DropdownSide;
  align: DropdownAlign;
  onClose: () => void;
  reduceMotion: boolean | null;
  isSub?: boolean;
}) => {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [openSub, setOpenSub] = React.useState<number | null>(null);

  const focusable = () =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[data-menu-item]") ?? [],
    );

  const moveFocus = (dir: 1 | -1) => {
    const nodes = focusable();
    if (nodes.length === 0) return;
    const idx = nodes.indexOf(document.activeElement as HTMLElement);
    const next = (idx + dir + nodes.length) % nodes.length;
    nodes[next]?.focus();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: focus only on mount
  React.useEffect(() => {
    focusable()[0]?.focus();
  }, []);

  const spring = reduceMotion
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 520, damping: 32 } as const);

  return (
    <motion.div
      ref={listRef}
      role="menu"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
      transition={spring}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          moveFocus(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          moveFocus(-1);
        } else if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
      className={`${isSub ? "" : `absolute ${sideClasses[side]} ${alignClasses[side][align]}`} z-popover min-w-52 ${originClasses[side][align]} rounded-xl border border-border bg-background p-1 shadow-xl`}
    >
      {items.map((item, index) => {
        if (item.type === "separator") {
          return (
            <hr
              // biome-ignore lint/suspicious/noArrayIndexKey: positional menu structure
              key={`sep-${index}`}
              className="my-1 border-border border-t-0 border-b"
            />
          );
        }
        if (item.type === "label") {
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: positional menu structure
              key={`label-${index}`}
              className="px-3 pt-2 pb-1 font-medium text-muted-foreground text-xs"
            >
              {item.label}
            </div>
          );
        }
        const hasSub = !!item.submenu?.length;
        const baseClass =
          "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-foreground text-sm outline-none [transition:background-color_120ms_ease] focus:bg-accent hover:bg-accent disabled:pointer-events-none disabled:opacity-40";
        const inner = (
          <>
            {item.icon && (
              <span className="shrink-0 text-muted-foreground">
                {item.icon}
              </span>
            )}
            <span className="flex-1 truncate">{item.label}</span>
            {item.shortcut && (
              <span className="ml-auto text-muted-foreground text-xs tracking-widest">
                {item.shortcut}
              </span>
            )}
            {hasSub && SubArrow}
          </>
        );

        if (hasSub) {
          return (
            // biome-ignore lint/a11y/noStaticElementInteractions: hover region for submenu
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: positional menu structure
              key={`sub-${index}`}
              className="relative"
              onMouseEnter={() => setOpenSub(index)}
              onMouseLeave={() => setOpenSub((v) => (v === index ? null : v))}
            >
              <button
                type="button"
                role="menuitem"
                data-menu-item
                aria-haspopup="menu"
                aria-expanded={openSub === index}
                disabled={item.disabled}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    setOpenSub(index);
                  } else if (e.key === "ArrowLeft") {
                    setOpenSub(null);
                  }
                }}
                onClick={() => setOpenSub(openSub === index ? null : index)}
                className={baseClass}
              >
                {inner}
              </button>
              <AnimatePresence>
                {openSub === index && item.submenu && (
                  <div className="absolute top-0 left-full ml-1">
                    <MenuPanel
                      items={item.submenu}
                      side="right"
                      align="start"
                      onClose={onClose}
                      reduceMotion={reduceMotion}
                      isSub
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        }

        const handleSelect = () => {
          item.onSelect?.();
          onClose();
        };

        if (item.href) {
          return (
            <a
              // biome-ignore lint/suspicious/noArrayIndexKey: positional menu structure
              key={`item-${index}`}
              role="menuitem"
              data-menu-item
              href={item.href}
              onClick={handleSelect}
              className={baseClass}
            >
              {inner}
            </a>
          );
        }
        return (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: positional menu structure
            key={`item-${index}`}
            type="button"
            role="menuitem"
            data-menu-item
            disabled={item.disabled}
            onClick={handleSelect}
            className={baseClass}
          >
            {inner}
          </button>
        );
      })}
    </motion.div>
  );
};

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ trigger, items, side = "bottom", align = "start", className }, ref) => {
    const reduceMotion = useReducedMotion();
    const [open, setOpen] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

    React.useEffect(() => {
      if (!open) return;
      const onDown = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onDown);
      return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    const close = () => {
      setOpen(false);
      triggerRef.current?.focus();
    };

    return (
      <div ref={rootRef} className={`relative inline-block ${className ?? ""}`}>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && !open) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className="inline-flex outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {trigger}
        </button>
        <AnimatePresence>
          {open && (
            <MenuPanel
              items={items}
              side={side}
              align={align}
              onClose={close}
              reduceMotion={reduceMotion}
            />
          )}
        </AnimatePresence>
      </div>
    );
  },
);
DropdownMenu.displayName = "DropdownMenu";

export { DropdownMenu };
