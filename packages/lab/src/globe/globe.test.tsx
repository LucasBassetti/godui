import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

// cobe needs a real WebGL context, which jsdom lacks — stub it.
const destroy = vi.fn();
vi.mock("cobe", () => ({
  default: vi.fn(() => ({ update: vi.fn(), destroy })),
}));

import createGlobe from "cobe";
import { Globe } from "./globe";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="globe"]',
  ) as HTMLElement;
}

describe("Globe", () => {
  it("creates a globe on a canvas", () => {
    const { container } = render(<Globe />);
    expect(getRoot(container).querySelector("canvas")).not.toBeNull();
    expect(createGlobe).toHaveBeenCalled();
  });

  it("destroys the globe on unmount", () => {
    const { unmount } = render(<Globe />);
    unmount();
    expect(destroy).toHaveBeenCalled();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Globe ref={ref} />);
    expect(ref.current).toBe(getRoot(container));
    expect(Globe.displayName).toBe("Globe");
  });
});
