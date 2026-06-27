"use client";

import { FluidCursor } from "@godui/components";
import * as React from "react";

export function FluidCursorDemo() {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="relative grid h-72 w-full cursor-none place-items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card"
    >
      <p className="text-lg font-semibold">Move your pointer inside the card</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Hover me
        </button>
        <span
          data-cursor
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          Or me
        </span>
      </div>
      <FluidCursor containerRef={ref} />
    </div>
  );
}
