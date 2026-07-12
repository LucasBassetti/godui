"use client";

import { ProgressiveCardReveal } from "@godui/components";
import * as React from "react";

type Leg = {
  icon: string;
  label: string;
  meta: string;
  distance: string;
  time: string;
};

const legs: Leg[] = [
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
    time: "~2 hours",
  },
  {
    icon: "🚴",
    label: "Cycling",
    meta: "~2 days",
    distance: "60 miles",
    time: "~2 days",
  },
  {
    icon: "🚶",
    label: "Walking",
    meta: "~40 minutes",
    distance: "2 miles",
    time: "~40 minutes",
  },
];

export function ProgressiveCardRevealDemo() {
  const [active, setActive] = React.useState(4);

  return (
    <ProgressiveCardReveal
      activeIndex={active}
      onActiveChange={setActive}
      className="w-full max-w-[360px] max-sm:mx-4"
    >
      {legs.map((leg) => (
        <ProgressiveCardReveal.Card key={leg.label}>
          <ProgressiveCardReveal.CardCollapsed>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 font-medium">
                <span aria-hidden>{leg.icon}</span>
                {leg.label}
              </span>
              <span className="text-sm text-muted-foreground">{leg.meta}</span>
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
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Distance
                  </p>
                  <p className="text-3xl font-semibold">{leg.distance}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Time
                  </p>
                  <p className="text-3xl font-semibold">{leg.time}</p>
                </div>
              </div>
            </div>
          </ProgressiveCardReveal.CardExpanded>
        </ProgressiveCardReveal.Card>
      ))}
    </ProgressiveCardReveal>
  );
}
