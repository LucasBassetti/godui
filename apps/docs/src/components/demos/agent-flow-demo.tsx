"use client";

import {
  AgentFlow,
  type AgentFlowEdge,
  type AgentFlowNode,
} from "@godui/components";

const NODES: AgentFlowNode[] = [
  {
    id: "trigger",
    label: "Trigger",
    sublabel: "user message",
    x: 90,
    y: 170,
    icon: <BoltIcon />,
  },
  {
    id: "planner",
    label: "Planner",
    sublabel: "opus-4.8",
    x: 320,
    y: 170,
    icon: <BrainIcon />,
  },
  {
    id: "search",
    label: "Search tool",
    sublabel: "web",
    x: 560,
    y: 80,
    icon: <SearchIcon />,
  },
  {
    id: "code",
    label: "Code tool",
    sublabel: "sandbox",
    x: 560,
    y: 260,
    icon: <CodeIcon />,
  },
  {
    id: "synth",
    label: "Synthesize",
    sublabel: "opus-4.8",
    x: 800,
    y: 170,
    icon: <SparkIcon />,
  },
  {
    id: "answer",
    label: "Answer",
    sublabel: "streamed",
    x: 1020,
    y: 170,
    icon: <CheckDotIcon />,
  },
];

const EDGES: AgentFlowEdge[] = [
  { id: "e1", from: "trigger", to: "planner" },
  { id: "e2", from: "planner", to: "search", curvature: 40 },
  { id: "e3", from: "planner", to: "code", curvature: -40 },
  { id: "e4", from: "search", to: "synth", curvature: -40 },
  { id: "e5", from: "code", to: "synth", curvature: 40 },
  { id: "e6", from: "synth", to: "answer" },
];

export function AgentFlowDemo() {
  // The whole choreography — trace border → light icon → flow to next node —
  // is driven by AgentFlow's autoPlay. It starts at the root (Trigger) and
  // runs once to the last node. The preview's replay button restarts it.
  return (
    <AgentFlow
      nodes={NODES}
      edges={EDGES}
      autoPlay
      aria-label="Research agent workflow"
      className="h-full min-h-[440px] w-full rounded-none border-0 bg-transparent"
    />
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
function CodeIcon() {
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
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z" />
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
