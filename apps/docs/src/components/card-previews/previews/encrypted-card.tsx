"use client";

import { Sk } from "./_kit";

const ROWS = ["a", "b", "c", "d"];
const CELLS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function EncryptedCardPreview() {
  return (
    <div className="relative h-24 w-36 overflow-hidden rounded-xl border border-border bg-card p-3">
      <div className="space-y-1.5">
        {ROWS.map((row) => (
          <div key={row} className="flex gap-1">
            {CELLS.map((cell) => (
              <Sk key={`${row}-${cell}`} className="size-1.5 rounded-[2px]" />
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(64px_circle_at_62%_44%,color-mix(in_oklch,var(--primary)_38%,transparent),transparent_70%)]" />
    </div>
  );
}
