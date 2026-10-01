import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("tooltip opens on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-tooltip--default",
    act: async (p) => {
      await p.getByRole("button", { name: "Hover" }).hover();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("hopping across a toolbar stays on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-tooltip--toolbar",
    setup: async (p) => {
      await p.getByRole("button", { name: "Bold" }).hover();
      await p.waitForTimeout(400);
    },
    act: async (p) => {
      // Real pointer travel: Radix closes the first tooltip once the pointer
      // leaves its grace area, which needs pointermoves, not a teleport.
      const box = await p.getByRole("button", { name: "Italic" }).boundingBox();
      if (!box) throw new Error("no Italic button");
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
        steps: 6,
      });
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
