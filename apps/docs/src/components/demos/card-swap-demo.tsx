"use client";

import { CardSwap } from "@godui/components";
import { Activity, Globe, ScrollText, Zap } from "lucide-react";

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

export function CardSwapDemo() {
  return (
    <div className="grid min-h-[24rem] place-items-center">
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
    </div>
  );
}
