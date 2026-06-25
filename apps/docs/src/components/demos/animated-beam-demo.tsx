"use client";

import { AnimatedBeam } from "@godui/components";
import { Box, Cloud, Database, Sparkles } from "lucide-react";
import * as React from "react";

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

export function AnimatedBeamDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hubRef = React.useRef<HTMLDivElement>(null);
  const aRef = React.useRef<HTMLDivElement>(null);
  const bRef = React.useRef<HTMLDivElement>(null);
  const cRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[320px] w-full max-w-lg items-center justify-between px-10"
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
      <AnimatedBeam containerRef={containerRef} fromRef={bRef} toRef={hubRef} />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={cRef}
        toRef={hubRef}
        curvature={-50}
      />
    </div>
  );
}
