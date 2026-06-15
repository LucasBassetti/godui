"use client";

import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type DocsTabsProps = {
  tabs: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function DocsTabs({
  tabs,
  value,
  onChange,
  className,
}: DocsTabsProps) {
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

export function DocsPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("not-prose", className)}>{children}</div>;
}
