import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ParticleDissolve } from "./particle-dissolve";

const context = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(64) })),
  scale: vi.fn(),
} as unknown as CanvasRenderingContext2D;

let intersectionCallback: IntersectionObserverCallback | undefined;
const observe = vi.fn();
const disconnect = vi.fn();
let frameCallback: FrameRequestCallback | undefined;
let frameId = 0;
const requestFrame = vi.fn((callback: FrameRequestCallback) => {
  frameCallback = callback;
  frameId += 1;
  return frameId;
});
const cancelFrame = vi.fn();

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: number[] = [];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  observe = observe;
  unobserve = vi.fn();
  disconnect = disconnect;
  takeRecords = () => [];
}

async function flushBuild() {
  await act(async () => {});
}

beforeEach(() => {
  frameCallback = undefined;
  frameId = 0;
  intersectionCallback = undefined;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  vi.stubGlobal("requestAnimationFrame", requestFrame);
  vi.stubGlobal("cancelAnimationFrame", cancelFrame);
  observe.mockClear();
  disconnect.mockClear();
  requestFrame.mockClear();
  cancelFrame.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ParticleDissolve", () => {
  it("waits for in-view before starting RAF and cleans up the observer", async () => {
    const { unmount } = render(
      <ParticleDissolve trigger="in-view" width={4} height={4} />,
    );

    await flushBuild();

    expect(requestFrame).not.toHaveBeenCalled();
    expect(observe).toHaveBeenCalledOnce();

    unmount();

    expect(disconnect).toHaveBeenCalledOnce();
    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it("starts one loop when the in-view trigger fires and cancels it on unmount", async () => {
    const { unmount } = render(
      <ParticleDissolve trigger="in-view" width={4} height={4} />,
    );
    await flushBuild();

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(requestFrame).toHaveBeenCalledOnce();
    unmount();
    expect(cancelFrame).toHaveBeenCalledWith(1);
  });

  it("waits for hover before starting RAF", async () => {
    const { container } = render(
      <ParticleDissolve trigger="hover" width={4} height={4} />,
    );
    await flushBuild();

    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(requestFrame).not.toHaveBeenCalled();

    fireEvent.pointerEnter(canvas as HTMLCanvasElement);

    expect(requestFrame).toHaveBeenCalledOnce();
  });

  it("stops a one-shot loop after it settles", async () => {
    render(
      <ParticleDissolve trigger="mount" mode="assemble" width={4} height={4} />,
    );
    await flushBuild();

    expect(requestFrame).toHaveBeenCalledOnce();
    act(() => {
      for (let i = 0; i < 200; i++) frameCallback?.(0);
    });
    const callsAfterSettling = requestFrame.mock.calls.length;

    act(() => {
      frameCallback?.(0);
    });
    expect(requestFrame).toHaveBeenCalledTimes(callsAfterSettling);
  });

  it("clears the loop timer on cleanup", async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(
      <ParticleDissolve trigger="mount" mode="loop" width={4} height={4} />,
    );
    await flushBuild();

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2600);
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
