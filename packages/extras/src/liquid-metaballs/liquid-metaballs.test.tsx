import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { LiquidMetaballs } from "./liquid-metaballs";

describe("LiquidMetaballs", () => {
  it("renders a decorative full-bleed svg layer", () => {
    const { container } = render(<LiquidMetaballs />);
    const root = container.querySelector("[data-slot='liquid-metaballs']");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(root?.className).toContain("z-base");
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders one circle per blob (plus a cursor blob when interactive)", () => {
    const { container } = render(
      <LiquidMetaballs blobCount={5} colors={["#f00", "#0f0"]} />,
    );
    // 5 blobs + 1 cursor blob = 6 circles.
    expect(container.querySelectorAll("circle").length).toBe(6);
  });

  it("forwards the ref to the root", () => {
    const ref = createRef<HTMLDivElement>();
    render(<LiquidMetaballs ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
