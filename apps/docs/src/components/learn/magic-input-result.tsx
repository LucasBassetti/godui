"use client";

import { MagicInput } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive Magic
 * Input so the reader can feel every mechanism the article pulled apart: focus
 * to lift it, watch the rainbow edge, submit to run the progress lifecycle.
 */
export function MagicInputResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — focus it, then submit
        </span>
      </div>
      <div className="flex min-h-[240px] items-center justify-center p-10">
        <div className="flex w-full max-w-xs flex-col gap-6">
          <MagicInput placeholder="Focus me" submitButton />
          <MagicInput rainbow={false} placeholder="Primary edge" />
          <MagicInput
            variant="secondary"
            rainbow={false}
            depth="always"
            placeholder="Always raised"
          />
        </div>
      </div>
    </div>
  );
}
