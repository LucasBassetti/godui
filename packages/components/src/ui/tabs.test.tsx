import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/tabs";
import * as Godui from "./tabs";

// jsdom has no layout: offset* read data-x/y/w/h so tests control geometry.
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

type AnimateCall = [Keyframe[], KeyframeAnimationOptions];
let animate: ReturnType<typeof vi.fn>;
let handles: Array<{
  cancel: ReturnType<typeof vi.fn>;
  onfinish: (() => void) | null;
}>;
// ResizeObserver stand-in: records what's observed; tests fire it by hand.
let resizeObservers: Array<{ callback: () => void; targets: Element[] }>;
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
  resizeObservers = [];
  globalThis.ResizeObserver = class {
    entry: { callback: () => void; targets: Element[] };
    constructor(callback: () => void) {
      this.entry = { callback, targets: [] };
      resizeObservers.push(this.entry);
    }
    observe(target: Element) {
      this.entry.targets.push(target);
    }
    unobserve() {}
    disconnect() {
      this.entry.targets = [];
    }
  } as unknown as typeof ResizeObserver;
});
const fireResize = () =>
  act(() => {
    for (const ro of resizeObservers) ro.callback();
  });

afterEach(() => {
  for (const [prop, descriptor] of saved) {
    if (descriptor)
      Object.defineProperty(HTMLElement.prototype, prop as string, descriptor);
  }
  delete (Element.prototype as Partial<Element>).animate;
  globalThis.ResizeObserver = OriginalResizeObserver;
});

function Usage({
  ui,
  value,
  variant,
}: {
  ui: typeof Shadcn;
  value?: string;
  variant?: "default" | "line";
}) {
  const { Tabs, TabsContent, TabsList, TabsTrigger } = ui;
  return (
    <Tabs defaultValue={value ? undefined : "a"} value={value}>
      <TabsList variant={variant}>
        <TabsTrigger value="a" data-x="0" data-w="80" data-h="30">
          Account
        </TabsTrigger>
        <TabsTrigger value="b" data-x="84" data-w="100" data-h="30">
          Password
        </TabsTrigger>
        <TabsTrigger value="c" data-x="188" data-w="60" data-h="30">
          Team
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">Account panel</TabsContent>
      <TabsContent value="b">Password panel</TabsContent>
      <TabsContent value="c">Team panel</TabsContent>
    </Tabs>
  );
}

const indicator = () =>
  document.querySelector('[data-slot="tabs-indicator"]') as HTMLElement;
const list = () =>
  document.querySelector('[data-slot="tabs-list"]') as HTMLElement;
const calls = () => animate.mock.calls as unknown as AnimateCall[];

describe("Tabs", () => {
  it("matches shadcn's data-slot tree (plus the indicator) and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} />);
    expectSlotParity(slotTree(), expected, ["tabs-indicator"]);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("places the indicator on the active tab without animating", () => {
    render(<Usage ui={Godui} />);
    expect(indicator().style.translate).toBe("0px 0px");
    expect(indicator().style.width).toBe("80px");
    expect(indicator().style.height).toBe("30px");
    expect(list()).toHaveAttribute("data-indicator", "ready");
    expect(animate).not.toHaveBeenCalled();
  });

  it("slides to the clicked tab with translate + scale", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("tab", { name: "Password" }));
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    const [frames] = calls()[0];
    expect(frames[0]).toMatchObject({ translate: "0px 0px", scale: "0.8 1" });
    expect(frames[1]).toMatchObject({ translate: "84px 0px", scale: "1 1" });
    expect(indicator().style.translate).toBe("84px 0px");
    expect(indicator().style.width).toBe("100px");
  });

  it("moves when the controlled value changes", async () => {
    const { rerender } = render(<Usage ui={Godui} value="a" />);
    rerender(<Usage ui={Godui} value="c" />);
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    expect(calls()[0][0][1]).toMatchObject({ translate: "188px 0px" });
  });

  it("re-targets mid-flight, cancelling the running slide", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("tab", { name: "Password" }));
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    await user.click(screen.getByRole("tab", { name: "Team" }));
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(2));
    expect(handles[0].cancel).toHaveBeenCalled();
    expect(calls()[1][0][1]).toMatchObject({ translate: "188px 0px" });
  });

  it("uses shadcn's underline geometry on the line variant", () => {
    render(<Usage ui={Godui} variant="line" />);
    // 2px bar starting 2px below the trigger, inset 1px (the trigger border).
    expect(indicator().style.translate).toBe("1px 32px");
    expect(indicator().style.width).toBe("78px");
    expect(indicator().style.height).toBe("2px");
  });

  it("follows the active tab when a trigger is inserted before it", async () => {
    function Dynamic({ extra }: { extra: boolean }) {
      const { Tabs, TabsList, TabsTrigger } = Godui;
      return (
        <Tabs defaultValue="b">
          <TabsList>
            {extra ? (
              <TabsTrigger value="new" data-x="0" data-w="50" data-h="30">
                New
              </TabsTrigger>
            ) : null}
            <TabsTrigger
              value="b"
              data-x={extra ? "54" : "0"}
              data-w="100"
              data-h="30"
            >
              Password
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
    }
    const { rerender } = render(<Dynamic extra={false} />);
    expect(indicator().style.translate).toBe("0px 0px");
    rerender(<Dynamic extra />);
    await waitFor(() => expect(indicator().style.translate).toBe("54px 0px"));
  });

  it("re-measures when a trigger resizes", () => {
    render(<Usage ui={Godui} />);
    const active = screen.getByRole("tab", { name: "Account" });
    const observed = resizeObservers.flatMap((ro) => ro.targets);
    expect(observed).toContain(active);
    active.setAttribute("data-w", "96");
    fireResize();
    expect(indicator().style.width).toBe("96px");
  });

  it("applies a resize that lands mid-slide once the slide finishes", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("tab", { name: "Password" }));
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    screen.getByRole("tab", { name: "Password" }).setAttribute("data-w", "120");
    fireResize();
    expect(indicator().style.width).toBe("100px");
    act(() => handles[0].onfinish?.());
    expect(indicator().style.width).toBe("120px");
  });

  it("starts an interrupted slide from the drawn box, scroll included", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("tab", { name: "Password" }));
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    Object.defineProperty(list(), "scrollLeft", { value: 40 });
    list().getBoundingClientRect = () =>
      ({ left: 100, top: 0, width: 300, height: 36 }) as DOMRect;
    indicator().getBoundingClientRect = () =>
      ({ left: 150, top: 0, width: 90, height: 30 }) as DOMRect;
    await user.click(screen.getByRole("tab", { name: "Team" }));
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(2));
    expect(calls()[1][0][0]).toMatchObject({ translate: "90px 0px" });
  });

  it("reads --godui-duration-base in seconds or milliseconds", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    indicator().style.setProperty("--godui-duration-base", "0.3s");
    await user.click(screen.getByRole("tab", { name: "Password" }));
    await waitFor(() => expect(animate).toHaveBeenCalledTimes(1));
    expect(calls()[0][1]).toMatchObject({ duration: 300 });
  });

  it("TabsList asChild renders like shadcn (no injected indicator)", () => {
    const { Tabs, TabsList, TabsTrigger } = Godui;
    render(
      <Tabs defaultValue="a">
        <TabsList asChild>
          <nav>
            <TabsTrigger value="a">Account</TabsTrigger>
          </nav>
        </TabsList>
      </Tabs>,
    );
    expect(list().tagName).toBe("NAV");
    expect(indicator()).toBeNull();
  });

  it("snaps under reduced motion", async () => {
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
      await user.click(screen.getByRole("tab", { name: "Password" }));
      await waitFor(() => expect(indicator().style.translate).toBe("84px 0px"));
      expect(animate).not.toHaveBeenCalled();
    } finally {
      window.matchMedia = original;
    }
  });

  it("server markup styles the active trigger like shadcn", () => {
    const html = renderToString(<Usage ui={Godui} />);
    expect(html).not.toContain("data-indicator=");
    expect(html).toContain("data-[state=active]:bg-background");
    expect(html).toContain("group-data-[indicator=ready]/tabs-list:block");
  });

  it("animates nothing but transform and opacity", () => {
    render(<Usage ui={Godui} />);
    const trigger = screen.getByRole("tab", { name: "Account" });
    expect(trigger.className).not.toContain("transition-all");
    const panel = screen.getByRole("tabpanel");
    expect(panel.className).toContain(
      "data-[state=active]:animate-godui-fade-in",
    );
  });
});
