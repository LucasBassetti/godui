"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type ComboboxOption = {
  label: string;
  value: string;
  description?: string;
};

/** A non-option affordance rendered inside the listbox (e.g. a pinned top row or
 *  an empty-state CTA). `onSelect` receives the current (trimmed) query. */
export type ComboboxAction = {
  label: React.ReactNode;
  onSelect: (query: string) => void;
};

export type ComboboxProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue" | "onToggle"
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
  /** Multi-select mode: chosen options render as chips in the control and
   *  picking one keeps the list open. Drive it with `values` + `onToggle`. */
  multiple?: boolean;
  /** Selected values (multi-select). */
  values?: string[];
  /** Toggle handler (multi-select). */
  onToggle?: (value: string, option: ComboboxOption) => void;
  /** Offer the typed value as an "Add …" row when it isn't already an option, so
   *  free entry works alongside the suggestions. Implies a searchable input. */
  creatable?: boolean;
  /** Persist a newly-typed value instead of committing a synthetic option.
   *  Receives the trimmed label. */
  onCreate?: (label: string) => void | Promise<void>;
  /** Spinner + disabled state on the create row while a create is in flight. */
  creating?: boolean;
  /** When false, render a plain click-to-open dropdown (no type-ahead filtering)
   *  — a drop-in for a fixed-enum `<select>`. Defaults smart: searchable once the
   *  option count exceeds `searchableThreshold`. Ignored when a feature that needs
   *  a text query is on (`onSearch`, `creatable`, `emptyAction`, `multiple`). */
  searchable?: boolean;
  /** Option count above which search auto-enables when `searchable` is unset.
   *  Defaults to `COMBOBOX_SEARCHABLE_THRESHOLD` (5). */
  searchableThreshold?: number;
  /** A persistent row shown at the top of the list — a place for a "manage" or
   *  "create" affordance that's always reachable, whatever the query. */
  pinnedAction?: ComboboxAction;
  /** A call-to-action button shown in the empty state — e.g. to create or invite
   *  the thing the user was searching for. Implies a searchable input. */
  emptyAction?: ComboboxAction;
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

const SearchIcon = (
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
);

const CheckIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 text-primary"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
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
      multiple = false,
      values,
      onToggle,
      creatable = false,
      onCreate,
      creating = false,
      searchable,
      searchableThreshold = COMBOBOX_SEARCHABLE_THRESHOLD,
      pinnedAction,
      emptyAction,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const listboxId = React.useId();
    const inputId = React.useId();
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState(defaultValue ?? "");
    const value = isControlled ? valueProp : internal;

    const selectedValues = React.useMemo(() => values ?? [], [values]);

    const allOptions = React.useMemo(
      () => staticOptions ?? [],
      [staticOptions],
    );
    const selectedOption = allOptions.find((o) => o.value === value);

    // Smart default: features that need a typed query force the input; otherwise
    // honor an explicit `searchable`, else auto-enable past the threshold.
    const isSearchable =
      onSearch != null || multiple || creatable || emptyAction != null
        ? true
        : (searchable ?? allOptions.length > searchableThreshold);

    const [query, setQuery] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [asyncResults, setAsyncResults] = React.useState<ComboboxOption[]>(
      [],
    );
    // Drive the create-row spinner from the pending `onCreate` promise even when
    // the parent doesn't wire the `creating` prop, so the click always reacts.
    const [creatingInternal, setCreatingInternal] = React.useState(false);
    const isCreating = creating || creatingInternal;
    // Polite live-region text so screen readers hear the create/select outcome.
    const [liveMessage, setLiveMessage] = React.useState("");
    // Brief success flash: the trailing search icon morphs to a check, then back.
    const [createdFlash, setCreatedFlash] = React.useState(false);
    const flashTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const flashCreated = () => {
      setCreatedFlash(true);
      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setCreatedFlash(false), 1300);
    };
    React.useEffect(() => () => clearTimeout(flashTimer.current), []);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const reqId = React.useRef(0);
    // The query the current asyncResults belong to, so reopening the popup with
    // the same query doesn't reflash the spinner or refetch.
    const fetchedQuery = React.useRef<string | null>(null);
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
      // Results for this query are already loaded — reopening must not reflash
      // the spinner or refetch.
      if (fetchedQuery.current === query) return;
      const id = ++reqId.current;
      setLoading(true);
      const t = setTimeout(() => {
        onSearch(query).then((res) => {
          if (id === reqId.current) {
            setAsyncResults(res);
            fetchedQuery.current = query;
            setLoading(false);
            setActive(0);
          }
        });
      }, 180);
      return () => clearTimeout(t);
    }, [query, onSearch, open]);

    const matches = onSearch
      ? asyncResults
      : allOptions.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        );

    // Creatable: offer the typed value as a "create" row when it isn't already
    // an option, so free entry works alongside the suggestions.
    const trimmedQuery = query.trim();
    const canCreate =
      creatable &&
      trimmedQuery.length > 0 &&
      !matches.some(
        (o) => o.label.toLowerCase() === trimmedQuery.toLowerCase(),
      );
    const createRow: ComboboxOption = {
      value: trimmedQuery,
      label: trimmedQuery,
    };
    // Create row goes last so the default highlight (and Enter) prefer a real
    // match over creating.
    const results: ComboboxOption[] = canCreate
      ? [...matches, createRow]
      : matches;

    // Keep the active index in range as the result list changes size.
    React.useEffect(() => {
      setActive((a) => Math.min(a, Math.max(0, results.length - 1)));
    }, [results.length]);

    // Chip labels resolve from options ∪ a small cache of chosen items, so a
    // selection still names itself when the query filters it out.
    const labelCacheRef = React.useRef(new Map<string, string>());
    React.useEffect(() => {
      for (const o of results) labelCacheRef.current.set(o.value, o.label);
    }, [results]);
    const chipLabel = (v: string) =>
      allOptions.find((o) => o.value === v)?.label ??
      labelCacheRef.current.get(v) ??
      v;
    // The selected option's label — resolved from the cache too, so an async
    // pick (whose option never lives in `options`) still names itself.
    const selectedLabel =
      selectedOption?.label ??
      (value ? labelCacheRef.current.get(value) : undefined);

    const runCreate = async () => {
      if (isCreating) return;
      const created = trimmedQuery;
      if (onCreate) {
        // Keep the popup open with an in-row spinner while the create is in
        // flight; only close once it resolves. On error the row simply returns
        // to its idle state (the popup never silently vanishes).
        try {
          setCreatingInternal(true);
          await onCreate(created);
          setLiveMessage(`Created “${created}”`);
          flashCreated();
          setQuery("");
          setOpen(false);
        } finally {
          setCreatingInternal(false);
        }
      } else {
        // No handler: commit the typed value as a synthetic option.
        setLiveMessage(`Created “${created}”`);
        flashCreated();
        commit({ value: created, label: created });
      }
    };

    const commit = (opt: ComboboxOption) => {
      // Identity check (not a magic value) so a real option whose value happens
      // to match the query can't be mistaken for the create row.
      if (opt === createRow) {
        void runCreate();
        return;
      }
      if (multiple) {
        labelCacheRef.current.set(opt.value, opt.label);
        onToggle?.(opt.value, opt);
        setQuery("");
        setActive(0);
        inputRef.current?.focus();
        return;
      }
      if (!isControlled) setInternal(opt.value);
      onChange?.(opt.value, opt);
      setQuery("");
      setOpen(false);
    };

    const onInputKeyDown = (e: React.KeyboardEvent) => {
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
        <span aria-live="polite" role="status" className="sr-only">
          {liveMessage}
        </span>
        {multiple ? (
          // A <label> tied to the input by `htmlFor` so clicking the empty chip
          // area focuses the input (opening the list via onFocus). The explicit
          // association is required: a bare <label> proxies clicks to its first
          // labelable descendant — a chip's remove button — silently toggling it off.
          <label
            htmlFor={inputId}
            className="flex min-h-[2.75rem] w-full flex-wrap items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 py-2 text-sm focus-within:ring-2 focus-within:ring-ring"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {selectedValues.map((v) => (
                <motion.span
                  key={v}
                  layout
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }
                  }
                  transition={spring}
                  className="inline-flex items-center gap-1 rounded-md bg-accent py-1 pr-1 pl-2 font-medium text-accent-foreground text-xs"
                >
                  {chipLabel(v)}
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Remove ${chipLabel(v)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!disabled)
                        onToggle?.(v, { value: v, label: chipLabel(v) });
                    }}
                    className="-mr-0.5 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground [transition:color_120ms_ease,background-color_120ms_ease,scale_120ms_ease] hover:scale-110 hover:bg-foreground/10 hover:text-foreground active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="size-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            <input
              ref={inputRef}
              id={inputId}
              role="combobox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-autocomplete="list"
              disabled={disabled}
              value={query}
              placeholder={selectedValues.length === 0 ? placeholder : ""}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onInputKeyDown}
              className="min-w-[6rem] flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
        ) : isSearchable ? (
          <div className="relative">
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-autocomplete="list"
              disabled={disabled}
              value={
                open
                  ? query
                  : (selectedLabel ?? (creatable ? (value ?? "") : query))
              }
              placeholder={placeholder}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onInputKeyDown}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-9 text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="-translate-y-1/2 absolute top-1/2 right-3 flex">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={loading ? "spin" : createdFlash ? "check" : "search"}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }
                  }
                  transition={
                    reduceMotion ? { duration: 0 } : { duration: 0.14 }
                  }
                  className="flex"
                >
                  {loading ? Spinner : createdFlash ? CheckIcon : SearchIcon}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        ) : (
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
              className={`truncate ${selectedLabel ? "text-foreground" : "text-muted-foreground"}`}
            >
              {selectedLabel ?? placeholder}
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
        )}

        <AnimatePresence>
          {open && (
            <motion.ul
              id={listboxId}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              aria-busy={loading || undefined}
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
              {pinnedAction && (
                <li className="mb-1 border-border border-b pb-1">
                  <button
                    type="button"
                    onClick={() => pinnedAction.onSelect(query.trim())}
                    className="w-full rounded-lg px-3 py-2 text-left font-medium text-primary text-sm hover:bg-accent"
                  >
                    {pinnedAction.label}
                  </button>
                </li>
              )}
              {loading && results.length === 0 && (
                <li className="flex items-center justify-center gap-2 px-3 py-6 text-muted-foreground text-sm">
                  {Spinner}
                  <span>Searching…</span>
                </li>
              )}
              {!loading && results.length === 0 && (
                <li className="px-3 py-6 text-center text-muted-foreground text-sm">
                  <div>{emptyMessage}</div>
                  {emptyAction && (
                    <button
                      type="button"
                      onClick={() => emptyAction.onSelect(query.trim())}
                      className="mt-2 rounded-lg px-3 py-1.5 font-medium text-primary text-sm hover:bg-accent"
                    >
                      {emptyAction.label}
                    </button>
                  )}
                </li>
              )}
              {results.map((opt, i) => {
                const isActive = i === active;
                const isCreate = opt === createRow;
                const isSelected = isCreate
                  ? false
                  : multiple
                    ? selectedValues.includes(opt.value)
                    : opt.value === value;
                return (
                  <motion.li
                    key={isCreate ? "__create_row__" : opt.value}
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduceMotion ? 0 : i * 0.02 }}
                    role="option"
                    aria-label={isCreate ? `Add ${opt.label}` : opt.label}
                    aria-selected={isSelected}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => commit(opt)}
                    className={`flex cursor-pointer items-start gap-2 rounded-lg px-3 py-2 text-sm [transition:background-color_120ms_ease] ${
                      isActive ? "bg-accent" : ""
                    }`}
                  >
                    {isCreate ? (
                      <span className="flex flex-1 items-center gap-1.5 text-primary">
                        {isCreating ? (
                          Spinner
                        ) : (
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="size-4 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        )}
                        <span className="block truncate">
                          {isCreating ? "Adding" : "Create"}{" "}
                          <span className="font-semibold">
                            &ldquo;{opt.label}&rdquo;
                          </span>
                        </span>
                      </span>
                    ) : (
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
                    )}
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
