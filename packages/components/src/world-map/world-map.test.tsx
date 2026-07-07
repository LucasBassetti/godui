import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { WorldMap } from "./world-map";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="world-map"]',
  ) as HTMLElement;
}

describe("WorldMap", () => {
  it("renders the dotted map and default arcs", () => {
    const { container } = render(<WorldMap />);
    const root = getRoot(container);
    expect(root.querySelector("svg")).not.toBeNull();
    // Land dots are injected as <circle> elements.
    expect(root.querySelectorAll("circle").length).toBeGreaterThan(100);
    // Default connection set draws paths.
    expect(root.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  it("renders only the connections it is given", () => {
    const { container } = render(
      <WorldMap
        connections={[
          {
            start: { lat: 51.5074, lng: -0.1278 },
            end: { lat: 35.6762, lng: 139.6503 },
          },
        ]}
      />,
    );
    expect(getRoot(container).querySelectorAll("path").length).toBe(1);
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<WorldMap ref={ref} />);
    expect(ref.current).toBe(getRoot(container));
    expect(WorldMap.displayName).toBe("WorldMap");
  });
});
