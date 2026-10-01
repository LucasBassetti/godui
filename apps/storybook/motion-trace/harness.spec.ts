import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const click = async (page: Page) => {
  await page.getByTestId("go").click();
};

test("GPU-only fixture: no layout while animating, everything composited", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "internal-motion-trace--gpu-only",
    act: click,
    windowMs: 700,
  });
  expectGpuOnly(result);
});

test("layout-thrash fixture is caught", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "internal-motion-trace--layout-thrash",
    act: click,
    windowMs: 700,
  });
  expect(() => expectGpuOnly(result)).toThrow();
  expect(result.layoutCount).toBeGreaterThan(5);
});
