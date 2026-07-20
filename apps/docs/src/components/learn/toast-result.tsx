"use client";

import { ToastProvider, toast } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, imperative
 * `toast()` API. Fire a few, hover the stack to expand it and pause the
 * countdown, and drag one away to dismiss it.
 */
export function ToastResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover the stack, or drag a toast away
        </span>
      </div>
      <div className="flex min-h-[240px] w-full flex-wrap items-center justify-center gap-3 p-10">
        <button
          type="button"
          onClick={() =>
            toast({ title: "Event created", description: "Friday at 5pm" })
          }
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Show toast
        </button>
        <button
          type="button"
          onClick={() =>
            toast.success({
              title: "Saved",
              description: "Your changes are live.",
            })
          }
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground"
        >
          Success
        </button>
        <button
          type="button"
          onClick={() =>
            toast({
              title: "Deleted file",
              description: "report.pdf",
              action: { label: "Undo", onClick: () => {} },
            })
          }
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground"
        >
          With action
        </button>
        <ToastProvider />
      </div>
    </div>
  );
}
