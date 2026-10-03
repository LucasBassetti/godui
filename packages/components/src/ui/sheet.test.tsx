import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/sheet";
import { Button } from "./button";
import * as Godui from "./sheet";

type Side = "top" | "right" | "bottom" | "left";

function Usage({
  ui,
  defaultOpen,
  side,
}: {
  ui: typeof Shadcn;
  defaultOpen?: boolean;
  side?: Side;
}) {
  const {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } = ui;
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const content = () =>
  document.querySelector('[data-slot="sheet-content"]') as HTMLElement;

describe("Sheet", () => {
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

  it("opens from the trigger and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it.each([
    "top",
    "right",
    "bottom",
    "left",
  ] as const)("slides the full panel in and out from the %s", (side) => {
    render(<Usage ui={Godui} defaultOpen side={side} />);
    const cls = content().className;
    expect(cls).toContain(
      `data-[state=open]:animate-godui-slide-in-from-${side}`,
    );
    expect(cls).toContain(
      `data-[state=closed]:animate-godui-slide-out-to-${side}`,
    );
    expect(cls).toContain("[--godui-enter-distance:100%]");
    expect(cls).not.toMatch(/(^|\s)transition(\s|$)|duration-\d|animate-in/);
  });

  it("fades the overlay with godui-motion", () => {
    render(<Usage ui={Godui} defaultOpen />);
    const overlay = document.querySelector('[data-slot="sheet-overlay"]');
    expect(overlay?.className).toContain(
      "data-[state=open]:animate-godui-fade-in",
    );
  });
});
