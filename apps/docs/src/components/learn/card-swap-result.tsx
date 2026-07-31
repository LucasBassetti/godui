"use client";

import { CardSwap } from "@godui/components";
import { Activity, Globe, ScrollText, Zap } from "lucide-react";
import { useBareScene } from "@/components/learn/bare-scene-context";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `CardSwap`. Watch it auto-advance, hover to pause, or use the arrows; move
 * the pointer across the stack for the tilt.
 */
const FEATURES = [
  {
    icon: Zap,
    title: "Realtime sync",
    body: "Every change lands instantly across every device and teammate.",
  },
  {
    icon: Activity,
    title: "Built-in analytics",
    body: "Understand usage without wiring up a single event by hand.",
  },
  {
    icon: Globe,
    title: "Edge delivery",
    body: "Served from the region closest to each request, every time.",
  },
  {
    icon: ScrollText,
    title: "Audit logs",
    body: "Know who did what, and when — exportable on demand.",
  },
];

function CardSwapResultBody() {
  return (
    <CardSwap className="h-72 w-80">
      {FEATURES.map(({ icon: Icon, ...f }) => (
        <div
          key={f.title}
          className="flex h-full w-full flex-col justify-between rounded-2xl border border-border bg-card p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 ring-inset">
            <Icon className="size-5" strokeWidth={2} />
          </span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {f.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {f.body}
            </p>
          </div>
        </div>
      ))}
    </CardSwap>
  );
}

export function CardSwapResult() {
  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center p-6">
        <CardSwapResultBody />
      </div>
    );
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover to pause, sweep to tilt
        </span>
      </div>
      <div className="flex min-h-[340px] items-center justify-center p-10">
        <CardSwapResultBody />
      </div>
    </div>
  );
}
