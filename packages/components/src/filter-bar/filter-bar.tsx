"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type FilterOption = {
  label: string;
  value: string;
  count?: number;
};

export type Facet = {
  id: string;
  label: string;
  options: FilterOption[];
};

export type FilterValue = Record<string, string[]>;

export type FilterBarProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  facets: Facet[];
  value?: FilterValue;
  defaultValue?: FilterValue;
  onChange?: (value: FilterValue) => void;
  /** Show a search box inside each facet popover. */
  searchable?: boolean;
  /** Show option counts. */
  showCounts?: boolean;
};

const CloseIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const PlusIcon = (
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
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      facets,
      value: valueProp,
      defaultValue,
      onChange,
      searchable = true,
      showCounts = true,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState<FilterValue>(
      () => defaultValue ?? {},
    );
    const value = isControlled ? valueProp : internal;
    const [open, setOpen] = React.useState<string | null>(null);
    const [query, setQuery] = React.useState("");
    const rootRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

    React.useEffect(() => {
      if (!open) return;
      const onDown = (e: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(null);
        }
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(null);
      };
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onDown);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);

    const commit = (next: FilterValue) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const toggleOption = (facetId: string, optValue: string) => {
      const current = value[facetId] ?? [];
      const has = current.includes(optValue);
      const nextList = has
        ? current.filter((v) => v !== optValue)
        : [...current, optValue];
      const next = { ...value, [facetId]: nextList };
      if (nextList.length === 0) delete next[facetId];
      commit(next);
    };

    const clearFacet = (facetId: string) => {
      const next = { ...value };
      delete next[facetId];
      commit(next);
    };

    const clearAll = () => commit({});

    const spring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 520, damping: 32 } as const);

    const activeCount = Object.values(value).reduce(
      (sum, list) => sum + list.length,
      0,
    );

    const summarize = (facet: Facet, selected: string[]) => {
      const first = facet.options.find((o) => o.value === selected[0]);
      const firstLabel = first?.label ?? selected[0];
      return selected.length > 1
        ? `${firstLabel} +${selected.length - 1}`
        : firstLabel;
    };

    return (
      <motion.div
        ref={rootRef}
        layout
        className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {facets.map((facet) => {
          const selected = value[facet.id] ?? [];
          const hasSelection = selected.length > 0;
          const isOpen = open === facet.id;
          const filtered = facet.options.filter((o) =>
            o.label.toLowerCase().includes(query.toLowerCase()),
          );
          return (
            <motion.div key={facet.id} layout className="relative">
              <div
                className={`group flex items-center rounded-full border [transition:border-color_150ms_ease,background-color_150ms_ease] ${
                  hasSelection
                    ? "border-foreground/15 bg-accent"
                    : "border-dashed border-border bg-background hover:border-foreground/25 hover:bg-accent/50"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    setQuery("");
                    setOpen(isOpen ? null : facet.id);
                  }}
                  className="flex items-center gap-1.5 rounded-full py-1.5 pr-2 pl-3 font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {!hasSelection && (
                    <span className="text-muted-foreground">{PlusIcon}</span>
                  )}
                  <span
                    className={
                      hasSelection ? "text-foreground" : "text-muted-foreground"
                    }
                  >
                    {facet.label}
                  </span>
                  <AnimatePresence initial={false}>
                    {hasSelection && (
                      <motion.span
                        initial={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, width: 0 }
                        }
                        animate={{ opacity: 1, width: "auto" }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, width: 0 }
                        }
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: 0.2, ease: "easeOut" }
                        }
                        className="flex items-center gap-1.5 overflow-hidden"
                      >
                        <span className="h-3.5 w-px bg-border" />
                        <span className="whitespace-nowrap text-foreground">
                          {summarize(facet, selected)}
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <AnimatePresence>
                  {hasSelection && (
                    <motion.button
                      type="button"
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.6 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.6 }
                      }
                      transition={spring}
                      onClick={() => clearFacet(facet.id)}
                      aria-label={`Clear ${facet.label}`}
                      className="mr-1 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground [transition:background-color_150ms_ease,color_150ms_ease] hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {CloseIcon}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    role="listbox"
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.96, y: -4 }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.96, y: -4 }
                    }
                    transition={spring}
                    className="absolute top-full left-0 z-popover mt-2 w-60 origin-top-left rounded-xl border border-border bg-background p-1.5 shadow-xl"
                  >
                    {searchable && (
                      <input
                        // biome-ignore lint/a11y/noAutofocus: focus the search when the facet popover opens
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Search ${facet.label.toLowerCase()}…`}
                        className="mb-1 w-full rounded-lg border border-border bg-muted px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    )}
                    <ul className="max-h-60 overflow-y-auto">
                      {filtered.length === 0 && (
                        <li className="px-3 py-2 text-muted-foreground text-sm">
                          No matches
                        </li>
                      )}
                      {filtered.map((opt) => {
                        const checked = selected.includes(opt.value);
                        return (
                          <li key={opt.value}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={checked}
                              onClick={() => toggleOption(facet.id, opt.value)}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm [transition:background-color_150ms_ease] hover:bg-accent"
                            >
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border [transition:background-color_150ms_ease,border-color_150ms_ease] ${
                                  checked
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border"
                                }`}
                              >
                                {checked && (
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    className="h-3 w-3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M20 6 9 17l-5-5" />
                                  </svg>
                                )}
                              </span>
                              <span className="flex-1 text-foreground">
                                {opt.label}
                              </span>
                              {showCounts && opt.count !== undefined && (
                                <span className="text-muted-foreground text-xs tabular-nums">
                                  {opt.count}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {activeCount > 0 && (
            <motion.button
              type="button"
              layout
              initial={
                reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              transition={spring}
              onClick={clearAll}
              className="rounded-full px-2.5 py-1.5 font-medium text-muted-foreground text-sm underline-offset-4 [transition:color_150ms_ease] hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Clear all
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);
FilterBar.displayName = "FilterBar";

export { FilterBar };
