"use client";

import { ScrollStack } from "@godui/components";
import { BarChart3, GitBranch, Rocket } from "lucide-react";

const CARDS = [
  {
    icon: GitBranch,
    eyebrow: "Plan",
    title: "One source of truth",
    body: "Issues, docs, and roadmaps live on a single surface your whole team trusts.",
    stat: "12 projects",
    statLabel: "in sync",
  },
  {
    icon: BarChart3,
    eyebrow: "Track",
    title: "Progress you can see",
    body: "Live insight into velocity and scope — no spreadsheets, no status meetings.",
    stat: "98.2%",
    statLabel: "on-time delivery",
  },
  {
    icon: Rocket,
    eyebrow: "Ship",
    title: "From plan to production",
    body: "Move work from idea to release without losing the thread along the way.",
    stat: "240ms",
    statLabel: "median deploy",
  },
];

export function ScrollStackDemo() {
  return (
    <ScrollStack
      height="30rem"
      pinTop="10%"
      className="w-full max-w-md rounded-2xl border border-border bg-muted/30"
    >
      {CARDS.map(({ icon: Icon, ...c }) => (
        <article
          key={c.title}
          className="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 ring-inset">
              <Icon className="size-[18px]" strokeWidth={2} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {c.eyebrow}
            </span>
          </div>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            {c.title}
          </h3>
          <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
            {c.body}
          </p>
          <div className="mt-7 flex items-baseline gap-2 border-t border-border pt-5">
            <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {c.stat}
            </span>
            <span className="text-sm text-muted-foreground">{c.statLabel}</span>
          </div>
        </article>
      ))}
    </ScrollStack>
  );
}
