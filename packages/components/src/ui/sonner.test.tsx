import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isCompositorProp } from "@godui/motion-lint";
import { act, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/sonner";
import * as Godui from "./sonner";

const PKG = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const toastLi = () =>
  document.querySelector("[data-sonner-toast]") as HTMLElement | null;

afterEach(() => {
  act(() => {
    toast.dismiss();
  });
});

async function show(
  ui: typeof Shadcn,
  props: React.ComponentProps<typeof Shadcn.Toaster> = {},
) {
  const view = render(<ui.Toaster {...props} />);
  act(() => {
    toast("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: { label: "Undo", onClick: () => {} },
    });
  });
  await waitFor(() => expect(toastLi()).not.toBeNull());
  return view;
}

describe("Sonner", () => {
  it("renders like shadcn's Toaster and exports the same names", async () => {
    const shadcn = await show(Shadcn);
    const expected = {
      slots: slotTree(),
      style: document
        .querySelector("[data-sonner-toaster]")
        ?.getAttribute("style"),
      text: toastLi()?.textContent,
    };
    shadcn.unmount();
    act(() => {
      toast.dismiss();
    });
    await show(Godui);
    expectSlotParity(slotTree(), expected.slots);
    expect(
      document.querySelector("[data-sonner-toaster]")?.getAttribute("style"),
    ).toBe(expected.style);
    expect(toastLi()?.textContent).toBe(expected.text);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("limits toast transitions to transform and opacity", async () => {
    await show(Godui);
    // Sonner's CSS is unlayered and Tailwind's is in @layer utilities, so
    // only !important overrides win.
    expect(toastLi()?.className).toContain(
      "[transition-property:transform,opacity]!",
    );
    expect(toastLi()?.className).toContain("ease-spring-snappy!");
    const action = screen.getByRole("button", { name: "Undo" });
    expect(action.className).toContain("[transition-property:opacity]!");
  });

  it("merges user toastOptions instead of replacing them", async () => {
    await show(Godui, {
      toastOptions: { classNames: { toast: "my-toast" } },
    });
    const cls = toastLi()?.className ?? "";
    expect(cls).toContain("my-toast");
    expect(cls).toContain("[transition-property:transform,opacity]!");
  });

  it("overrides every non-GPU transition in sonner's stylesheet", () => {
    const css = readFileSync(
      join(PKG, "node_modules/sonner/dist/styles.css"),
      "utf8",
    );
    const offending = new Set<string>();
    for (const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const transition = /(?:^|;)\s*transition:\s*([^;]+)/.exec(rule[2]);
      const value = transition?.[1].replace("!important", "").trim();
      if (!value || value === "none") continue;
      const props = value.split(",").map((part) => part.trim().split(/\s+/)[0]);
      if (props.some((prop) => !isCompositorProp(prop))) {
        offending.add(rule[1].trim().replace(/\s+/g, " "));
      }
    }
    // Each of these has a matching override in GODUI_TOAST / GODUI_BUTTON.
    expect([...offending].sort()).toEqual([
      "[data-sonner-toast]",
      "[data-sonner-toast][data-styled='true'] [data-button]",
      "[data-sonner-toast][data-styled='true'] [data-close-button]",
    ]);
  });
});
