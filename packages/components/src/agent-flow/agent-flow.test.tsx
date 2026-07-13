import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  AgentFlow,
  type AgentFlowEdge,
  type AgentFlowNode,
} from "./agent-flow";

const NODES: AgentFlowNode[] = [
  { id: "a", label: "Trigger", status: "done", x: 0, y: 0 },
  {
    id: "b",
    label: "Planner",
    sublabel: "gpt",
    status: "running",
    x: 200,
    y: 0,
  },
  { id: "c", label: "Output", status: "idle", x: 400, y: 0 },
];
const EDGES: AgentFlowEdge[] = [
  { id: "a-b", from: "a", to: "b" },
  { id: "b-c", from: "b", to: "c" },
];

describe("AgentFlow", () => {
  it("renders a labelled group with a node per entry", () => {
    const { container, getByText } = render(
      <AgentFlow nodes={NODES} edges={EDGES} />,
    );
    const root = container.querySelector('[data-slot="agent-flow"]');
    expect(root).toHaveAttribute("role", "group");
    expect(root).toHaveAttribute("aria-label", "Agent workflow");
    expect(getByText("Trigger")).toBeInTheDocument();
    expect(getByText("Planner")).toBeInTheDocument();
    expect(getByText("Output")).toBeInTheDocument();
  });

  it("draws a resting path + travelling gradient per edge", () => {
    const { container } = render(<AgentFlow nodes={NODES} edges={EDGES} />);
    const edgeLayer = container.querySelector('svg[role="presentation"]');
    // One resting stroke and one packet gradient per edge.
    expect(
      edgeLayer?.querySelectorAll('path[stroke="var(--border)"]'),
    ).toHaveLength(EDGES.length);
    expect(edgeLayer?.querySelectorAll("linearGradient")).toHaveLength(
      EDGES.length,
    );
  });

  it("exposes each node's status via data-status", () => {
    const { getByText } = render(<AgentFlow nodes={NODES} edges={EDGES} />);
    expect(getByText("Planner").closest("[data-status]")).toHaveAttribute(
      "data-status",
      "running",
    );
    expect(getByText("Trigger").closest("[data-status]")).toHaveAttribute(
      "data-status",
      "done",
    );
  });

  it("marks nodes as grabbable only when draggable", () => {
    const { getByText, rerender } = render(
      <AgentFlow nodes={NODES} edges={EDGES} draggable />,
    );
    const node = () => getByText("Output").closest("[data-status]");
    expect(node()?.className).toContain("cursor-grab");
    rerender(<AgentFlow nodes={NODES} edges={EDGES} draggable={false} />);
    expect(node()?.className).not.toContain("cursor-grab");
  });

  it("autoPlay begins by tracing the root node, others idle", () => {
    const { getByText } = render(
      <AgentFlow nodes={NODES} edges={EDGES} autoPlay />,
    );
    // Root (no incoming edge) starts tracing → running; downstream stay idle.
    expect(getByText("Trigger").closest("[data-status]")).toHaveAttribute(
      "data-status",
      "running",
    );
    expect(getByText("Output").closest("[data-status]")).toHaveAttribute(
      "data-status",
      "idle",
    );
  });

  it("accepts a custom aria-label", () => {
    const { container } = render(
      <AgentFlow nodes={NODES} edges={EDGES} aria-label="Support agent" />,
    );
    expect(container.querySelector('[data-slot="agent-flow"]')).toHaveAttribute(
      "aria-label",
      "Support agent",
    );
  });
});
