import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { DynamicIsland } from "./dynamic-island";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="dynamic-island"]',
  ) as HTMLElement;
}

describe("DynamicIsland", () => {
  it("renders its children", () => {
    const { container } = render(
      <DynamicIsland>
        <span>Now playing</span>
      </DynamicIsland>,
    );
    expect(getRoot(container).textContent).toContain("Now playing");
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<DynamicIsland ref={ref}>x</DynamicIsland>);
    expect(ref.current).toBe(getRoot(container));
  });

  it("merges a custom className and sets a displayName", () => {
    const { container } = render(
      <DynamicIsland className="custom" size="large">
        x
      </DynamicIsland>,
    );
    expect(getRoot(container)).toHaveClass("custom");
    expect(DynamicIsland.displayName).toBe("DynamicIsland");
  });
});
