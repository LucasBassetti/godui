import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const open = async (page: Page) => {
  await page.getByRole("button", { name: "Open popover" }).click();
};

test("popover opens on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-popover--default",
    act: open,
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("popover closes on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-popover--default",
    setup: open,
    act: async (p) => {
      await p.keyboard.press("Escape");
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
