"use client";

import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from "@godui/components";

export function MorphingDialogDemo() {
  return (
    <div className="flex w-full justify-center py-8">
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
              close. Press Escape or click the backdrop to dismiss.
            </p>
          </div>
          <MorphingDialogClose />
        </MorphingDialogContent>
      </MorphingDialog>
    </div>
  );
}
