import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("the fill glides to a new value on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-progress--stepped",
    // The story starts at 13; one click sets 66.
    act: async (p) => {
      await p.getByRole("button", { name: "Advance" }).click();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("the indeterminate bar sweeps on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-progress--indeterminate",
    // The loop starts on load, before tracing; restart it so Chrome reports
    // the animation (and whether it composited) inside the traced window.
    act: async (p) => {
      await p.evaluate(() => {
        const bar = document.querySelector('[data-slot="progress-indicator"]');
        for (const animation of bar?.getAnimations() ?? []) {
          animation.cancel();
          animation.play();
        }
      });
    },
    // Two iterations of the 1.4s loop.
    windowMs: 2800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
