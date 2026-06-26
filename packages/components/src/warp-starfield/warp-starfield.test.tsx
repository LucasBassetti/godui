import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { WarpStarfield } from "./warp-starfield";

describe("WarpStarfield", () => {
  it("renders a decorative full-bleed canvas layer", () => {
    const { container } = render(<WarpStarfield />);
    const root = container.querySelector("[data-slot='warp-starfield']");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(root?.className).toContain("z-base");
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("renders without throwing in warp mode with custom props", () => {
    expect(() =>
      render(<WarpStarfield warp color="#ffffff" starCount={200} depth={2} />),
    ).not.toThrow();
  });

  it("forwards the ref to the root", () => {
    const ref = createRef<HTMLDivElement>();
    render(<WarpStarfield ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
