import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { LightRays } from "./light-rays";

describe("LightRays", () => {
  it("renders a decorative full-bleed layer", () => {
    const { container } = render(<LightRays />);
    const root = container.querySelector("[data-slot='light-rays']");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(root?.className).toContain("z-base");
  });

  it("maps speed to the sweep duration var", () => {
    const { container } = render(<LightRays speed={2} />);
    const root = container.querySelector<HTMLDivElement>(
      "[data-slot='light-rays']",
    );
    expect(root?.style.getPropertyValue("--rays-speed")).toBe("7s");
  });

  it("omits the grain layer when grain is 0", () => {
    const { container } = render(<LightRays grain={0} />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("forwards the ref to the root", () => {
    const ref = createRef<HTMLDivElement>();
    render(<LightRays ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
