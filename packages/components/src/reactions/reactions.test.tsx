import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Reactions } from "./reactions";

const reactions = [
  { emoji: "👍", count: 3, reacted: true, users: ["Ana", "Marco"] },
  { emoji: "🎉", count: 1 },
];

describe("Reactions", () => {
  it("forwards ref to the container", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Reactions ref={ref} reactions={reactions} />);
    expect(ref.current?.getAttribute("data-slot")).toBe("reactions");
  });

  it("renders a pill per reaction with its count", () => {
    render(<Reactions reactions={reactions} />);
    expect(screen.getByText("👍")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("reflects the reacted state via aria-pressed", () => {
    render(<Reactions reactions={reactions} />);
    const pressed = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed).toBeTruthy();
  });

  it("calls onToggle with the emoji", () => {
    const onToggle = vi.fn();
    render(<Reactions reactions={reactions} onToggle={onToggle} />);
    fireEvent.click(screen.getByText("🎉"));
    expect(onToggle).toHaveBeenCalledWith("🎉");
  });

  it("opens the picker and adds an emoji", () => {
    const onAdd = vi.fn();
    render(
      <Reactions reactions={reactions} options={["🔥", "🚀"]} onAdd={onAdd} />,
    );
    fireEvent.click(screen.getByLabelText("Add reaction"));
    fireEvent.mouseDown(screen.getByText("🔥"));
    expect(onAdd).toHaveBeenCalledWith("🔥");
  });
});
