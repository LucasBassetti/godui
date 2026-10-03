import { act, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { HoldConfirmButton } from "./hold-confirm-button";

// framer-motion drives `animate()` on its own frameloop, so completion timing
// is covered in Storybook rather than unit tests. Here we assert the
// synchronous press/cancel state transitions the component owns.
function pressEnter(button: HTMLElement) {
  act(() => {
    button.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
  });
}
function releaseEnter(button: HTMLElement) {
  act(() => {
    button.dispatchEvent(
      new KeyboardEvent("keyup", { key: "Enter", bubbles: true }),
    );
  });
}

describe("HoldConfirmButton", () => {
  it("renders its label", () => {
    render(<HoldConfirmButton>Delete account</HoldConfirmButton>);
    expect(
      screen.getByRole("button", { name: "Delete account" }),
    ).toBeInTheDocument();
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<HoldConfirmButton ref={ref}>Hold</HoldConfirmButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets a displayName", () => {
    expect(HoldConfirmButton.displayName).toBe("HoldConfirmButton");
  });

  it("enters the holding status on key press", () => {
    render(<HoldConfirmButton>Hold</HoldConfirmButton>);
    const button = screen.getByRole("button");
    button.focus();
    pressEnter(button);
    expect(button).toHaveAttribute("data-status", "holding");
  });

  it("cancels (no confirm) when released early", () => {
    const onConfirm = vi.fn();
    render(<HoldConfirmButton onConfirm={onConfirm}>Hold</HoldConfirmButton>);
    const button = screen.getByRole("button");
    button.focus();
    pressEnter(button);
    releaseEnter(button);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("data-status", "idle");
  });

  it("does not start when disabled", () => {
    render(<HoldConfirmButton disabled>Hold</HoldConfirmButton>);
    const button = screen.getByRole("button");
    pressEnter(button);
    expect(button).toHaveAttribute("data-status", "idle");
  });

  it("merges a custom className", () => {
    render(<HoldConfirmButton className="custom">Hold</HoldConfirmButton>);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });
});
