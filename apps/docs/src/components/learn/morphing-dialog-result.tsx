"use client";

import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * MorphingDialog. Click the card and watch it become the modal through the
 * shared `layoutId`, then press Escape, click the backdrop, or hit the close
 * button to spring it back.
 */
export function MorphingDialogResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — click the card, Escape to close
        </span>
      </div>
      <div className="flex min-h-[260px] w-full items-center justify-center p-10">
        <MorphingDialog>
          <MorphingDialogTrigger className="w-64 rounded-2xl border border-border bg-card p-4 text-left shadow-sm [transition:box-shadow_200ms_ease] hover:shadow-md">
            <div className="h-28 rounded-xl bg-gradient-to-br from-chart-1 to-chart-3" />
            <div className="mt-3 font-semibold">Aurora Sessions</div>
            <div className="text-sm text-muted-foreground">Tap to expand</div>
          </MorphingDialogTrigger>

          <MorphingDialogContent className="w-[min(92vw,28rem)] rounded-2xl">
            <div className="h-44 bg-gradient-to-br from-chart-1 to-chart-3" />
            <div className="p-5">
              <div className="text-lg font-semibold">Aurora Sessions</div>
              <p className="mt-2 text-sm text-muted-foreground">
                The card physically morphs into this modal through a shared
                <code className="mx-1">layoutId</code>, then springs back on
                close.
              </p>
            </div>
            <MorphingDialogClose />
          </MorphingDialogContent>
        </MorphingDialog>
      </div>
    </div>
  );
}
