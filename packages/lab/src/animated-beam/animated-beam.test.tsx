import { render } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { AnimatedBeam, type AnimatedBeamProps } from "./animated-beam";

function Harness(props: Partial<AnimatedBeamProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef}>
      <div ref={fromRef} />
      <div ref={toRef} />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={fromRef}
        toRef={toRef}
        {...props}
      />
    </div>
  );
}

describe("AnimatedBeam", () => {
  it("renders an svg overlay with two paths", () => {
    const { container } = render(<Harness />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.querySelectorAll("path")).toHaveLength(2);
  });

  it("applies pathDashArray to the resting path", () => {
    const { container } = render(<Harness pathDashArray="4 5" />);
    const restingPath = container.querySelector("path");
    expect(restingPath).toHaveAttribute("stroke-dasharray", "4 5");
  });

  it("renders a gradient definition for the travelling beam", () => {
    const { container } = render(<Harness />);
    expect(container.querySelector("linearGradient")).not.toBeNull();
  });
});
