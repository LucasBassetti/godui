import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/popover";
import { Button } from "./button";
import * as Godui from "./popover";

function Usage({
  ui,
  defaultOpen,
}: {
  ui: typeof Shadcn;
  defaultOpen?: boolean;
}) {
  const {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
  } = ui;
  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}

const content = () =>
  document.querySelector('[data-slot="popover-content"]') as HTMLElement;

describe("Popover", () => {
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

  it("toggles from the trigger and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("button", { name: "Open popover" }));
    expect(content()).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(content()).toBeNull());
  });

  it("grows from the trigger and drifts out of it, per side", () => {
    render(<Usage ui={Godui} defaultOpen />);
    const cls = content().className;
    expect(cls).toContain("origin-(--radix-popover-content-transform-origin)");
    expect(cls).toContain("data-[state=open]:animate-godui-popover-in");
    expect(cls).toContain("data-[state=closed]:animate-godui-popover-out");
    for (const side of [
      "data-[side=bottom]:[--godui-enter-y:-0.25rem]",
      "data-[side=top]:[--godui-enter-y:0.25rem]",
      "data-[side=left]:[--godui-enter-x:0.25rem]",
      "data-[side=right]:[--godui-enter-x:-0.25rem]",
    ]) {
      expect(cls).toContain(side);
    }
    expect(cls).not.toMatch(/animate-in|zoom-in|slide-in-from/);
  });
});
