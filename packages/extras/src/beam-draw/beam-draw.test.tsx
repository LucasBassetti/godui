import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { BeamDraw } from "./beam-draw";

function getRoot(container: HTMLElement) {
  return container.querySelector<SVGSVGElement>(
    '[data-slot="beam-draw"]',
  ) as SVGSVGElement;
}

describe("BeamDraw", () => {
  it("renders the default beams", () => {
    const { container } = render(<BeamDraw />);
    expect(getRoot(container).querySelectorAll("path").length).toBe(4);
  });

  it("renders a path per custom entry", () => {
    const { container } = render(
      <BeamDraw paths={["M0 0 L10 10", "M0 0 L20 20"]} />,
    );
    expect(getRoot(container).querySelectorAll("path").length).toBe(2);
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<SVGSVGElement>();
    const { container } = render(<BeamDraw ref={ref} />);
    expect(ref.current).toBe(getRoot(container));
    expect(BeamDraw.displayName).toBe("BeamDraw");
  });
});
