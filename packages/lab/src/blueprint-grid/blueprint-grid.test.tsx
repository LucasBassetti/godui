import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { BlueprintGrid } from "./blueprint-grid";

describe("BlueprintGrid", () => {
  it("renders a decorative full-bleed layer", () => {
    const { container } = render(<BlueprintGrid />);
    const root = container.querySelector("[data-slot='blueprint-grid']");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(root?.className).toContain("z-base");
  });

  it("renders the dots variant", () => {
    const { container } = render(<BlueprintGrid variant="dots" color="#888" />);
    expect(container.innerHTML).toContain("radial-gradient");
  });

  it("renders the perspective variant", () => {
    const { container } = render(<BlueprintGrid variant="perspective" />);
    expect(container.innerHTML).toContain("rotateX");
  });

  it("forwards the ref to the root", () => {
    const ref = createRef<HTMLDivElement>();
    render(<BlueprintGrid ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
