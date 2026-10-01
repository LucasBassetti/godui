import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("the shimmer band sweeps on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-skeleton--card",
    // The loop starts on load, before tracing; restart it so Chrome reports
    // the animation (and whether it composited) inside the traced window.
    act: async (p) => {
      await p.evaluate(() => {
        for (const el of document.querySelectorAll('[data-slot="skeleton"]')) {
          for (const animation of el.getAnimations({ subtree: true })) {
            animation.cancel();
            animation.play();
          }
        }
      });
      // Let the band cross the blocks: 1.2s of idle shimmer.
      await p.waitForTimeout(1200);
    },
    // One 1.6s iteration of the loop.
    windowMs: 1800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
