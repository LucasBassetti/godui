import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const open = async (page: Page) => {
  await page.getByRole("button", { name: "Open sheet" }).click();
};

test("sheet slides in on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-sheet--default",
    act: open,
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("sheet slides out on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-sheet--default",
    setup: open,
    act: async (p) => {
      await p.keyboard.press("Escape");
    },
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
