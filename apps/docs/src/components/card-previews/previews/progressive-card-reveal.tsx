"use client";

import { Sk } from "./_kit";

function Row({ rows }: { rows: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <Sk className="h-2 w-2/3 rounded-full" />
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${rows}`}
      >
        <div className="overflow-hidden">
          <Sk className="mt-2 h-1.5 w-1/2 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProgressiveCardRevealPreview() {
  return (
    <div className="flex w-48 flex-col gap-2">
      <Row rows="grid-rows-[1fr] group-hover:grid-rows-[0fr]" />
      <Row rows="grid-rows-[0fr] group-hover:grid-rows-[1fr]" />
      <Row rows="grid-rows-[0fr]" />
    </div>
  );
}
