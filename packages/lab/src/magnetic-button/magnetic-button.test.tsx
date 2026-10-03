import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { MagneticButton } from "./magnetic-button";

describe("MagneticButton", () => {
  it("renders its children", () => {
    render(<MagneticButton>Go</MagneticButton>);
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("forwards the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<MagneticButton ref={ref}>x</MagneticButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveAttribute("data-slot", "magnetic-button");
  });

  it("sets a displayName", () => {
    expect(MagneticButton.displayName).toBe("MagneticButton");
  });

  it("merges a custom className", () => {
    render(<MagneticButton className="custom">x</MagneticButton>);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("wraps the button in a sensor padded by range", () => {
    const { container } = render(<MagneticButton range={20}>x</MagneticButton>);
    const sensor = container.querySelector<HTMLElement>(
      '[data-slot="magnetic-button-sensor"]',
    );
    expect(sensor).toBeInTheDocument();
    expect(sensor?.style.padding).toBe("20px");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<MagneticButton onClick={onClick}>x</MagneticButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders with a static label", () => {
    render(<MagneticButton staticLabel>Centered</MagneticButton>);
    expect(
      screen.getByRole("button", { name: "Centered" }),
    ).toBeInTheDocument();
  });
});
