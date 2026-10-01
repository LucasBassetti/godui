import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/hover-card";
import * as Godui from "./hover-card";

function Usage({
  ui,
  defaultOpen,
}: {
  ui: typeof Shadcn;
  defaultOpen?: boolean;
}) {
  const { HoverCard, HoverCardContent, HoverCardTrigger } = ui;
  return (
    <HoverCard defaultOpen={defaultOpen} openDelay={0}>
      <HoverCardTrigger href="#nextjs">@nextjs</HoverCardTrigger>
      <HoverCardContent>
        The React Framework – created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  );
}

const content = () =>
  document.querySelector('[data-slot="hover-card-content"]') as HTMLElement;

describe("HoverCard", () => {
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

  it("opens on keyboard focus", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.tab();
    await waitFor(() => expect(content()).toBeInTheDocument());
    expect(screen.getByText(/The React Framework/)).toBeInTheDocument();
  });

  it("grows from the link and drifts out of it, per side", () => {
    render(<Usage ui={Godui} defaultOpen />);
    const cls = content().className;
    expect(cls).toContain(
      "origin-(--radix-hover-card-content-transform-origin)",
    );
    expect(cls).toContain("data-[state=open]:animate-godui-popover-in");
    expect(cls).toContain("data-[state=closed]:animate-godui-popover-out");
    expect(cls).toContain("data-[side=bottom]:[--godui-enter-y:-0.25rem]");
    expect(cls).not.toMatch(/animate-in|zoom-in|slide-in-from/);
  });
});
