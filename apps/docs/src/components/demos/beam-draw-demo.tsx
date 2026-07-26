"use client";

import { BeamDraw } from "@godui/components";
import { useRef } from "react";
import { DemoScrollPort, DemoScrollRunway } from "@/components/demos/_kit";

// Right-hand nodes, positioned at the y-fractions where the default beams end
// (40, 150, 250, 360 on the 400-tall viewBox).
const NODES = [
  { label: "Database", top: "10%" },
  { label: "Auth", top: "37.5%" },
  { label: "Payments", top: "62.5%" },
  { label: "Analytics", top: "90%" },
] as const;

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 shadow-lg">
      <span className="text-sm font-medium text-foreground">{children}</span>
      <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
    </div>
  );
}

export function BeamDrawDemo() {
  // Stage-fill scrubber — pair with Example fullWidth.
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <DemoScrollPort ref={scrollRef}>
      <DemoScrollRunway
        pad="xl"
        className="flex min-h-[260vh] flex-col items-center justify-center gap-12"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground md:text-3xl">
            Your entire stack, connected
          </h3>
          <p className="mt-3 text-muted-foreground">
            Scroll to light up the pipeline.
          </p>
        </div>

        <div className="relative aspect-[5/2] w-full max-w-3xl rounded-2xl border border-border bg-card/60 shadow-xl">
          <BeamDraw
            container={scrollRef}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          />

          <div className="absolute top-1/2 left-0 flex -translate-y-1/2 items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 shadow-lg">
            <span className="size-2.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            <span className="font-semibold text-foreground text-sm">
              API Core
            </span>
          </div>

          {NODES.map((node) => (
            <div
              key={node.label}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: node.top }}
            >
              <Chip>{node.label}</Chip>
            </div>
          ))}
        </div>
      </DemoScrollRunway>
    </DemoScrollPort>
  );
}
