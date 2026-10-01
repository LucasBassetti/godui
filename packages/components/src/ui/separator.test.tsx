import { render } from "@testing-library/react";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/separator";
import * as Godui from "./separator";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { Separator } = ui;
  return (
    <div>
      <Separator />
      <Separator orientation="vertical" decorative={false} />
    </div>
  );
}

describe("Separator", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("renders horizontal and vertical orientations", () => {
    const { container } = render(<Usage ui={Godui} />);
    const [horizontal, vertical] = container.querySelectorAll(
      "[data-slot=separator]",
    );
    expect(horizontal).toHaveAttribute("data-orientation", "horizontal");
    expect(horizontal).toHaveAttribute("role", "none");
    expect(vertical).toHaveAttribute("data-orientation", "vertical");
    expect(vertical).toHaveAttribute("role", "separator");
  });
});
