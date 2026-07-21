"use client";

import { ScrollReveal } from "@godui/components";

/**
 * Closing panel — real ScrollReveal cards with a short stagger so the
 * reader can scroll the page (or just land on the panel) and feel the spring.
 */

const CARDS = [0, 1, 2] as const;

export function ScrollRevealResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll into view
        </span>
      </div>
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 p-8 md:p-12">
        {CARDS.map((i) => (
          <ScrollReveal key={i} delay={i * 0.1} className="w-full max-w-sm">
            <div className="flex h-16 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
              <span className="h-2 w-24 rounded-full bg-foreground/25" />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
