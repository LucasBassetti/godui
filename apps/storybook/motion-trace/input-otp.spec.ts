import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("a typed digit rises in on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-input-otp--default",
    setup: async (p) => {
      await p.getByRole("textbox").focus();
      await p.keyboard.type("12");
    },
    // One keystroke: its own text layout settles, then only the rise animates.
    act: async (p) => {
      await p.keyboard.type("3");
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
