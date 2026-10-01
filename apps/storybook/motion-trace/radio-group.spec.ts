import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("selecting grows the dot on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-radio-group--default",
    act: async (p) => {
      await p.getByRole("radio", { name: "Compact" }).click();
    },
    windowMs: 600,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
