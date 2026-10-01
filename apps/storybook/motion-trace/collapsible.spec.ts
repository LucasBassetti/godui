import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const toggle = async (page: Page) => {
  await page.getByRole("button", { name: "Toggle" }).click();
};

test("collapsible opens with a snap + FLIP on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-collapsible--default",
    act: toggle,
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("collapsible closes with a fade, then snap + FLIP", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-collapsible--default",
    setup: toggle,
    act: toggle,
    windowMs: 900,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // Same discrete snap as Accordion: the height changes once the fade ends.
  expectGpuOnly(result, { maxLayoutFrames: 3 });
});
