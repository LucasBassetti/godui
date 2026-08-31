"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type ContextMenuItem =
  | { type: "separator" }
  | { type: "label"; label: React.ReactNode }
  | {
      type?: "item";
      label: React.ReactNode;
      icon?: React.ReactNode;
      shortcut?: string;
      disabled?: boolean;
      destructive?: boolean;
      onSelect?: () => void;
    };

export type ContextMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  items: ContextMenuItem[];
  children: React.ReactNode;
};

type Coords = {
  x: number;
  y: number;
  flipX: boolean;
  flipY: boolean;
  viewportWidth: number;
  viewportHeight: number;
};

const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ items, children, className, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    const [coords, setCoords] = React.useState<Coords | null>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

    React.useEffect(() => {
      if (!coords) return;
      const ownerDocument = rootRef.current?.ownerDocument;
      if (!ownerDocument) return;
      const ownerWindow = ownerDocument.defaultView;
      const onDown = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setCoords(null);
        }
      };
      const onScroll = () => setCoords(null);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setCoords(null);
      };
      ownerDocument.addEventListener("mousedown", onDown);
      ownerWindow?.addEventListener("scroll", onScroll, true);
      ownerDocument.addEventListener("keydown", onKey);
      return () => {
        ownerDocument.removeEventListener("mousedown", onDown);
        ownerWindow?.removeEventListener("scroll", onScroll, true);
        ownerDocument.removeEventListener("keydown", onKey);
      };
    }, [coords]);

    React.useEffect(() => {
      if (coords) {
        menuRef.current
          ?.querySelector<HTMLElement>("[data-menu-item]")
          ?.focus();
      }
    }, [coords]);

    const openAt = (clientX: number, clientY: number) => {
      const menuW = 220;
      const menuH = Math.min(items.length * 40 + 12, 360);
      const ownerWindow = rootRef.current?.ownerDocument.defaultView;
      const viewportWidth = ownerWindow?.innerWidth ?? Number.POSITIVE_INFINITY;
      const viewportHeight =
        ownerWindow?.innerHeight ?? Number.POSITIVE_INFINITY;
      const flipX = clientX + menuW > viewportWidth;
      const flipY = clientY + menuH > viewportHeight;
      setCoords({
        x: clientX,
        y: clientY,
        flipX,
        flipY,
        viewportWidth,
        viewportHeight,
      });
    };

    const moveFocus = (dir: 1 | -1) => {
      const nodes = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>("[data-menu-item]") ??
          [],
      );
      if (!nodes.length) return;
      const idx = nodes.indexOf(
        menuRef.current?.ownerDocument.activeElement as HTMLElement,
      );
      nodes[(idx + dir + nodes.length) % nodes.length]?.focus();
    };

    const spring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 520, damping: 32 } as const);

    return (
      <div ref={rootRef} className={className} {...props}>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: right-click capture region */}
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            openAt(e.clientX, e.clientY);
          }}
          className="h-full w-full"
        >
          {children}
        </div>

        <AnimatePresence>
          {coords && (
            <motion.div
              ref={menuRef}
              role="menu"
              initial={
                reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              transition={spring}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  moveFocus(1);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  moveFocus(-1);
                }
              }}
              style={{
                position: "fixed",
                left: coords.flipX ? undefined : coords.x,
                right: coords.flipX
                  ? coords.viewportWidth - coords.x
                  : undefined,
                top: coords.flipY ? undefined : coords.y,
                bottom: coords.flipY
                  ? coords.viewportHeight - coords.y
                  : undefined,
                transformOrigin: `${coords.flipX ? "right" : "left"} ${
                  coords.flipY ? "bottom" : "top"
                }`,
              }}
              className="z-popover min-w-52 rounded-xl border border-border bg-background p-1 shadow-2xl"
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
                return (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: positional menu structure
                    key={`item-${index}`}
                    type="button"
                    role="menuitem"
                    data-menu-item
                    disabled={item.disabled}
                    onClick={() => {
                      item.onSelect?.();
                      setCoords(null);
                    }}
                    className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none [transition:background-color_120ms_ease] focus:bg-accent hover:bg-accent disabled:pointer-events-none disabled:opacity-40 ${
                      item.destructive
                        ? "text-destructive focus:bg-destructive/10 hover:bg-destructive/10"
                        : "text-foreground"
                    }`}
                  >
                    {item.icon && (
                      <span className="shrink-0 opacity-70">{item.icon}</span>
                    )}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut && (
                      <span className="ml-auto text-muted-foreground text-xs tracking-widest">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
ContextMenu.displayName = "ContextMenu";

export { ContextMenu };
