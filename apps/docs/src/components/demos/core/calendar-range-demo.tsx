"use client";

import { Calendar } from "@godui/components";
import * as React from "react";

/** react-day-picker's `DateRange` (the docs app doesn't depend on it directly). */
type DateRange = { from: Date | undefined; to?: Date | undefined };

export function CalendarRangeDemo() {
  // The first day picked: hover another to preview the range, click to
  // commit it.
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    const today = new Date();
    return { from: today, to: today };
  });

  return (
    <Calendar
      mode="range"
      defaultMonth={range?.from}
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm"
    />
  );
}
