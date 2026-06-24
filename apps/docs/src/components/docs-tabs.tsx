"use client";

import type { ReactNode } from "react";
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
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-sm transition-colors",
            value === tab.value
              ? "bg-fd-background text-fd-foreground shadow-sm"
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
  return (
    <div
      className={cn(
        // NB: --color-fd-muted is aliased to muted-foreground in the GodUI
        // theme, so bg-fd-muted renders light in dark mode. Use the real
        // --muted/--card tokens directly for a correct, contrasting track.
        "inline-flex gap-0.5 rounded-[10px] border border-fd-border bg-[var(--muted)] p-[3px]",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-[7px] px-3 py-1 text-[13px] font-medium transition-colors",
            value === tab.value
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
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
