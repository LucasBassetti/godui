import { render } from "@testing-library/react";
import * as React from "react";
import { vi } from "vitest";
import { useFlipGroup } from "./use-flip-group";

type Pt = { left: number; top: number };
const layout = new Map<string, Pt>();
const offset = new Map<string, Pt>();

function Group({ trigger, order }: { trigger: number; order: string[] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useFlipGroup(ref, trigger, { duration: 200 });
  return (
    <div ref={ref}>
      {order.map((id) => (
        <div key={id} data-flip data-id={id} />
      ))}
    </div>
  );
}

let animate: ReturnType<typeof vi.fn>;
beforeEach(() => {
  layout.clear();
  offset.clear();
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const id = this.dataset.id;
      const base = (id && layout.get(id)) || { left: 0, top: 0 };
      const off = (id && offset.get(id)) || { left: 0, top: 0 };
      const left = base.left + off.left;
      const top = base.top + off.top;
      return {
        left,
        top,
        x: left,
        y: top,
        width: 10,
        height: 10,
        right: left + 10,
        bottom: top + 10,
        toJSON() {},
      } as DOMRect;
    },
  );
  animate = vi.fn(function (this: HTMLElement) {
    const id = this.dataset.id as string;
    return { cancel: () => offset.delete(id) };
  });
  (HTMLElement.prototype as unknown as { animate: unknown }).animate = animate;
  window.matchMedia = vi
    .fn()
    .mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
});
afterEach(() => {
  vi.restoreAllMocks();
  delete (HTMLElement.prototype as unknown as { animate?: unknown }).animate;
});

describe("useFlipGroup", () => {
  it("does not animate on first mount", () => {
    layout.set("a", { left: 0, top: 0 });
    render(<Group trigger={0} order={["a"]} />);
    expect(animate).not.toHaveBeenCalled();
  });

  it("plays the inverse translate for children that moved when the trigger changes", () => {
    layout.set("a", { left: 0, top: 0 });
    layout.set("b", { left: 0, top: 40 });
    const { rerender } = render(<Group trigger={0} order={["a", "b"]} />);
    layout.set("b", { left: 0, top: 100 });
    rerender(<Group trigger={1} order={["a", "b"]} />);
    expect(animate).toHaveBeenCalledTimes(1);
    // The individual `translate` property, replace-composited: Chrome runs it
    // on the compositor (composite:"add" falls back to the main thread), and it
    // sits outside the element's own scale/rotate.
    expect(animate.mock.calls[0][0]).toEqual([
      { translate: "0px -60px" },
      { translate: "0px 0px" },
    ]);
    expect(animate.mock.calls[0][1]).toMatchObject({ duration: 200 });
    expect(animate.mock.calls[0][1].composite ?? "replace").toBe("replace");
  });

  it("measures from the current visual position (interrupted FLIP)", () => {
    layout.set("b", { left: 0, top: 40 });
    const { rerender } = render(<Group trigger={0} order={["b"]} />);
    layout.set("b", { left: 0, top: 100 });
    rerender(<Group trigger={1} order={["b"]} />);
    // Halfway through: the running FLIP draws b 30px above its slot (visually at 70).
    offset.set("b", { left: 0, top: -30 });
    // Layout jumps back to 40 before the animation finishes.
    layout.set("b", { left: 0, top: 40 });
    rerender(<Group trigger={2} order={["b"]} />);
    // Visual 70 → layout 40: start 30px below rest, not from the stale 100.
    expect(animate.mock.calls[1][0][0]).toEqual({ translate: "0px 30px" });
  });

  it("does nothing under prefers-reduced-motion", () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
    }) as unknown as typeof window.matchMedia;
    layout.set("a", { left: 0, top: 0 });
    const { rerender } = render(<Group trigger={0} order={["a"]} />);
    layout.set("a", { left: 0, top: 50 });
    rerender(<Group trigger={1} order={["a"]} />);
    expect(animate).not.toHaveBeenCalled();
  });

  it("adds the FLIP offset on top of the element's own translate", () => {
    layout.set("c", { left: 0, top: 0 });
    const { rerender, container } = render(<Group trigger={0} order={["c"]} />);
    const el = container.querySelector<HTMLElement>('[data-id="c"]');
    if (!el) throw new Error("missing");
    el.style.translate = "4px 8px";
    layout.set("c", { left: 0, top: 20 });
    rerender(<Group trigger={1} order={["c"]} />);
    expect(animate.mock.calls[0][0]).toEqual([
      { translate: "4px -12px" },
      { translate: "4px 8px" },
    ]);
  });

  it("is a no-op when element.animate is unavailable", () => {
    delete (HTMLElement.prototype as unknown as { animate?: unknown }).animate;
    layout.set("a", { left: 0, top: 0 });
    const { rerender } = render(<Group trigger={0} order={["a"]} />);
    layout.set("a", { left: 0, top: 50 });
    expect(() => rerender(<Group trigger={1} order={["a"]} />)).not.toThrow();
  });
});

describe("useFlipGroup baseline and tokens", () => {
  // ResizeObserver stand-in; tests fire it to simulate a layout change that
  // no trigger accounts for (an image loading in an open panel, a reflow).
  let fire: () => void;
  const Original = globalThis.ResizeObserver;
  beforeEach(() => {
    const callbacks: Array<() => void> = [];
    fire = () => {
      for (const cb of callbacks) cb();
    };
    globalThis.ResizeObserver = class {
      constructor(cb: () => void) {
        callbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });
  afterEach(() => {
    globalThis.ResizeObserver = Original;
  });

  it("re-baselines without animating when layout changes between triggers", () => {
    layout.set("a", { left: 0, top: 0 });
    layout.set("b", { left: 0, top: 40 });
    const { rerender } = render(<Group trigger={0} order={["a", "b"]} />);
    layout.set("b", { left: 0, top: 240 });
    fire();
    expect(animate).not.toHaveBeenCalled();
    rerender(<Group trigger={1} order={["a", "b"]} />);
    expect(animate).not.toHaveBeenCalled();
  });

  it("applies a resize that lands mid-FLIP once the FLIP finishes", () => {
    const handles: Array<{ onfinish: (() => void) | null }> = [];
    animate.mockImplementation(() => {
      const handle = { cancel: () => {}, onfinish: null };
      handles.push(handle);
      return handle;
    });
    layout.set("a", { left: 0, top: 0 });
    layout.set("b", { left: 0, top: 40 });
    const { rerender } = render(<Group trigger={0} order={["a", "b"]} />);
    layout.set("b", { left: 0, top: 100 });
    rerender(<Group trigger={1} order={["a", "b"]} />);
    expect(animate).toHaveBeenCalledTimes(1);
    layout.set("b", { left: 0, top: 150 });
    fire();
    handles[0].onfinish?.();
    rerender(<Group trigger={2} order={["a", "b"]} />);
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it("defaults the duration to --godui-duration-base (ms or s)", () => {
    function Tokened({ trigger }: { trigger: number }) {
      const ref = React.useRef<HTMLDivElement>(null);
      useFlipGroup(ref, trigger);
      return (
        <div
          ref={ref}
          style={{ "--godui-duration-base": "0.4s" } as React.CSSProperties}
        >
          <div data-flip data-id="b" />
        </div>
      );
    }
    layout.set("b", { left: 0, top: 40 });
    const { rerender } = render(<Tokened trigger={0} />);
    layout.set("b", { left: 0, top: 100 });
    rerender(<Tokened trigger={1} />);
    expect(animate.mock.calls[0][1]).toMatchObject({ duration: 400 });
  });
});
