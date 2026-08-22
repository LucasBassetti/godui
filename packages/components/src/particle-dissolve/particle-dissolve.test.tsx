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

let intersectionCallback: IntersectionObserverCallback;
const observe = vi.fn();
const disconnect = vi.fn();

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

async function flushEffects() {
  await act(async () => {});
}

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn(() => 1),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  observe.mockClear();
  disconnect.mockClear();
});

describe("ParticleDissolve", () => {
  it("waits for in-view before starting RAF and disconnects the observer on cleanup", async () => {
    const { container, unmount } = render(
      <ParticleDissolve trigger="in-view" width={4} height={4} />,
    );

    await flushEffects();

    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(observe).toHaveBeenCalled();

    unmount();

    expect(disconnect).toHaveBeenCalled();
    expect(container.querySelector("canvas")).toBeNull();

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it("starts RAF when the in-view trigger fires", async () => {
    render(<ParticleDissolve trigger="in-view" width={4} height={4} />);
    await flushEffects();

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(requestAnimationFrame).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalled();
  });

  it("waits for hover before starting RAF", async () => {
    const { container } = render(
      <ParticleDissolve trigger="hover" width={4} height={4} />,
    );
    await flushEffects();

    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(requestAnimationFrame).not.toHaveBeenCalled();

    fireEvent.pointerEnter(canvas as HTMLCanvasElement);

    expect(requestAnimationFrame).toHaveBeenCalledOnce();
  });
});
