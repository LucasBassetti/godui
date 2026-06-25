"use client";

import { AnimatedBeam } from "@godui/components";
import { Cloud, RefreshCw, Smartphone } from "lucide-react";
import * as React from "react";

const Node = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; label: string }
>(({ children, label }, ref) => (
  <div className="flex flex-col items-center gap-2.5">
    <div
      ref={ref}
      className="z-raised flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-md"
    >
      {children}
    </div>
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
  </div>
));
Node.displayName = "Node";

export function AnimatedBeamSyncDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const deviceRef = React.useRef<HTMLDivElement>(null);
  const cloudRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full max-w-sm items-start justify-between px-6 py-2"
    >
      <Node ref={deviceRef} label="Device">
        <Smartphone className="size-7" />
      </Node>

      <div className="z-raised mt-4 flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm">
        <RefreshCw className="size-4" />
      </div>

      <Node ref={cloudRef} label="Cloud">
        <Cloud className="size-7" />
      </Node>

      {/* Two dashed arcs bow opposite ways for a continuous two-way sync. */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={deviceRef}
        toRef={cloudRef}
        curvature={36}
        duration={3}
        pathDashArray="4 5"
        gradientStartColor="var(--primary)"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={deviceRef}
        toRef={cloudRef}
        curvature={-36}
        duration={3}
        delay={1.5}
        reverse
        pathDashArray="4 5"
        gradientStartColor="color-mix(in oklch, var(--primary) 70%, white)"
      />
    </div>
  );
}
