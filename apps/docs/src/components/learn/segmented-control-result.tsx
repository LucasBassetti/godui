"use client";

import { SegmentedControl, type SegmentedOption } from "@godui/components";
import { CalendarDays, CalendarRange, Sun } from "lucide-react";
import { useState } from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * Segmented Control. Click between options and feel the pill spring to the
 * new tab instead of cross-fading in place.
 */
const OPTIONS: SegmentedOption[] = [
  { label: "Day", value: "day", icon: <Sun className="size-3.5" /> },
  { label: "Week", value: "week", icon: <CalendarDays className="size-3.5" /> },
  {
    label: "Month",
    value: "month",
    icon: <CalendarRange className="size-3.5" />,
  },
];

export function SegmentedControlResult() {
  const [view, setView] = useState("week");

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — click between options
        </span>
      </div>
      <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 p-10">
        <SegmentedControl options={OPTIONS} value={view} onChange={setView} />
        <p className="text-muted-foreground text-xs">
          Viewing <span className="text-foreground">{view}</span> range
        </p>
      </div>
    </div>
  );
}
