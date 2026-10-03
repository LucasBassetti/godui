import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const toggle = async (page: Page) => {
  await page.getByRole("checkbox").click();
};

test("checking floods and draws on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-checkbox--default",
    act: toggle,
    windowMs: 600,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("unchecking drains on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-checkbox--default",
    setup: async (p) => {
      await toggle(p);
      await p.waitForTimeout(600);
    },
    act: toggle,
    windowMs: 600,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("the draining disc keeps the checked fill, then the indicator goes", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-checkbox--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  await toggle(page);
  await page.waitForTimeout(600);
  const frames = await page.evaluate(async () => {
    const box = document.querySelector<HTMLElement>('[data-slot="checkbox"]');
    const indicator = () =>
      box?.querySelector<HTMLElement>('[data-slot="checkbox-indicator"]');
    const checkedFill = getComputedStyle(
      indicator() as HTMLElement,
    ).backgroundColor;
    box?.click();
    const out: Array<{ fill: string; scale: string } | null> = [];
    for (let i = 0; i < 30; i++) {
      await new Promise(requestAnimationFrame);
      const disc = indicator()?.firstElementChild;
      out.push(
        disc
          ? {
              fill: getComputedStyle(disc).backgroundColor,
              scale: getComputedStyle(disc).scale,
            }
          : null,
      );
    }
    return { checkedFill, out };
  });
  const draining = frames.out.filter((f) => f !== null);
  // It drains over a few frames, in the color it had while checked (once the
  // root is unchecked its own fill is transparent)...
  expect(draining.length).toBeGreaterThan(3);
  for (const f of draining) expect(f.fill).toBe(frames.checkedFill);
  const scales = draining.map((f) => Number(f.scale));
  expect(Math.min(...scales)).toBeLessThan(0.5);
  // ...and then Presence removes the indicator.
  expect(frames.out.at(-1)).toBeNull();
});
