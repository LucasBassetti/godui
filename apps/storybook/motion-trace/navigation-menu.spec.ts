import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const open = async (p: Page) => {
  await p.getByRole("button", { name: "Home" }).click();
};

for (const story of ["default", "without-viewport"]) {
  test(`navigation menu opens on the compositor (${story})`, async ({
    page,
  }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-navigation-menu--${story}`,
      act: open,
      windowMs: 700,
    });
    expect(result.animationCount).toBeGreaterThan(0);
    expectGpuOnly(result);
  });

  test(`hopping to the next trigger slides both contents on the compositor (${story})`, async ({
    page,
  }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-navigation-menu--${story}`,
      setup: open,
      act: async (p) => {
        await p.getByRole("button", { name: "Components" }).hover();
      },
      windowMs: 800,
    });
    // The old content's exit and the new content's enter (plus the chevrons).
    expect(result.animationCount).toBeGreaterThan(1);
    // Two discrete frames: the old content is removed when its exit ends, and
    // the new content's (longer) enter finishes. The viewport's size snap lands
    // with the mutation itself. Neither repeats per frame.
    expectGpuOnly(result, { maxLayoutFrames: 2 });
  });

  test(`navigation menu closes on the compositor (${story})`, async ({
    page,
  }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-navigation-menu--${story}`,
      setup: open,
      act: async (p) => {
        await p.keyboard.press("Escape");
      },
      windowMs: 600,
    });
    expect(result.animationCount).toBeGreaterThan(0);
    expectGpuOnly(result);
  });
}

test("the exiting content stays visible while it slides out", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-navigation-menu--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  await open(page);
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Components" }).hover();
  await page.waitForTimeout(60);
  const leaving = page.locator(
    '[data-slot="navigation-menu-content"][data-motion="to-start"]',
  );
  await expect(leaving).toHaveCount(1);
  const animations = await leaving.evaluate((el) =>
    el.getAnimations().map((a) => (a as CSSAnimation).animationName),
  );
  expect(animations).toEqual(["godui-slide-out-to-left"]);
  // Gone once its exit has finished.
  await expect(leaving).toHaveCount(0, { timeout: 1000 });
});

test("the indicator slides on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-navigation-menu--with-indicator",
    setup: open,
    act: async (p) => {
      await p.getByRole("button", { name: "Components" }).hover();
    },
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // Same two discrete frames as any hop (old content removed, new enter ends);
  // the indicator itself only transitions transform.
  expectGpuOnly(result, { maxLayoutFrames: 2 });
});
