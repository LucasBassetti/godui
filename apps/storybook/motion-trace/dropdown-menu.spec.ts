import { expect, test } from "@playwright/test";
import { deselect } from "./deselect";
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

test("a sub-menu opens fully visible, not clipped by its parent", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-dropdown-menu--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(500);
  await page.getByRole("menuitem", { name: "Invite users" }).hover();
  await page.waitForTimeout(500);
  const sub = page.locator('[data-slot="dropdown-menu-sub-content"]');
  await expect(sub).toBeVisible();
  // The sub-menu's centre must be hit-testable as part of the sub-menu (it is
  // not hidden under, or clipped by, the parent menu's overflow).
  const hit = await sub.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const at = document.elementFromPoint(
      r.left + r.width / 2,
      r.top + r.height / 2,
    );
    return Boolean(at && el.contains(at));
  });
  expect(hit).toBe(true);
});

test("a deselected indicator is removed at once, without re-popping", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=ui-dropdown-menu--checkboxes&viewMode=story",
  );
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "View options" }).click();
  await page.waitForTimeout(500);
  const checkbox = {
    selector: '[data-slot="dropdown-menu-checkbox-item"]',
    text: "Status Bar",
  };
  const indicator = '[data-state="checked"]';
  // Checked on open: unchecking it removes the check in the same frame.
  expect(
    await deselect(page, { checked: checkbox, indicator, click: checkbox }),
  ).toEqual({ connectedAfterOneFrame: false, animations: [] });
  // After a toggle (data-animate set): re-check (pops), then uncheck again.
  await page.getByRole("menuitemcheckbox", { name: "Status Bar" }).click();
  await page.waitForTimeout(500);
  expect(
    await deselect(page, { checked: checkbox, indicator, click: checkbox }),
  ).toEqual({ connectedAfterOneFrame: false, animations: [] });
  // Picking another radio removes the old dot in the same frame.
  expect(
    await deselect(page, {
      checked: {
        selector: '[data-slot="dropdown-menu-radio-item"]',
        text: "Bottom",
      },
      indicator,
      click: {
        selector: '[data-slot="dropdown-menu-radio-item"]',
        text: "Top",
      },
    }),
  ).toEqual({ connectedAfterOneFrame: false, animations: [] });
});
