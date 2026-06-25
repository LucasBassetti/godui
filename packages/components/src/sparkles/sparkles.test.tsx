import { render } from "@testing-library/react";
import { createRef } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Sparkles } from "./sparkles";

// jsdom has no 2D canvas context; returning null lets the effect bail cleanly.
beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="sparkles"]',
  ) as HTMLElement;
}

describe("Sparkles", () => {
  it("renders its children above a canvas", () => {
    const { container } = render(
      <Sparkles>
        <span>Magic</span>
      </Sparkles>,
    );
    expect(getRoot(container).textContent).toContain("Magic");
    expect(getRoot(container).querySelector("canvas")).not.toBeNull();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Sparkles ref={ref}>x</Sparkles>);
    expect(ref.current).toBe(getRoot(container));
    expect(Sparkles.displayName).toBe("Sparkles");
  });
});
