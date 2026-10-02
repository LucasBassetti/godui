import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/collapsible";
import * as GoduiAccordion from "./accordion";
import * as GoduiCollapsible from "./collapsible";

// jsdom has no layout; this models one. Leaves are 40px rows. Stacks (the
// test parent, a panel box, an accordion root, an accordion panel's content)
// stack their children. A Collapsible root is its trigger row, plus an 8px gap
// and its panel while the panel is in the flow (not hidden, not absolute), as
// in shadcn's `flex flex-col gap-2` demo. An accordion item is its trigger row
// plus its open panel. `data-centered` parents are centered on y = 0 (a stage
// that centers them); `data-stage="N"` ones center their content in N px.
const ROW = 40;
const GAP = 8;
const slot = (el: Element | null) => el?.getAttribute("data-slot") ?? "";
const kids = (el: Element) => [...el.children];
function inFlow(box: Element): boolean {
  return (
    !(box as HTMLElement).hidden &&
    (box as HTMLElement).style.position !== "absolute"
  );
}
function isStack(el: Element): boolean {
  return (
    el.hasAttribute("data-parent") ||
    slot(el) === "collapsible-content" ||
    slot(el) === "accordion" ||
    slot(el.parentElement) === "accordion-content"
  );
}
function stackHeight(el: Element): number {
  const loose = [...el.childNodes].some(
    (n) => n.nodeType === 3 && n.textContent?.trim(),
  );
  if (loose || el.children.length === 0) return ROW;
  const sum = kids(el).reduce((s, k) => s + heightOf(k), 0);
  const stage = Number(el.getAttribute("data-stage") ?? 0);
  return Math.max(stage, sum);
}
function heightOf(el: Element): number {
  if (slot(el) === "collapsible") {
    const box = GoduiCollapsibleContentOf(el);
    return ROW + (box && inFlow(box) ? GAP + heightOf(box) : 0);
  }
  if (slot(el) === "accordion-item") {
    const panel = el.querySelector(':scope > [data-slot="accordion-content"]');
    const open = panel?.getAttribute("data-state") === "open";
    const inner = panel?.firstElementChild;
    return ROW + (open && inner ? heightOf(inner) : 0);
  }
  if (isStack(el)) return stackHeight(el);
  return ROW;
}
function GoduiCollapsibleContentOf(root: Element): HTMLElement | null {
  return (
    [
      ...root.querySelectorAll<HTMLElement>(
        '[data-slot="collapsible-content"]',
      ),
    ].find((el) => el.closest('[data-slot="collapsible"]') === root) ?? null
  );
}
/** Extra drawn offset per element (a running glide), in px. */
const drawn = new Map<Element, number>();
function topOf(el: Element): number {
  return layoutTop(el) + (drawn.get(el) ?? 0);
}
function layoutTop(el: Element): number {
  const parent = el.parentElement;
  if (!parent) return 0;
  if (slot(el) === "collapsible-content") {
    const root = el.closest('[data-slot="collapsible"]');
    if (!root) return 0;
    const box = el as HTMLElement;
    if (box.style.position === "absolute") {
      return topOf(root) + (Number.parseFloat(box.style.top) || 0);
    }
    return topOf(root) + ROW + GAP;
  }
  if (slot(el) === "accordion-content") return topOf(parent) + ROW;
  if (isStack(parent)) {
    const base = el.hasAttribute("data-centered")
      ? (heightOf(parent) - heightOf(el)) / 2
      : 0;
    let top = topOf(parent) + base;
    for (let p = el.previousElementSibling; p; p = p.previousElementSibling) {
      top += heightOf(p);
    }
    return top;
  }
  const base = topOf(parent);
  return el.hasAttribute("data-centered") ? base - heightOf(el) / 2 : base;
}

const originalRect = Element.prototype.getBoundingClientRect;
const descriptors = {
  offsetHeight: Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetHeight",
  ),
  offsetWidth: Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetWidth",
  ),
};
type Handle = {
  cancel: ReturnType<typeof vi.fn>;
  onfinish: null;
  finished: Promise<void>;
  finish: () => void;
  playState?: string;
};
let animate: ReturnType<typeof vi.fn>;
let handles: Handle[];
let restore: Array<() => void>;

beforeEach(() => {
  drawn.clear();
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const top = topOf(this);
    const height = heightOf(this);
    return {
      top,
      bottom: top + height,
      left: 0,
      width: 300,
      height,
      x: 0,
      y: top,
    } as DOMRect;
  };
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return heightOf(this);
    },
  });
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      return 300;
    },
  });
  handles = [];
  restore = [];
  animate = vi.fn(() => {
    let resolve = () => {};
    const handle: Handle = {
      cancel: vi.fn(),
      onfinish: null,
      finished: new Promise<void>((r) => {
        resolve = r;
      }),
      finish: () => {
        handle.playState = "finished";
        resolve();
      },
    };
    handles.push(handle);
    return handle;
  });
  Element.prototype.animate = animate as unknown as Element["animate"];
});

afterEach(() => {
  Element.prototype.getBoundingClientRect = originalRect;
  for (const [name, descriptor] of Object.entries(descriptors)) {
    if (descriptor) {
      Object.defineProperty(HTMLElement.prototype, name, descriptor);
    }
  }
  delete (Element.prototype as Partial<Element>).animate;
  document.head.querySelector("style[data-test-anim]")?.remove();
  for (const undo of restore.reverse()) undo();
});

/**
 * Browsers return a live computed style; Radix Presence relies on it to see
 * the closing panel's hold keyframe. jsdom snapshots, so make it live, with
 * optional per-element overrides (e.g. a drawn `translate`).
 */
function liveStyles(
  override: (el: Element, prop: string | symbol) => unknown = () => undefined,
) {
  const real = window.getComputedStyle;
  const spy = vi.spyOn(window, "getComputedStyle").mockImplementation(
    (el: Element) =>
      new Proxy({} as CSSStyleDeclaration, {
        get(_, prop) {
          const forced = override(el, prop);
          if (forced !== undefined) return forced;
          const style = real(el);
          const value = Reflect.get(style, prop);
          return typeof value === "function" ? value.bind(style) : value;
        },
      }),
  );
  const style = document.createElement("style");
  style.dataset.testAnim = "";
  style.textContent =
    '[data-slot$="-content"][data-state="closed"] { animation-name: godui-reveal-hold; }';
  document.head.append(style);
  restore.push(() => spy.mockRestore());
}

function reducedMotion() {
  const original = window.matchMedia;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("reduce"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  restore.push(() => {
    window.matchMedia = original;
  });
}

/** shadcn's demo shape: the panel holds element children. */
function Usage({ ui, open }: { ui: typeof Shadcn; open?: boolean }) {
  const { Collapsible, CollapsibleContent, CollapsibleTrigger } = ui;
  return (
    <div data-parent>
      <p data-testid="before">Before</p>
      <Collapsible defaultOpen={open} className="flex flex-col gap-2">
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-2">
          <div data-testid="one">@radix-ui/colors</div>
          <div data-testid="two">@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>
      <p data-testid="after">After</p>
      <div data-testid="after-2">More</div>
    </div>
  );
}

const { Collapsible, CollapsibleContent, CollapsibleTrigger } =
  GoduiCollapsible;
const box = () =>
  document.querySelector('[data-slot="collapsible-content"]') as HTMLElement;
type Call = {
  el: Element;
  frames: Keyframe[];
  options: KeyframeAnimationOptions;
  handle: Handle;
};
const calls = (): Call[] =>
  animate.mock.calls.map((args, i) => ({
    el: animate.mock.contexts[i] as Element,
    frames: (args as unknown as [Keyframe[]])[0],
    options: (args as unknown as [Keyframe[], KeyframeAnimationOptions])[1],
    handle: handles[i],
  }));
const moves = () => calls().filter((c) => "translate" in c.frames[0]);
const fades = () =>
  calls().filter((c) => "opacity" in c.frames[0] || "filter" in c.frames[0]);
const moveOf = (el: Element | null) => moves().find((m) => m.el === el);
const click = (user: ReturnType<typeof userEvent.setup>, name = "Toggle") =>
  user.click(screen.getByRole("button", { name }));
// Radix suppresses animations on an initially-open panel until the next
// frame; a real click always comes later than that.
const settle = () => new Promise((resolve) => setTimeout(resolve, 50));
// Two 40px rows + the 8px gap the panel adds to the root.
const ROOM = 2 * ROW + GAP;

describe("Collapsible", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} open />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={GoduiCollapsible} open />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(GoduiCollapsible)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("doesn't animate on first paint", async () => {
    render(<Usage ui={GoduiCollapsible} open />);
    await act(settle);
    expect(animate).not.toHaveBeenCalled();
  });

  it("opening sweeps the panel's edge down while its children hold still, and the content after it rides the edge", async () => {
    const user = userEvent.setup();
    render(<Usage ui={GoduiCollapsible} />);
    await click(user);
    const panel = box();
    const [one, two] = [screen.getByTestId("one"), screen.getByTestId("two")];
    // Only what comes after the Collapsible moves; the box starts tucked up
    // by the room the panel takes (its height + the gap), and each child
    // starts that far the other way — net zero, so only the clip edge moves.
    expect(moves().map((m) => m.el)).toEqual([
      screen.getByTestId("after"),
      screen.getByTestId("after-2"),
      panel,
      one,
      two,
    ]);
    expect(moveOf(screen.getByTestId("after"))?.frames[0]).toEqual({
      translate: `0px -${ROOM}px`,
    });
    expect(moveOf(panel)?.frames).toEqual([
      { translate: `0 -${ROOM}px` },
      { translate: "0 0px" },
    ]);
    for (const child of [one, two]) {
      expect(moveOf(child)?.frames).toEqual([
        { translate: `0 ${ROOM}px` },
        { translate: "0 0px" },
      ]);
    }
    // One clock: same duration and curve for followers, edge and children.
    const edge = moveOf(panel);
    for (const m of moves()) {
      expect(m.options.duration).toBe(260);
      expect(m.options.easing).toBe(edge?.options.easing);
    }
    // The children fade in a beat apart.
    expect(fades().map((f) => [f.el, f.options.delay])).toEqual([
      [one, 0],
      [two, 37.5],
    ]);
    expect(fades()[0].frames).toEqual([{ opacity: 0 }, { opacity: 1 }]);
    // ...and still end with the edge: one clock, one last frame.
    for (const f of fades()) {
      expect(Number(f.options.delay) + Number(f.options.duration)).toBe(260);
    }
  });

  it("clips only while the edge sweeps, never at rest", async () => {
    const user = userEvent.setup();
    render(<Usage ui={GoduiCollapsible} />);
    const panel = box();
    expect(panel.className).toContain("data-sweeping:overflow-clip");
    expect(panel.className).not.toMatch(/(^|\s)overflow-(hidden|clip)/);
    await click(user);
    expect(panel).toHaveAttribute("data-sweeping");
    // Mid-sweep the box overlaps the trigger: it lets the pointer through;
    // its children take it back.
    expect(panel.className).toContain("data-sweeping:pointer-events-none");
    expect(panel.className).toContain("data-sweeping:*:pointer-events-auto");
    await act(async () => {
      for (const h of handles) h.finish();
      await settle();
    });
    expect(panel).not.toHaveAttribute("data-sweeping");
  });

  it("closing leaves the flow at once, where it's drawn: the content after it rises while the edge sweeps up, on the quicker clock", async () => {
    liveStyles();
    const user = userEvent.setup();
    render(<Usage ui={GoduiCollapsible} open />);
    await act(settle);
    await click(user);
    const panel = box();
    // Still mounted (held by the no-op keyframe) but out of the flow, pinned
    // where it was drawn: 40px trigger + 8px gap below the root's top.
    expect(panel).toHaveAttribute("data-state", "closed");
    expect(panel.style.position).toBe("absolute");
    expect(panel.style.top).toBe(`${ROW + GAP}px`);
    expect(panel.style.left).toBe("0px");
    expect(panel.style.width).toBe("300px");
    expect(panel.className).toContain(
      "data-[state=closed]:animate-godui-reveal-hold",
    );
    expect(
      document.querySelector('[data-slot="collapsible"]')?.className,
    ).toContain("relative");
    expect(moveOf(screen.getByTestId("after"))?.frames[0]).toEqual({
      translate: `0px ${ROOM}px`,
    });
    const edge = moveOf(panel);
    expect(edge?.frames).toEqual([
      { translate: "0 0px" },
      { translate: `0 -${ROOM}px` },
    ]);
    expect(moveOf(screen.getByTestId("one"))?.frames).toEqual([
      { translate: "0 0px" },
      { translate: `0 ${ROOM}px` },
    ]);
    expect(edge?.options).toMatchObject({ duration: 150, fill: "forwards" });
    for (const m of moves()) expect(m.options.duration).toBe(150);
    // The children fade out ahead of the edge, together.
    expect(fades().map((f) => f.options.delay)).toEqual([0, 0]);
    expect(fades()[0].frames).toEqual([{ opacity: 1 }, { opacity: 0 }]);
    // Radix hides it (and drops its children) once the hold keyframe ends.
    const end = Object.assign(new Event("animationend", { bubbles: true }), {
      animationName: "godui-reveal-hold",
    });
    act(() => {
      panel.dispatchEvent(end);
    });
    await waitFor(() => expect(panel).toHaveAttribute("hidden"));
  });

  it("closing in a parent a stage centers: pinned where it's drawn though leaving the flow moves the root", async () => {
    liveStyles();
    const user = userEvent.setup();
    const { container } = render(<Usage ui={GoduiCollapsible} open />);
    container.querySelector("[data-parent]")?.setAttribute("data-centered", "");
    await act(settle);
    await click(user);
    // The parent shrinks and re-centers (the root moves down) the moment the
    // panel leaves the flow; its offset in the root is still trigger + gap.
    expect(box().style.top).toBe(`${ROW + GAP}px`);
  });

  it("reopening puts the panel back in the flow and starts fresh", async () => {
    liveStyles();
    const user = userEvent.setup();
    render(<Usage ui={GoduiCollapsible} open />);
    await act(settle);
    await click(user);
    for (const h of handles) h.finish();
    animate.mockClear();
    handles.length = 0;
    await click(user);
    const panel = box();
    expect(panel.style.position).toBe("");
    expect(panel.style.top).toBe("");
    expect(panel.style.width).toBe("");
    expect(moveOf(panel)?.frames[0]).toEqual({ translate: `0 -${ROOM}px` });
  });

  it("keeps a caller's inline style through a close and reopen", async () => {
    liveStyles();
    const user = userEvent.setup();
    render(
      <div data-parent>
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent style={{ width: "120px" }}>
            <div>Body</div>
          </CollapsibleContent>
        </Collapsible>
      </div>,
    );
    await act(settle);
    await click(user);
    await click(user);
    expect(box().style.width).toBe("120px");
    expect(box().style.position).toBe("");
  });

  it("reversing mid-sweep carries on from where the edge is drawn", async () => {
    let edgeHandle: Handle | undefined;
    let mid = "";
    liveStyles((el, prop) =>
      prop === "translate" && slot(el) === "collapsible-content"
        ? edgeHandle?.cancel.mock.calls.length
          ? "none"
          : mid
        : undefined,
    );
    const user = userEvent.setup();
    render(<Usage ui={GoduiCollapsible} />);
    await click(user);
    edgeHandle = moveOf(box())?.handle;
    mid = "0px -30px";
    await click(user);
    expect(edgeHandle?.cancel).toHaveBeenCalled();
    const panel = box();
    const edge = moves()
      .filter((m) => m.el === panel)
      .at(-1);
    const child = moves()
      .filter((m) => m.el === screen.getByTestId("one"))
      .at(-1);
    expect(edge?.frames).toEqual([
      { translate: "0 -30px" },
      { translate: `0 -${ROOM}px` },
    ]);
    expect(child?.frames[0]).toEqual({ translate: "0 30px" });
  });

  it("reduced motion: nothing moves; the children only fade", async () => {
    reducedMotion();
    const user = userEvent.setup();
    render(<Usage ui={GoduiCollapsible} />);
    await click(user);
    expect(moves()).toEqual([]);
    expect(fades().map((f) => f.el)).toEqual([
      screen.getByTestId("one"),
      screen.getByTestId("two"),
    ]);
    expect(box()).not.toHaveAttribute("data-sweeping");
  });

  it("asChild content: the child is the box, its children hold still", async () => {
    const user = userEvent.setup();
    render(
      <div data-parent>
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent asChild>
            <section>
              <p data-testid="inside">Panel</p>
            </section>
          </CollapsibleContent>
        </Collapsible>
        <p data-testid="after">After</p>
      </div>,
    );
    await click(user);
    const section = document.querySelector("section");
    expect(section).toBe(box());
    expect(moveOf(section)?.frames[0]).toEqual({
      translate: `0 -${ROW + GAP}px`,
    });
    expect(moveOf(screen.getByTestId("inside"))?.frames[0]).toEqual({
      translate: `0 ${ROW + GAP}px`,
    });
    expect(moveOf(screen.getByTestId("after"))?.frames[0]).toEqual({
      translate: `0px -${ROW + GAP}px`,
    });
  });

  it("loose text in the panel can't hold still: the panel fades, the content after it still glides", async () => {
    const user = userEvent.setup();
    render(
      <div data-parent>
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            Yes. Free to use for personal and commercial projects.
          </CollapsibleContent>
        </Collapsible>
        <p data-testid="after">After</p>
      </div>,
    );
    await click(user);
    expect(moveOf(box())).toBeUndefined();
    expect(fades().map((f) => f.el)).toEqual([box()]);
    // With `filter: opacity()`: the box's own opacity belongs to the hold
    // keyframe, and Chrome won't composite two opacity animations on it.
    expect(fades()[0].frames).toEqual([
      { filter: "opacity(0)" },
      { filter: "opacity(1)" },
    ]);
    expect(moveOf(screen.getByTestId("after"))?.frames[0]).toEqual({
      translate: `0px -${ROW + GAP}px`,
    });
  });

  it("a panel box that paints (a border) would drag it over the trigger: it fades instead", async () => {
    liveStyles((el, prop) => {
      if (slot(el) !== "collapsible-content") return undefined;
      if (prop === "borderTopWidth") return "1px";
      if (prop === "getPropertyValue") {
        return (name: string) =>
          name === "border-top-width"
            ? "1px"
            : name === "border-top-color"
              ? "rgb(228, 228, 231)"
              : "";
      }
      return undefined;
    });
    const user = userEvent.setup();
    render(<Usage ui={GoduiCollapsible} />);
    await click(user);
    expect(moveOf(box())).toBeUndefined();
    expect(fades().map((f) => f.el)).toEqual([box()]);
    expect(moveOf(screen.getByTestId("after"))).toBeDefined();
  });

  it("in a parent that a stage centers, the parent glides instead of jumping", async () => {
    const user = userEvent.setup();
    const { container } = render(<Usage ui={GoduiCollapsible} />);
    const parent = container.querySelector("[data-parent]") as HTMLElement;
    parent.setAttribute("data-centered", "");
    await click(user);
    // The parent grows by the panel's room; the stage moves it up by half.
    const glide = moveOf(parent);
    expect(glide?.frames).toEqual([
      { translate: `0px ${ROOM / 2}px` },
      { translate: "0px 0px" },
    ]);
    const edge = moveOf(box());
    expect(glide?.options).toMatchObject({
      duration: edge?.options.duration,
      easing: edge?.options.easing,
    });
  });

  it("centered alone in a fixed stage, the Collapsible itself glides (FLIP)", async () => {
    const user = userEvent.setup();
    render(
      <div data-parent data-stage="400">
        <Collapsible data-centered data-testid="root">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>One</div>
          </CollapsibleContent>
        </Collapsible>
      </div>,
    );
    await click(user);
    expect(moveOf(screen.getByTestId("root"))?.frames[0]).toEqual({
      translate: `0px ${(ROW + GAP) / 2}px`,
    });
  });

  it("toggles with Enter and Space on the trigger", async () => {
    const user = userEvent.setup();
    render(<Usage ui={GoduiCollapsible} />);
    const trigger = screen.getByRole("button", { name: "Toggle" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(" ");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("passes a React 19 callback ref's cleanup through (Collapsible)", () => {
    const cleanup = vi.fn();
    const seen: Array<HTMLElement | null> = [];
    const ref = (node: HTMLDivElement | null) => {
      seen.push(node);
      return cleanup;
    };
    const { unmount } = render(
      <Collapsible ref={ref}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Body</CollapsibleContent>
      </Collapsible>,
    );
    expect(seen).toEqual([document.querySelector('[data-slot="collapsible"]')]);
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
    // React calls the cleanup instead of ref(null).
    expect(seen).not.toContain(null);
  });
});

describe("Collapsible nesting", () => {
  function Nested({ stage }: { stage?: number }) {
    return (
      <div data-parent data-centered="">
        <Collapsible defaultOpen data-testid="outer">
          <CollapsibleTrigger>Outer</CollapsibleTrigger>
          <CollapsibleContent>
            <div data-parent data-stage={stage}>
              <Collapsible
                data-testid="inner"
                data-centered={stage ? "" : undefined}
              >
                <CollapsibleTrigger>Inner</CollapsibleTrigger>
                <CollapsibleContent>
                  <div data-testid="inner-body">Inner body</div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <p data-testid="after">After</p>
      </div>
    );
  }

  it("an inner Collapsible's change moves the outer one's followers on the same clock; only the inner panel sweeps", async () => {
    const user = userEvent.setup();
    render(<Nested />);
    await act(settle);
    await click(user, "Inner");
    const [outerBox, innerBox] = document.querySelectorAll(
      '[data-slot="collapsible-content"]',
    );
    expect(moveOf(screen.getByTestId("after"))?.frames[0]).toEqual({
      translate: `0px -${ROW + GAP}px`,
    });
    expect(moveOf(innerBox)?.frames[0]).toEqual({
      translate: `0 -${ROW + GAP}px`,
    });
    expect(moveOf(outerBox)).toBeUndefined();
    const edge = moveOf(innerBox);
    for (const m of moves()) {
      expect(m.options.duration).toBe(edge?.options.duration);
      expect(m.options.easing).toBe(edge?.options.easing);
    }
  });

  it("a nested Collapsible that rides its outer one's glide doesn't glide again", async () => {
    const user = userEvent.setup();
    render(<Nested />);
    await act(settle);
    await click(user, "Inner");
    const parents = document.querySelectorAll("[data-parent]");
    // The centered outer parent glides up half the room; the inner parent
    // moved by exactly as much, so it rides along.
    expect(moveOf(parents[0])?.frames[0]).toEqual({
      translate: `0px ${(ROW + GAP) / 2}px`,
    });
    expect(moveOf(parents[1])).toBeUndefined();
  });

  it("a nested Collapsible its own stage re-centers glides by that move alone", async () => {
    const user = userEvent.setup();
    render(<Nested stage={200} />);
    await act(settle);
    await click(user, "Inner");
    // The inner stage keeps the outer panel's height: the outer content
    // doesn't move; the inner root re-centers by half the room, in a fixed
    // parent, so it FLIPs there.
    expect(moveOf(screen.getByTestId("inner"))?.frames[0]).toEqual({
      translate: `0px ${(ROW + GAP) / 2}px`,
    });
    expect(moveOf(document.querySelector("[data-parent]"))).toBeUndefined();
  });

  it("a closing inner panel leaves the flow before the outer one measures, whichever observer runs first", async () => {
    liveStyles();
    const user = userEvent.setup();
    // The inner Collapsible mounts after the outer one (its observer is the
    // later one), the order that used to measure the outer before the inner
    // panel left the flow.
    render(
      <div data-parent>
        <Collapsible data-testid="outer">
          <CollapsibleTrigger>Outer</CollapsibleTrigger>
          <CollapsibleContent>
            <div data-parent>
              <Collapsible defaultOpen>
                <CollapsibleTrigger>Inner</CollapsibleTrigger>
                <CollapsibleContent>
                  <div>Inner body</div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <p data-testid="after">After</p>
      </div>,
    );
    await click(user, "Outer");
    await act(settle);
    animate.mockClear();
    handles.length = 0;
    await click(user, "Inner");
    expect(moveOf(screen.getByTestId("after"))?.frames[0]).toEqual({
      translate: `0px ${ROW + GAP}px`,
    });
  });

  it("inside an Accordion: the rows below ride the Collapsible's edge", async () => {
    const { Accordion, AccordionContent, AccordionItem, AccordionTrigger } =
      GoduiAccordion;
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>
            <Collapsible>
              <CollapsibleTrigger>Inner</CollapsibleTrigger>
              <CollapsibleContent>
                <div>Inner body</div>
              </CollapsibleContent>
            </Collapsible>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>B body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await act(settle);
    await click(user, "Inner");
    const rowB = screen
      .getByRole("button", { name: "B" })
      .closest('[data-slot="accordion-item"]');
    const innerBox = box();
    expect(moveOf(rowB)?.frames[0]).toEqual({
      translate: `0px -${ROW + GAP}px`,
    });
    expect(moveOf(innerBox)?.frames[0]).toEqual({
      translate: `0 -${ROW + GAP}px`,
    });
    expect(moveOf(rowB)?.options.duration).toBe(
      moveOf(innerBox)?.options.duration,
    );
    expect(moveOf(rowB)?.options.easing).toBe(moveOf(innerBox)?.options.easing);
  });

  it("an Accordion inside a Collapsible: the content after the Collapsible rides the accordion's edge", async () => {
    const { Accordion, AccordionContent, AccordionItem, AccordionTrigger } =
      GoduiAccordion;
    const user = userEvent.setup();
    render(
      <div data-parent>
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Outer</CollapsibleTrigger>
          <CollapsibleContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="a">
                <AccordionTrigger>A</AccordionTrigger>
                <AccordionContent>A body</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CollapsibleContent>
        </Collapsible>
        <p data-testid="after">After</p>
      </div>,
    );
    await act(settle);
    await click(user, "A");
    expect(moveOf(screen.getByTestId("after"))?.frames[0]).toEqual({
      translate: `0px -${ROW}px`,
    });
  });
});

describe("Collapsible nesting in a stage that centers the outer root", () => {
  // The outer Collapsible sits directly in a fixed-height stage that centers
  // it: when the inner panel opens, the stage moves the outer root (its
  // parent group FLIPs it back) while its glider — the stage — stays put. The
  // inner root rides that FLIP; gliding it too would move it twice as far.
  function Stage({
    inner,
    open = true,
  }: {
    inner: "collapsible" | "accordion";
    open?: boolean;
  }) {
    const { Accordion, AccordionContent, AccordionItem, AccordionTrigger } =
      GoduiAccordion;
    return (
      <div data-parent data-stage="400">
        <Collapsible defaultOpen={open} data-centered="" data-testid="outer">
          <CollapsibleTrigger>Outer</CollapsibleTrigger>
          <CollapsibleContent>
            {inner === "collapsible" ? (
              <div data-parent data-testid="inner-parent">
                <Collapsible>
                  <CollapsibleTrigger>Inner</CollapsibleTrigger>
                  <CollapsibleContent>
                    <div>Inner body</div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ) : (
              <Accordion type="single" collapsible data-testid="inner-root">
                <AccordionItem value="a">
                  <AccordionTrigger>Inner</AccordionTrigger>
                  <AccordionContent>Inner body</AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  for (const inner of ["collapsible", "accordion"] as const) {
    const glider = () =>
      screen.getByTestId(
        inner === "collapsible" ? "inner-parent" : "inner-root",
      );
    // The inner one opens 48px (collapsible: row + gap) or 40px (accordion).
    const half = (inner === "collapsible" ? ROW + GAP : ROW) / 2;

    it(`inner ${inner} mounted with the outer one (its observer runs first): only the outer root's FLIP moves it`, async () => {
      const user = userEvent.setup();
      render(<Stage inner={inner} />);
      await act(settle);
      await click(user, "Inner");
      expect(moveOf(screen.getByTestId("outer"))?.frames[0]).toEqual({
        translate: `0px ${half}px`,
      });
      expect(moveOf(glider())).toBeUndefined();
    });

    it(`inner ${inner} mounted after the outer one (its observer runs last): only the outer root's FLIP moves it`, async () => {
      const user = userEvent.setup();
      render(<Stage inner={inner} open={false} />);
      await click(user, "Outer");
      await act(settle);
      animate.mockClear();
      handles.length = 0;
      await click(user, "Inner");
      expect(moveOf(screen.getByTestId("outer"))?.frames[0]).toEqual({
        translate: `0px ${half}px`,
      });
      expect(moveOf(glider())).toBeUndefined();
    });
  }
});

describe("Collapsible fallbacks and clamps", () => {
  for (const [label, child] of [
    [
      "an inline child",
      <span key="s" style={{ display: "inline" }}>
        Inline
      </span>,
    ],
    [
      "a display: contents child",
      <div key="d" style={{ display: "contents" }}>
        Contents
      </div>,
    ],
  ] as const) {
    it(`${label} ignores translate: the panel fades instead`, async () => {
      const user = userEvent.setup();
      render(
        <div data-parent>
          <Collapsible>
            <CollapsibleTrigger>Toggle</CollapsibleTrigger>
            <CollapsibleContent>{child}</CollapsibleContent>
          </Collapsible>
          <p data-testid="after">After</p>
        </div>,
      );
      await click(user);
      expect(moveOf(box())).toBeUndefined();
      expect(fades().map((f) => f.el)).toEqual([box()]);
      expect(moveOf(screen.getByTestId("after"))).toBeDefined();
    });
  }

  it("a 0ms clock never makes a negative duration or a delay past it", async () => {
    const real = window.getComputedStyle.bind(window);
    liveStyles((el, prop) =>
      prop === "getPropertyValue" && slot(el) === "collapsible"
        ? (name: string) =>
            name === "--godui-duration-base"
              ? "0ms"
              : real(el).getPropertyValue(name)
        : undefined,
    );
    const user = userEvent.setup();
    render(<Usage ui={GoduiCollapsible} />);
    await click(user);
    expect(fades()).toHaveLength(2);
    for (const call of calls()) {
      expect(Number(call.options.duration)).toBeGreaterThanOrEqual(0);
      expect(Number(call.options.delay ?? 0)).toBeLessThanOrEqual(0);
    }
  });
});

describe("Collapsible root positioning", () => {
  it("is relative by class, so a closing panel has a fixed anchor", () => {
    render(<Collapsible className="flex" />);
    const root = document.querySelector('[data-slot="collapsible"]');
    expect(root?.className).toContain("relative");
  });

  it("asChild: no relative class (Slot would concatenate it); inline relative only on a static child", () => {
    render(
      <>
        <Collapsible asChild>
          <li data-testid="static">Static</li>
        </Collapsible>
        <Collapsible asChild>
          <li data-testid="pinned" style={{ position: "absolute" }}>
            Pinned
          </li>
        </Collapsible>
      </>,
    );
    const plain = screen.getByTestId("static");
    const pinned = screen.getByTestId("pinned");
    expect(plain.className).not.toContain("relative");
    expect(pinned.className).not.toContain("relative");
    expect(plain.style.position).toBe("relative");
    expect(pinned.style.position).toBe("absolute");
  });
});
