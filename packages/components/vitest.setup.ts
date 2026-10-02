import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

// jsdom polyfills for browser APIs the components / framer-motion / rough-notation
// reach for but jsdom does not implement. They no-op so renders don't throw.

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (!("IntersectionObserver" in globalThis)) {
  globalThis.IntersectionObserver = class {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

// Test output stays pristine: a React "not wrapped in act(...)" warning fails
// the test that logged it (wrap the update — an event, a timer, a settle —
// in act()). The warning is still printed, so the failing test shows why.
const actWarnings: string[] = [];
const consoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  const [message, ...rest] = args;
  if (typeof message === "string" && message.includes("not wrapped in act(")) {
    let i = 0;
    actWarnings.push(
      message.split("\n")[0].replace(/%s/g, () => String(rest[i++])),
    );
  }
  consoleError(...args);
};
afterEach(() => {
  if (actWarnings.length === 0) return;
  const found = actWarnings.splice(0);
  throw new Error(`React act() warning(s):\n${found.join("\n")}`);
});
