import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("checking pops the check on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-checkbox--default",
    act: async (p) => {
      await p.getByRole("checkbox").click();
    },
    windowMs: 600,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
