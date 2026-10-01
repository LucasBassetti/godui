"use client";

import { Calendar } from "@godui/components";
import * as React from "react";

export function CalendarDropdownDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown"
      className="rounded-md border shadow-sm"
    />
  );
}
