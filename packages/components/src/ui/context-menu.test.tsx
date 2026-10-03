import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/context-menu";
import * as Godui from "./context-menu";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
  } = ui;
  return (
    <ContextMenu>
      <ContextMenuTrigger>Right click here</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Bookmarks
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="pedro">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioItem value="pedro">
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const open = () => fireEvent.contextMenu(screen.getByText("Right click here"));
const content = () =>
  document.querySelector('[data-slot="context-menu-content"]') as HTMLElement;

describe("ContextMenu", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} />);
    open();
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} />);
    open();
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("opens on right click and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    open();
    expect(content()).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(content()).toBeNull());
  });

  it("grows from the pointer and pops checks in", () => {
    render(<Usage ui={Godui} />);
    open();
    const cls = content().className;
    expect(cls).toContain(
      "origin-(--radix-context-menu-content-transform-origin)",
    );
    expect(cls).toContain("data-[state=open]:animate-godui-popover-in");
    expect(cls).toContain("data-[state=closed]:animate-godui-popover-out");
    expect(cls).not.toMatch(/animate-in|zoom-in|slide-in-from/);
    const check = screen
      .getByRole("menuitemcheckbox")
      .querySelector('[data-state="checked"]');
    expect(check?.className).toContain("animate-godui-fade-scale-in");
    expect(check?.className).toContain("[--godui-enter-scale:0.5]");
  });
});

describe("ContextMenu indicators (mount rule)", () => {
  const keepOpen = (event: Event) => event.preventDefault();

  function Stateful() {
    const {
      ContextMenuCheckboxItem: CheckboxItem,
      ContextMenuRadioGroup: RadioGroup,
      ContextMenuRadioItem: RadioItem,
    } = Godui;
    const [checked, setChecked] = React.useState(true);
    const [value, setValue] = React.useState("a");
    return (
      <Godui.ContextMenu>
        <Godui.ContextMenuTrigger>Target</Godui.ContextMenuTrigger>
        <Godui.ContextMenuContent>
          <CheckboxItem
            checked={checked}
            onCheckedChange={setChecked}
            onSelect={keepOpen}
          >
            Bar
          </CheckboxItem>
          <RadioGroup value={value} onValueChange={setValue}>
            <RadioItem value="a" onSelect={keepOpen}>
              A
            </RadioItem>
            <RadioItem value="b" onSelect={keepOpen}>
              B
            </RadioItem>
          </RadioGroup>
        </Godui.ContextMenuContent>
      </Godui.ContextMenu>
    );
  }

  const checkbox = () => screen.getByRole("menuitemcheckbox", { name: "Bar" });
  const radio = (name: string) => screen.getByRole("menuitemradio", { name });
  const indicatorClasses = (item: HTMLElement) =>
    (item.querySelector('[data-state="checked"]')?.className ?? "").split(" ");

  it("does not pop when the menu opens", async () => {
    const user = userEvent.setup();
    render(<Stateful />);
    await user.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Target"),
    });
    for (const item of [checkbox(), radio("A")]) {
      expect(item).toHaveAttribute("data-state", "checked");
      expect(item).not.toHaveAttribute("data-animate");
      // The keyframe is gated on the item's data-animate, never applied bare.
      expect(indicatorClasses(item)).not.toContain(
        "animate-godui-fade-scale-in",
      );
    }
  });

  it("pops after a change", async () => {
    const user = userEvent.setup();
    render(<Stateful />);
    await user.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Target"),
    });
    await user.click(checkbox());
    expect(checkbox()).toHaveAttribute("data-state", "unchecked");
    await user.click(checkbox());
    expect(checkbox()).toHaveAttribute("data-state", "checked");
    expect(checkbox()).toHaveAttribute("data-animate", "true");
    expect(indicatorClasses(checkbox())).toContain(
      "group-data-[animate=true]/context-menu-checkbox-item:data-[state=checked]:animate-godui-fade-scale-in",
    );
    expect(radio("B")).not.toHaveAttribute("data-animate");
    await user.click(radio("B"));
    expect(radio("B")).toHaveAttribute("data-state", "checked");
    expect(radio("B")).toHaveAttribute("data-animate", "true");
    expect(indicatorClasses(radio("B"))).toContain(
      "group-data-[animate=true]/context-menu-radio-item:data-[state=checked]:animate-godui-fade-scale-in",
    );
  });

  it("toggle, close, reopen: the fresh mount doesn't pop", async () => {
    const user = userEvent.setup();
    render(<Stateful />);
    await user.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Target"),
    });
    await user.click(checkbox());
    await user.click(radio("B"));
    expect(checkbox()).toHaveAttribute("data-animate", "true");
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        document.querySelector('[data-slot="context-menu-content"]'),
      ).toBeNull(),
    );
    await user.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Target"),
    });
    // Items remount on open: whatever changed last time, nothing pops now.
    for (const item of [checkbox(), radio("A"), radio("B")]) {
      expect(item).not.toHaveAttribute("data-animate");
    }
    expect(radio("B")).toHaveAttribute("data-state", "checked");
  });
});
