import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
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
    expect(button).toHaveAttribute("data-size", "lg");
    expect(
      container.querySelector("[data-slot='progress-fold-front']"),
    ).toHaveClass("bg-secondary");
  });

  it("merges a custom className", () => {
    render(<ProgressFoldButton className="custom">A</ProgressFoldButton>);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("is idle by default: no status / progressbar", () => {
    render(<ProgressFoldButton>A</ProgressFoldButton>);
    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("data-status");
    expect(button).not.toHaveAttribute("aria-busy");
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("marks loading state with data-status and aria-busy", () => {
    render(<ProgressFoldButton status="loading">A</ProgressFoldButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-status", "loading");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("loading without progress is indeterminate", () => {
    render(<ProgressFoldButton status="loading">A</ProgressFoldButton>);
    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("data-determinate");
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuetext", "Loading");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("loading with progress is determinate and exposes the value", () => {
    render(
      <ProgressFoldButton status="loading" progress={40}>
        A
      </ProgressFoldButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-determinate", "true");
    expect(button.style.getPropertyValue("--progress-fold-fill")).toBe("0.4");
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuetext", "40%");
  });

  it("clamps out-of-range progress values", () => {
    const { rerender } = render(
      <ProgressFoldButton status="loading" progress={150}>
        A
      </ProgressFoldButton>,
    );
    let button = screen.getByRole("button");
    expect(button.style.getPropertyValue("--progress-fold-fill")).toBe("1");

    rerender(
      <ProgressFoldButton status="loading" progress={-20}>
        A
      </ProgressFoldButton>,
    );
    button = screen.getByRole("button");
    expect(button.style.getPropertyValue("--progress-fold-fill")).toBe("0");
  });
});
