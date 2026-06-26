import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AgentStep, AgentTimeline } from "./agent-timeline";

describe("AgentTimeline", () => {
  it("forwards ref to the list", () => {
    const ref = { current: null as HTMLOListElement | null };
    render(<AgentTimeline ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLOListElement);
  });

  it("reflects step status via data attribute", () => {
    render(
      <AgentTimeline>
        <AgentStep status="success" title="Done" last />
      </AgentTimeline>,
    );
    const step = document.querySelector('[data-slot="agent-step"]');
    expect(step?.getAttribute("data-status")).toBe("success");
  });

  it("toggles the collapsible body when it has children", () => {
    render(
      <AgentStep status="running" title="Searching" defaultOpen={false}>
        <span>tool output</span>
      </AgentStep>,
    );
    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("tool output")).toBeInTheDocument();
  });

  it("disables the toggle when there is no body", () => {
    render(<AgentStep status="pending" title="Queued" last />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
