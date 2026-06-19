import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { BorderBeam } from "./border-beam";

function getBeamRoot(container: HTMLElement) {
  return container.querySelector('[data-slot="border-beam"]') as HTMLElement;
}

describe("BorderBeam", () => {
  it("renders a single traveling beam by default", () => {
    const { container } = render(<BorderBeam />);
    const root = getBeamRoot(container);
    expect(root).toBeInTheDocument();
    expect(root.children).toHaveLength(1);
  });

  it("renders a second blurred echo when glow is enabled", () => {
    const { container } = render(<BorderBeam glow />);
    expect(getBeamRoot(container).children).toHaveLength(2);
  });

  it("exposes the border width as a CSS variable", () => {
    const { container } = render(<BorderBeam borderWidth={3} />);
    expect(
      getBeamRoot(container).style.getPropertyValue("--border-beam-width"),
    ).toBe("3px");
  });

  it("paints the rainbow gradient by default", () => {
    const { container } = render(<BorderBeam />);
    const beam = getBeamRoot(container).firstElementChild as HTMLElement;
    expect(beam.style.background).toContain("--rainbow-1");
  });

  it("falls back to a two-color gradient when rainbow is off", () => {
    const { container } = render(<BorderBeam rainbow={false} />);
    const beam = getBeamRoot(container).firstElementChild as HTMLElement;
    expect(beam.style.background).toBe("");
    expect(beam).toHaveClass("bg-linear-to-l");
  });

  it("forwards the ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<BorderBeam ref={ref} />);
    expect(ref.current).toBe(getBeamRoot(container));
  });
});
