import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { ScrollTimeline, type TimelineEntry } from "./scroll-timeline";

const data: TimelineEntry[] = [
  { title: "Kickoff", date: "2024", content: <p>Started the project.</p> },
  { title: "Launch", date: "2025", content: <p>Shipped v1.</p> },
];

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="scroll-timeline"]',
  ) as HTMLElement;
}

describe("ScrollTimeline", () => {
  it("renders an entry per data item", () => {
    const { getByText, getAllByText } = render(<ScrollTimeline data={data} />);
    expect(getByText("Started the project.")).toBeInTheDocument();
    expect(getByText("Shipped v1.")).toBeInTheDocument();
    // Date shows in both the sticky rail and the mobile heading.
    expect(getAllByText("2024").length).toBeGreaterThan(0);
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ScrollTimeline ref={ref} data={data} />);
    expect(ref.current).toBe(getRoot(container));
    expect(ScrollTimeline.displayName).toBe("ScrollTimeline");
  });
});
