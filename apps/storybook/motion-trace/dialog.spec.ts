import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const open = async (page: Page) => {
  await page.getByRole("button", { name: "Open dialog" }).click();
};

test("dialog opens on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-dialog--default",
    act: open,
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("dialog closes on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-dialog--default",
    setup: open,
    act: async (p) => {
      await p.keyboard.press("Escape");
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
