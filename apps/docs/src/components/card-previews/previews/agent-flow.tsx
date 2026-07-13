"use client";

import { Ac, Panel, Sk } from "./_kit";

function Node({ className, live }: { className?: string; live?: boolean }) {
  return (
    <Panel
      className={`flex items-center gap-2 px-2 py-1.5 shadow-sm ${className ?? ""}`}
    >
      <span
        className={`size-3 shrink-0 rounded-md ${
          live
            ? "bg-primary"
            : "bg-[var(--muted-foreground)]/25 transition-colors duration-300 group-hover:bg-primary"
        }`}
      />
      <Sk className="h-1.5 w-8 rounded-full" />
    </Panel>
  );
}

function Wire({ className }: { className?: string }) {
  return (
    <span
      className={`relative block h-px overflow-hidden bg-[var(--muted-foreground)]/25 ${className ?? ""}`}
    >
      <Ac className="absolute inset-y-0 left-0 w-1/3 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-[300%]" />
    </span>
  );
}

export default function AgentFlowPreview() {
  return (
    <div className="relative h-24 w-44">
      <Node live className="absolute left-0 top-1/2 -translate-y-1/2" />
      <Wire className="absolute left-[4.5rem] top-1/2 w-10 -translate-y-1/2" />
      <Node className="absolute right-0 top-2" />
      <Node className="absolute right-0 bottom-2" />
      <Wire className="absolute right-[4.5rem] top-[30%] w-10 rotate-[18deg]" />
      <Wire className="absolute right-[4.5rem] bottom-[30%] w-10 -rotate-[18deg]" />
    </div>
  );
}
