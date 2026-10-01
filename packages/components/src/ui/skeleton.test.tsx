import { render, screen } from "@testing-library/react";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/skeleton";
import * as Godui from "./skeleton";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { Skeleton } = ui;
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

const skeleton = () => screen.getByTestId("skeleton");

describe("Skeleton", () => {
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

  it("forwards props and keeps the call site's classes", () => {
    render(<Godui.Skeleton data-testid="skeleton" className="h-4 w-[250px]" />);
    expect(skeleton()).toHaveAttribute("data-slot", "skeleton");
    expect(skeleton()).toHaveClass(
      "h-4",
      "w-[250px]",
      "bg-accent",
      "rounded-md",
    );
  });

  it("shimmers with a transform-only band", () => {
    render(<Godui.Skeleton data-testid="skeleton" />);
    const cls = skeleton().className;
    expect(cls).toContain("after:animate-godui-shimmer");
    expect(cls).toContain("after:-translate-x-full");
    expect(cls).toContain("overflow-hidden");
    expect(cls).not.toContain("transition");
    // shadcn's pulse only returns under reduced motion.
    expect(cls.split(/\s+/)).not.toContain("animate-pulse");
  });

  it("reduced motion: the band is hidden and the block pulses instead", () => {
    render(<Godui.Skeleton data-testid="skeleton" />);
    const cls = skeleton().className;
    expect(cls).toContain("motion-reduce:animate-pulse");
    expect(cls).toContain("motion-reduce:after:hidden");
  });

  it("lets a call site's absolute replace relative", () => {
    render(<Godui.Skeleton data-testid="skeleton" className="absolute" />);
    const cls = skeleton().className.split(/\s+/);
    expect(cls).toContain("absolute");
    expect(cls).not.toContain("relative");
  });
});
