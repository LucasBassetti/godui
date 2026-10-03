import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const open = async (page: Page) => {
  await page.getByRole("combobox", { name: "Fruit" }).click();
};

for (const story of ["default", "popper"]) {
  test(`select opens on the compositor (${story})`, async ({ page }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-select--${story}`,
      act: open,
      windowMs: 700,
    });
    expect(result.animationCount).toBeGreaterThan(0);
    expectGpuOnly(result);
  });
}

test("select closes on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-select--popper",
    setup: open,
    act: async (p) => {
      await p.getByRole("option", { name: "Banana" }).click();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
