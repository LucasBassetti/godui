import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { NeuralGrid } from "./neural-grid";

describe("NeuralGrid", () => {
  it("renders a decorative full-bleed canvas layer", () => {
    const { container } = render(<NeuralGrid />);
    const root = container.querySelector("[data-slot='neural-grid']");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(root?.className).toContain("z-base");
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("renders without throwing for custom props", () => {
    expect(() =>
      render(<NeuralGrid color="#6366f1" nodeCount={30} density={0.8} />),
    ).not.toThrow();
  });

  it("forwards the ref to the root", () => {
    const ref = createRef<HTMLDivElement>();
    render(<NeuralGrid ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
