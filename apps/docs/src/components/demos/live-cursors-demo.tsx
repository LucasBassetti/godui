"use client";

import { SimulatedCursors } from "@godui/components";

export function LiveCursorsDemo() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(oklch(0.7_0_0/0.12)_1px,transparent_1px)] px-6 [background-size:18px_18px]">
      {/* Centered play area — kept clear of the stage header chrome (title,
          breadcrumb, badges top-left; controls top-right) by living in a
          vertically-centered band, and the cursors roam only inside it. */}
      <div className="relative h-[64%] w-full max-w-2xl">
        {/* A mock collaborative canvas */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-4">
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
    </div>
  );
}
