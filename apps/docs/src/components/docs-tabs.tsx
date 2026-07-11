"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type DocsTabsProps = {
  tabs: Array<{ value: string; label: string; icon?: ReactNode }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function DocsTabs({ tabs, value, onChange, className }: DocsTabsProps) {
  return (
    <div className={cn("flex gap-6 border-b border-fd-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors",
            value === tab.value
              ? "border-fd-foreground text-fd-foreground"
              : "border-transparent text-fd-muted-foreground hover:text-fd-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

type PillTabsProps = {
  tabs: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function PillTabs({ tabs, value, onChange, className }: PillTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  // Measure the active pill so the floating thumb can slide to it. Pills are
  // variable-width (pnpm/npm/yarn/bun), so the thumb is positioned from the
  // live layout rather than an equal-column grid like <Segmented>.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const active = container?.querySelector<HTMLButtonElement>(
      `[data-value="${CSS.escape(value)}"]`,
    );
    if (!active) return;
    setThumb({
      left: active.offsetLeft,
      top: active.offsetTop,
      width: active.offsetWidth,
      height: active.offsetHeight,
    });
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-wrap gap-1", className)}
    >
      {thumb ? (
        <span
          aria-hidden="true"
          className="absolute rounded-md border border-fd-border bg-[var(--muted)] shadow-sm transition-[transform,width,height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{
            width: thumb.width,
            height: thumb.height,
            transform: `translate(${thumb.left}px, ${thumb.top}px)`,
            top: 0,
            left: 0,
          }}
        />
      ) : null}
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          data-value={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative z-[1] rounded-md px-2.5 py-1 text-sm transition-colors",
            value === tab.value
              ? "text-fd-foreground"
              : "text-fd-muted-foreground hover:text-fd-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Pill-style segmented control (e.g. Preview / Code). Unlike DocsTabs (underline
 * tabs) this renders an enclosed track with a raised active segment.
 */
export function Segmented({ tabs, value, onChange, className }: DocsTabsProps) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.value === value),
  );

  return (
    <div
      className={cn(
        // NB: --color-fd-muted is aliased to muted-foreground in the GodUI
        // theme, so bg-fd-muted renders light in dark mode. Use the real
        // --muted/--card tokens directly for a correct, contrasting track.
        // Grid (not inline-flex) so every segment is an equal-width column —
        // a shrink-to-fit flex track sizes buttons to their content, which
        // makes the half-width thumb misalign with the wider tab.
        "relative inline-grid h-8 rounded-[10px] border border-fd-border bg-[var(--muted)] p-[3px]",
        className,
      )}
      style={{
        gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
      }}
    >
      {/* Floating thumb that slides under the active segment. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-[3px] left-[3px] rounded-[7px] bg-[var(--card)] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{
          // Match the flex-1 button width exactly: track inner width is
          // (100% - 2*3px padding), split n ways. translateX(100%) then steps
          // by one button so the thumb stays centered under each segment.
          width: `calc((100% - 6px) / ${tabs.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            // h-8 track (border-box) leaves a 24px inner area; symmetric
            // py-[3px] + leading-[18px] centers the label vertically without
            // depending on grid row-stretch behavior.
            "relative z-[1] inline-flex items-center justify-center gap-1.5 rounded-[7px] px-3 py-[3px] text-[13px] leading-[18px] font-medium transition-colors",
            value === tab.value
              ? "text-[var(--foreground)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function DocsPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("not-prose", className)}>{children}</div>;
}
