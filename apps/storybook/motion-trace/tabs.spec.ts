import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

for (const story of ["default", "line", "vertical"]) {
  test(`tabs indicator slides on the compositor (${story})`, async ({
    page,
  }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-tabs--${story}`,
      act: async (p) => {
        await p.getByRole("tab", { name: "Password" }).click();
      },
      windowMs: 700,
    });
    expect(result.animationCount).toBeGreaterThan(0);
    expectGpuOnly(result);
  });
}

test("the indicator, not the trigger, paints the active background", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-tabs--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  const list = page.locator('[data-slot="tabs-list"]');
  await expect(list).toHaveAttribute("data-indicator", "ready");
  const active = page.getByRole("tab", { name: "Account" });
  const bg = await active.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  expect(bg).toBe("rgba(0, 0, 0, 0)");
  const indicator = page.locator('[data-slot="tabs-indicator"]');
  const [tabBox, indicatorBox] = await Promise.all([
    active.boundingBox(),
    indicator.boundingBox(),
  ]);
  expect(indicatorBox?.x).toBeCloseTo(tabBox?.x ?? -1, 0);
  expect(indicatorBox?.width).toBeCloseTo(tabBox?.width ?? -1, 0);
});
