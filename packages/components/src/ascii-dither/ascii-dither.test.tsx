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

function captureVideo() {
  let video: HTMLVideoElement | null = null;
  const createElement = document.createElement.bind(document);
  vi.spyOn(document, "createElement").mockImplementation((tagName) => {
    const element = createElement(tagName);
    if (tagName === "video") video = element as HTMLVideoElement;
    return element;
  });
  return () => {
    if (!video) throw new Error("Video element was not created");
    return video;
  };
}

function setupAnimationFrame() {
  let nextId = 0;
  const request = vi.fn((_callback: FrameRequestCallback) => ++nextId);
  const cancel = vi.fn((_id: number) => {});
  vi.stubGlobal("requestAnimationFrame", request);
  vi.stubGlobal("cancelAnimationFrame", cancel);
  return { cancel, request };
}

function setupVideoState(video: HTMLVideoElement) {
  let currentTime = 0;
  let paused = true;
  let ended = false;
  Object.defineProperties(video, {
    currentTime: {
      configurable: true,
      get: () => currentTime,
      set: (value: number) => {
        currentTime = value;
      },
    },
    ended: { configurable: true, get: () => ended },
    paused: { configurable: true, get: () => paused },
    videoHeight: { configurable: true, value: 1 },
    videoWidth: { configurable: true, value: 1 },
  });
  const play = vi.spyOn(video, "play").mockImplementation(() => {
    paused = false;
    return Promise.resolve();
  });
  vi.spyOn(video, "pause").mockImplementation(() => {
    paused = true;
  });
  vi.spyOn(video, "load").mockImplementation(() => {});
  return {
    end() {
      paused = true;
      ended = true;
    },
    pause() {
      paused = true;
    },
    play() {
      paused = false;
    },
    playMethod: play,
  };
}

class ImmediateImage {
  crossOrigin = "";
  naturalHeight = 0;
  naturalWidth = 0;
  onload: (() => void) | null = null;

  set src(_value: string) {
    this.onload?.();
  }
}

function captureGridDimensions(cellSize: number) {
  const widthDescriptor = Object.getOwnPropertyDescriptor(
    HTMLCanvasElement.prototype,
    "width",
  );
  const heightDescriptor = Object.getOwnPropertyDescriptor(
    HTMLCanvasElement.prototype,
    "height",
  );
  if (
    !widthDescriptor?.get ||
    !widthDescriptor.set ||
    !heightDescriptor?.get ||
    !heightDescriptor.set
  ) {
    throw new Error("Canvas dimension descriptors are unavailable");
  }

  const widthAssignments: number[] = [];
  const heightAssignments: number[] = [];
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    setTransform: vi.fn(),
  } as unknown as CanvasRenderingContext2D);
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    value: 80,
  });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    value: 60,
  });
  for (const [dimension, descriptor, assignments] of [
    ["width", widthDescriptor, widthAssignments],
    ["height", heightDescriptor, heightAssignments],
  ] as const) {
    Object.defineProperty(HTMLCanvasElement.prototype, dimension, {
      configurable: true,
      get: descriptor.get,
      set(value: number) {
        assignments.push(value);
        descriptor.set?.call(this, value);
      },
    });
  }
  vi.stubGlobal("Image", ImmediateImage);
  setupMatchMedia();
  const rendered = render(
    <AsciiDither
      cellSize={cellSize}
      color="red"
      reveal={false}
      src="/poster.png"
      type="image"
    />,
  );
  rendered.unmount();
  Object.defineProperty(HTMLCanvasElement.prototype, "width", widthDescriptor);
  Object.defineProperty(
    HTMLCanvasElement.prototype,
    "height",
    heightDescriptor,
  );
  return { heightAssignments, widthAssignments };
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

  it("does not loop a paused video when autoplay is disabled", () => {
    setupMatchMedia();
    setupCanvas();
    const getVideo = captureVideo();
    const { request } = setupAnimationFrame();
    const rendered = render(
      <AsciiDither
        autoPlay={false}
        color="red"
        loop={false}
        reveal={false}
        src="/clip.mp4"
        type="video"
      />,
    );
    const video = getVideo();
    const state = setupVideoState(video);

    act(() => video.dispatchEvent(new Event("loadeddata")));

    expect(state.playMethod).not.toHaveBeenCalled();
    expect(request).not.toHaveBeenCalled();
    rendered.unmount();
  });

  it("syncs the loop with video playback and paints the terminal frame", () => {
    setupMatchMedia();
    const { context } = setupCanvas();
    const getVideo = captureVideo();
    const { cancel, request } = setupAnimationFrame();
    const rendered = render(
      <AsciiDither
        autoPlay={false}
        color="red"
        loop={false}
        reveal={false}
        src="/clip.mp4"
        type="video"
      />,
    );
    const video = getVideo();
    const state = setupVideoState(video);

    act(() => video.dispatchEvent(new Event("loadeddata")));
    expect(request).not.toHaveBeenCalled();

    state.play();
    act(() => video.dispatchEvent(new Event("play")));
    expect(request).toHaveBeenCalledTimes(1);

    state.pause();
    act(() => video.dispatchEvent(new Event("pause")));
    expect(cancel).toHaveBeenLastCalledWith(1);

    state.play();
    act(() => video.dispatchEvent(new Event("play")));
    expect(request).toHaveBeenCalledTimes(2);

    const drawImage = context.drawImage as unknown as {
      mock: { calls: unknown[][] };
    };
    const clearRect = context.clearRect as unknown as {
      mock: { calls: unknown[][] };
    };
    const drawsBeforeEnded = drawImage.mock.calls.length;
    const clearsBeforeEnded = clearRect.mock.calls.length;
    state.end();
    act(() => video.dispatchEvent(new Event("ended")));

    expect(cancel).toHaveBeenLastCalledWith(2);
    expect(drawImage.mock.calls.length).toBeGreaterThan(drawsBeforeEnded);
    expect(clearRect.mock.calls.length).toBeGreaterThan(clearsBeforeEnded);
    rendered.unmount();
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

  it.each([
    0,
    -4,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])("keeps grid dimensions finite for cellSize %s", (cellSize) => {
    const { heightAssignments, widthAssignments } =
      captureGridDimensions(cellSize);
    expect(widthAssignments.every(Number.isFinite)).toBe(true);
    expect(heightAssignments.every(Number.isFinite)).toBe(true);
    expect(widthAssignments.at(-1)).toBe(80);
    expect(heightAssignments.at(-1)).toBe(60);
  });

  it("preserves grid density for valid cell sizes", () => {
    const { heightAssignments, widthAssignments } = captureGridDimensions(4);
    expect(widthAssignments.at(-1)).toBe(20);
    expect(heightAssignments.at(-1)).toBe(15);
  });
});
