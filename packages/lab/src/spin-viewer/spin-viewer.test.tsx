import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { SpinViewer } from "./spin-viewer";

const FRAMES = ["/a.png", "/b.png", "/c.png"];

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="spin-viewer"]',
  ) as HTMLElement;
}

describe("SpinViewer", () => {
  it("exposes an accessible label", () => {
    const { container } = render(<SpinViewer frames={FRAMES} />);
    expect(getRoot(container)).toHaveAttribute("role", "img");
    expect(getRoot(container)).toHaveAttribute(
      "aria-label",
      "360-degree view. Drag to rotate.",
    );
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SpinViewer ref={ref} frames={FRAMES} />);
    expect(ref.current).toHaveAttribute("data-slot", "spin-viewer");
  });

  it("renders a loading placeholder before frames preload", () => {
    const { container } = render(<SpinViewer frames={FRAMES} />);
    // jsdom never fires <img> load, so the pulse placeholder stays mounted.
    expect(getRoot(container).querySelector(".animate-pulse")).not.toBeNull();
  });

  it("merges a custom className and sets a displayName", () => {
    const { container } = render(
      <SpinViewer frames={FRAMES} className="custom" />,
    );
    expect(getRoot(container)).toHaveClass("custom");
    expect(SpinViewer.displayName).toBe("SpinViewer");
  });

  it("does not crash with an empty frame list", () => {
    const { container } = render(<SpinViewer frames={[]} />);
    expect(getRoot(container)).not.toBeNull();
  });
});
