"use client";

import { DynamicIsland, type DynamicIslandSize } from "@godui/components";
import { Music, Phone, Timer } from "lucide-react";
import * as React from "react";

const VIEWS: { key: DynamicIslandSize; label: string }[] = [
  { key: "compact", label: "Idle" },
  { key: "default", label: "Call" },
  { key: "long", label: "Timer" },
  { key: "large", label: "Now Playing" },
];

export function DynamicIslandDemo() {
  const [view, setView] = React.useState<DynamicIslandSize>("default");

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="flex h-[220px] w-full items-start justify-center pt-2">
        <DynamicIsland size={view} presenceKey={view}>
          {view === "compact" ? (
            <div className="size-2 rounded-full bg-white/70" />
          ) : null}

          {view === "default" ? (
            <div className="flex w-full items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <Phone className="size-4 text-green-400" />
                Incoming
              </span>
              <span className="font-medium">Ada</span>
            </div>
          ) : null}

          {view === "long" ? (
            <div className="flex w-full items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <Timer className="size-4 text-amber-400" />
                Focus
              </span>
              <span className="font-mono tabular-nums">24:59</span>
            </div>
          ) : null}

          {view === "large" ? (
            <div className="flex w-full items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/10">
                <Music className="size-6 text-white/80" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">Midnight</div>
                <div className="truncate text-xs text-white/60">
                  The Sketches
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-2/3 rounded-full bg-white/80" />
                </div>
              </div>
            </div>
          ) : null}
        </DynamicIsland>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium [transition:background_150ms_ease] ${
              view === v.key
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground hover:bg-accent/70"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
