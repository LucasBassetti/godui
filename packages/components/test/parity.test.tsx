import { render } from "@testing-library/react";
import { expectSlotParity, slotTree } from "./parity";

describe("parity kit", () => {
  it("lists slotted elements in order and ignores declared extras", () => {
    render(
      <div data-slot="a">
        <span data-slot="extra" />
        <p data-slot="b" />
      </div>,
    );
    const tree = slotTree();
    expect(tree).toEqual(["div[a]", "span[extra]", "p[b]"]);
    expectSlotParity(tree, ["div[a]", "p[b]"], ["extra"]);
    expect(() => expectSlotParity(tree, ["div[a]", "p[b]"])).toThrow();
  });
});
