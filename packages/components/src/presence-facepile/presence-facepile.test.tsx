import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PresenceFacepile } from "./presence-facepile";

const users = [
  { id: "1", name: "Ana Reyes", status: "active" as const },
  { id: "2", name: "Marco Bell", status: "typing" as const },
  { id: "3", name: "Priya Nair", status: "idle" as const },
  { id: "4", name: "Jules Kim" },
  { id: "5", name: "Sam Diaz" },
  { id: "6", name: "Lee Cho" },
];

describe("PresenceFacepile", () => {
  it("forwards ref to the container", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<PresenceFacepile ref={ref} users={users} />);
    expect(ref.current?.getAttribute("data-slot")).toBe("presence-facepile");
  });

  it("collapses overflow beyond max into a +N chip", () => {
    render(<PresenceFacepile users={users} max={4} />);
    expect(screen.getByLabelText("2 more")).toHaveTextContent("+2");
  });

  it("opens the overflow popover listing hidden users", () => {
    render(<PresenceFacepile users={users} max={4} />);
    fireEvent.click(screen.getByLabelText("2 more"));
    expect(screen.getByText("Sam Diaz")).toBeInTheDocument();
    expect(screen.getByText("Lee Cho")).toBeInTheDocument();
  });

  it("renders initials when no avatar image is provided", () => {
    render(<PresenceFacepile users={[users[0]]} />);
    expect(screen.getByText("AR")).toBeInTheDocument();
  });
});
