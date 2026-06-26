"use client";

import { SimulatedCursors } from "@godui/components";

export function LiveCursorsDemo() {
  return (
    <div className="relative mx-auto h-[400px] w-full overflow-hidden rounded-2xl border border-border bg-[radial-gradient(oklch(0.7_0_0/0.12)_1px,transparent_1px)] [background-size:18px_18px]">
      {/* A mock collaborative canvas */}
      <div className="pointer-events-none absolute inset-0 p-6">
        <div className="flex flex-wrap gap-4">
          <div className="h-28 w-44 rounded-xl border border-border bg-card shadow-sm" />
          <div className="h-28 w-60 rounded-xl border border-border bg-card shadow-sm" />
          <div className="h-36 w-40 rounded-xl border border-border bg-card shadow-sm" />
          <div className="h-24 w-52 rounded-xl border border-border bg-card shadow-sm" />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Four teammates are exploring this canvas in real time.
        </p>
      </div>
      <SimulatedCursors names={["Ana", "Marco", "Priya", "Jules"]} />
    </div>
  );
}
