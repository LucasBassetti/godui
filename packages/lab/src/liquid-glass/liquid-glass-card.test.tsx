import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { LiquidGlassCard } from "./liquid-glass-card";

describe("LiquidGlassCard", () => {
  it("renders its children", () => {
    const { container } = render(<LiquidGlassCard>Glass</LiquidGlassCard>);
    const root = container.querySelector("[data-slot='liquid-glass-card']");
    expect(root?.textContent).toBe("Glass");
  });

  it("applies the radius and tint to the root element", () => {
    const { container } = render(
      <LiquidGlassCard radius={40} tint="rgba(0,0,0,0.2)">
        x
      </LiquidGlassCard>,
    );
    const root = container.querySelector<HTMLDivElement>(
      "[data-slot='liquid-glass-card']",
    );
    expect(root?.style.borderRadius).toBe("40px");
    expect(root?.style.backgroundColor).toBe("rgba(0, 0, 0, 0.2)");
  });

  it("initializes the pointer-tracking CSS variables", () => {
    const { container } = render(<LiquidGlassCard>x</LiquidGlassCard>);
    const root = container.querySelector<HTMLDivElement>(
      "[data-slot='liquid-glass-card']",
    );
    expect(root?.style.getPropertyValue("--lg-x")).toBe("50%");
    expect(root?.style.getPropertyValue("--lg-y")).toBe("50%");
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<LiquidGlassCard ref={ref}>x</LiquidGlassCard>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
