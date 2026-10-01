import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("dropdown menu opens on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-dropdown-menu--default",
    act: async (p) => {
      await p.getByRole("button", { name: "Open menu" }).click();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("checking an item pops its indicator on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-dropdown-menu--checkboxes",
    setup: async (p) => {
      await p.getByRole("button", { name: "View options" }).click();
    },
    act: async (p) => {
      await p.getByRole("menuitemcheckbox", { name: "Panel" }).click();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
