import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AsciiDither } from "./ascii-dither";

describe("AsciiDither", () => {
  it.each([
    ["bayer", 1],
    ["bayer", 0],
    ["bayer", Number.NaN],
    ["floyd-steinberg", 1],
    ["floyd-steinberg", 0],
    ["floyd-steinberg", Number.NaN],
  ] as const)("keeps fillRect coordinates finite for %s dithering with levels=%s", async (ditherType, levels) => {
    const originalGetContext = Object.getOwnPropertyDescriptor(
      HTMLCanvasElement.prototype,
      "getContext",
    );
    const fillRect = vi.fn();
    const context = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      fillRect,
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([0, 0, 0, 255]),
      })),
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    class MockImage {
      naturalWidth = 1;
      naturalHeight = 1;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      crossOrigin = "";

      set src(_value: string) {
        queueMicrotask(() => this.onload?.());
      }
    }

    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: vi.fn(() => context),
    });
    vi.stubGlobal("Image", MockImage as unknown as typeof Image);

    let unmount: (() => void) | undefined;
    try {
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
      unmount = rendered.unmount;

      await waitFor(() => expect(fillRect).toHaveBeenCalled());

      expect(rendered.container.querySelector("canvas")).not.toBeNull();
      for (const args of fillRect.mock.calls) {
        expect(args.every((value) => Number.isFinite(value))).toBe(true);
      }
    } finally {
      unmount?.();
      vi.unstubAllGlobals();
      if (originalGetContext) {
        Object.defineProperty(
          HTMLCanvasElement.prototype,
          "getContext",
          originalGetContext,
        );
      } else {
        delete (HTMLCanvasElement.prototype as { getContext?: unknown })
          .getContext;
      }
    }
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
});
