import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AsciiDither } from "./ascii-dither";

class ImmediateImage {
  crossOrigin = "";
  naturalWidth = 0;
  naturalHeight = 0;
  onload: (() => void) | null = null;

  set src(_value: string) {
    this.onload?.();
  }
}

function mockMeasuredLayout(width: number, height: number) {
  const widthDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "clientWidth",
  );
  const heightDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "clientHeight",
  );

  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    value: height,
  });

  return () => {
    if (widthDescriptor) {
      Object.defineProperty(
        HTMLElement.prototype,
        "clientWidth",
        widthDescriptor,
      );
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
    }
    if (heightDescriptor) {
      Object.defineProperty(
        HTMLElement.prototype,
        "clientHeight",
        heightDescriptor,
      );
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, "clientHeight");
    }
  };
}

function renderAndCaptureDimensions(cellSize: number) {
  const restoreLayout = mockMeasuredLayout(80, 60);
  const widthAssignments: number[] = [];
  const heightAssignments: number[] = [];
  const canvasDescriptors = {
    width: Object.getOwnPropertyDescriptor(
      HTMLCanvasElement.prototype,
      "width",
    ),
    height: Object.getOwnPropertyDescriptor(
      HTMLCanvasElement.prototype,
      "height",
    ),
  };
  const getContextDescriptor = Object.getOwnPropertyDescriptor(
    HTMLCanvasElement.prototype,
    "getContext",
  );
  const context = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    setTransform: vi.fn(),
  } as unknown as CanvasRenderingContext2D;

  for (const [dimension, assignments] of [
    ["width", widthAssignments],
    ["height", heightAssignments],
  ] as const) {
    const descriptor = canvasDescriptors[dimension];
    if (!descriptor?.get || !descriptor.set) {
      throw new Error(`Canvas ${dimension} descriptor is unavailable`);
    }
    Object.defineProperty(HTMLCanvasElement.prototype, dimension, {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: descriptor.get,
      set(value: number) {
        assignments.push(value);
        descriptor.set?.call(this, value);
      },
    });
  }
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: vi.fn(() => context),
  });

  vi.stubGlobal("Image", ImmediateImage);
  let rendered: ReturnType<typeof render> | undefined;
  try {
    expect(() => {
      rendered = render(
        <AsciiDither
          color="red"
          reveal={false}
          src="/poster.png"
          type="image"
          cellSize={cellSize}
        />,
      );
    }).not.toThrow();

    return { heightAssignments, widthAssignments };
  } finally {
    rendered?.unmount();
    restoreLayout();
    for (const dimension of ["width", "height"] as const) {
      const descriptor = canvasDescriptors[dimension];
      if (descriptor) {
        Object.defineProperty(
          HTMLCanvasElement.prototype,
          dimension,
          descriptor,
        );
      } else {
        Reflect.deleteProperty(HTMLCanvasElement.prototype, dimension);
      }
    }
    if (getContextDescriptor) {
      Object.defineProperty(
        HTMLCanvasElement.prototype,
        "getContext",
        getContextDescriptor,
      );
    } else {
      Reflect.deleteProperty(HTMLCanvasElement.prototype, "getContext");
    }
  }
}

describe("AsciiDither", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates its visibility observer in the portaled document's realm", () => {
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
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: vi.fn(() => context),
    });
    Object.defineProperty(
      Object.getPrototypeOf(frameDocument.createElement("canvas")),
      "getContext",
      {
        configurable: true,
        value: vi.fn(() => context),
      },
    );

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

  it.each([
    { label: "zero", cellSize: 0 },
    { label: "negative", cellSize: -4 },
    { label: "NaN", cellSize: Number.NaN },
    { label: "positive infinity", cellSize: Number.POSITIVE_INFINITY },
    { label: "negative infinity", cellSize: Number.NEGATIVE_INFINITY },
  ])("keeps canvas geometry finite and positive for a $label cellSize", ({
    cellSize,
  }) => {
    const { heightAssignments, widthAssignments } =
      renderAndCaptureDimensions(cellSize);
    const offscreenWidth = widthAssignments[widthAssignments.length - 1];
    const offscreenHeight = heightAssignments[heightAssignments.length - 1];

    expect(widthAssignments.every((value) => Number.isFinite(value))).toBe(
      true,
    );
    expect(heightAssignments.every((value) => Number.isFinite(value))).toBe(
      true,
    );
    expect(offscreenWidth).toBe(80);
    expect(offscreenHeight).toBe(60);
    expect(offscreenWidth).toBeGreaterThan(0);
    expect(offscreenHeight).toBeGreaterThan(0);
  });

  it("preserves grid density for a valid cellSize", () => {
    const { heightAssignments, widthAssignments } =
      renderAndCaptureDimensions(4);

    expect(widthAssignments[widthAssignments.length - 1]).toBe(20);
    expect(heightAssignments[heightAssignments.length - 1]).toBe(15);
  });
});
