import { vi } from "vitest";

function createMediaQueryList(query: string) {
  return {
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  } as unknown as MediaQueryList;
}

export function createOwnerRealmHarness() {
  const events: string[] = [];
  const parentMatchMedia = vi.fn((query: string) =>
    createMediaQueryList(query),
  );
  const parentRaf = vi.fn(() => 1);

  vi.spyOn(window, "matchMedia").mockImplementation(parentMatchMedia);
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(parentRaf);
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(vi.fn());

  const parentResizeObserver = vi.fn();
  class ParentResizeObserver {
    constructor() {
      parentResizeObserver();
    }

    observe() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ParentResizeObserver);

  const parentIntersectionObserver = vi.fn();
  class ParentIntersectionObserver {
    constructor() {
      parentIntersectionObserver();
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

  const frameMatchMedia = vi.fn((query: string) => createMediaQueryList(query));
  Object.defineProperty(frameWindow, "matchMedia", {
    configurable: true,
    value: frameMatchMedia,
  });

  const frameResizeConstructor = vi.fn();
  const frameResizeObserve = vi.fn();
  const frameResizeDisconnect = vi.fn();
  class FrameResizeObserver {
    constructor() {
      frameResizeConstructor();
      events.push("resize-constructor");
    }

    observe(target: Element) {
      frameResizeObserve(target);
      events.push("resize-observe");
    }

    disconnect() {
      frameResizeDisconnect();
    }
  }
  Object.defineProperty(frameWindow, "ResizeObserver", {
    configurable: true,
    value: FrameResizeObserver,
  });

  const frameIntersectionConstructor = vi.fn();
  const frameIntersectionObserve = vi.fn();
  const frameIntersectionDisconnect = vi.fn();
  class FrameIntersectionObserver {
    constructor() {
      frameIntersectionConstructor();
      events.push("intersection-constructor");
    }

    observe(target: Element) {
      frameIntersectionObserve(target);
      events.push("intersection-observe");
    }

    disconnect() {
      frameIntersectionDisconnect();
    }
  }
  Object.defineProperty(frameWindow, "IntersectionObserver", {
    configurable: true,
    value: FrameIntersectionObserver,
  });

  const frameRaf = vi.fn(() => {
    events.push("raf");
    return 1;
  });
  const frameCancel = vi.fn();
  Object.defineProperty(frameWindow, "requestAnimationFrame", {
    configurable: true,
    value: frameRaf,
  });
  Object.defineProperty(frameWindow, "cancelAnimationFrame", {
    configurable: true,
    value: frameCancel,
  });

  const parentVisibilityAdd = vi.spyOn(document, "addEventListener");
  const parentVisibilityRemove = vi.spyOn(document, "removeEventListener");
  const frameVisibilityAdd = vi.spyOn(frameDocument, "addEventListener");
  const frameVisibilityRemove = vi.spyOn(frameDocument, "removeEventListener");

  const context = {
    arc: vi.fn(),
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray([102, 102, 102, 255]),
    })),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    setTransform: vi.fn(),
    stroke: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  vi.spyOn(
    Object.getPrototypeOf(frameDocument.createElement("canvas")),
    "getContext",
  ).mockReturnValue(context);

  return {
    events,
    frame,
    frameCancel,
    frameDocument,
    frameIntersectionConstructor,
    frameIntersectionDisconnect,
    frameIntersectionObserve,
    frameMatchMedia,
    frameRaf,
    frameResizeConstructor,
    frameResizeDisconnect,
    frameResizeObserve,
    frameWindow,
    frameVisibilityAdd,
    frameVisibilityRemove,
    parentIntersectionObserver,
    parentMatchMedia,
    parentRaf,
    parentResizeObserver,
    parentVisibilityAdd,
    parentVisibilityRemove,
  };
}

export function resetOwnerRealmTestEnvironment() {
  vi.restoreAllMocks();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => createMediaQueryList(query),
  });
}
