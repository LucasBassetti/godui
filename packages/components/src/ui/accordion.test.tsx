import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/accordion";
import * as Godui from "./accordion";

// jsdom has no layout. Items are 40px tall plus 40px while their panel is
// rendered, so opening item 1 pushes items 2 and 3 down by 40px.
const ROW = 40;
function topOf(el: Element): number {
  if (el.getAttribute("data-slot") !== "accordion-item") return 0;
  let top = 0;
  for (
    let prev = el.previousElementSibling;
    prev;
    prev = prev.previousElementSibling
  ) {
    const panel = prev.querySelector('[data-slot="accordion-content"]');
    top += ROW + (panel && !panel.hasAttribute("hidden") ? ROW : 0);
  }
  return top;
}

const originalRect = Element.prototype.getBoundingClientRect;
let animate: ReturnType<typeof vi.fn>;
let handles: Array<{ cancel: ReturnType<typeof vi.fn>; onfinish: null }>;
let liveStyle: { mockRestore(): void } | undefined;

beforeEach(() => {
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const top = topOf(this);
    return { top, left: 0, width: 300, height: ROW, x: 0, y: top } as DOMRect;
  };
  handles = [];
  animate = vi.fn(() => {
    const handle = { cancel: vi.fn(), onfinish: null };
    handles.push(handle);
    return handle;
  });
  Element.prototype.animate = animate as unknown as Element["animate"];
});

afterEach(() => {
  Element.prototype.getBoundingClientRect = originalRect;
  delete (Element.prototype as Partial<Element>).animate;
  document.head.querySelector("style[data-test-anim]")?.remove();
  liveStyle?.mockRestore();
  liveStyle = undefined;
});

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
const animatedElements = () => animate.mock.contexts as unknown as Element[];
const firstFrame = (i: number) =>
  (animate.mock.calls[i] as unknown as [Keyframe[]])[0][0];

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

  it("opening snaps the height and FLIPs the items below", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(
      screen.getByRole("button", { name: "Product Information" }),
    );
    expect(animatedElements()).toEqual([items()[1], items()[2]]);
    expect(firstFrame(0)).toMatchObject({ translate: "0px -40px" });
  });

  it("closing waits for the exit fade, then FLIPs", async () => {
    // Browsers return a live computed style; Radix Presence relies on that to
    // see the closed-state animation. jsdom snapshots, so make it live here.
    const real = window.getComputedStyle;
    liveStyle = vi.spyOn(window, "getComputedStyle").mockImplementation(
      (el: Element) =>
        new Proxy({} as CSSStyleDeclaration, {
          get(_, prop) {
            const style = real(el);
            const value = Reflect.get(style, prop);
            return typeof value === "function" ? value.bind(style) : value;
          },
        }),
    );
    const style = document.createElement("style");
    style.dataset.testAnim = "";
    style.textContent =
      '[data-slot="accordion-content"][data-state="closed"] { animation-name: godui-fade-out; }';
    document.head.append(style);
    const user = userEvent.setup();
    render(<Usage ui={Godui} defaultValue="item-1" />);
    // Radix suppresses animations on an initially-open panel until the next
    // frame; a real click always comes later than that.
    await new Promise((resolve) => setTimeout(resolve, 50));
    await user.click(
      screen.getByRole("button", { name: "Product Information" }),
    );
    expect(animate).not.toHaveBeenCalled();
    const content = document.querySelector('[data-slot="accordion-content"]');
    // jsdom has no AnimationEvent; Radix only reads `animationName`.
    const end = Object.assign(new Event("animationend", { bubbles: true }), {
      animationName: "godui-fade-out",
    });
    act(() => {
      content?.dispatchEvent(end);
    });
    await waitFor(() => expect(animate).toHaveBeenCalled());
    expect(animatedElements()).toEqual([items()[1], items()[2]]);
    expect(firstFrame(0)).toMatchObject({ translate: "0px 40px" });
  });

  it("interrupting cancels the running FLIP and starts a new one", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    const trigger = screen.getByRole("button", { name: "Product Information" });
    await user.click(trigger);
    await user.click(trigger);
    expect(handles[0].cancel).toHaveBeenCalled();
    expect(animate.mock.calls.length).toBeGreaterThan(2);
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

  it("reduced motion moves items without animating", async () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      await user.click(
        screen.getByRole("button", { name: "Product Information" }),
      );
      expect(animate).not.toHaveBeenCalled();
    } finally {
      window.matchMedia = original;
    }
  });

  it("animates no height: panel slides in, fades out; chevron rotates", () => {
    render(<Usage ui={Godui} defaultValue="item-1" />);
    const content = document.querySelector('[data-slot="accordion-content"]');
    expect(content?.className).toContain(
      "data-[state=open]:animate-godui-slide-in-from-top",
    );
    expect(content?.className).toContain(
      "data-[state=closed]:animate-godui-fade-out",
    );
    expect(content?.className).not.toContain("accordion-down");
    const trigger = screen.getByRole("button", { name: "Product Information" });
    expect(trigger.className).not.toContain("transition-all");
    // Chrome won't composite the individual `rotate` property on an <svg>;
    // the chevron turns with `transform` instead.
    expect(trigger.className).toContain(
      "[&[data-state=open]>svg]:[transform:rotate(180deg)]",
    );
    expect(trigger.className).not.toContain("rotate-180");
    const chevron = trigger.querySelector("svg");
    expect(chevron?.getAttribute("class")).toContain("transition-[transform]");
    expect(chevron?.getAttribute("class")).toContain(
      "motion-reduce:transition-none",
    );
  });
});
