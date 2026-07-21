"use client";

import { SpinViewer } from "@godui/components";
import { useMemo } from "react";
import { makeCubeFrames } from "@/components/demos/spin-viewer-frames";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `SpinViewer`. Frames are a generated 360° shaded cube (same generator the
 * component demo uses) so the panel needs no binary assets; drag it, or
 * wait — it auto-rotates until you grab it.
 */
export function SpinViewerResult() {
  const frames = useMemo(() => makeCubeFrames(48), []);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — drag it, or let it auto-rotate
        </span>
      </div>
      <div className="relative flex min-h-[300px] items-center justify-center p-10">
        <SpinViewer frames={frames} autoRotate className="size-56" />
      </div>
    </div>
  );
}
