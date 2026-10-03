import { expect, test } from "@playwright/test";
import { deselect } from "./deselect";
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

test("controlled: the deselected dot is removed at once, without re-popping", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-radio-group--controlled&viewMode=story");
  await page.waitForLoadState("networkidle");
  // Radio buttons have no text of their own: match on their value.
  const item = (value: string) => ({
    selector: `[data-slot="radio-group-item"][value="${value}"]`,
    text: "",
  });
  const indicator = '[data-slot="radio-group-indicator"]';
  // Selected on first paint.
  expect(
    await deselect(page, {
      checked: item("comfortable"),
      indicator,
      click: item("compact"),
    }),
  ).toEqual({ connectedAfterOneFrame: false, animations: [] });
  // Selected by a change (data-animate set), then deselected.
  await page.waitForTimeout(500);
  expect(
    await deselect(page, {
      checked: item("compact"),
      indicator,
      click: item("default"),
    }),
  ).toEqual({ connectedAfterOneFrame: false, animations: [] });
});
