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
  const paint = await active.evaluate((el) => {
    const style = getComputedStyle(el);
    return [style.backgroundColor, style.boxShadow];
  });
  // Neither the background nor shadcn's shadow-sm stays on the trigger.
  expect(paint).toEqual(["rgba(0, 0, 0, 0)", "none"]);
  const indicator = page.locator('[data-slot="tabs-indicator"]');
  const [tabBox, indicatorBox] = await Promise.all([
    active.boundingBox(),
    indicator.boundingBox(),
  ]);
  expect(indicatorBox?.x).toBeCloseTo(tabBox?.x ?? -1, 0);
  expect(indicatorBox?.width).toBeCloseTo(tabBox?.width ?? -1, 0);
});

test("a customised active trigger keeps its own colors after hydration", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-tabs--custom-active&viewMode=story");
  await page.waitForLoadState("networkidle");
  await expect(page.locator('[data-slot="tabs-list"]')).toHaveAttribute(
    "data-indicator",
    "ready",
  );
  const [trigger, primary] = await page.evaluate(() => {
    const active = document.querySelector('[role="tab"][data-state="active"]');
    const probe = document.createElement("div");
    probe.className = "bg-primary";
    document.body.append(probe);
    const colors = [
      active ? getComputedStyle(active).backgroundColor : "",
      getComputedStyle(probe).backgroundColor,
    ];
    probe.remove();
    return colors;
  });
  expect(trigger).toBe(primary);
});
