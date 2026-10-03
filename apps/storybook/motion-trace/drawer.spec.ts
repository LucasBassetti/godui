import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const open = async (page: Page) => {
  await page.getByRole("button", { name: "Open drawer" }).click();
};

test("drawer opens on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-drawer--default",
    act: open,
    windowMs: 900,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // The header and footer rises end 60ms apart (staggered delays), and each
  // finishing animation costs one discrete layout frame.
  expectGpuOnly(result, { maxLayoutFrames: 2 });
});

test("drawer closes on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-drawer--default",
    setup: async (p) => {
      await open(p);
      await p.waitForTimeout(400);
    },
    act: async (p) => {
      await p.getByRole("button", { name: "Cancel" }).click();
    },
    windowMs: 900,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("content rises in after the sheet (staggered delays apply)", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-drawer--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  await open(page);
  const delays = await page.evaluate(() =>
    ["drawer-header", "drawer-footer"].map((slot) => {
      const el = document.querySelector(`[data-slot="${slot}"]`);
      const style = el ? getComputedStyle(el) : null;
      return [style?.animationName, style?.animationDelay];
    }),
  );
  expect(delays).toEqual([
    ["godui-slide-in-from-bottom", "0.06s"],
    ["godui-slide-in-from-bottom", "0.12s"],
  ]);
});
