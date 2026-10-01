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

  it("don't transition paint (focus rings snap)", () => {
    render(
      <Usage
        ui={{ input: GoduiInput, textarea: GoduiTextarea, group: GoduiGroup }}
      />,
    );
    for (const el of [
      screen.getByPlaceholderText("Email"),
      screen.getByPlaceholderText("Message"),
      document.querySelector('[data-slot="input-group"]') as HTMLElement,
    ]) {
      expect(el.className).not.toMatch(/transition-\[color|transition-all/);
    }
  });
});
