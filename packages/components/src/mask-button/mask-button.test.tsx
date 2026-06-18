import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { MaskButton } from "./mask-button";

describe("MaskButton", () => {
  it("renders its children (label + fill both carry the text)", () => {
    render(<MaskButton>Reveal</MaskButton>);
    // Label and mirrored fill both render the children.
    expect(screen.getAllByText("Reveal")).toHaveLength(2);
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<MaskButton ref={ref}>A</MaskButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets a displayName", () => {
    expect(MaskButton.displayName).toBe("MaskButton");
  });

  it("defaults to nature / primary / md", () => {
    render(<MaskButton>A</MaskButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-mask", "nature");
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "md");
    expect(button).toHaveAttribute("type", "button");
  });

  it("reflects mask, variant and size props", () => {
    render(
      <MaskButton mask="forest" variant="secondary" size="lg">
        A
      </MaskButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-mask", "forest");
    expect(button).toHaveAttribute("data-variant", "secondary");
    expect(button).toHaveAttribute("data-size", "lg");
    expect(button).toHaveClass("mask-button--lg");
  });

  it("merges a custom className", () => {
    render(<MaskButton className="custom">A</MaskButton>);
    expect(screen.getByRole("button")).toHaveClass("mask-button", "custom");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<MaskButton onClick={onClick}>A</MaskButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("toggles data-pressed on Space activation", async () => {
    const user = userEvent.setup();
    render(<MaskButton>A</MaskButton>);
    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{ >}");
    expect(button).toHaveAttribute("data-pressed", "true");
    await user.keyboard("{/ }");
    expect(button).not.toHaveAttribute("data-pressed");
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <MaskButton disabled onClick={onClick}>
        A
      </MaskButton>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
