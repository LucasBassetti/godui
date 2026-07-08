"use client";

import { Ac, Sk } from "./_kit";

function Badge({ accent, delay }: { accent?: boolean; delay?: string }) {
  return (
    <div
      className={`flex h-10 w-28 items-center gap-2 rounded-xl border border-border bg-card px-2.5 transition-transform duration-300 ease-out group-hover:-translate-y-1 ${delay ?? ""}`}
    >
      {accent ? (
        <Ac className="size-5 rounded-md" />
      ) : (
        <Sk className="size-5 rounded-md" />
      )}
      <div className="flex flex-col gap-1">
        <Sk className="h-1.5 w-8 rounded" />
        <Sk className="h-2.5 w-14 rounded" />
      </div>
    </div>
  );
}

export default function StoreBadgePreview() {
  return (
    <div className="flex items-center gap-2">
      <Badge accent />
      <Badge delay="[transition-delay:60ms]" />
    </div>
  );
}
