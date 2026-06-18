import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Highlighter } from "./highlighter";

describe("Highlighter", () => {
  it("renders its children", () => {
    render(<Highlighter>Important</Highlighter>);
    expect(screen.getByText("Important")).toBeInTheDocument();
  });

  it("forwards the ref to the wrapping span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Highlighter ref={ref}>A</Highlighter>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("sets a displayName", () => {
    expect(Highlighter.displayName).toBe("Highlighter");
  });

  it("adds dark text for the default highlight action", () => {
    render(<Highlighter>A</Highlighter>);
    expect(screen.getByText("A")).toHaveClass("text-neutral-950");
  });

  it("keeps inherited color for non-highlight actions", () => {
    render(<Highlighter action="underline">A</Highlighter>);
    expect(screen.getByText("A")).not.toHaveClass("text-neutral-950");
  });

  it("merges a custom className", () => {
    render(<Highlighter className="custom">A</Highlighter>);
    expect(screen.getByText("A")).toHaveClass("inline-block", "custom");
  });

  it("renders without drawing when isView is set and never in view", () => {
    // IntersectionObserver is stubbed to never fire, so the annotation is
    // skipped but children must still render.
    render(<Highlighter isView>Deferred</Highlighter>);
    expect(screen.getByText("Deferred")).toBeInTheDocument();
  });
});
