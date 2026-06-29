"use client";

import { Ac } from "./_kit";

export default function HoldConfirmButtonPreview() {
  return (
    <div className="relative h-9 w-32 overflow-hidden rounded-lg bg-[var(--muted-foreground)]/20">
      <Ac className="absolute inset-y-0 left-0 w-0 transition-[width] duration-[1100ms] ease-linear group-hover:w-full" />
    </div>
  );
}
