import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FluidCursor } from "./fluid-cursor";

function mockMatchMedia(fine: boolean, reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("pointer: fine")
      ? fine
      : query.includes("reduce")
        ? reduce
        : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("FluidCursor", () => {
  it("renders the cursor on a fine pointer without reduced motion", () => {
    mockMatchMedia(true, false);
    render(<FluidCursor />);
    expect(
      document.body.querySelector('[data-slot="fluid-cursor"]'),
    ).not.toBeNull();
  });

  it("renders nothing on a coarse (touch) pointer", () => {
    mockMatchMedia(false, false);
    render(<FluidCursor />);
    expect(
      document.body.querySelector('[data-slot="fluid-cursor"]'),
    ).toBeNull();
  });

  it("renders nothing under reduced motion", () => {
    mockMatchMedia(true, true);
    render(<FluidCursor />);
    expect(
      document.body.querySelector('[data-slot="fluid-cursor"]'),
    ).toBeNull();
  });
});
