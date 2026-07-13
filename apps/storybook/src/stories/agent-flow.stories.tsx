import {
  AgentFlow,
  type AgentFlowEdge,
  type AgentFlowNode,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const NODES: AgentFlowNode[] = [
  {
    id: "trigger",
    label: "Trigger",
    sublabel: "user message",
    status: "done",
    x: 90,
    y: 170,
  },
  {
    id: "planner",
    label: "Planner",
    sublabel: "opus-4.8",
    status: "running",
    x: 320,
    y: 170,
  },
  {
    id: "search",
    label: "Search tool",
    sublabel: "web",
    status: "idle",
    x: 560,
    y: 80,
  },
  {
    id: "code",
    label: "Code tool",
    sublabel: "sandbox",
    status: "idle",
    x: 560,
    y: 260,
  },
  {
    id: "synth",
    label: "Synthesize",
    sublabel: "opus-4.8",
    status: "idle",
    x: 800,
    y: 170,
  },
  { id: "output", label: "Answer", status: "idle", x: 1020, y: 170 },
];

const EDGES: AgentFlowEdge[] = [
  { id: "e1", from: "trigger", to: "planner" },
  { id: "e2", from: "planner", to: "search", curvature: 40 },
  { id: "e3", from: "planner", to: "code", curvature: -40 },
  { id: "e4", from: "search", to: "synth", curvature: -40 },
  { id: "e5", from: "code", to: "synth", curvature: 40 },
  { id: "e6", from: "synth", to: "output" },
];

const meta = {
  title: "AI/AgentFlow",
  component: AgentFlow,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div className="p-6">
      <AgentFlow {...args} className="h-[420px] w-full" />
    </div>
  ),
  args: { nodes: NODES, edges: EDGES },
} satisfies Meta<typeof AgentFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// The showcase: a continuous light traces each card's border, lights its icon,
// then flows down the edge to the next node. Runs once from the root.
export const AutoPlay: Story = {
  args: { autoPlay: true },
};

// Every edge persists: lines draw on with the packet and stay lit, so the whole
// traversed path glows once the flow reaches the leaves.
export const AutoPlayPersist: Story = {
  args: {
    autoPlay: true,
    edges: EDGES.map((e) => ({ ...e, persist: true })),
  },
};

// Same, looping forever.
export const AutoPlayContinuous: Story = {
  args: {
    autoPlay: true,
    continuous: true,
  },
};

export const Static: Story = {
  args: { draggable: false, pannable: false },
};

export const AllRunning: Story = {
  args: {
    nodes: NODES.map((n) => ({ ...n, status: "running" as const })),
  },
};
