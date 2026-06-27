import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { OptimisticToggleButton } from "./optimistic-toggle-button";

describe("OptimisticToggleButton", () => {
  it("renders the inactive label by default", () => {
    render(<OptimisticToggleButton />);
    const button = screen.getByRole("button", { name: /follow/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<OptimisticToggleButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets a displayName", () => {
    expect(OptimisticToggleButton.displayName).toBe("OptimisticToggleButton");
  });

  it("flips optimistically on click and calls onToggle with the next state", async () => {
    const onToggle = vi.fn(() => Promise.resolve());
    render(<OptimisticToggleButton onToggle={onToggle} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("rolls back when the commit rejects", async () => {
    const onToggle = vi.fn(() => Promise.reject(new Error("nope")));
    render(<OptimisticToggleButton onToggle={onToggle} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    await waitFor(() =>
      expect(button).toHaveAttribute("aria-pressed", "false"),
    );
  });

  it("respects the controlled pressed prop", () => {
    render(<OptimisticToggleButton pressed />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("merges a custom className", () => {
    render(<OptimisticToggleButton className="custom" />);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });
});
