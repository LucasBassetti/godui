"use client";

import { AnimatedBeam } from "@godui/components";
import { Database, MonitorSmartphone, Server, ShieldCheck } from "lucide-react";
import * as React from "react";

const Node = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; tone?: "default" | "primary" }
>(({ children, tone = "default" }, ref) => (
  <div
    ref={ref}
    className={`z-raised flex size-14 items-center justify-center rounded-2xl border shadow-md ${
      tone === "primary"
        ? "border-primary/30 bg-primary text-primary-foreground"
        : "border-border bg-card text-foreground"
    }`}
  >
    {children}
  </div>
));
Node.displayName = "Node";

function Stage({
  label,
  nodeRef,
  children,
  tone,
}: {
  label: string;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  tone?: "default" | "primary";
}) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <Node ref={nodeRef} tone={tone}>
        {children}
      </Node>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

export function AnimatedBeamPipelineDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const clientRef = React.useRef<HTMLDivElement>(null);
  const edgeRef = React.useRef<HTMLDivElement>(null);
  const computeRef = React.useRef<HTMLDivElement>(null);
  const dbRef = React.useRef<HTMLDivElement>(null);

  const beam = {
    containerRef,
    pathDashArray: "0.1 8",
    pathWidth: 2,
    duration: 4,
  } as const;

  return (
    <div
      ref={containerRef}
      className="relative flex w-full max-w-xl items-start justify-between px-4 py-2"
    >
      <Stage label="Client" nodeRef={clientRef}>
        <MonitorSmartphone className="size-6" />
      </Stage>
      <Stage label="Edge" nodeRef={edgeRef} tone="primary">
        <ShieldCheck className="size-6" />
      </Stage>
      <Stage label="Compute" nodeRef={computeRef}>
        <Server className="size-6" />
      </Stage>
      <Stage label="Database" nodeRef={dbRef}>
        <Database className="size-6" />
      </Stage>

      {/* Dotted resting line with a beam that flows stage to stage in sequence. */}
      <AnimatedBeam {...beam} fromRef={clientRef} toRef={edgeRef} delay={0} />
      <AnimatedBeam
        {...beam}
        fromRef={edgeRef}
        toRef={computeRef}
        delay={0.6}
      />
      <AnimatedBeam {...beam} fromRef={computeRef} toRef={dbRef} delay={1.2} />
    </div>
  );
}
