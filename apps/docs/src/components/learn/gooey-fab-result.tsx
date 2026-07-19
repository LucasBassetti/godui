"use client";

import { GooeyFab } from "@godui/components";

const Icon = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-[45%]"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

/**
 * Closing "here's the finished thing" panel — the real, interactive Gooey FAB
 * so the reader can feel every mechanism the article just pulled apart.
 */
export function GooeyFabResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — open, pick an action
        </span>
      </div>
      <div className="flex min-h-[280px] items-end justify-center p-10 pb-14">
        <GooeyFab
          actions={[
            {
              label: "Edit",
              icon: (
                <Icon d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              ),
            },
            {
              label: "Share",
              icon: <Icon d="M4 12v8h16v-8M12 16V4M8 8l4-4 4 4" />,
            },
            {
              label: "Delete",
              icon: <Icon d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />,
            },
          ]}
        />
      </div>
    </div>
  );
}
