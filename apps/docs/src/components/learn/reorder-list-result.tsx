"use client";

import { ReorderItem, ReorderList } from "@godui/components";
import * as React from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * ReorderList. Grab a row by its handle and drag it up or down.
 */
const INITIAL = [
  { id: "1", label: "Draft proposal" },
  { id: "2", label: "Review with design" },
  { id: "3", label: "Ship to staging" },
  { id: "4", label: "Announce" },
];

export function ReorderListResult() {
  const [items, setItems] = React.useState(INITIAL);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — drag a row by its handle
        </span>
      </div>
      <div className="relative flex min-h-[280px] items-center justify-center p-6 sm:p-10">
        <ReorderList values={items} onReorder={setItems} className="w-72">
          {items.map((item) => (
            <ReorderItem key={item.id} value={item}>
              <span aria-hidden className="text-muted-foreground">
                ⠿
              </span>
              {item.label}
            </ReorderItem>
          ))}
        </ReorderList>
      </div>
    </div>
  );
}
