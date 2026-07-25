"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type ComboboxOption = {
  label: string;
  value: string;
  description?: string;
};

export type ComboboxProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  /** Static option list. Ignored when `onSearch` is provided. */
  options?: ComboboxOption[];
  /** Async resolver. Return options for a query. */
  onSearch?: (query: string) => Promise<ComboboxOption[]>;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  emptyMessage?: string;
  /** Disable the input and prevent opening the listbox. */
  disabled?: boolean;
  onChange?: (value: string, option: ComboboxOption) => void;
  /** When false, render a plain click-to-open dropdown (no type-ahead filtering)
   *  — a drop-in for a fixed-enum `<select>`. Defaults smart: searchable once the
   *  option count exceeds `searchableThreshold`. */
  searchable?: boolean;
  /** Option count above which search auto-enables when `searchable` is unset.
   *  Defaults to `COMBOBOX_SEARCHABLE_THRESHOLD` (5). */
  searchableThreshold?: number;
};

/** Lists longer than this auto-enable the type-ahead input; shorter lists render
 *  as a plain click-to-open dropdown. Override per-instance with
 *  `searchableThreshold`, or change here to retune globally. */
export const COMBOBOX_SEARCHABLE_THRESHOLD = 5;

function highlight(label: string, query: string) {
  if (!query) return label;
  const idx = label.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return label;
  return (
    <>
      {label.slice(0, idx)}
      <mark className="bg-transparent font-semibold text-foreground">
        {label.slice(idx, idx + query.length)}
      </mark>
      {label.slice(idx + query.length)}
    </>
  );
}

const Spinner = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 animate-spin text-muted-foreground"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M21 12a9 9 0 1 1-6.2-8.6" />
  </svg>
);

const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options: staticOptions,
      onSearch,
      value: valueProp,
      defaultValue,
      placeholder = "Search…",
      emptyMessage = "No results",
      disabled = false,
      onChange,
      searchable,
      searchableThreshold = COMBOBOX_SEARCHABLE_THRESHOLD,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const listboxId = React.useId();
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState(defaultValue ?? "");
    const value = isControlled ? valueProp : internal;

    const allOptions = React.useMemo(
      () => staticOptions ?? [],
      [staticOptions],
    );
    const selectedOption = allOptions.find((o) => o.value === value);

    // Smart default: async search is always searchable; otherwise honor an
    // explicit `searchable`, else auto-enable it past the threshold.
    const isSearchable =
      onSearch != null
        ? true
        : (searchable ?? allOptions.length > searchableThreshold);

    const [query, setQuery] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [asyncResults, setAsyncResults] = React.useState<ComboboxOption[]>(
      [],
    );
    const rootRef = React.useRef<HTMLDivElement>(null);
    const reqId = React.useRef(0);
    const typeahead = React.useRef({ buf: "", at: 0 });

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

    // async search
    React.useEffect(() => {
      if (!onSearch || !open) return;
      const id = ++reqId.current;
      setLoading(true);
      const t = setTimeout(() => {
        onSearch(query).then((res) => {
          if (id === reqId.current) {
            setAsyncResults(res);
            setLoading(false);
            setActive(0);
          }
        });
      }, 180);
      return () => clearTimeout(t);
    }, [query, onSearch, open]);

    const results = onSearch
      ? asyncResults
      : allOptions.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        );

    const commit = (opt: ComboboxOption) => {
      if (!isControlled) setInternal(opt.value);
      onChange?.(opt.value, opt);
      setQuery("");
      setOpen(false);
    };

    // Keyboard for the non-searchable trigger button (a plain <select>-like control).
    const onButtonKeyDown = (e: React.KeyboardEvent) => {
      if (!open) {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
          e.preventDefault();
          setActive(
            Math.max(
              0,
              results.findIndex((o) => o.value === value),
            ),
          );
          setOpen(true);
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setActive(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActive(results.length - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (results[active]) commit(results[active]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key.length === 1) {
        // First-letter type-ahead, matching a native <select>.
        const recent = Date.now() - typeahead.current.at < 600;
        const buf = recent ? typeahead.current.buf + e.key : e.key;
        typeahead.current = { buf, at: Date.now() };
        const idx = results.findIndex((o) =>
          o.label.toLowerCase().startsWith(buf.toLowerCase()),
        );
        if (idx >= 0) setActive(idx);
      }
    };

    const spring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 520, damping: 32 } as const);

    return (
      <div
        ref={rootRef}
        className={`relative w-72 ${className ?? ""}`}
        {...props}
      >
        {!isSearchable ? (
          // Non-searchable: a plain click-to-open dropdown (drop-in for <select>).
          <button
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            disabled={disabled}
            onClick={() => !disabled && setOpen((o) => !o)}
            onKeyDown={onButtonKeyDown}
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-left text-foreground text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={`truncate ${selectedOption ? "text-foreground" : "text-muted-foreground"}`}
            >
              {selectedOption?.label ?? placeholder}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        ) : (
          <div className="relative">
            <input
              role="combobox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-autocomplete="list"
              disabled={disabled}
              value={open ? query : (selectedOption?.label ?? query)}
              placeholder={placeholder}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setOpen(true);
                  setActive((a) => Math.min(a + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter" && open && results[active]) {
                  e.preventDefault();
                  commit(results[active]);
                } else if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-9 text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="-translate-y-1/2 absolute top-1/2 right-3">
              {loading ? (
                Spinner
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 21l-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
                </svg>
              )}
            </span>
          </div>
        )}

        <AnimatePresence>
          {open && (
            <motion.ul
              id={listboxId}
              role="listbox"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, y: -4 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, y: -4 }
              }
              transition={spring}
              className="absolute top-full left-0 z-popover mt-2 max-h-72 w-full origin-top overflow-y-auto rounded-xl border border-border bg-background p-1 shadow-xl"
            >
              {!loading && results.length === 0 && (
                <li className="px-3 py-6 text-center text-muted-foreground text-sm">
                  {emptyMessage}
                </li>
              )}
              {results.map((opt, i) => {
                const isActive = i === active;
                const isSelected = opt.value === value;
                return (
                  <motion.li
                    key={opt.value}
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduceMotion ? 0 : i * 0.02 }}
                    role="option"
                    aria-label={opt.label}
                    aria-selected={isSelected}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => commit(opt)}
                    className={`flex cursor-pointer items-start gap-2 rounded-lg px-3 py-2 text-sm [transition:background-color_120ms_ease] ${
                      isActive ? "bg-accent" : ""
                    }`}
                  >
                    <span className="flex-1">
                      <span className="block text-foreground">
                        {highlight(opt.label, query)}
                      </span>
                      {opt.description && (
                        <span className="block text-muted-foreground text-xs">
                          {opt.description}
                        </span>
                      )}
                    </span>
                    {isSelected && (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
Combobox.displayName = "Combobox";

export { Combobox };
