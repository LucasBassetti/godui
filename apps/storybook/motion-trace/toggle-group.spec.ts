import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

for (const story of ["single", "outline"]) {
  test(`single toggle group slides its indicator on the compositor (${story})`, async ({
    page,
  }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-toggle-group--${story}`,
      act: async (p) => {
        await p.getByRole("radio").last().click();
      },
      windowMs: 700,
    });
    expect(result.animationCount).toBeGreaterThan(0);
    expectGpuOnly(result);
  });
}

test("the indicator, not the item, paints the on background", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-toggle-group--single&viewMode=story");
  await page.waitForLoadState("networkidle");
  await expect(page.locator('[data-slot="toggle-group"]')).toHaveAttribute(
    "data-indicator",
    "ready",
  );
  const on = page.locator('[data-slot="toggle-group-item"][data-state="on"]');
  const bg = await on.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgba(0, 0, 0, 0)");
  const [itemBox, indicatorBox] = await Promise.all([
    on.boundingBox(),
    page.locator('[data-slot="toggle-group-indicator"]').boundingBox(),
  ]);
  expect(indicatorBox?.x).toBeCloseTo(itemBox?.x ?? -1, 0);
  expect(indicatorBox?.width).toBeCloseTo(itemBox?.width ?? -1, 0);
});
