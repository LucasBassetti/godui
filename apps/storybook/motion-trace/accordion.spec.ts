import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const toggle = async (page: Page) => {
  await page.getByRole("button", { name: "Product Information" }).click();
};

test("accordion opens with a snap + FLIP on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-accordion--default",
    act: toggle,
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // Two discrete "animation finished" frames: the FLIP ends, then the panel's
  // delayed rise ends ~100ms later. Neither repeats per frame.
  expectGpuOnly(result, { maxLayoutFrames: 2 });
});

test("accordion closes with a fade, then snap + FLIP, on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-accordion--default",
    setup: toggle,
    act: toggle,
    windowMs: 900,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // Discrete, not per-frame: the panel's height snaps once its 150ms fade
  // ends (that commit + the next frame), then the FLIP settles (one frame).
  expectGpuOnly(result, { maxLayoutFrames: 3 });
});
