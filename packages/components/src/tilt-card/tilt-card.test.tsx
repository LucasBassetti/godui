import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { TiltCard } from "./tilt-card";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="tilt-card"]',
  ) as HTMLElement;
}

describe("TiltCard", () => {
  it("renders its children", () => {
    const { container } = render(<TiltCard>Body</TiltCard>);
    expect(getRoot(container).textContent).toContain("Body");
  });

  it("forwards the ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<TiltCard ref={ref}>x</TiltCard>);
    expect(ref.current).toBe(getRoot(container));
  });

  it("renders a glare layer by default and omits it when disabled", () => {
    const { container: withGlare } = render(<TiltCard>x</TiltCard>);
    expect(getRoot(withGlare).querySelector("[aria-hidden]")).not.toBeNull();

    const { container: noGlare } = render(<TiltCard glare={false}>x</TiltCard>);
    expect(getRoot(noGlare).querySelector("[aria-hidden]")).toBeNull();
  });

  it("merges a custom className and sets a displayName", () => {
    const { container } = render(<TiltCard className="custom">x</TiltCard>);
    expect(getRoot(container)).toHaveClass("custom");
    expect(TiltCard.displayName).toBe("TiltCard");
  });
});
