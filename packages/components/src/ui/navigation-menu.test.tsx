import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/navigation-menu";
import * as Godui from "./navigation-menu";
import { NavigationMenuViewportFrame } from "./navigation-menu-viewport-frame";

/** shadcn's navigation-menu-demo (next/link → <a>, viewport passed in). */
function Usage({
  ui,
  viewport,
  defaultValue,
  indicator,
}: {
  ui: typeof Shadcn;
  viewport?: boolean;
  defaultValue?: string;
  indicator?: boolean;
}) {
  const {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
  } = ui;
  return (
    <NavigationMenu viewport={viewport} defaultValue={defaultValue}>
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem value="home">
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a href="/">shadcn/ui</a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a href="/docs">Introduction</a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="components">
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <a href="/docs/primitives/alert-dialog">Alert Dialog</a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="/docs">Docs</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem value="list">
          <NavigationMenuTrigger>List</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#components">Components</a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {indicator ? <NavigationMenuIndicator /> : null}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const HERE = dirname(fileURLToPath(import.meta.url));

const slot = (name: string) =>
  document.querySelector(`[data-slot="${name}"]`) as HTMLElement | null;
const contents = () => [
  ...document.querySelectorAll<HTMLElement>(
    '[data-slot="navigation-menu-content"]',
  ),
];

/**
 * jsdom has no CSS, so Radix Presence would unmount a closing content at once.
 * Report animation names (switching with data-motion / data-state) so exiting
 * contents stay mounted, as they do in a browser mid-animation.
 */
function stubAnimations() {
  const real = window.getComputedStyle.bind(window);
  return vi
    .spyOn(window, "getComputedStyle")
    .mockImplementation((el, pseudo) => {
      const style = real(el, pseudo);
      if (!(el instanceof HTMLElement)) return style;
      if (el.dataset.slot !== "navigation-menu-content") return style;
      return new Proxy(style, {
        get(target, key) {
          if (key === "animationName") {
            const leaving =
              el.dataset.motion?.startsWith("to-") ||
              el.dataset.state === "closed";
            return leaving ? "godui-out" : "godui-in";
          }
          const value = Reflect.get(target, key);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    });
}

describe("NavigationMenu", () => {
  it("matches shadcn's data-slot tree and exports (viewport and viewport={false})", () => {
    for (const viewport of [true, false]) {
      for (const defaultValue of [undefined, "home"]) {
        const { unmount } = render(
          <Usage ui={Shadcn} viewport={viewport} defaultValue={defaultValue} />,
        );
        const expected = slotTree();
        unmount();
        const godui = render(
          <Usage ui={Godui} viewport={viewport} defaultValue={defaultValue} />,
        );
        expectSlotParity(slotTree(), expected);
        godui.unmount();
      }
    }
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("opens on click, closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("button", { name: "Home" }));
    expect(slot("navigation-menu-content")).toHaveTextContent("Introduction");
    expect(slot("navigation-menu-viewport")).toHaveAttribute(
      "data-state",
      "open",
    );
    await user.keyboard("{Escape}");
    await waitFor(() => expect(slot("navigation-menu-content")).toBeNull());
  });

  it("a click on a trigger that opened without a click (hover) keeps it open; the next click closes", async () => {
    for (const viewport of [true, false]) {
      const user = userEvent.setup();
      // Open without a click, as a hover does after its delay.
      const { unmount } = render(
        <Usage ui={Godui} viewport={viewport} defaultValue="home" />,
      );
      const home = screen.getByRole("button", { name: "Home" });
      expect(home).toHaveAttribute("data-state", "open");
      await user.click(home);
      expect(home).toHaveAttribute("data-state", "open");
      await user.click(home);
      expect(home).toHaveAttribute("data-state", "closed");
      unmount();
    }
  });

  it("a click-opened trigger still closes on the next click (Radix's toggle)", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    const home = screen.getByRole("button", { name: "Home" });
    await user.click(home);
    expect(home).toHaveAttribute("data-state", "open");
    await user.click(home);
    expect(home).toHaveAttribute("data-state", "closed");
  });

  it("chevron rotates with transform on a spring (SVG-safe), honouring reduced motion", () => {
    render(<Usage ui={Godui} />);
    const chevron = screen
      .getByRole("button", { name: "Home" })
      .querySelector("svg") as SVGElement;
    const cls = chevron.getAttribute("class") ?? "";
    expect(cls).toContain("[transform:rotate(0deg)]");
    expect(cls).toContain("transition-[transform]");
    expect(cls).toContain("duration-(--godui-duration-base)");
    expect(cls).toContain("ease-spring-snappy");
    expect(cls).toContain("group-data-[state=open]:[transform:rotate(180deg)]");
    expect(cls).toContain("motion-reduce:transition-none");
    expect(cls).not.toMatch(/(^|\s)transition(\s|$)|duration-300|rotate-180/);
  });

  it("switching items sets from-/to- motion and both contents animate", async () => {
    const spy = stubAnimations();
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      await user.click(screen.getByRole("button", { name: "Home" }));
      // With a menu open, entering another trigger switches at once (a click
      // there would toggle it shut again, as in a browser).
      await user.hover(screen.getByRole("button", { name: "Components" }));
      await waitFor(() => expect(contents()).toHaveLength(2));
      const [home, components] = contents();
      // The exiting content comes first, so the incoming one paints over it.
      expect(home).toHaveTextContent("Introduction");
      expect(home).toHaveAttribute("data-motion", "to-start");
      expect(components).toHaveTextContent("Alert Dialog");
      expect(components).toHaveAttribute("data-motion", "from-end");
      for (const el of [home, components]) {
        expect(el.className).toContain("[--godui-enter-distance:3rem]");
        expect(el.className).toContain(
          "data-[motion=from-end]:animate-godui-slide-in-from-right",
        );
        expect(el.className).toContain(
          "data-[motion=from-start]:animate-godui-slide-in-from-left",
        );
        expect(el.className).toContain(
          "data-[motion=to-end]:animate-godui-slide-out-to-right",
        );
        expect(el.className).toContain(
          "data-[motion=to-start]:animate-godui-slide-out-to-left",
        );
        expect(el.className).not.toMatch(
          /(^|\s|:)(animate-in|animate-out|fade-in|fade-out|slide-in-from-right-52)(\s|$)/,
        );
      }
    } finally {
      spy.mockRestore();
    }
  });

  it("the exiting content is an inert copy that leaves when its exit ends", async () => {
    const spy = stubAnimations();
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      await user.click(screen.getByRole("button", { name: "Home" }));
      await user.hover(screen.getByRole("button", { name: "Components" }));
      await waitFor(() => expect(contents()).toHaveLength(2));
      const [ghost, components] = contents();
      expect(ghost).toHaveAttribute("data-exiting");
      expect(ghost).toHaveAttribute("aria-hidden", "true");
      expect(ghost.inert).toBe(true);
      expect(ghost.style.pointerEvents).toBe("none");
      expect(ghost.querySelector("[id]")).toBeNull();
      expect(ghost).not.toHaveAttribute("id");
      expect(components).not.toHaveAttribute("data-exiting");
      // Links in the copy are not reachable; the live content's are.
      expect(
        screen.getByRole("link", { name: "Alert Dialog" }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: "Introduction" })).toBeNull();
      ghost.dispatchEvent(new Event("animationend"));
      expect(contents()).toEqual([components]);
    } finally {
      spy.mockRestore();
    }
  });

  it("without an exit animation (e.g. overridden) the copy is not kept", async () => {
    // No stub: jsdom reports no animation, like a content whose animation was
    // removed via className, so nothing lingers.
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("button", { name: "Home" }));
    await user.hover(screen.getByRole("button", { name: "Components" }));
    await waitFor(() =>
      expect(contents()[0]).toHaveTextContent("Alert Dialog"),
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(contents()).toHaveLength(1);
  });

  it("switching back reverses the direction", async () => {
    const spy = stubAnimations();
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} defaultValue="list" />);
      await user.hover(screen.getByRole("button", { name: "Components" }));
      await waitFor(() => expect(contents()).toHaveLength(2));
      const [list, components] = contents();
      expect(list).toHaveTextContent("Components");
      expect(components).toHaveTextContent("Alert Dialog");
      expect(list).toHaveAttribute("data-motion", "to-end");
      expect(components).toHaveAttribute("data-motion", "from-start");
    } finally {
      spy.mockRestore();
    }
  });

  it("viewport scales from the top; its size snaps", () => {
    render(<Usage ui={Godui} defaultValue="home" />);
    const cls = slot("navigation-menu-viewport")?.className ?? "";
    expect(cls).toContain("origin-top");
    expect(cls).toContain("[--godui-enter-scale:0.95]");
    expect(cls).toContain("data-[state=open]:animate-godui-fade-scale-in");
    expect(cls).toContain("data-[state=closed]:animate-godui-fade-scale-out");
    expect(cls).toContain("h-[var(--radix-navigation-menu-viewport-height)]");
    expect(cls).not.toMatch(/origin-top-center|zoom-in|zoom-out|animate-in/);
    expect(cls).not.toMatch(/(^|\s)transition/);
  });

  it("the viewport opens under its trigger (clamped in the menu) and glides between triggers", async () => {
    // jsdom has no layout: the menu is 500px wide, Home sits at 0–80px,
    // Components at 90–210px, and every open panel is 200px (+1px borders).
    const restore: Array<() => void> = [];
    const rect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function (this: Element) {
      const text = this.textContent ?? "";
      const trigger =
        this.getAttribute("data-slot") === "navigation-menu-trigger";
      const left = trigger && text.startsWith("Components") ? 90 : 0;
      const width = trigger ? (left ? 120 : 80) : 500;
      return { left, top: 0, width, height: 36, x: left, y: 0 } as DOMRect;
    };
    restore.push(() => {
      Element.prototype.getBoundingClientRect = rect;
    });
    for (const [prop, value] of [
      [
        "offsetWidth",
        (el: HTMLElement) =>
          el.dataset.slot === "navigation-menu-content"
            ? 200
            : el.dataset.slot === "navigation-menu-viewport"
              ? 202
              : 0,
      ],
      [
        "clientWidth",
        (el: HTMLElement) =>
          el.dataset.slot === "navigation-menu"
            ? 500
            : el.dataset.slot === "navigation-menu-viewport"
              ? 200
              : 0,
      ],
    ] as const) {
      const original = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        prop,
      );
      Object.defineProperty(HTMLElement.prototype, prop, {
        configurable: true,
        get(this: HTMLElement) {
          return value(this);
        },
      });
      restore.push(() => {
        if (original)
          Object.defineProperty(HTMLElement.prototype, prop, original);
      });
    }
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      const wrapper = slot("navigation-menu")?.lastElementChild as HTMLElement;
      expect(wrapper.className).toContain("transition-[translate]");
      expect(wrapper.className).toContain("motion-reduce:transition-none");
      await user.click(screen.getByRole("button", { name: "Components" }));
      // Centered under Components (150px) → 150 − 101 = 49px; first open
      // lands there at once.
      await waitFor(() => expect(wrapper.style.translate).toBe("49px 0px"));
      expect(wrapper.style.transition).toBe("none");
      await waitFor(() => expect(wrapper.style.transition).toBe(""));
      // Home's center (40px) would put the panel off the menu's left edge:
      // clamped to 0, and this time it glides (no transition override).
      await user.click(screen.getByRole("button", { name: "Home" }));
      await waitFor(() => expect(wrapper.style.translate).toBe("0px 0px"));
      expect(wrapper.style.transition).toBe("");
    } finally {
      for (const undo of restore.reverse()) undo();
    }
  });

  it("viewport={false}: content fades and scales from the top on its own", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} viewport={false} />);
    expect(slot("navigation-menu-viewport")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Home" }));
    const content = slot("navigation-menu-content") as HTMLElement;
    expect(content).toHaveAttribute("data-state", "open");
    const cls = content.className;
    expect(cls).toContain(
      "group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-godui-fade-scale-in",
    );
    expect(cls).toContain(
      "group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-godui-fade-scale-out",
    );
    expect(cls).toContain("origin-top");
    expect(cls).not.toMatch(/duration-200|zoom-in-95|zoom-out-95|fade-in-0/);
  });

  it("indicator slides with Radix's inline transform; no layout transitions", async () => {
    // Radix measures the trigger in a ResizeObserver callback; fire it on
    // observe so the indicator renders in jsdom.
    const RealRO = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      constructor(private cb: ResizeObserverCallback) {}
      observe() {
        this.cb([], this as unknown as ResizeObserver);
      }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    try {
      render(<Usage ui={Godui} defaultValue="home" indicator />);
      const indicator = await waitFor(() => {
        const el = slot("navigation-menu-indicator");
        expect(el).not.toBeNull();
        return el as HTMLElement;
      });
      expect(indicator.style.transform).toMatch(/^translateX\(/);
      const cls = indicator.className;
      expect(cls).toContain("transition-[transform]");
      expect(cls).toContain("duration-(--godui-duration-base)");
      expect(cls).toContain("ease-spring-snappy");
      expect(cls).toContain("motion-reduce:transition-none");
      expect(cls).toContain("data-[state=visible]:animate-godui-fade-in");
      expect(cls).toContain("data-[state=hidden]:animate-godui-fade-out");
      expect(cls).not.toMatch(
        /(^|\s|:)(animate-in|animate-out|fade-in|fade-out)(\s|$)/,
      );
    } finally {
      globalThis.ResizeObserver = RealRO;
    }
  });

  it("trigger and link drop their paint transitions", () => {
    render(<Usage ui={Godui} defaultValue="home" />);
    const trigger = screen.getByRole("button", { name: "Home" });
    expect(trigger.className).not.toMatch(/transition-\[color|transition-all/);
    expect(Godui.navigationMenuTriggerStyle()).not.toMatch(/transition/);
    for (const link of document.querySelectorAll(
      '[data-slot="navigation-menu-link"]',
    )) {
      expect(link.className).not.toMatch(/transition-all|transition-\[color/);
    }
  });

  it('the module stays server-safe like shadcn\'s (no "use client")', () => {
    // navigationMenuTriggerStyle() must stay callable from Server Components;
    // the client-only exit keeper lives in navigation-menu-viewport-frame.tsx.
    const source = readFileSync(join(HERE, "navigation-menu.tsx"), "utf8");
    expect(source).not.toMatch(/^["']use client["']/m);
    const frame = readFileSync(
      join(HERE, "navigation-menu-viewport-frame.tsx"),
      "utf8",
    );
    expect(frame).toMatch(/^"use client";/);
  });

  describe("viewport frame (exit replay for Radix's dropped exit)", () => {
    /** A frame with an open viewport; contents are added by hand, like Radix. */
    function setup() {
      const view = render(
        <NavigationMenuViewportFrame>
          <div data-slot="navigation-menu-viewport" data-state="open" />
        </NavigationMenuViewportFrame>,
      );
      const viewport = slot("navigation-menu-viewport") as HTMLElement;
      const content = (id: string, motion?: string) => {
        const el = document.createElement("div");
        el.dataset.slot = "navigation-menu-content";
        if (motion) el.dataset.motion = motion;
        el.id = id;
        el.innerHTML = `<a id="${id}-link" href="#x">${id}</a>`;
        viewport.append(el);
        return el;
      };
      const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
      const ghosts = () => [
        ...viewport.querySelectorAll<HTMLElement>("[data-exiting]"),
      ];
      return { view, viewport, content, flush, ghosts };
    }

    it("replays an exit Radix dropped (node removed before it animated)", async () => {
      const spy = stubAnimations();
      try {
        const { content, flush, ghosts } = setup();
        const a = content("a", "to-start");
        await flush();
        a.remove();
        await flush();
        expect(ghosts()).toHaveLength(1);
        expect(ghosts()[0]).toHaveAttribute("data-ghost-of", "a");
      } finally {
        spy.mockRestore();
      }
    });

    it("does not replay an exit that already played (Radix keeps the node through it)", async () => {
      const spy = stubAnimations();
      try {
        const { content, flush, ghosts } = setup();
        const a = content("a");
        await flush();
        // Radix switches away: data-motion flips, the slide-out starts on the
        // still-mounted node, and Presence removes it after animationend.
        a.dataset.motion = "to-start";
        a.dispatchEvent(new Event("animationstart", { bubbles: true }));
        a.dispatchEvent(new Event("animationend", { bubbles: true }));
        a.remove();
        await flush();
        expect(ghosts()).toHaveLength(0);
      } finally {
        spy.mockRestore();
      }
    });

    it("A → B → A: the copy of A goes as soon as A is back", async () => {
      const spy = stubAnimations();
      try {
        const { content, flush, ghosts } = setup();
        const a = content("a", "to-start");
        await flush();
        a.remove();
        await flush();
        expect(ghosts()).toHaveLength(1);
        content("a", "from-start");
        await flush();
        expect(ghosts()).toHaveLength(0);
      } finally {
        spy.mockRestore();
      }
    });

    it("the copy ignores animation events bubbling from its children", async () => {
      const spy = stubAnimations();
      try {
        const { content, flush, ghosts } = setup();
        const a = content("a", "to-start");
        await flush();
        a.remove();
        await flush();
        const [ghost] = ghosts();
        ghost
          .querySelector("a")
          ?.dispatchEvent(new Event("animationend", { bubbles: true }));
        expect(ghost.isConnected).toBe(true);
        ghost.dispatchEvent(new Event("animationcancel"));
        expect(ghost.isConnected).toBe(false);
      } finally {
        spy.mockRestore();
      }
    });

    it("works in another realm (an iframe preview): no instanceof checks", async () => {
      // The docs' mobile preview renders into an iframe while the code runs
      // in the parent window, so its nodes fail the parent's `instanceof
      // HTMLElement`. jsdom gives an iframe its own realm, like a browser.
      const iframe = document.createElement("iframe");
      document.body.append(iframe);
      const frameWindow = iframe.contentWindow as Window & typeof globalThis;
      const doc = frameWindow.document;
      const real = frameWindow.getComputedStyle.bind(frameWindow);
      const spy = vi
        .spyOn(frameWindow, "getComputedStyle")
        .mockImplementation((el, pseudo) => {
          const style = real(el, pseudo);
          if ((el as HTMLElement).dataset?.slot !== "navigation-menu-content")
            return style;
          return new Proxy(style, {
            get(target, key) {
              if (key === "animationName") return "godui-out";
              const value = Reflect.get(target, key);
              return typeof value === "function" ? value.bind(target) : value;
            },
          });
        });
      try {
        const container = doc.body.appendChild(doc.createElement("div"));
        render(
          <NavigationMenuViewportFrame>
            <div data-slot="navigation-menu-viewport" data-state="open" />
          </NavigationMenuViewportFrame>,
          { container },
        );
        const viewport = container.querySelector(
          '[data-slot="navigation-menu-viewport"]',
        ) as HTMLElement;
        expect(viewport).not.toBeInstanceOf(HTMLElement);
        const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
        const add = (id: string, motion?: string) => {
          const el = doc.createElement("div");
          el.dataset.slot = "navigation-menu-content";
          if (motion) el.dataset.motion = motion;
          el.id = id;
          viewport.append(el);
          return el;
        };
        const ghosts = () => viewport.querySelectorAll("[data-exiting]");
        // A dropped exit is replayed...
        const a = add("a", "to-start");
        await flush();
        a.remove();
        await flush();
        expect(ghosts()).toHaveLength(1);
        // ...and an exit that already played is not.
        const b = add("b");
        await flush();
        b.dataset.motion = "to-end";
        b.dispatchEvent(
          new frameWindow.Event("animationstart", { bubbles: true }),
        );
        b.remove();
        await flush();
        expect(ghosts()).toHaveLength(1);
      } finally {
        spy.mockRestore();
        iframe.remove();
      }
    });

    it("unmounting removes pending copies and their timers", async () => {
      const spy = stubAnimations();
      const clear = vi.spyOn(window, "clearTimeout");
      try {
        const { view, viewport, content, flush, ghosts } = setup();
        const a = content("a", "to-start");
        await flush();
        a.remove();
        await flush();
        const [ghost] = ghosts();
        expect(ghost).toBeDefined();
        view.unmount();
        expect(ghost.isConnected).toBe(false);
        expect(viewport.isConnected).toBe(false);
        expect(clear).toHaveBeenCalled();
      } finally {
        clear.mockRestore();
        spy.mockRestore();
      }
    });
  });
});
