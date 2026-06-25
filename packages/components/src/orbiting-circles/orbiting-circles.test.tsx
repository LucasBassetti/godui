import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { OrbitingCircles } from "./orbiting-circles";

function getRoot(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-slot="orbiting-circles"]',
  ) as HTMLElement;
}

describe("OrbitingCircles", () => {
  it("renders every child", () => {
    const { container } = render(
      <OrbitingCircles>
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </OrbitingCircles>,
    );
    const text = getRoot(container).textContent ?? "";
    expect(text).toContain("a");
    expect(text).toContain("b");
    expect(text).toContain("c");
  });

  it("sizes the container from radius and iconSize", () => {
    const { container } = render(
      <OrbitingCircles radius={100} iconSize={40}>
        <span>a</span>
      </OrbitingCircles>,
    );
    expect(getRoot(container).style.width).toBe("240px");
    expect(getRoot(container).style.height).toBe("240px");
  });

  it("renders the track by default and hides it when showPath is false", () => {
    const { container: withPath } = render(
      <OrbitingCircles>
        <span>a</span>
      </OrbitingCircles>,
    );
    expect(getRoot(withPath).querySelector("[aria-hidden]")).not.toBeNull();

    const { container: noPath } = render(
      <OrbitingCircles showPath={false}>
        <span>a</span>
      </OrbitingCircles>,
    );
    expect(getRoot(noPath).querySelector("[aria-hidden]")).toBeNull();
  });

  it("forwards the ref and sets a displayName", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <OrbitingCircles ref={ref}>
        <span>a</span>
      </OrbitingCircles>,
    );
    expect(ref.current).toBe(getRoot(container));
    expect(OrbitingCircles.displayName).toBe("OrbitingCircles");
  });
});
