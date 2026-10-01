import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("holding the thumb grows it on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-slider--default",
    act: async (p) => {
      const box = await p.getByRole("slider").boundingBox();
      if (!box) throw new Error("no thumb");
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await p.mouse.down();
      await p.waitForTimeout(300);
      await p.mouse.up();
    },
    windowMs: 600,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
