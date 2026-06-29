"use client";

import { Ac, Sk } from "./_kit";

export default function BreadcrumbsPreview() {
  return (
    <div className="flex items-center gap-2">
      <Sk className="h-2.5 w-12 rounded-full" />
      <span className="text-[var(--muted-foreground)]/40 text-xs">›</span>
      <Ac className="h-2.5 w-16 rounded-full" />
    </div>
  );
}
