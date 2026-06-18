import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { TextAnimate } from "./text-animate";

describe("TextAnimate", () => {
  it("renders the text content", () => {
    const { container } = render(<TextAnimate>Animate me</TextAnimate>);
    expect(container.textContent).toContain("Animate me");
  });

  it("forwards the ref and defaults to a <p> element", () => {
    const ref = createRef<HTMLElement>();
    render(<TextAnimate ref={ref}>Hi</TextAnimate>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it("sets a displayName", () => {
    expect(TextAnimate.displayName).toBe("TextAnimate");
  });

  it("renders as the requested element via `as`", () => {
    const ref = createRef<HTMLElement>();
    render(
      <TextAnimate as="h2" ref={ref}>
        Heading
      </TextAnimate>,
    );
    expect(ref.current?.tagName).toBe("H2");
  });

  it("exposes an accessible label with the full text by default", () => {
    const { container } = render(<TextAnimate>Read me</TextAnimate>);
    expect(container.querySelector("[aria-label='Read me']")).not.toBeNull();
    // visible segments are hidden from the a11y tree
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  it("splits into one segment per character when by='character'", () => {
    const { container } = render(
      <TextAnimate by="character" accessible={false}>
        abc
      </TextAnimate>,
    );
    // 3 character segments, each an inline-block span
    const segments = container.querySelectorAll(".inline-block");
    expect(segments).toHaveLength(3);
  });

  it("merges a custom className onto the root", () => {
    const ref = createRef<HTMLElement>();
    render(
      <TextAnimate className="custom" ref={ref}>
        Hi
      </TextAnimate>,
    );
    expect(ref.current).toHaveClass("whitespace-pre-wrap", "custom");
  });
});
