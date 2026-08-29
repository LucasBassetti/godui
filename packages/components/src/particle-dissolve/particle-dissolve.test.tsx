import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("framer-motion", () => ({
  useReducedMotion: () => false,
}));

import { ParticleDissolve } from "./particle-dissolve";

const fillRect = vi.fn();
const context = {
  clearRect: vi.fn(),
  fillRect,
  fillText: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(8 * 8 * 4).fill(255),
  })),
  scale: vi.fn(),
} as unknown as CanvasRenderingContext2D;

let frameCallback: FrameRequestCallback | undefined;
let frameId = 0;
const requestFrame = vi.fn((callback: FrameRequestCallback) => {
  frameCallback = callback;
  frameId += 1;
  return frameId;
});

async function sampleCount(density: number) {
  const { unmount } = render(
    <ParticleDissolve density={density} trigger="mount" width={8} height={8} />,
  );

  await act(async () => {});

  act(() => {
    frameCallback?.(0);
  });

  const count = fillRect.mock.calls.length;
  unmount();
  return count;
}

beforeEach(() => {
  frameCallback = undefined;
  frameId = 0;
  vi.clearAllMocks();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  vi.stubGlobal("requestAnimationFrame", requestFrame);
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ParticleDissolve", () => {
  it.each([
    ["zero", 0],
    ["negative", -1],
    ["NaN", Number.NaN],
    ["Infinity", Number.POSITIVE_INFINITY],
  ])("uses a safe sampling step for %s density", async (_label, density) => {
    expect(await sampleCount(density)).toBe(4);
  });

  it("keeps sampling unchanged for a valid density", async () => {
    expect(await sampleCount(2)).toBe(16);
  });
});
