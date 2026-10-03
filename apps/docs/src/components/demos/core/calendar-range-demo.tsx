"use client";

import { Calendar } from "@godui/components";
import * as React from "react";

/** react-day-picker's `DateRange` (the docs app doesn't depend on it directly). */
type DateRange = { from: Date | undefined; to?: Date | undefined };

export function CalendarRangeDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    const from = new Date();
    const to = new Date(from);
    to.setDate(from.getDate() + 9);
    return { from, to };
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
