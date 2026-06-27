import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { UndoButton } from "./undo-button";

describe("UndoButton", () => {
  it("renders the label and undo control", () => {
    render(<UndoButton label="Message archived" />);
    expect(screen.getByText("Message archived")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument();
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<UndoButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("sets a displayName", () => {
    expect(UndoButton.displayName).toBe("UndoButton");
  });

  it("starts in the counting status", () => {
    render(<UndoButton />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "data-status",
      "counting",
    );
  });

  it("calls onUndo and stops counting when undo is clicked", async () => {
    const onUndo = vi.fn();
    const onCommit = vi.fn();
    render(<UndoButton onUndo={onUndo} onCommit={onCommit} />);
    await userEvent.click(screen.getByRole("button", { name: /undo/i }));
    expect(onUndo).toHaveBeenCalledOnce();
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveAttribute("data-status", "undone");
  });

  it("merges a custom className", () => {
    render(<UndoButton className="custom" />);
    expect(screen.getByRole("status")).toHaveClass("custom");
  });
});
