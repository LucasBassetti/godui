import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const open = async (page: Page) => {
  await page.getByRole("button", { name: "Show dialog" }).click();
};

test("alert dialog opens on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-alert-dialog--default",
    act: open,
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("alert dialog cancels on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-alert-dialog--default",
    setup: open,
    act: async (p) => {
      await p.getByRole("button", { name: "Cancel" }).click();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
