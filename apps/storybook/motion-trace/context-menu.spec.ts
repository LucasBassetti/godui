import { expect, test } from "@playwright/test";
import { deselect } from "./deselect";
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

test("a deselected indicator is removed at once, without re-popping", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-context-menu--checkboxes&viewMode=story");
  await page.waitForLoadState("networkidle");
  await page.getByText("Right click here").click({ button: "right" });
  await page.waitForTimeout(500);
  const checkbox = {
    selector: '[data-slot="context-menu-checkbox-item"]',
    text: "Show Bookmarks",
  };
  const indicator = '[data-state="checked"]';
  // Checked on open: unchecking it removes the check in the same frame.
  expect(
    await deselect(page, { checked: checkbox, indicator, click: checkbox }),
  ).toEqual({ connectedAfterOneFrame: false, animations: [] });
  // After a toggle (data-animate set): re-check (pops), then uncheck again.
  await page.getByRole("menuitemcheckbox", { name: "Show Bookmarks" }).click();
  await page.waitForTimeout(500);
  expect(
    await deselect(page, { checked: checkbox, indicator, click: checkbox }),
  ).toEqual({ connectedAfterOneFrame: false, animations: [] });
  // Picking another radio removes the old dot in the same frame.
  expect(
    await deselect(page, {
      checked: {
        selector: '[data-slot="context-menu-radio-item"]',
        text: "Pedro Duarte",
      },
      indicator,
      click: {
        selector: '[data-slot="context-menu-radio-item"]',
        text: "Colm Tuite",
      },
    }),
  ).toEqual({ connectedAfterOneFrame: false, animations: [] });
});
