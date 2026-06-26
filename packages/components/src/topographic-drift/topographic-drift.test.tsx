import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { TopographicDrift } from "./topographic-drift";

describe("TopographicDrift", () => {
  it("renders a decorative full-bleed canvas layer", () => {
    const { container } = render(<TopographicDrift />);
    const root = container.querySelector("[data-slot='topographic-drift']");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(root?.className).toContain("z-base");
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("renders without throwing for custom props", () => {
    expect(() =>
      render(<TopographicDrift color="#0ea5e9" lineCount={14} weight={1.5} />),
    ).not.toThrow();
  });

  it("forwards the ref to the root", () => {
    const ref = createRef<HTMLDivElement>();
    render(<TopographicDrift ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
