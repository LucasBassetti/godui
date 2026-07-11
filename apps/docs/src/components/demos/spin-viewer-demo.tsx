"use client";

import { SpinViewer } from "@godui/components";
import { useMemo } from "react";
import { makeCubeFrames } from "./spin-viewer-frames";

export function SpinViewerDemo() {
  // Frames are generated once — in real use you pass photo/render URLs instead.
  const frames = useMemo(() => makeCubeFrames(48), []);
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full max-w-[40rem] flex-col overflow-hidden rounded-2xl border border-border bg-card sm:flex-row">
        <div className="flex items-center justify-center bg-gradient-to-b from-muted/70 to-muted/10 p-4 sm:w-1/2">
          <SpinViewer frames={frames} autoRotate className="size-56" />
        </div>
        <div className="flex flex-col justify-center gap-3 p-6 sm:w-1/2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
            New · 2026
          </span>
          <div>
            <h3 className="text-xl font-semibold leading-tight">
              Monolith One
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Machined aluminum, fanless, built to sit on the desk and be stared
              at.
            </p>
          </div>
          <p className="text-lg font-semibold">$1,299</p>
          <div className="flex items-center gap-2">
            <span className="size-5 rounded-full border border-border bg-zinc-300" />
            <span className="size-5 rounded-full border border-border bg-zinc-600" />
            <span className="size-5 rounded-full border-2 border-primary bg-zinc-900" />
          </div>
          <button
            type="button"
            className="mt-1 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Configure
          </button>
          <p className="font-mono text-[11px] text-muted-foreground">
            Drag to rotate · 360° view
          </p>
        </div>
      </div>
    </div>
  );
}
