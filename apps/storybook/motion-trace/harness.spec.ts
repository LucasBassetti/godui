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

test("box-shadow keyframes are reported as non-compositable", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "internal-motion-trace--box-shadow",
    act: click,
    windowMs: 700,
  });
  expect(result.unsupported.flatMap((u) => u.properties)).toContain(
    "box-shadow",
  );
  expect(() => expectGpuOnly(result)).toThrow();
});

test("WAAPI composite:add is caught as not composited", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "internal-motion-trace--waapi-add",
    act: click,
    windowMs: 700,
  });
  expect(result.compositeFailed.length).toBeGreaterThan(0);
  expect(() => expectGpuOnly(result)).toThrow();
});

test("useFlipGroup runs on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "internal-motion-trace--flip",
    act: click,
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
