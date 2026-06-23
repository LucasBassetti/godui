import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GeometricBackground } from "./geometric-background";

describe("GeometricBackground", () => {
  it("spreads background props into inline style", () => {
    const { container } = render(
      <GeometricBackground
        background="rgb(1, 2, 3)"
        backgroundSize="40px 40px"
      />,
    );
    const el = container.querySelector<HTMLElement>(
      '[data-slot="geometric-background"]',
    );
    expect(el).not.toBeNull();
    expect(el?.style.background).toContain("rgb(1, 2, 3)");
    expect(el?.style.backgroundSize).toBe("40px 40px");
  });

  it("renders the baked default variant when given no props", () => {
    const { container } = render(<GeometricBackground />);
    const el = container.querySelector<HTMLElement>(
      '[data-slot="geometric-background"]',
    );
    expect(el?.style.backgroundImage).not.toBe("");
  });

  it("forwards arbitrary div attributes and className", () => {
    const { container } = render(
      <GeometricBackground className="custom" data-testid="bg" />,
    );
    const el = container.querySelector<HTMLElement>(
      '[data-slot="geometric-background"]',
    );
    expect(el?.className).toContain("custom");
    expect(el?.getAttribute("data-testid")).toBe("bg");
  });
});
