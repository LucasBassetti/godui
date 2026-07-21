"use client";

import { ProgressiveCardReveal } from "@godui/components";
import * as React from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * ProgressiveCardReveal. Click a collapsed pill and watch it expand while
 * its neighbours funnel to make room.
 */
type Leg = {
  icon: string;
  label: string;
  meta: string;
  distance: string;
  time: string;
};

const LEGS: Leg[] = [
  {
    icon: "✈️",
    label: "Flight",
    meta: "~3 hours",
    distance: "2,400 miles",
    time: "~3 hours",
  },
  {
    icon: "🚆",
    label: "Train",
    meta: "~12 hours",
    distance: "1,100 miles",
    time: "~12 hours",
  },
  {
    icon: "🚗",
    label: "Driving",
    meta: "~18 hours",
    distance: "332 miles",
    time: "~18 hours",
  },
  {
    icon: "🚴",
    label: "Cycling",
    meta: "~2 days",
    distance: "60 miles",
    time: "~2 days",
  },
];

export function ProgressiveCardRevealResult() {
  const [active, setActive] = React.useState(0);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — click a collapsed pill
        </span>
      </div>
      <div className="relative flex min-h-[280px] items-center justify-center p-6 sm:p-10">
        <ProgressiveCardReveal
          activeIndex={active}
          onActiveChange={setActive}
          className="w-full max-w-[360px]"
        >
          {LEGS.map((leg) => (
            <ProgressiveCardReveal.Card key={leg.label}>
              <ProgressiveCardReveal.CardCollapsed>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 font-medium">
                    <span aria-hidden>{leg.icon}</span>
                    {leg.label}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {leg.meta}
                  </span>
                </div>
              </ProgressiveCardReveal.CardCollapsed>
              <ProgressiveCardReveal.CardExpanded>
                <div className="flex flex-col gap-4">
                  <span className="flex items-center gap-2 font-medium">
                    <span aria-hidden>{leg.icon}</span>
                    {leg.label}
                  </span>
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wide">
                        Distance
                      </p>
                      <p className="font-semibold text-2xl">{leg.distance}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs uppercase tracking-wide">
                        Time
                      </p>
                      <p className="font-semibold text-2xl">{leg.time}</p>
                    </div>
                  </div>
                </div>
              </ProgressiveCardReveal.CardExpanded>
            </ProgressiveCardReveal.Card>
          ))}
        </ProgressiveCardReveal>
      </div>
    </div>
  );
}
