import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("the shimmer band sweeps on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-skeleton--card",
    // The loop starts on load, before tracing; restart it so Chrome reports
    // the animation (and whether it composited) inside the traced window.
    act: async (p) => {
      await p.evaluate(() => {
        for (const el of document.querySelectorAll('[data-slot="skeleton"]')) {
          for (const animation of el.getAnimations({ subtree: true })) {
            animation.cancel();
            animation.play();
          }
        }
      });
      // Let the band cross the blocks: 1.2s of idle shimmer.
      await p.waitForTimeout(1200);
    },
    // One 1.6s iteration of the loop.
    windowMs: 1800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test('className="animate-none" stops it, as it stops shadcn\'s pulse (reduced motion too)', async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/iframe.html?id=ui-skeleton--static&viewMode=story");
    await page.waitForSelector('[data-slot="skeleton"]');
    const state = await page.evaluate(() =>
      [...document.querySelectorAll('[data-slot="skeleton"]')].map((el) => ({
        root: getComputedStyle(el).animationName,
        band: getComputedStyle(el, "::after").display,
        running: el.getAnimations({ subtree: true }).length,
      })),
    );
    expect(state.length).toBe(3);
    for (const s of state) {
      expect(s, reducedMotion).toEqual({
        root: "none",
        band: "none",
        running: 0,
      });
    }
  }
});

test("a call site's motion-reduce:animate-none stops the reduced-motion pulse, as in shadcn", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(
    "/iframe.html?id=ui-skeleton--reduced-motion-none&viewMode=story",
  );
  await page.waitForSelector('[data-slot="skeleton"]');
  const state = await page.evaluate(() =>
    [...document.querySelectorAll('[data-slot="skeleton"]')].map((el) => ({
      root: getComputedStyle(el).animationName,
      band: getComputedStyle(el, "::after").display,
      running: el.getAnimations({ subtree: true }).length,
    })),
  );
  expect(state.length).toBe(1);
  expect(state[0]).toEqual({ root: "none", band: "none", running: 0 });
  // Without the call-site class the pulse is back under reduced motion.
  await page.goto("/iframe.html?id=ui-skeleton--default&viewMode=story");
  await page.waitForSelector('[data-slot="skeleton"]');
  const pulse = await page.evaluate(
    () =>
      getComputedStyle(
        document.querySelector('[data-slot="skeleton"]') as Element,
      ).animationName,
  );
  expect(pulse).toBe("pulse");
});
