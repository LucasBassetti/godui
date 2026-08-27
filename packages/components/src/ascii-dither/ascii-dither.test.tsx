import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AsciiDither } from "./ascii-dither";

type MockImage = {
  crossOrigin: string;
  naturalHeight: number;
  naturalWidth: number;
  onload: (() => void) | null;
  src: string;
};

const drawingMethods = [
  "arc",
  "clearRect",
  "drawImage",
  "fill",
  "fillRect",
  "fillText",
  "setTransform",
] as const;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function setupCanvas() {
  const context = Object.fromEntries([
    ...drawingMethods.map((method) => [method, vi.fn()]),
    [
      "getImageData",
      vi.fn(() => ({
        data: new Uint8ClampedArray([102, 102, 102, 255]),
      })),
    ],
  ]) as unknown as CanvasRenderingContext2D;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  return { context };
}

function setupImage() {
  const image: MockImage = {
    crossOrigin: "",
    naturalHeight: 1,
    naturalWidth: 1,
    onload: null,
    src: "",
  };
  vi.stubGlobal(
    "Image",
    vi.fn(() => image),
  );
  return image;
}

function setupMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  });
}

function renderDither(ditherType: "bayer" | "floyd-steinberg", levels: number) {
  setupMatchMedia();
  const image = setupImage();
  const { context } = setupCanvas();
  const rendered = render(
    <AsciiDither
      color="red"
      ditherType={ditherType}
      levels={levels}
      reveal={false}
      src="/poster.png"
      variant="dither"
    />,
  );
  const root = rendered.container.querySelector<HTMLElement>(
    '[data-slot="ascii-dither"]',
  );
  if (!root) throw new Error("AsciiDither root was not rendered");
  Object.defineProperties(root, {
    clientHeight: { configurable: true, value: 8 },
    clientWidth: { configurable: true, value: 8 },
  });
  if (!image.onload) throw new Error("Mock image did not receive onload");
  act(() => image.onload?.());
  return { context, ...rendered };
}

function expectFiniteDrawingArguments(context: CanvasRenderingContext2D) {
  for (const method of drawingMethods) {
    const calls = (
      context[method] as unknown as { mock: { calls: unknown[][] } }
    ).mock.calls;
    for (const call of calls) {
      for (const argument of call) {
        if (typeof argument === "number") {
          expect(Number.isFinite(argument)).toBe(true);
        }
      }
    }
  }
}

describe("AsciiDither", () => {
  it("creates its visibility observer in the portaled document's realm", () => {
    setupMatchMedia();
    const parentObserver = vi.fn();
    class ParentIntersectionObserver {
      constructor() {
        parentObserver();
      }

      observe() {}
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", ParentIntersectionObserver);

    const frame = document.createElement("iframe");
    document.body.appendChild(frame);
    const frameDocument = frame.contentDocument;
    const frameWindow = frame.contentWindow;
    if (!frameDocument || !frameWindow) {
      throw new Error("jsdom did not create an iframe document");
    }

    const frameObserve = vi.fn();
    const frameDisconnect = vi.fn();
    const frameObserver = vi.fn();
    class FrameIntersectionObserver {
      constructor() {
        frameObserver();
      }

      observe(target: Element) {
        frameObserve(target);
      }

      disconnect() {
        frameDisconnect();
      }
    }
    Object.defineProperty(frameWindow, "IntersectionObserver", {
      configurable: true,
      value: FrameIntersectionObserver,
    });

    const context = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context,
    );
    vi.spyOn(
      Object.getPrototypeOf(frameDocument.createElement("canvas")),
      "getContext",
    ).mockReturnValue(context);

    const { container, unmount } = render(
      <AsciiDither color="red" src="/poster.png" />,
      { container: frameDocument.body },
    );

    const root = container.querySelector<HTMLElement>(
      '[data-slot="ascii-dither"]',
    );
    expect(root).not.toBeNull();
    expect(frameObserver).toHaveBeenCalledOnce();
    expect(parentObserver).not.toHaveBeenCalled();
    expect(frameObserve).toHaveBeenCalledOnce();
    expect(frameObserve.mock.calls[0]?.[0]).toBe(root);

    unmount();
    expect(frameDisconnect).toHaveBeenCalledOnce();
    frame.remove();
  });

  describe.each([
    "bayer",
    "floyd-steinberg",
  ] as const)("%s dithering", (ditherType) => {
    it.each([
      1,
      0,
      -1,
      2.5,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ])("normalizes invalid levels (%s) to the level-2 output", (levels) => {
      const expected = renderDither(ditherType, 2);
      const expectedCalls = (
        expected.context.fillRect as unknown as {
          mock: { calls: unknown[][] };
        }
      ).mock.calls;
      expected.unmount();

      const actual = renderDither(ditherType, levels);
      const actualCalls = (
        actual.context.fillRect as unknown as {
          mock: { calls: unknown[][] };
        }
      ).mock.calls;
      expect(actualCalls).toEqual(expectedCalls);
      expectFiniteDrawingArguments(actual.context);
      actual.unmount();
    });

    it("keeps valid level counts distinct", () => {
      const level2 = renderDither(ditherType, 2);
      const level2Calls = (
        level2.context.fillRect as unknown as {
          mock: { calls: unknown[][] };
        }
      ).mock.calls;
      level2.unmount();

      const level3 = renderDither(ditherType, 3);
      const level3Calls = (
        level3.context.fillRect as unknown as {
          mock: { calls: unknown[][] };
        }
      ).mock.calls;
      expect(level3Calls).not.toEqual(level2Calls);
      expectFiniteDrawingArguments(level3.context);
      level3.unmount();
    });
  });
});
