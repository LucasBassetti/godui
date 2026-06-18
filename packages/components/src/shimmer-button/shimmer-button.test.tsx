import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ShimmerButton } from "./shimmer-button";

describe("ShimmerButton", () => {
  it("renders its children", () => {
    render(<ShimmerButton>Shimmer</ShimmerButton>);
    expect(screen.getByRole("button", { name: "Shimmer" })).toBeInTheDocument();
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ShimmerButton ref={ref}>A</ShimmerButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("sets a displayName", () => {
    expect(ShimmerButton.displayName).toBe("ShimmerButton");
  });

  it("defaults to primary / md / shimmer on, type button", () => {
    render(<ShimmerButton>A</ShimmerButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "md");
    expect(button).toHaveAttribute("data-shimmer", "true");
    expect(button).toHaveAttribute("type", "button");
  });

  it("reflects variant / size and can disable the shimmer", () => {
    render(
      <ShimmerButton variant="outline" size="sm" shimmer={false}>
        A
      </ShimmerButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "sm");
    expect(button).not.toHaveAttribute("data-shimmer");
  });

  it("applies variant text class and custom className", () => {
    render(<ShimmerButton className="custom">A</ShimmerButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "shimmer-button",
      "text-primary-foreground",
      "custom",
    );
  });

  it("exposes shimmer CSS custom properties via style", () => {
    render(
      <ShimmerButton shimmerDuration="5s" shimmerColor="red">
        A
      </ShimmerButton>,
    );
    const button = screen.getByRole("button");
    expect(button.style.getPropertyValue("--speed")).toBe("5s");
    expect(button.style.getPropertyValue("--shimmer-color")).toBe("red");
  });

  it("fires onClick and forwards mouse handlers", async () => {
    const onClick = vi.fn();
    const onMouseEnter = vi.fn();
    render(
      <ShimmerButton onClick={onClick} onMouseEnter={onMouseEnter}>
        A
      </ShimmerButton>,
    );
    const button = screen.getByRole("button");
    await userEvent.hover(button);
    await userEvent.click(button);
    expect(onMouseEnter).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("toggles data-pressed on keyboard activation", async () => {
    const user = userEvent.setup();
    render(<ShimmerButton>A</ShimmerButton>);
    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter>}");
    expect(button).toHaveAttribute("data-pressed", "true");
    await user.keyboard("{/Enter}");
    expect(button).not.toHaveAttribute("data-pressed");
  });
});
