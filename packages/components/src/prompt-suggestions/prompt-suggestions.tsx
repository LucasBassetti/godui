"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type PromptSuggestionsVariant = "grid" | "chips" | "list";

export type PromptSuggestion = {
  id?: string;
  /** The text inserted into the composer when chosen. */
  label: string;
  /** Optional secondary line (only shown in grid/list). */
  hint?: string;
  icon?: React.ReactNode;
};

export type PromptSuggestionsProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> & {
  suggestions: PromptSuggestion[];
  onSelect?: (suggestion: PromptSuggestion) => void;
  variant?: PromptSuggestionsVariant;
  /** Render shimmer skeletons instead of items. */
  loading?: boolean;
  /** Number of skeletons while loading. */
  skeletonCount?: number;
};

const CONTAINER_BY_VARIANT: Record<PromptSuggestionsVariant, string> = {
  grid: "grid grid-cols-1 gap-2 sm:grid-cols-2",
  chips: "flex flex-wrap gap-2",
  list: "flex flex-col gap-1.5",
};

const PromptSuggestions = React.forwardRef<
  HTMLDivElement,
  PromptSuggestionsProps
>(
  (
    {
      suggestions,
      onSelect,
      variant = "grid",
      loading = false,
      skeletonCount = 4,
      className,
      ...props
    },
    ref,
  ) => {
    const reduce = useReducedMotion();
    const itemsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

    const focusItem = (index: number) => {
      const list = itemsRef.current.filter(Boolean) as HTMLButtonElement[];
      if (list.length === 0) return;
      const next = (index + list.length) % list.length;
      list[next]?.focus();
    };

    if (loading) {
      return (
        <div
          ref={ref}
          data-slot="prompt-suggestions"
          data-loading=""
          className={`${CONTAINER_BY_VARIANT[variant]} ${className ?? ""}`}
          {...props}
        >
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeletons
              key={i}
              className={`rounded-xl border border-border bg-muted/40 motion-safe:animate-pulse ${variant === "chips" ? "h-9 w-32" : "h-16"}`}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="prompt-suggestions"
        data-variant={variant}
        className={`${CONTAINER_BY_VARIANT[variant]} ${className ?? ""}`}
        {...props}
      >
        {suggestions.map((suggestion, index) => {
          const isChip = variant === "chips";
          return (
            <motion.button
              key={suggestion.id ?? suggestion.label}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              type="button"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduce ? 0 : index * 0.05,
                type: "spring",
                stiffness: 300,
                damping: 24,
              }}
              onClick={() => onSelect?.(suggestion)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                  e.preventDefault();
                  focusItem(index + 1);
                } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  focusItem(index - 1);
                }
              }}
              className={
                isChip
                  ? "group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground shadow-2xs transition-[transform,background-color,border-color] hover:-translate-y-px hover:border-ring hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  : "group flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 text-left shadow-2xs transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-ring hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              }
            >
              {suggestion.icon ? (
                <span
                  className={`shrink-0 text-muted-foreground transition-colors group-hover:text-primary ${isChip ? "" : "mt-0.5"}`}
                >
                  {suggestion.icon}
                </span>
              ) : null}
              <span className="min-w-0">
                <span
                  className={`block truncate text-sm font-medium text-foreground ${isChip ? "" : ""}`}
                >
                  {suggestion.label}
                </span>
                {suggestion.hint && !isChip ? (
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {suggestion.hint}
                  </span>
                ) : null}
              </span>
              {!isChip ? (
                <ArrowIcon className="ml-auto size-4 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-[transform,opacity] group-hover:translate-x-0 group-hover:opacity-100" />
              ) : null}
            </motion.button>
          );
        })}
      </div>
    );
  },
);
PromptSuggestions.displayName = "PromptSuggestions";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export { PromptSuggestions };
