import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/dropdown-menu";
import { Button } from "./button";
import * as Godui from "./dropdown-menu";

function Usage({
  ui,
  defaultOpen,
  onBar,
}: {
  ui: typeof Shadcn;
  defaultOpen?: boolean;
  onBar?: (checked: boolean) => void;
}) {
  const {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } = ui;
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked onCheckedChange={onBar}>
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="top">
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const content = () =>
  document.querySelector('[data-slot="dropdown-menu-content"]') as HTMLElement;

describe("DropdownMenu", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} defaultOpen />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} defaultOpen />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("opens with Enter, moves with arrows and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    screen.getByRole("button", { name: "Open" }).focus();
    await user.keyboard("{Enter}");
    expect(content()).toBeInTheDocument();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveAttribute("role", "menuitem");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(content()).toBeNull());
  });

  it("toggles a checkbox item", async () => {
    const user = userEvent.setup();
    const onBar = vi.fn();
    render(<Usage ui={Godui} defaultOpen onBar={onBar} />);
    await user.click(screen.getByRole("menuitemcheckbox"));
    expect(onBar).toHaveBeenCalledWith(false);
  });

  it("content grows from the trigger; checks pop in", () => {
    render(<Usage ui={Godui} defaultOpen />);
    const cls = content().className;
    expect(cls).toContain(
      "origin-(--radix-dropdown-menu-content-transform-origin)",
    );
    expect(cls).toContain("data-[state=open]:animate-godui-popover-in");
    expect(cls).toContain("data-[state=closed]:animate-godui-popover-out");
    expect(cls).toContain("data-[side=bottom]:[--godui-enter-y:-0.25rem]");
    expect(cls).not.toMatch(/animate-in|zoom-in|slide-in-from/);
    const check = screen
      .getByRole("menuitemcheckbox")
      .querySelector('[data-state="checked"]');
    expect(check?.className).toContain("animate-godui-fade-scale-in");
    expect(check?.className).toContain("[--godui-enter-scale:0.5]");
  });
});
