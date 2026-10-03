import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { JellyButton } from "./jelly-button";

describe("JellyButton", () => {
  it("renders its children", () => {
    render(<JellyButton>Click me</JellyButton>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<JellyButton ref={ref}>Ref</JellyButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets a displayName", () => {
    expect(JellyButton.displayName).toBe("JellyButton");
  });

  it("reflects the primary variant default via data attribute", () => {
    render(<JellyButton>A</JellyButton>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "primary",
    );
  });

  it("applies the outline variant", () => {
    render(<JellyButton variant="outline">A</JellyButton>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "outline",
    );
  });

  it("maps the squash knob to the --jelly-press scale", () => {
    render(<JellyButton squash={1}>A</JellyButton>);
    expect(
      screen.getByRole("button").style.getPropertyValue("--jelly-press"),
    ).toBe("1.220 0.780");
  });

  it("clamps squash outside 0–1", () => {
    render(<JellyButton squash={5}>A</JellyButton>);
    expect(
      screen.getByRole("button").style.getPropertyValue("--jelly-press"),
    ).toBe("1.220 0.780");
  });

  it("merges a custom className", () => {
    render(<JellyButton className="custom">A</JellyButton>);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<JellyButton onClick={onClick}>A</JellyButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("toggles data-pressed on keyboard activation", async () => {
    const user = userEvent.setup();
    render(<JellyButton>A</JellyButton>);
    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter>}");
    expect(button).toHaveAttribute("data-pressed", "true");
    await user.keyboard("{/Enter}");
    expect(button).not.toHaveAttribute("data-pressed");
  });
});
