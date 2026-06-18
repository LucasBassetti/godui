import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ProgressFoldButton } from "./progress-fold-button";

describe("ProgressFoldButton", () => {
  it("renders its children", () => {
    render(<ProgressFoldButton>Run</ProgressFoldButton>);
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ProgressFoldButton ref={ref}>A</ProgressFoldButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets a displayName", () => {
    expect(ProgressFoldButton.displayName).toBe("ProgressFoldButton");
  });

  it("defaults to primary / md, type button", () => {
    render(<ProgressFoldButton>A</ProgressFoldButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "md");
    expect(button).toHaveAttribute("type", "button");
  });

  it("reflects variant / size and applies front variant classes", () => {
    const { container } = render(
      <ProgressFoldButton variant="secondary" size="lg">
        A
      </ProgressFoldButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-variant", "secondary");
    expect(button).toHaveClass("progress-fold-button--lg");
    expect(container.querySelector(".progress-fold-button-front")).toHaveClass(
      "bg-secondary",
    );
  });

  it("merges a custom className", () => {
    render(<ProgressFoldButton className="custom">A</ProgressFoldButton>);
    expect(screen.getByRole("button")).toHaveClass(
      "progress-fold-button",
      "custom",
    );
  });

  it("sets data-active on click and clears it on the bar animation end", async () => {
    const onClick = vi.fn();
    const { container } = render(
      <ProgressFoldButton onClick={onClick}>A</ProgressFoldButton>,
    );
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(button).toHaveAttribute("data-active", "true");

    const bar = container.querySelector(".progress-fold-button-bar");
    if (!bar) throw new Error("progress bar not found");
    fireEvent.animationEnd(bar);
    expect(button).not.toHaveAttribute("data-active");
  });
});
