"use client";

import { ThemeToggle } from "@godui/components";

export function ThemeToggleDemo() {
  return (
    <div className="flex w-full max-w-sm items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="space-y-0.5">
        <div className="text-sm font-semibold text-foreground">Appearance</div>
        <div className="text-xs text-muted-foreground">
          The theme wipes in from your click.
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
}
