import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("menubar opens a menu on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-menubar--default",
    act: async (p) => {
      await p.getByRole("menuitem", { name: "File", exact: true }).click();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("hopping to the next menu exits one and enters the other on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-menubar--default",
    setup: async (p) => {
      await p.getByRole("menuitem", { name: "File", exact: true }).click();
    },
    act: async (p) => {
      await p.keyboard.press("ArrowRight");
    },
    windowMs: 700,
  });
  // The old menu's exit and the new menu's enter.
  expect(result.animationCount).toBeGreaterThan(1);
  // Two discrete frames: the previous menu unmounts when its 150ms exit ends,
  // and the next menu's 260ms enter finishes. Neither repeats per frame.
  expectGpuOnly(result, { maxLayoutFrames: 2 });
});

test("checking an item pops its indicator on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-menubar--default",
    setup: async (p) => {
      await p.getByRole("menuitem", { name: "View" }).click();
    },
    act: async (p) => {
      await p
        .getByRole("menuitemcheckbox", { name: "Always Show Bookmarks Bar" })
        .click();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("a sub-menu opens fully visible, not clipped by its parent", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-menubar--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  await page.getByRole("menuitem", { name: "File", exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByRole("menuitem", { name: "Share" }).hover();
  await page.waitForTimeout(500);
  const sub = page.locator('[data-slot="menubar-sub-content"]');
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
