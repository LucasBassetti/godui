"use client";

import { Sk } from "./_kit";

export default function CommentPinPreview() {
  return (
    <div className="relative h-24 w-40 overflow-hidden rounded-xl border border-border bg-card">
      <div className="space-y-2 p-3">
        <Sk className="h-2 w-1/2 rounded-full" />
        <Sk className="h-2 w-3/4 rounded-full" />
      </div>
      <span className="absolute top-8 left-6 size-5 rounded-full rounded-bl-none bg-[var(--muted-foreground)]/30" />
      <span className="absolute top-12 left-24 size-6 rounded-full rounded-bl-none bg-primary transition-transform duration-300 group-hover:-translate-y-1" />
    </div>
  );
}
