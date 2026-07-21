"use client";

import {
  AgentFlow,
  type AgentFlowEdge,
  type AgentFlowNode,
} from "@godui/components";
import * as React from "react";

/**
 * The real `AgentFlow`, trimmed to four nodes so the whole run fits the
 * Result panel's height. `autoPlay` runs the full choreography from the
 * `Trigger` root; the replay button remounts the canvas (fresh `fitView`,
 * fresh sequence) so it can be watched again.
 */
const NODES: AgentFlowNode[] = [
  {
    id: "trigger",
    label: "Trigger",
    sublabel: "user message",
    x: 70,
    y: 110,
    icon: <BoltIcon />,
  },
  {
    id: "planner",
    label: "Planner",
    sublabel: "opus-4.8",
    x: 280,
    y: 110,
    icon: <BrainIcon />,
  },
  {
    id: "tool",
    label: "Search tool",
    sublabel: "web",
    x: 490,
    y: 110,
    icon: <SearchIcon />,
  },
  {
    id: "answer",
    label: "Answer",
    sublabel: "streamed",
    x: 700,
    y: 110,
    icon: <CheckDotIcon />,
  },
];

const EDGES: AgentFlowEdge[] = [
  { id: "e1", from: "trigger", to: "planner", persist: true },
  { id: "e2", from: "planner", to: "tool", persist: true },
  { id: "e3", from: "tool", to: "answer", persist: true },
];

export function AgentFlowResult() {
  const [run, setRun] = React.useState(0);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — autoPlay, one continuous light
        </span>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          aria-label="Replay run"
          title="Replay"
          className="ms-auto inline-flex size-8 items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
      <div className="p-4 md:p-6">
        <AgentFlow
          key={run}
          nodes={NODES}
          edges={EDGES}
          autoPlay
          aria-label="Research agent workflow"
          className="min-h-[360px] w-full"
        />
      </div>
    </div>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5a3 3 0 0 0-6 0 3 3 0 0 0-1 5.8A3 3 0 0 0 8 16a3 3 0 0 0 4 1 3 3 0 0 0 4-1 3 3 0 0 0 3-5.2A3 3 0 0 0 18 5a3 3 0 0 0-6 0Z" />
      <path d="M12 5v14" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function CheckDotIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
