import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/accordion";
import * as Godui from "./accordion";

// jsdom has no layout. A row is 40px; an open panel adds its own height: 40px,
// plus the rows of any accordion nested in it. A closing panel has left the
// flow (it's absolute), so only open panels take up room.
const ROW = 40;
const isOpenPanel = (el: Element | null) =>
  el?.getAttribute("data-slot") === "accordion-content" &&
  el.getAttribute("data-state") === "open";
const panelOf = (item: Element) =>
  item.querySelector(':scope > [data-slot="accordion-content"]');
function nestedItems(panel: Element): Element[] {
  return [...panel.querySelectorAll('[data-slot="accordion-item"]')].filter(
    (item) =>
      item.parentElement?.closest('[data-slot="accordion-content"]') === panel,
  );
}
function panelHeight(panel: Element): number {
  return ROW + nestedItems(panel).reduce((sum, i) => sum + heightOf(i), 0);
}
function heightOf(item: Element): number {
  const panel = panelOf(item);
  return ROW + (isOpenPanel(panel) && panel ? panelHeight(panel) : 0);
}
// When set, the top-level accordion sits in a parent that centers it
// vertically: it moves up by half of any height it gains.
let centered = false;
function topOf(el: Element): number {
  const slot = el.getAttribute("data-slot");
  if (slot === "accordion") {
    const panel = el.parentElement?.closest('[data-slot="accordion-content"]');
    if (panel) return topOf(panel);
    if (!centered) return 0;
    const rows = [...el.children].filter(
      (c) => c.getAttribute("data-slot") === "accordion-item",
    );
    return -rows.reduce((sum, r) => sum + heightOf(r), 0) / 2;
  }
  if (slot === "accordion-content") {
    const item = el.parentElement;
    return item ? topOf(item) + ROW : 0;
  }
  if (slot !== "accordion-item") return 0;
  let top = el.parentElement ? topOf(el.parentElement) : 0;
  for (let p = el.previousElementSibling; p; p = p.previousElementSibling) {
    top += heightOf(p);
  }
  return top;
}

const originalRect = Element.prototype.getBoundingClientRect;
const originalOffsetHeight = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "offsetHeight",
);
type Handle = {
  cancel: ReturnType<typeof vi.fn>;
  onfinish: null;
  finished: Promise<never>;
};
let animate: ReturnType<typeof vi.fn>;
let handles: Handle[];
let restore: Array<() => void>;

beforeEach(() => {
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const top = topOf(this);
    return { top, left: 0, width: 300, height: ROW, x: 0, y: top } as DOMRect;
  };
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return this.getAttribute("data-slot") === "accordion-content"
        ? panelHeight(this)
        : 0;
    },
  });
  handles = [];
  restore = [];
  animate = vi.fn(() => {
    const handle: Handle = {
      cancel: vi.fn(),
      onfinish: null,
      finished: new Promise<never>(() => {}),
    };
    handles.push(handle);
    return handle;
  });
  Element.prototype.animate = animate as unknown as Element["animate"];
});

afterEach(() => {
  centered = false;
  Element.prototype.getBoundingClientRect = originalRect;
  if (originalOffsetHeight) {
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetHeight",
      originalOffsetHeight,
    );
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
    '[data-slot="accordion-content"][data-state="closed"] { animation-name: godui-accordion-hold; }';
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

function Usage({
  ui,
  defaultValue,
}: {
  ui: typeof Shadcn;
  defaultValue?: string;
}) {
  const { Accordion, AccordionContent, AccordionItem, AccordionTrigger } = ui;
  return (
    <Accordion type="single" collapsible defaultValue={defaultValue}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Product Information</AccordionTrigger>
        <AccordionContent>Our flagship product.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Shipping Details</AccordionTrigger>
        <AccordionContent>We offer worldwide shipping.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Return Policy</AccordionTrigger>
        <AccordionContent>30-day returns.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const items = () => [
  ...document.querySelectorAll('[data-slot="accordion-item"]'),
];
const panel = () =>
  document.querySelector('[data-slot="accordion-content"]') as HTMLElement;
type Call = {
  el: Element;
  frames: Keyframe[];
  options: KeyframeAnimationOptions;
};
const calls = (): Call[] =>
  animate.mock.calls.map((args, i) => ({
    el: animate.mock.contexts[i] as Element,
    frames: (args as unknown as [Keyframe[]])[0],
    options: (args as unknown as [Keyframe[], KeyframeAnimationOptions])[1],
  }));
const moves = () => calls().filter((c) => "translate" in c.frames[0]);
const fades = () => calls().filter((c) => "opacity" in c.frames[0]);
const click = (user: ReturnType<typeof userEvent.setup>, name: string) =>
  user.click(screen.getByRole("button", { name }));
// Radix suppresses animations on an initially-open panel until the next
// frame; a real click always comes later than that.
const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

describe("Accordion", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} defaultValue="item-1" />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} defaultValue="item-1" />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("doesn't animate on first paint", () => {
    render(<Usage ui={Godui} defaultValue="item-1" />);
    expect(animate).not.toHaveBeenCalled();
  });

  it("opening sweeps the panel's edge down while its text holds still, and the rows below ride the edge", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await click(user, "Product Information");
    const box = panel();
    const content = box.firstElementChild;
    expect(moves().map((m) => m.el)).toEqual([
      items()[1],
      items()[2],
      box,
      content,
    ]);
    const [row, , edge, text] = moves();
    expect(row.frames[0]).toMatchObject({ translate: "0px -40px" });
    // The box starts fully tucked under the trigger; its content starts the
    // same distance the other way — net zero, so only the clip edge moves.
    expect(edge.frames).toEqual([
      { translate: "0 -40px" },
      { translate: "0 0px" },
    ]);
    expect(text.frames).toEqual([
      { translate: "0 40px" },
      { translate: "0 0px" },
    ]);
    // One clock: same duration and curve for rows and edge.
    for (const m of moves()) {
      expect(m.options.duration).toBe(edge.options.duration);
      expect(m.options.easing).toBe(edge.options.easing);
    }
    expect(edge.options.duration).toBe(260);
  });

  it("closing leaves the flow at once: the rows rise while the edge sweeps up, on the quicker clock", async () => {
    liveStyles();
    const user = userEvent.setup();
    render(<Usage ui={Godui} defaultValue="item-1" />);
    await settle();
    await click(user, "Product Information");
    const box = panel();
    // Still mounted (held by the no-op keyframe) but out of the flow.
    expect(box).toHaveAttribute("data-state", "closed");
    expect(box.className).toContain("data-[state=closed]:absolute");
    const [row, , edge, text] = moves();
    expect(row.el).toBe(items()[1]);
    expect(row.frames[0]).toMatchObject({ translate: "0px 40px" });
    expect(edge.el).toBe(box);
    expect(edge.frames).toEqual([
      { translate: "0 0px" },
      { translate: "0 -40px" },
    ]);
    expect(text.frames).toEqual([
      { translate: "0 0px" },
      { translate: "0 40px" },
    ]);
    expect(edge.options).toMatchObject({ duration: 150, fill: "forwards" });
    expect(row.options.duration).toBe(150);
    // The body fades out ahead of the edge.
    expect(fades()).toHaveLength(1);
    expect(fades()[0].frames).toEqual([{ opacity: 1 }, { opacity: 0 }]);
    // Radix hides it (and drops its children) once the hold keyframe ends.
    const end = Object.assign(new Event("animationend", { bubbles: true }), {
      animationName: "godui-accordion-hold",
    });
    act(() => {
      box.dispatchEvent(end);
    });
    await waitFor(() => expect(box).toHaveAttribute("hidden"));
  });

  it("reopening after a full close starts fresh, not from the old fill", async () => {
    liveStyles();
    const user = userEvent.setup();
    render(<Usage ui={Godui} defaultValue="item-1" />);
    await settle();
    await click(user, "Product Information");
    for (const h of handles) Object.assign(h, { playState: "finished" });
    animate.mockClear();
    await click(user, "Product Information");
    const box = panel();
    const edge = moves().find((m) => m.el === box);
    expect(edge?.frames[0]).toEqual({ translate: "0 -40px" });
    expect(fades()[0].frames).toEqual([{ opacity: 0 }, { opacity: 1 }]);
  });

  it("single mode: opening another item closes the first in the same beat", async () => {
    liveStyles();
    const user = userEvent.setup();
    render(<Usage ui={Godui} defaultValue="item-1" />);
    await settle();
    await click(user, "Shipping Details");
    const panels = [
      ...document.querySelectorAll('[data-slot="accordion-content"]'),
    ];
    const edges = moves().filter((m) => panels.includes(m.el));
    expect(edges.map((m) => m.frames)).toEqual([
      [{ translate: "0 0px" }, { translate: "0 -40px" }],
      [{ translate: "0 -40px" }, { translate: "0 0px" }],
    ]);
    // Item 2 rises by item 1's panel; item 3's net move is zero.
    const rows = moves().filter((m) => items().includes(m.el));
    expect(rows.map((m) => m.el)).toEqual([items()[1]]);
    // A change that opens anything runs on the opening clock, closes included.
    for (const m of moves()) expect(m.options.duration).toBe(260);
  });

  it("reversing mid-sweep carries on from where the edge is drawn", async () => {
    let drawn = "";
    liveStyles((el, prop) =>
      prop === "translate" &&
      el.getAttribute("data-slot") === "accordion-content"
        ? drawn
        : undefined,
    );
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await click(user, "Product Information");
    const firstHandles = [...handles];
    drawn = "0px -12px";
    await click(user, "Product Information");
    for (const h of firstHandles) expect(h.cancel).toHaveBeenCalled();
    const edge = moves()
      .filter((m) => m.el === panel())
      .at(-1);
    const text = moves()
      .filter((m) => m.el === panel().firstElementChild)
      .at(-1);
    expect(edge?.frames[0]).toEqual({ translate: "0 -12px" });
    expect(text?.frames[0]).toEqual({ translate: "0 12px" });
  });

  it("a fresh open cascades the content's blocks in; a reversal moves them as one", async () => {
    const { Accordion, AccordionContent, AccordionItem, AccordionTrigger } =
      Godui;
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>
            <p>One</p>
            <p>Two</p>
            <p>Three</p>
            <p>Four</p>
            <p>Five</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await click(user, "Details");
    const paragraphs = [...panel().querySelectorAll("p")];
    expect(fades().map((f) => f.el)).toEqual(paragraphs);
    // A beat apart (a quarter of --godui-duration-fast), capped at 4 blocks.
    expect(fades().map((f) => f.options.delay)).toEqual([
      0, 37.5, 75, 112.5, 112.5,
    ]);
    for (const f of fades()) {
      expect(f.frames).toEqual([{ opacity: 0 }, { opacity: 1 }]);
      expect(f.options.fill).toBe("backwards");
    }
  });

  it("in a parent that centers it, the accordion's own box glides instead of jumping", async () => {
    centered = true;
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await click(user, "Product Information");
    const root = document.querySelector('[data-slot="accordion"]');
    const glide = moves().find((m) => m.el === root);
    // 3 rows (120px) grow to 160px: the parent moves it up 20px in one step;
    // it starts back where it was drawn and glides there on the panels' clock.
    expect(glide?.frames).toEqual([
      { translate: "0px 20px" },
      { translate: "0px 0px" },
    ]);
    const edge = moves().find((m) => m.el === panel());
    expect(glide?.options.duration).toBe(edge?.options.duration);
    expect(glide?.options.easing).toBe(edge?.options.easing);
  });

  it("a programmatic change with no click doesn't guess where the box was", async () => {
    centered = true;
    const { Accordion, AccordionContent, AccordionItem, AccordionTrigger } =
      Godui;
    const { rerender } = render(
      <Accordion type="single" value="">
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    rerender(
      <Accordion type="single" value="a">
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await settle();
    const root = document.querySelector('[data-slot="accordion"]');
    expect(moves().some((m) => m.el === root)).toBe(false);
  });

  it("reduced motion: nothing moves; the body only fades", async () => {
    reducedMotion();
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await click(user, "Product Information");
    expect(moves()).toEqual([]);
    expect(fades().map((f) => f.el)).toEqual([panel().firstElementChild]);
  });

  it("a nested accordion's change glides the outer rows below it", async () => {
    const { Accordion, AccordionContent, AccordionItem, AccordionTrigger } =
      Godui;
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible defaultValue="outer-a">
        <AccordionItem value="outer-a">
          <AccordionTrigger>Outer A</AccordionTrigger>
          <AccordionContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="inner">
                <AccordionTrigger>Inner</AccordionTrigger>
                <AccordionContent>Inner body.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="outer-b">
          <AccordionTrigger>Outer B</AccordionTrigger>
          <AccordionContent>B body.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await settle();
    await click(user, "Inner");
    const outerB = screen
      .getByRole("button", { name: "Outer B" })
      .closest('[data-slot="accordion-item"]');
    const glide = moves().find((m) => m.el === outerB);
    expect(glide?.frames[0]).toMatchObject({ translate: "0px -40px" });
    // The outer panel's own edge doesn't sweep: only the inner one opened.
    const outerPanel = panelOf(outerB?.previousElementSibling as Element);
    expect(moves().some((m) => m.el === outerPanel)).toBe(false);
  });

  it("AccordionContent asChild works like shadcn's", () => {
    const { Accordion, AccordionContent, AccordionItem, AccordionTrigger } =
      Godui;
    render(
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Title</AccordionTrigger>
          <AccordionContent asChild>
            <section>Body</section>
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("draws dividers on the following item, so they glide with it", () => {
    render(<Usage ui={Godui} />);
    const item = items()[1] as HTMLElement;
    // Same look as shadcn's border-b last:border-b-0, but the line belongs to
    // the row that glides instead of the one whose height snaps.
    expect(item.className).toContain("border-t");
    expect(item.className).toContain("first:border-t-0");
    expect(item.className).not.toContain("border-b");
  });

  it("moves between triggers with arrows and toggles with Enter", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    screen.getByRole("button", { name: "Product Information" }).focus();
    await user.keyboard("{ArrowDown}");
    const second = screen.getByRole("button", { name: "Shipping Details" });
    expect(second).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("animates no height: the panel box ignores the pointer, its content takes it back", () => {
    render(<Usage ui={Godui} defaultValue="item-1" />);
    const box = panel();
    expect(box.className).not.toMatch(/accordion-(down|up)|height/);
    // Mid-sweep the box overlaps the trigger above it.
    expect(box.className).toContain("pointer-events-none");
    expect(box.firstElementChild?.className).toContain("pointer-events-auto");
    expect(box.className).toContain(
      "data-[state=closed]:animate-godui-accordion-hold",
    );
    expect(items()[0].className).toContain("relative");
    expect(
      document.querySelector('[data-slot="accordion"]')?.className,
    ).toContain("ease-spring-smooth");
    const trigger = screen.getByRole("button", { name: "Product Information" });
    expect(trigger.className).not.toContain("transition-all");
    // Chrome won't composite the individual `rotate` property on an <svg>;
    // the chevron turns with `transform` instead, on the panel's clock.
    expect(trigger.className).toContain(
      "[&[data-state=open]>svg]:[transform:rotate(180deg)]",
    );
    expect(trigger.className).not.toContain("rotate-180");
    const chevron = trigger.querySelector("svg")?.getAttribute("class");
    expect(chevron).toContain("transition-[transform]");
    expect(chevron).toContain("motion-reduce:transition-none");
    expect(chevron).toContain(
      "[[data-state=closed]>&]:duration-(--godui-duration-fast)",
    );
  });

  it("passes a React 19 callback ref's cleanup through (Accordion)", () => {
    const cleanup = vi.fn();
    const seen: Array<HTMLElement | null> = [];
    const ref = (node: HTMLDivElement | null) => {
      seen.push(node);
      return cleanup;
    };
    const { unmount } = render(
      <Godui.Accordion ref={ref} type="single" collapsible>
        <Godui.AccordionItem value="a">
          <Godui.AccordionTrigger>A</Godui.AccordionTrigger>
          <Godui.AccordionContent>Body</Godui.AccordionContent>
        </Godui.AccordionItem>
      </Godui.Accordion>,
    );
    expect(seen).toEqual([document.querySelector('[data-slot="accordion"]')]);
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
    // React calls the cleanup instead of ref(null).
    expect(seen).not.toContain(null);
  });
});
