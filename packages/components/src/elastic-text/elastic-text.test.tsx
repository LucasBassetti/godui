import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { ElasticText } from "./elastic-text";

describe("ElasticText", () => {
  it("renders the full text content across its segments", () => {
    const { container } = render(<ElasticText>Hello</ElasticText>);
    const root = container.querySelector("[data-slot='elastic-text']");
    expect(root?.textContent).toBe("Hello");
  });

  it("splits the text into one segment per character", () => {
    const { container } = render(<ElasticText>abc</ElasticText>);
    expect(container.querySelectorAll("[data-elastic-segment]")).toHaveLength(
      3,
    );
  });

  it("forwards the ref to the root span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<ElasticText ref={ref}>Hi</ElasticText>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("sets a displayName", () => {
    expect(ElasticText.displayName).toBe("ElasticText");
  });

  it("merges a custom className", () => {
    const { container } = render(
      <ElasticText className="custom">Hi</ElasticText>,
    );
    expect(container.querySelector("[data-slot='elastic-text']")).toHaveClass(
      "custom",
    );
  });

  it("renders without a segment list when there is no text", () => {
    const { container } = render(
      <ElasticText>
        <span aria-hidden />
      </ElasticText>,
    );
    const root = container.querySelector("[data-slot='elastic-text']");
    expect(root).not.toBeNull();
    expect(container.querySelectorAll("[data-elastic-segment]")).toHaveLength(
      0,
    );
  });

  it("accepts hover mode and still renders the text", () => {
    const { container } = render(
      <ElasticText mode="hover">Hover me</ElasticText>,
    );
    expect(
      container.querySelector("[data-slot='elastic-text']")?.textContent,
    ).toBe("Hover me");
  });
});
