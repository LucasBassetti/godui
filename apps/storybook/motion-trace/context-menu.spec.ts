import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("context menu opens on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-context-menu--default",
    act: async (p) => {
      await p.getByText("Right click here").click({ button: "right" });
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("context menu closes on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-context-menu--default",
    setup: async (p) => {
      await p.getByText("Right click here").click({ button: "right" });
    },
    act: async (p) => {
      await p.keyboard.press("Escape");
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
