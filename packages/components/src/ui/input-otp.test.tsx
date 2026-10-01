import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/input-otp";
import * as Godui from "./input-otp";

const PKG = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

// input-otp probes for password-manager badges with elementFromPoint on a
// timer; jsdom doesn't implement it.
beforeAll(() => {
  document.elementFromPoint ??= () => null;
});

function Usage({ ui }: { ui: typeof Shadcn }) {
  const { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } = ui;
  return (
    <InputOTP maxLength={6} aria-label="One-time password">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

const slots = () => [
  ...document.querySelectorAll<HTMLElement>('[data-slot="input-otp-slot"]'),
];

describe("InputOTP", () => {
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

  it("fills slots as you type; each digit rises in", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.type(screen.getByRole("textbox"), "123");
    expect(slots().map((slot) => slot.textContent)).toEqual([
      "1",
      "2",
      "3",
      "",
      "",
      "",
    ]);
    const digit = slots()[0].querySelector("span");
    expect(digit?.className).toContain("animate-godui-slide-in-from-bottom");
  });

  it("no paint transitions; the caret only blinks its opacity", async () => {
    const user = userEvent.setup();
    render(<Usage ui={Godui} />);
    await user.click(screen.getByRole("textbox"));
    for (const slot of slots()) {
      expect(slot.className).not.toContain("transition-all");
    }
    const caret = document.querySelector(
      '[data-slot="input-otp-slot"] .animate-godui-caret-blink',
    );
    expect(caret).not.toBeNull();
    expect(caret?.className).not.toMatch(/duration-\d/);
  });

  it("godui-caret-blink animates opacity only (styles.css)", () => {
    const css = readFileSync(join(PKG, "styles.css"), "utf8");
    expect(css).toContain("--animate-godui-caret-blink:");
    const start = css.indexOf("@keyframes godui-caret-blink");
    expect(start).toBeGreaterThan(-1);
    const block = css.slice(start, css.indexOf("\n}", start));
    const props = [...block.matchAll(/([a-z-]+):/g)].map((m) => m[1]);
    expect(new Set(props)).toEqual(new Set(["opacity"]));
  });
});
