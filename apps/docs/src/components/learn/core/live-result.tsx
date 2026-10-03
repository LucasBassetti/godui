"use client";

import type { ReactNode } from "react";
import { useBareScene } from "@/components/learn/bare-scene-context";

/** The real, interactive component as a Learn article's final chapter. */
export function LiveResult({
  hint,
  children,
}: {
  hint: string;
  children: ReactNode;
}) {
  if (useBareScene())
    return (
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-8 p-6">
        {children}
      </div>
    );

  return (
    <div className="not-prose my-8 rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-fd-border border-b px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          {hint}
        </span>
      </div>
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-8 p-10">
        {children}
      </div>
    </div>
  );
}
