import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Lamp } from "./lamp";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="lamp"]',
  ) as HTMLElement;
}

describe("Lamp", () => {
  it("renders its children", () => {
    const { container } = render(
      <Lamp>
        <h2>Headline</h2>
      </Lamp>,
    );
    expect(getRoot(container).textContent).toContain("Headline");
  });

  it("exposes the color as the --lamp CSS variable", () => {
    const { container } = render(<Lamp color="oklch(0.7 0.2 320)">x</Lamp>);
    expect(getRoot(container).style.getPropertyValue("--lamp")).toBe(
      "oklch(0.7 0.2 320)",
    );
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Lamp ref={ref}>x</Lamp>);
    expect(ref.current).toBe(getRoot(container));
    expect(Lamp.displayName).toBe("Lamp");
  });
});
