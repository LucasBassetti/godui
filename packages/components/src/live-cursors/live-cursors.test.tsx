import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LiveCursors } from "./live-cursors";

const cursors = [
  { id: "u1", name: "Ana", x: 40, y: 60 },
  { id: "u2", name: "Marco", x: 120, y: 90, color: "oklch(0.6 0.2 250)" },
];

describe("LiveCursors", () => {
  it("forwards ref to the container", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<LiveCursors ref={ref} cursors={cursors} />);
    expect(ref.current?.getAttribute("data-slot")).toBe("live-cursors");
  });

  it("renders a flag per cursor with its name", () => {
    const { getByText } = render(<LiveCursors cursors={cursors} />);
    expect(getByText("Ana")).toBeInTheDocument();
    expect(getByText("Marco")).toBeInTheDocument();
  });

  it("renders a cursor-chat message when present", () => {
    const { getByText } = render(
      <LiveCursors
        cursors={[{ id: "u1", name: "Ana", x: 0, y: 0, message: "on it!" }]}
      />,
    );
    expect(getByText("on it!")).toBeInTheDocument();
  });
});
