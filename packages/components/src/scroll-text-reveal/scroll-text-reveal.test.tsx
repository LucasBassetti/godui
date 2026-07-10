import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { ScrollTextReveal } from "./scroll-text-reveal";

const COPY = "Design is how it works";

describe("ScrollTextReveal", () => {
  it("exposes the full copy for assistive tech via aria-label", () => {
    const { container } = render(<ScrollTextReveal>{COPY}</ScrollTextReveal>);
    expect(
      container.querySelector("[aria-label]")?.getAttribute("aria-label"),
    ).toBe(COPY);
  });

  it("keeps a screen-reader copy and hides the animated segments", () => {
    const { container } = render(<ScrollTextReveal>{COPY}</ScrollTextReveal>);
    expect(container.querySelector(".sr-only")?.textContent).toBe(COPY);
    // Every visible segment is aria-hidden so the label isn't read twice.
    const segments = container.querySelectorAll("[aria-hidden]");
    expect(segments.length).toBeGreaterThan(0);
  });

  it("renders as the requested element", () => {
    const { container } = render(
      <ScrollTextReveal as="h2">{COPY}</ScrollTextReveal>,
    );
    expect(container.querySelector("h2")).not.toBeNull();
  });

  it("forwards the ref and merges a custom className", () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <ScrollTextReveal ref={ref} className="custom">
        {COPY}
      </ScrollTextReveal>,
    );
    const root = container.querySelector(".custom") as HTMLElement;
    expect(root).not.toBeNull();
    expect(ref.current).toBe(root);
    expect(ScrollTextReveal.displayName).toBe("ScrollTextReveal");
  });

  it("renders with keepRevealed enabled", () => {
    const { container } = render(
      <ScrollTextReveal keepRevealed>{COPY}</ScrollTextReveal>,
    );
    expect(container.querySelector(".sr-only")?.textContent).toBe(COPY);
  });
});
