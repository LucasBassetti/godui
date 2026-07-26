"use client";

import type { ReactNode } from "react";
import { PreviewFrame } from "@/components/preview-frame";
import { cn } from "@/lib/cn";

export type CanvasBg = "default" | "light" | "dark" | "tinted";
export type StageView = "desktop" | "mobile";

/**
 * The live preview stage: a dotted-grid canvas that renders the active example.
 * `bg` swaps only the canvas backdrop (light / dark / tinted) — it never touches
 * the site theme, so the demo keeps rendering in the real theme.
 */
export function Stage({
  children,
  view,
  bg,
  fullWidth,
  replayKey,
}: {
  children: ReactNode;
  view: StageView;
  bg: CanvasBg;
  fullWidth: boolean;
  replayKey: number;
}) {
  return (
    <div
      data-bg={bg}
      className={cn(
        "workbench-canvas relative flex h-full w-full flex-col items-center justify-center overflow-auto",
        view === "mobile" ? "p-6" : fullWidth ? "p-0" : "p-6 md:p-12",
      )}
    >
      {view === "mobile" ? (
        <PreviewFrame key={replayKey} fullWidth={fullWidth}>
          {children}
        </PreviewFrame>
      ) : (
        <div
          key={replayKey}
          className={cn(
            "flex w-full max-w-full",
            fullWidth
              ? "min-h-full flex-1 flex-col self-stretch"
              : "items-center justify-center",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
