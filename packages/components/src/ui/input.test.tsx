import { render, screen } from "@testing-library/react";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as ShadcnInput from "../../test/shadcn/input";
import * as ShadcnGroup from "../../test/shadcn/input-group";
import * as ShadcnTextarea from "../../test/shadcn/textarea";
import * as GoduiInput from "./input";
import * as GoduiGroup from "./input-group";
import * as GoduiTextarea from "./textarea";

type Ui = {
  input: typeof ShadcnInput;
  textarea: typeof ShadcnTextarea;
  group: typeof ShadcnGroup;
};

function Usage({ ui }: { ui: Ui }) {
  const { Input } = ui.input;
  const { Textarea } = ui.textarea;
  const {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
  } = ui.group;
  return (
    <div>
      <Input type="email" placeholder="Email" />
      <Textarea placeholder="Message" />
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="Notes" />
      </InputGroup>
    </div>
  );
}

describe("Input, Textarea, InputGroup", () => {
  it("match shadcn's data-slot trees and exports", () => {
    const shadcn = {
      input: ShadcnInput,
      textarea: ShadcnTextarea,
      group: ShadcnGroup,
    };
    const godui = {
      input: GoduiInput,
      textarea: GoduiTextarea,
      group: GoduiGroup,
    };
    const { unmount } = render(<Usage ui={shadcn} />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={godui} />);
    expectSlotParity(slotTree(), expected);
    for (const [g, s] of [
      [GoduiInput, ShadcnInput],
      [GoduiTextarea, ShadcnTextarea],
      [GoduiGroup, ShadcnGroup],
    ]) {
      expect(Object.keys(g)).toEqual(expect.arrayContaining(Object.keys(s)));
    }
  });

  it("input and textarea keep shadcn's ring, which snaps: no transition class", () => {
    render(
      <Usage
        ui={{ input: GoduiInput, textarea: GoduiTextarea, group: GoduiGroup }}
      />,
    );
    for (const el of [
      screen.getByPlaceholderText("Email"),
      screen.getByPlaceholderText("Message"),
    ]) {
      const classes = el.className.split(/\s+/);
      expect(classes).toEqual(
        expect.arrayContaining([
          "focus-visible:ring-[3px]",
          "focus-visible:ring-ring/50",
        ]),
      );
      expect(classes.filter((c) => /(^|:)transition/.test(c))).toEqual([]);
    }
  });

  it("the input group transitions only its ::before ring (opacity, scale)", () => {
    render(
      <Usage
        ui={{ input: GoduiInput, textarea: GoduiTextarea, group: GoduiGroup }}
      />,
    );
    const group = document.querySelector<HTMLElement>(
      '[data-slot="input-group"]',
    );
    const classes = group?.className.split(/\s+/) ?? [];
    expect(classes.filter((c) => /(^|:)transition-(?!none)/.test(c))).toEqual([
      "before:transition-[opacity,scale]",
    ]);
  });
});
