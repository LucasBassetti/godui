"use client";

import type { ReactNode } from "react";
import { PreviewFrame } from "@/components/preview-frame";
import { cn } from "@/lib/cn";

export type CanvasBg = "default" | "light" | "dark" | "tinted";
export type StageView = "desktop" | "mobile";

/**
 * The live preview stage: a dotted-grid canvas that renders the active example.
 *
 * Layout contract:
 * - default — padded, children centered (buttons, inputs, media, framed scroll)
 * - `fullWidth` — edge-to-edge, no pad; demo owns the surface (backgrounds,
 *   stage-fill scroll ports, docks). Overflow is clipped so nested scrollports
 *   don't fight the stage.
 *
 * `bg` swaps only the canvas backdrop hint — it never touches the site theme.
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
        "workbench-canvas relative flex h-full min-h-0 w-full flex-col items-center justify-center",
        fullWidth ? "overflow-hidden" : "overflow-auto",
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
              ? "h-full min-h-0 flex-1 flex-col self-stretch"
              : "items-center justify-center",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
