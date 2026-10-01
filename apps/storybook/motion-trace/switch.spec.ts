import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

for (const story of ["default", "small"]) {
  test(`switch toggles on the compositor (${story})`, async ({ page }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-switch--${story}`,
      act: async (p) => {
        await p.getByRole("switch").click();
      },
      windowMs: 600,
    });
    expect(result.animationCount).toBeGreaterThan(0);
    expectGpuOnly(result);
  });
}
