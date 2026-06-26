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

type Coords = { x: number; y: number; flipX: boolean; flipY: boolean };

const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ items, children, className, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    const [coords, setCoords] = React.useState<Coords | null>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!coords) return;
      const onDown = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setCoords(null);
        }
      };
      const onScroll = () => setCoords(null);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setCoords(null);
      };
      document.addEventListener("mousedown", onDown);
      window.addEventListener("scroll", onScroll, true);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onDown);
        window.removeEventListener("scroll", onScroll, true);
        document.removeEventListener("keydown", onKey);
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
      const flipX = clientX + menuW > window.innerWidth;
      const flipY = clientY + menuH > window.innerHeight;
      setCoords({ x: clientX, y: clientY, flipX, flipY });
    };

    const moveFocus = (dir: 1 | -1) => {
      const nodes = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>("[data-menu-item]") ??
          [],
      );
      if (!nodes.length) return;
      const idx = nodes.indexOf(document.activeElement as HTMLElement);
      nodes[(idx + dir + nodes.length) % nodes.length]?.focus();
    };

    const spring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 520, damping: 32 } as const);

    return (
      <div ref={ref} className={className} {...props}>
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
                right: coords.flipX ? window.innerWidth - coords.x : undefined,
                top: coords.flipY ? undefined : coords.y,
                bottom: coords.flipY
                  ? window.innerHeight - coords.y
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
