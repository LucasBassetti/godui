import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/tooltip";
import { Button } from "./button";
import * as Godui from "./tooltip";

function Usage({
  ui,
  defaultOpen,
}: {
  ui: typeof Shadcn;
  defaultOpen?: boolean;
}) {
  const { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } = ui;
  return (
    <TooltipProvider>
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const content = () =>
  document.querySelector('[data-slot="tooltip-content"]') as HTMLElement;

describe("Tooltip", () => {
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

  it("opens on keyboard focus and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.tab();
    await waitFor(() => expect(content()).toBeInTheDocument());
    expect(screen.getByRole("tooltip")).toHaveTextContent("Add to library");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(content()).toBeNull());
  });

  it("delayed opens grow and drift; instant opens (focus, skip-delay) only fade", () => {
    render(<Usage ui={Godui} defaultOpen />);
    const cls = content().className;
    expect(cls).toContain("origin-(--radix-tooltip-content-transform-origin)");
    expect(cls).toContain("data-[state=delayed-open]:animate-godui-popover-in");
    expect(cls).toContain("data-[state=closed]:animate-godui-popover-out");
    expect(cls).toContain("data-[side=top]:[--godui-enter-y:0.25rem]");
    // Radix uses instant-open for keyboard focus and for hopping between
    // tooltips inside the skip-delay window: no movement, just a fade.
    expect(cls).toContain("data-[state=instant-open]:animate-godui-fade-in");
    expect(cls).not.toMatch(/animate-in|zoom-in|slide-in-from|fade-in-0/);
  });
});
