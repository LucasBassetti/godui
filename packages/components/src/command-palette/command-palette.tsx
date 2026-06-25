"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { createPortal } from "react-dom";

export type CommandItem = {
  /** Stable id. */
  id: string;
  /** Visible label. */
  label: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Optional shortcut hint rendered on the right (e.g. "⌘P"). */
  shortcut?: string;
  /** Extra terms to match against when filtering. */
  keywords?: string[];
  /** Invoked when the item is chosen. */
  onSelect?: () => void;
};

export type CommandGroup = {
  /** Optional group heading. */
  heading?: string;
  items: CommandItem[];
};

export type CommandPaletteProps = {
  /** Controlled open state. */
  open: boolean;
  /** Called when the palette opens or closes. */
  onOpenChange: (open: boolean) => void;
  /** Grouped commands to show. */
  groups: CommandGroup[];
  /** Input placeholder. */
  placeholder?: string;
  /** Toggle the palette with ⌘K / Ctrl+K. */
  enableShortcut?: boolean;
};

function matches(item: CommandItem, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    item.label.toLowerCase().includes(q) ||
    item.keywords?.some((k) => k.toLowerCase().includes(q)) === true
  );
}

function useMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open,
      onOpenChange,
      groups,
      placeholder = "Type a command or search…",
      enableShortcut = true,
    },
    ref,
  ) => {
    const mounted = useMounted();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [query, setQuery] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(0);

    const filteredGroups = React.useMemo(
      () =>
        groups
          .map((g) => ({
            ...g,
            items: g.items.filter((i) => matches(i, query)),
          }))
          .filter((g) => g.items.length > 0),
      [groups, query],
    );
    const flat = React.useMemo(
      () => filteredGroups.flatMap((g) => g.items),
      [filteredGroups],
    );

    React.useEffect(() => {
      if (open) {
        setQuery("");
        setActiveIndex(0);
        const id = requestAnimationFrame(() => inputRef.current?.focus());
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          cancelAnimationFrame(id);
          document.body.style.overflow = prevOverflow;
        };
      }
    }, [open]);

    React.useEffect(() => {
      if (!enableShortcut) return;
      const onKey = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          onOpenChange(!open);
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [enableShortcut, open, onOpenChange]);

    const select = (item: CommandItem) => {
      item.onSelect?.();
      onOpenChange(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % Math.max(flat.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(
          (i) => (i - 1 + Math.max(flat.length, 1)) % Math.max(flat.length, 1),
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = flat[activeIndex];
        if (item) select(item);
      }
    };

    if (!mounted) return null;

    let runningIndex = -1;

    return createPortal(
      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-modal flex items-start justify-center p-4 pt-[12vh]">
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.div
              ref={ref}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              data-slot="command-palette"
              initial={{ opacity: 0, scale: 0.96, y: -8, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97, y: -6, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onKeyDown={handleKeyDown}
              className="relative z-raised flex max-h-[60vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <span aria-hidden className="text-muted-foreground">
                  ⌕
                </span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  placeholder={placeholder}
                  className="w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>

              <div className="overflow-y-auto p-2">
                {flat.length === 0 ? (
                  <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No results found.
                  </div>
                ) : (
                  filteredGroups.map((group) => (
                    <div key={group.heading ?? "group"} className="mb-1">
                      {group.heading ? (
                        <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                          {group.heading}
                        </div>
                      ) : null}
                      {group.items.map((item) => {
                        runningIndex += 1;
                        const isActive = runningIndex === activeIndex;
                        const itemIndex = runningIndex;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => select(item)}
                            onMouseMove={() => setActiveIndex(itemIndex)}
                            className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground"
                          >
                            {isActive ? (
                              <motion.span
                                layoutId="command-active"
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 35,
                                }}
                                className="absolute inset-0 rounded-lg bg-accent"
                              />
                            ) : null}
                            {item.icon ? (
                              <span className="relative text-muted-foreground">
                                {item.icon}
                              </span>
                            ) : null}
                            <span className="relative flex-1">
                              {item.label}
                            </span>
                            {item.shortcut ? (
                              <kbd className="relative rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
                                {item.shortcut}
                              </kbd>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>,
      document.body,
    );
  },
);
CommandPalette.displayName = "CommandPalette";

export { CommandPalette };
