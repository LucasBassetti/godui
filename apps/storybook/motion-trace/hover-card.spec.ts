import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("hover card opens on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-hover-card--default",
    act: async (p) => {
      await p.getByRole("button", { name: "@nextjs" }).hover();
    },
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
