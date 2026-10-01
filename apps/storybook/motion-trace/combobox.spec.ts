import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("combobox opens on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-combobox--default",
    act: async (p) => {
      await p.getByPlaceholder("Select a framework").click();
      await p.keyboard.press("ArrowDown");
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("removing a chip FLIPs the rest on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-combobox--multiple",
    setup: async (p) => {
      await p.waitForTimeout(300);
    },
    act: async (p) => {
      await p.locator('[data-slot="combobox-chip-remove"]').first().click();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
