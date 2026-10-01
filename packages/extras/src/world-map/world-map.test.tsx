import { render, screen, within } from "@testing-library/react";
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

  it("exposes labeled endpoints while keeping the decorative SVG hidden", () => {
    const { container } = render(
      <WorldMap
        connections={[
          {
            start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
            end: { lat: 51.5074, lng: -0.1278, label: "London" },
          },
          {
            start: { lat: 35.6762, lng: 139.6503 },
            end: { lat: -33.8688, lng: 151.2093 },
          },
        ]}
      />,
    );
    const root = getRoot(container);
    const svg = root.querySelector("svg");
    const endpoints = screen.getByRole("list", {
      name: "World map endpoints",
    });

    expect(
      within(endpoints).getByRole("listitem", { name: "San Francisco" }),
    ).toBeInTheDocument();
    expect(
      within(endpoints).getByRole("listitem", { name: "London" }),
    ).toBeInTheDocument();
    expect(within(endpoints).getAllByRole("listitem")).toHaveLength(2);
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("role", "presentation");
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<WorldMap ref={ref} />);
    expect(ref.current).toBe(getRoot(container));
    expect(WorldMap.displayName).toBe("WorldMap");
  });
});
