import { render, screen } from "@testing-library/react";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/button";
import * as Godui from "./button";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { Button } = ui;
  return (
    <div>
      <Button>Button</Button>
      <Button variant="outline" size="sm">
        Outline
      </Button>
      <Button variant="link" asChild>
        <a href="#x">Read the guide</a>
      </Button>
    </div>
  );
}

describe("Button", () => {
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

  it("presses with a GPU scale and no transition-all", () => {
    render(<Godui.Button>Go</Godui.Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("active:scale-[0.97]");
    expect(cls).toContain("transition-[scale]");
    expect(cls).not.toMatch(/transition-all|(^|\s)transition(\s|$)/);
  });

  it("asChild keeps press motion on the child", () => {
    render(
      <Godui.Button asChild>
        <a href="#x">Docs</a>
      </Godui.Button>,
    );
    const link = screen.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link.className).toContain("active:scale-[0.97]");
  });

  it("reduced motion drops the press transition", () => {
    render(<Godui.Button>Go</Godui.Button>);
    expect(screen.getByRole("button").className).toContain(
      "motion-reduce:transition-none",
    );
  });

  it("link variant does not squish", () => {
    render(<Godui.Button variant="link">L</Godui.Button>);
    expect(screen.getByRole("button").className).toContain("active:scale-100");
  });
});
