import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("arrow keys slide the highlight on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-command--default",
    setup: async (p) => {
      await p.getByPlaceholder("Type a command or search...").focus();
    },
    act: async (p) => {
      for (let i = 0; i < 3; i++) {
        await p.keyboard.press("ArrowDown");
        await p.waitForTimeout(80);
      }
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("the indicator, not the item, paints the selection", async ({ page }) => {
  await page.goto("/iframe.html?id=ui-command--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  await expect(page.locator('[data-slot="command-list"]')).toHaveAttribute(
    "data-indicator",
    "ready",
  );
  const selected = page.locator('[cmdk-item][data-selected="true"]');
  const bg = await selected.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  expect(bg).toBe("rgba(0, 0, 0, 0)");
  const [itemBox, indicatorBox] = await Promise.all([
    selected.boundingBox(),
    page.locator('[data-slot="command-indicator"]').boundingBox(),
  ]);
  expect(indicatorBox?.y).toBeCloseTo(itemBox?.y ?? -1, 0);
  expect(indicatorBox?.height).toBeCloseTo(itemBox?.height ?? -1, 0);
});
