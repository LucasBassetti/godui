import { act, render, waitFor } from "@testing-library/react";
import * as React from "react";
import { useActiveIndicator } from "./use-active-indicator";

// jsdom has no layout: offset* read data-x/w attributes.
const GEOMETRY = [
  ["offsetLeft", "data-x"],
  ["offsetTop", "data-y"],
  ["offsetWidth", "data-w"],
  ["offsetHeight", "data-h"],
] as const;
const saved = GEOMETRY.map(([prop]) => [
  prop,
  Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop),
]);
let animate: ReturnType<typeof vi.fn>;
let handles: Array<{
  cancel: ReturnType<typeof vi.fn>;
  onfinish: (() => void) | null;
}>;
let resizeCallbacks: Array<() => void>;
const OriginalResizeObserver = globalThis.ResizeObserver;

beforeEach(() => {
  for (const [prop, attr] of GEOMETRY) {
    Object.defineProperty(HTMLElement.prototype, prop, {
      configurable: true,
      get() {
        return Number(this.getAttribute(attr) ?? 0);
      },
    });
  }
  handles = [];
  animate = vi.fn(() => {
    const handle = { cancel: vi.fn(), onfinish: null };
    handles.push(handle);
    return handle;
  });
  Element.prototype.animate = animate as unknown as Element["animate"];
  resizeCallbacks = [];
  globalThis.ResizeObserver = class {
    constructor(cb: () => void) {
      resizeCallbacks.push(cb);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

afterEach(() => {
  for (const [prop, descriptor] of saved) {
    if (descriptor)
      Object.defineProperty(HTMLElement.prototype, prop as string, descriptor);
  }
  delete (Element.prototype as Partial<Element>).animate;
  globalThis.ResizeObserver = OriginalResizeObserver;
});

type Item = { id: string; x: number; w: number };

function List({
  items,
  active,
  enabled = true,
}: {
  items: Item[];
  active: string;
  enabled?: boolean;
}) {
  const container = React.useRef<HTMLDivElement>(null);
  const indicator = React.useRef<HTMLSpanElement>(null);
  useActiveIndicator(container, indicator, {
    active: '[data-state="on"]',
    items: "button",
    enabled,
  });
  return (
    <div ref={container} data-testid="list">
      <span ref={indicator} data-testid="indicator" />
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          data-state={item.id === active ? "on" : "off"}
          data-x={item.x}
          data-w={item.w}
          data-h="30"
        >
          {item.id}
        </button>
      ))}
    </div>
  );
}

const ITEMS: Item[] = [
  { id: "a", x: 0, w: 80 },
  { id: "b", x: 84, w: 100 },
];
const el = (id: string) =>
  document.querySelector(`[data-testid="${id}"]`) as HTMLElement;

describe("useActiveIndicator", () => {
  it("places the indicator without animating and marks the container ready", () => {
    render(<List items={ITEMS} active="a" />);
    expect(el("indicator").style.translate).toBe("0px 0px");
    expect(el("indicator").style.width).toBe("80px");
    expect(el("list")).toHaveAttribute("data-indicator", "ready");
    expect(animate).not.toHaveBeenCalled();
  });

  it("slides with translate + scale when the active element changes", async () => {
    const { rerender } = render(<List items={ITEMS} active="a" />);
    rerender(<List items={ITEMS} active="b" />);
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    const [frames] = animate.mock.calls[0] as unknown as [Keyframe[]];
    expect(frames[0]).toMatchObject({ translate: "0px 0px", scale: "0.8 1" });
    expect(frames[1]).toMatchObject({ translate: "84px 0px", scale: "1 1" });
  });

  it("snaps when an item is inserted before the active one", async () => {
    const { rerender } = render(<List items={ITEMS} active="b" />);
    rerender(
      <List
        items={[
          { id: "new", x: 0, w: 40 },
          { id: "a", x: 44, w: 80 },
          { id: "b", x: 128, w: 100 },
        ]}
        active="b"
      />,
    );
    await waitFor(() =>
      expect(el("indicator").style.translate).toBe("128px 0px"),
    );
    expect(animate).not.toHaveBeenCalled();
  });

  it("applies a resize that lands mid-slide once the slide finishes", async () => {
    const { rerender } = render(<List items={ITEMS} active="a" />);
    rerender(<List items={ITEMS} active="b" />);
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    document.querySelector('[data-state="on"]')?.setAttribute("data-w", "120");
    act(() => {
      for (const cb of resizeCallbacks) cb();
    });
    expect(el("indicator").style.width).toBe("100px");
    act(() => handles[0].onfinish?.());
    expect(el("indicator").style.width).toBe("120px");
  });

  it("disabled: removes data-indicator", () => {
    const { rerender } = render(<List items={ITEMS} active="a" />);
    rerender(<List items={ITEMS} active="a" enabled={false} />);
    expect(el("list")).not.toHaveAttribute("data-indicator");
  });

  it("reduced motion: moves without animating", async () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    try {
      const { rerender } = render(<List items={ITEMS} active="a" />);
      rerender(<List items={ITEMS} active="b" />);
      await waitFor(() =>
        expect(el("indicator").style.translate).toBe("84px 0px"),
      );
      expect(animate).not.toHaveBeenCalled();
    } finally {
      window.matchMedia = original;
    }
  });
});
