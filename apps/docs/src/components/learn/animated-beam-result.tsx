"use client";

import { AnimatedBeam } from "@godui/components";
import { Box, Cloud, Database, Sparkles } from "lucide-react";
import * as React from "react";

/**
 * Closing "here's the finished thing" panel — the real `AnimatedBeam`, a
 * compact hub-and-spoke version of the marketing demo (three nodes feeding
 * one hub with alternating curvature).
 */
const Node = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => (
  <div
    ref={ref}
    className={`z-raised flex items-center justify-center rounded-full border border-border bg-card shadow-md ${className ?? ""}`}
  >
    {children}
  </div>
));
Node.displayName = "Node";

export function AnimatedBeamResult() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hubRef = React.useRef<HTMLDivElement>(null);
  const aRef = React.useRef<HTMLDivElement>(null);
  const bRef = React.useRef<HTMLDivElement>(null);
  const cRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — three beams, one hub
        </span>
      </div>
      <div className="flex min-h-[320px] items-center justify-center p-6 md:p-10">
        <div
          ref={containerRef}
          className="relative flex h-[280px] w-full max-w-md items-center justify-between px-8"
        >
          <div className="flex flex-col gap-8">
            <Node ref={aRef} className="size-12">
              <Box className="size-5 text-foreground" />
            </Node>
            <Node ref={bRef} className="size-12">
              <Cloud className="size-5 text-foreground" />
            </Node>
            <Node ref={cRef} className="size-12">
              <Database className="size-5 text-foreground" />
            </Node>
          </div>

          <Node ref={hubRef} className="size-16 bg-primary">
            <Sparkles className="size-7 text-primary-foreground" />
          </Node>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={aRef}
            toRef={hubRef}
            curvature={50}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={bRef}
            toRef={hubRef}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={cRef}
            toRef={hubRef}
            curvature={-50}
          />
        </div>
      </div>
    </div>
  );
}
