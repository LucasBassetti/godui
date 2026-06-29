"use client";

import { Sk } from "./_kit";

function Row({ move }: { move?: string }) {
  return (
    <div
      className={`flex h-9 items-center gap-2.5 rounded-lg border border-border bg-card px-3 shadow-sm transition-transform duration-300 ${move ?? ""}`}
    >
      <div className="flex flex-col gap-0.5">
        <span className="h-0.5 w-2.5 rounded bg-[var(--muted-foreground)]/40" />
        <span className="h-0.5 w-2.5 rounded bg-[var(--muted-foreground)]/40" />
      </div>
      <Sk className="h-2 w-24 rounded-full" />
    </div>
  );
}

export default function ReorderListPreview() {
  return (
    <div className="flex w-44 flex-col gap-2">
      <Row move="group-hover:translate-y-[5.5rem]" />
      <Row />
      <Row move="group-hover:-translate-y-[5.5rem]" />
    </div>
  );
}
