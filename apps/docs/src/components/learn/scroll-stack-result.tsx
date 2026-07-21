"use client";

import { ScrollStack } from "@godui/components";
import { BarChart3, GitBranch, Rocket } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `ScrollStack`. Page scroll through a framed panel is awkward, so this uses
 * the component's own self-contained mode (`height`) instead — it becomes
 * its own scroller and the sticky/scale math works the same either way.
 */
type Card = {
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  eyebrow: string;
  title: string;
  body: string;
};

const CARDS: Card[] = [
  {
    Icon: GitBranch,
    eyebrow: "01 — Plan",
    title: "One source of truth",
    body: "Issues, docs, and roadmaps live on a single surface the team trusts.",
  },
  {
    Icon: BarChart3,
    eyebrow: "02 — Track",
    title: "Progress you can see",
    body: "Live insight into velocity and scope — no status meetings required.",
  },
  {
    Icon: Rocket,
    eyebrow: "03 — Ship",
    title: "From plan to production",
    body: "Move work from idea to release without losing the thread.",
  },
];

export function ScrollStackResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll inside this panel
        </span>
      </div>
      <div className="relative flex min-h-[300px] items-center justify-center p-6 md:p-10">
        <ScrollStack
          height="24rem"
          pinTop="8%"
          className="w-full max-w-md rounded-2xl border border-fd-border bg-[var(--muted)]/30"
        >
          {CARDS.map(({ Icon, eyebrow, title, body }) => (
            <article
              key={title}
              className="flex w-full flex-col rounded-2xl border border-border bg-card p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 ring-inset">
                  <Icon className="size-4" strokeWidth={2} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {eyebrow}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </article>
          ))}
        </ScrollStack>
      </div>
    </div>
  );
}
