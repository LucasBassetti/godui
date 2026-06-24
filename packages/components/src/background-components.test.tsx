import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GeometricBackground } from "./geometric-background";
import { PixelGrid } from "./pixel-grid";

describe("GeometricBackground", () => {
  it("renders the baked default style when given no props", () => {
    const { container } = render(<GeometricBackground />);
    const el = container.querySelector<HTMLElement>(
      '[data-slot="geometric-background"]',
    );
    expect(el).not.toBeNull();
    expect(el?.style.backgroundImage).not.toBe("");
  });

  it("lets the caller own the background via the style prop", () => {
    const { container } = render(
      <GeometricBackground
        style={{ backgroundColor: "rgb(1, 2, 3)", backgroundSize: "40px 40px" }}
      />,
    );
    const el = container.querySelector<HTMLElement>(
      '[data-slot="geometric-background"]',
    );
    // Owning the background drops the baked default image entirely.
    expect(el?.style.backgroundColor).toBe("rgb(1, 2, 3)");
    expect(el?.style.backgroundSize).toBe("40px 40px");
    expect(el?.style.backgroundImage).toBe("");
  });

  it("keeps the baked background when style has no background keys", () => {
    const { container } = render(
      <GeometricBackground style={{ opacity: 0.5 }} />,
    );
    const el = container.querySelector<HTMLElement>(
      '[data-slot="geometric-background"]',
    );
    expect(el?.style.opacity).toBe("0.5");
    expect(el?.style.backgroundImage).not.toBe("");
  });

  it("forwards arbitrary div attributes and className", () => {
    const { container } = render(
      <GeometricBackground className="custom" data-testid="bg" />,
    );
    const el = container.querySelector<HTMLElement>(
      '[data-slot="geometric-background"]',
    );
    expect(el?.className).toContain("custom");
    expect(el?.getAttribute("data-testid")).toBe("bg");
  });
});

describe("PixelGrid", () => {
  it("renders a canvas inside the container", () => {
    const { container } = render(<PixelGrid />);
    const el = container.querySelector<HTMLElement>('[data-slot="pixel-grid"]');
    expect(el).not.toBeNull();
    expect(el?.querySelector("canvas")).not.toBeNull();
  });

  it("accepts an explicit color without crashing", () => {
    const { container } = render(<PixelGrid color="oklch(0.7 0.18 280)" />);
    expect(
      container.querySelector('[data-slot="pixel-grid"] canvas'),
    ).not.toBeNull();
  });

  it("forwards arbitrary div attributes and className", () => {
    const { container } = render(
      <PixelGrid className="custom" data-testid="grid" />,
    );
    const el = container.querySelector<HTMLElement>('[data-slot="pixel-grid"]');
    expect(el?.className).toContain("custom");
    expect(el?.getAttribute("data-testid")).toBe("grid");
  });

  it("unmounts cleanly without leaking animation frames", () => {
    const { unmount } = render(<PixelGrid />);
    expect(() => unmount()).not.toThrow();
  });
});
