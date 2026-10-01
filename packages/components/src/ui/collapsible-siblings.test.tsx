import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as Godui from "./collapsible";

// Two Collapsibles in one parent. jsdom has no layout, so rects are computed
// from the DOM (40px rows, +40px while a panel is open) PLUS any running FLIP
// offset — like a browser's getBoundingClientRect during an animation.
const ROW = 40;
const heightOf = (el: Element) => {
  const panel = el.querySelector('[data-slot="collapsible-content"]');
  return ROW + (panel && !panel.hasAttribute("hidden") ? ROW : 0);
};
const drawn = new Map<Element, number>();
function topOf(el: Element): number {
  if (!el.parentElement?.hasAttribute("data-parent")) return 0;
  let top = 0;
  for (
    let prev = el.previousElementSibling;
    prev;
    prev = prev.previousElementSibling
  ) {
    top += heightOf(prev);
  }
  return top + (drawn.get(el) ?? 0);
}

type Handle = {
  cancel: () => void;
  onfinish: (() => void) | null;
  finished: Promise<void>;
  finish: () => void;
};
const originalRect = Element.prototype.getBoundingClientRect;
const OriginalRO = globalThis.ResizeObserver;
let handles: Handle[];
let calls: Array<{ el: Element; dy: number }>;
let resize: () => void;

beforeEach(() => {
  drawn.clear();
  handles = [];
  calls = [];
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const top = topOf(this);
    return { top, left: 0, width: 300, height: ROW, x: 0, y: top } as DOMRect;
  };
  Element.prototype.animate = function (this: Element, frames: Keyframe[]) {
    const el = this;
    const dy = Number.parseFloat(String(frames[0].translate).split(" ")[1]);
    calls.push({ el, dy });
    drawn.set(el, dy);
    let resolve = () => {};
    const handle: Handle = {
      cancel: () => drawn.delete(el),
      onfinish: null,
      finished: new Promise<void>((r) => {
        resolve = r;
      }),
      finish: () => {
        drawn.delete(el);
        handle.onfinish?.();
        resolve();
      },
    };
    handles.push(handle);
    return handle as unknown as Animation;
  } as Element["animate"];
  const callbacks: Array<() => void> = [];
  resize = () => {
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
  Element.prototype.getBoundingClientRect = originalRect;
  delete (Element.prototype as Partial<Element>).animate;
  globalThis.ResizeObserver = OriginalRO;
});

function Pair() {
  const { Collapsible, CollapsibleContent, CollapsibleTrigger } = Godui;
  return (
    <div data-parent>
      <Collapsible data-testid="a">
        <CollapsibleTrigger>Toggle A</CollapsibleTrigger>
        <CollapsibleContent>Panel A</CollapsibleContent>
      </Collapsible>
      <Collapsible data-testid="b">
        <CollapsibleTrigger>Toggle B</CollapsibleTrigger>
        <CollapsibleContent>Panel B</CollapsibleContent>
      </Collapsible>
      <p data-testid="after">After</p>
    </div>
  );
}

describe("Collapsibles sharing a parent", () => {
  it("opening one, then the other, never moves the clicked one's own header", async () => {
    const user = userEvent.setup();
    render(<Pair />);
    await user.click(screen.getByRole("button", { name: "Toggle A" }));
    // A's FLIP is running on B and the paragraph when both groups observe the resize.
    act(() => resize());
    await act(async () => {
      for (const handle of handles) handle.finish();
      await Promise.resolve();
    });
    calls = [];
    await user.click(screen.getByRole("button", { name: "Toggle B" }));
    expect(calls.find((c) => c.el === screen.getByTestId("b"))).toBeUndefined();
    expect(calls.find((c) => c.el === screen.getByTestId("after"))?.dy).toBe(
      -ROW,
    );
  });
});
