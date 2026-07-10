"use client";

import { Ac, Sk } from "./_kit";

function Chip({
  accent,
  w,
  delay,
}: {
  accent?: boolean;
  w: string;
  delay?: string;
}) {
  return (
    <div
      className={`flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-2 transition-transform duration-300 ease-out group-hover:-translate-y-1.5 ${w} ${delay ?? ""}`}
    >
      {accent ? (
        <Ac className="size-3.5 rounded-full" />
      ) : (
        <Sk className="size-3.5 rounded-full" />
      )}
      <Sk className="h-2 w-8 rounded" />
    </div>
  );
}

export default function StackBadgePreview() {
  return (
    <div className="flex max-w-[13rem] flex-wrap items-center justify-center gap-2">
      <Chip w="w-20" />
      <Chip accent w="w-24" delay="[transition-delay:60ms]" />
      <Chip w="w-16" delay="[transition-delay:120ms]" />
      <Chip w="w-24" delay="[transition-delay:180ms]" />
    </div>
  );
}
