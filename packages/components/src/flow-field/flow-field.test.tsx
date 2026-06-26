import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { FlowField } from "./flow-field";

describe("FlowField", () => {
  it("renders a decorative full-bleed canvas layer", () => {
    const { container } = render(<FlowField />);
    const root = container.querySelector("[data-slot='flow-field']");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(root?.className).toContain("z-base");
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("renders without throwing for custom props", () => {
    expect(() =>
      render(<FlowField color="#10b981" particleCount={400} fade={0.1} />),
    ).not.toThrow();
  });

  it("forwards the ref to the root", () => {
    const ref = createRef<HTMLDivElement>();
    render(<FlowField ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
