import { render, screen } from "@testing-library/react";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/textarea";
import * as Godui from "./textarea";

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { Textarea } = ui;
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Textarea placeholder="Disabled" disabled />
    </div>
  );
}

describe("Textarea", () => {
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

  it("keeps shadcn's focus and invalid ring, which snaps: no transition class", () => {
    render(<Usage ui={Godui} />);
    const textarea = screen.getByPlaceholderText("Type your message here.");
    const classes = textarea.className.split(/\s+/);
    expect(classes).toEqual(
      expect.arrayContaining([
        "focus-visible:border-ring",
        "focus-visible:ring-[3px]",
        "focus-visible:ring-ring/50",
        "aria-invalid:ring-destructive/20",
      ]),
    );
    expect(classes.filter((c) => /(^|:)transition/.test(c))).toEqual([]);
  });

  it("stays a native textarea: typing and disabled work", () => {
    render(<Usage ui={Godui} />);
    const textarea = screen.getByPlaceholderText<HTMLTextAreaElement>(
      "Type your message here.",
    );
    textarea.focus();
    expect(textarea).toHaveFocus();
    expect(screen.getByPlaceholderText("Disabled")).toBeDisabled();
  });
});
