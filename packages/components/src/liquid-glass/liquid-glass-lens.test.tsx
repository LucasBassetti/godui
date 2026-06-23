import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { LiquidGlassLens } from "./liquid-glass-lens";

describe("LiquidGlassLens", () => {
  it("renders a circular lens sized by the size prop", () => {
    const { container } = render(<LiquidGlassLens size={200} />);
    const root = container.querySelector<HTMLDivElement>(
      "[data-slot='liquid-glass-lens']",
    );
    expect(root?.style.width).toBe("200px");
    expect(root?.style.height).toBe("200px");
    expect(root?.className).toContain("rounded-full");
  });

  it("is hidden until the pointer is over the parent", () => {
    const { container } = render(<LiquidGlassLens />);
    const root = container.querySelector<HTMLDivElement>(
      "[data-slot='liquid-glass-lens']",
    );
    expect(root?.style.opacity).toBe("0");
  });

  it("renders its children", () => {
    const { container } = render(<LiquidGlassLens>Hi</LiquidGlassLens>);
    const root = container.querySelector("[data-slot='liquid-glass-lens']");
    expect(root?.textContent).toBe("Hi");
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<LiquidGlassLens ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
