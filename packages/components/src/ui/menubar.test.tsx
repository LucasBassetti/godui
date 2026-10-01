import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/menubar";
import * as Godui from "./menubar";

/** shadcn's menubar-demo (File / Edit / View / Profiles), built from `ui.*`. */
function Usage({
  ui,
  defaultValue,
}: {
  ui: typeof Shadcn;
  defaultValue?: string;
}) {
  const {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } = ui;
  return (
    <Menubar defaultValue={defaultValue}>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="profiles">
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

const content = () =>
  document.querySelector('[data-slot="menubar-content"]') as HTMLElement | null;

/**
 * jsdom has no CSS, so Radix Presence would unmount a closing menu at once.
 * Report the real animation names so the closing menu stays mounted (its
 * animationend never fires here), as it does in a browser mid-exit.
 */
function stubExitAnimations() {
  const real = window.getComputedStyle.bind(window);
  return vi
    .spyOn(window, "getComputedStyle")
    .mockImplementation((el, pseudo) => {
      const style = real(el, pseudo);
      if (!(el instanceof HTMLElement)) return style;
      if (el.dataset.slot !== "menubar-content") return style;
      return new Proxy(style, {
        get(target, key) {
          if (key === "animationName")
            return el.dataset.state === "closed"
              ? "godui-popover-out"
              : "godui-popover-in";
          const value = Reflect.get(target, key);
          return typeof value === "function" ? value.bind(target) : value;
        },
      });
    });
}

const contents = () => [
  ...document.querySelectorAll<HTMLElement>('[data-slot="menubar-content"]'),
];

describe("Menubar", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    for (const menu of ["file", "view", "profiles"]) {
      const { unmount } = render(<Usage ui={Shadcn} defaultValue={menu} />);
      const expected = slotTree();
      unmount();
      const godui = render(<Usage ui={Godui} defaultValue={menu} />);
      expectSlotParity(slotTree(), expected);
      godui.unmount();
    }
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("opens on click and ArrowRight hops to the next menu", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("menuitem", { name: "File" }));
    expect(content()).toHaveTextContent("New Tab");
    await user.keyboard("{ArrowRight}");
    await waitFor(() => expect(content()).toHaveTextContent("Undo"));
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveAttribute(
      "data-state",
      "open",
    );
    await user.keyboard("{Escape}");
    await waitFor(() => expect(content()).toBeNull());
  });

  it("a hop keeps the next menu open while the previous one animates out", async () => {
    const spy = stubExitAnimations();
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      await user.click(screen.getByRole("menuitem", { name: "File" }));
      await user.keyboard("{ArrowRight}");
      await waitFor(() => expect(contents()).toHaveLength(2));
      const [file, edit] = contents();
      expect(file).toHaveAttribute("data-state", "closed");
      expect(edit).toHaveAttribute("data-state", "open");
      expect(edit).toHaveTextContent("Undo");
      expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveAttribute(
        "data-state",
        "open",
      );
    } finally {
      spy.mockRestore();
    }
  });

  it("a press inside the next menu during the old one's exit keeps it open (pointer hop)", async () => {
    const spy = stubExitAnimations();
    try {
      const user = userEvent.setup();
      render(<Usage ui={Godui} />);
      await user.click(screen.getByRole("menuitem", { name: "File" }));
      await user.hover(screen.getByRole("menuitem", { name: "Edit" }));
      await waitFor(() => expect(contents()).toHaveLength(2));
      const [file, edit] = contents();
      expect(file).toHaveAttribute("data-state", "closed");
      // The exiting File menu's layer sees this press as "outside".
      fireEvent.pointerDown(edit);
      fireEvent.focus(edit);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(edit).toHaveAttribute("data-state", "open");
      expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveAttribute(
        "data-state",
        "open",
      );
    } finally {
      spy.mockRestore();
    }
  });

  it("an open menu still dismisses on outside focus and presses, and calls the user's handlers", async () => {
    const onInteractOutside = vi.fn();
    const onFocusOutside = vi.fn();
    const onPointerDownOutside = vi.fn();
    function Bar() {
      return (
        <>
          <Godui.Menubar>
            <Godui.MenubarMenu value="file">
              <Godui.MenubarTrigger>File</Godui.MenubarTrigger>
              <Godui.MenubarContent
                onInteractOutside={onInteractOutside}
                onFocusOutside={onFocusOutside}
                onPointerDownOutside={onPointerDownOutside}
              >
                <Godui.MenubarItem>New Tab</Godui.MenubarItem>
              </Godui.MenubarContent>
            </Godui.MenubarMenu>
          </Godui.Menubar>
          <button type="button">Elsewhere</button>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Bar />);
    await user.click(screen.getByRole("menuitem", { name: "File" }));
    expect(content()).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));
    await waitFor(() => expect(content()).toBeNull());
    expect(onPointerDownOutside).toHaveBeenCalled();
    expect(onInteractOutside).toHaveBeenCalled();

    onInteractOutside.mockClear();
    await user.click(screen.getByRole("menuitem", { name: "File" }));
    expect(content()).not.toBeNull();
    screen.getByRole("button", { name: "Elsewhere" }).focus();
    await waitFor(() => expect(content()).toBeNull());
    expect(onFocusOutside).toHaveBeenCalled();
    expect(onInteractOutside).toHaveBeenCalled();
  });

  it("content and sub-content grow from the trigger; checks pop in", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} defaultValue="file" />);
    for (const cls of [content()?.className ?? ""]) {
      expect(cls).toContain(
        "origin-(--radix-menubar-content-transform-origin)",
      );
      expect(cls).toContain("data-[state=open]:animate-godui-popover-in");
      expect(cls).toContain("data-[state=closed]:animate-godui-popover-out");
      expect(cls).toContain("data-[side=bottom]:[--godui-enter-y:-0.25rem]");
      expect(cls).not.toMatch(/animate-in|zoom-in|slide-in-from|fade-in-0/);
    }
    await user.hover(screen.getByRole("menuitem", { name: "Share" }));
    screen.getByRole("menuitem", { name: "Share" }).focus();
    await user.keyboard("{ArrowRight}");
    const sub = await waitFor(() => {
      const el = document.querySelector('[data-slot="menubar-sub-content"]');
      expect(el).not.toBeNull();
      return el as HTMLElement;
    });
    expect(sub.className).toContain(
      "data-[state=open]:animate-godui-popover-in",
    );
    expect(sub.className).toContain(
      "data-[side=right]:[--godui-enter-x:-0.25rem]",
    );
    expect(sub.className).not.toMatch(/animate-in|zoom-in|slide-in-from/);
  });

  it("check and radio indicators pop in from 50%", () => {
    const { unmount } = render(<Usage ui={Godui} defaultValue="view" />);
    const check = screen
      .getByRole("menuitemcheckbox", { name: "Always Show Full URLs" })
      .querySelector('[data-state="checked"]');
    expect(check?.className).toContain("animate-godui-fade-scale-in");
    expect(check?.className).toContain("[--godui-enter-scale:0.5]");
    unmount();
    render(<Usage ui={Godui} defaultValue="profiles" />);
    const dot = screen
      .getByRole("menuitemradio", { name: "Benoit" })
      .querySelector('[data-state="checked"]');
    expect(dot?.className).toContain("animate-godui-fade-scale-in");
  });

  it("reduced motion: only root-scaled godui keyframes, no transitions", () => {
    render(<Usage ui={Godui} defaultValue="file" />);
    // Every animated part uses `animate-godui-*`, whose movement multiplies the
    // root-only `--godui-motion` (0 under reduced motion), so nothing here needs
    // a motion-reduce: override; a transform transition would.
    for (const el of document.querySelectorAll("[data-slot]")) {
      expect(el.className).not.toMatch(/(^|\s)transition/);
    }
    expect(content()?.className).toContain("animate-godui-popover-in");
  });
});
