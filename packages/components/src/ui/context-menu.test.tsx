import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
