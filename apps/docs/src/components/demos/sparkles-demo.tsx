"use client";

import { Sparkles } from "@godui/components";

export function SparklesDemo() {
  return (
    <Sparkles className="flex h-60 w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-border bg-card">
      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
        ✨ Introducing GodUI
      </span>
      <h2 className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent">
        Build with a little magic
      </h2>
    </Sparkles>
  );
}
