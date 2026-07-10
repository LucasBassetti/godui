import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { HolographicCard } from "./holographic-card";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="holographic-card"]',
  ) as HTMLElement;
}

describe("HolographicCard", () => {
  it("renders its children", () => {
    const { container } = render(<HolographicCard>Body</HolographicCard>);
    expect(getRoot(container).textContent).toContain("Body");
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <HolographicCard ref={ref}>x</HolographicCard>,
    );
    expect(ref.current).toBe(getRoot(container));
  });

  it("layers foil, sparkle, and glare by default and drops the optional ones", () => {
    // base + foil + sparkle + glare + edge.
    const { container: full } = render(<HolographicCard>x</HolographicCard>);
    expect(getRoot(full).querySelectorAll("[aria-hidden]").length).toBe(5);

    // base + foil + edge remain when the optional overlays are off.
    const { container: bare } = render(
      <HolographicCard glare={false} sparkle={false}>
        x
      </HolographicCard>,
    );
    expect(getRoot(bare).querySelectorAll("[aria-hidden]").length).toBe(3);
  });

  it("merges a custom className and sets a displayName", () => {
    const { container } = render(
      <HolographicCard className="custom">x</HolographicCard>,
    );
    expect(getRoot(container)).toHaveClass("custom");
    expect(HolographicCard.displayName).toBe("HolographicCard");
  });
});
