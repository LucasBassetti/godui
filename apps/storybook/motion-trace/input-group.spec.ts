import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const STORY = "ui-input-group--default";
const focusControl = async (page: Page) => {
  await page.getByPlaceholder("Search...").click();
};

/** The group's ::before ring, read back from the browser. */
function ringStyle(page: Page) {
  return page.evaluate(() => {
    const group = document.querySelector(
      '[data-slot="input-group"]',
    ) as HTMLElement;
    const ring = getComputedStyle(group, "::before");
    return {
      opacity: Number(ring.opacity),
      scale: ring.scale,
      transitionProperty: ring.transitionProperty,
    };
  });
}

test("input group focus ring fades in on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: STORY,
    act: focusControl,
    windowMs: 500,
  });
  // The ring's opacity + scale transitions are the traced animations.
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("input group focus ring fades out on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: STORY,
    setup: focusControl,
    act: async (p) => {
      await p.locator("body").click({ position: { x: 5, y: 5 } });
    },
    windowMs: 500,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("the ::before ring fades and grows in, reaching full opacity and size", async ({
  page,
}) => {
  await page.goto(`/iframe.html?id=${STORY}&viewMode=story`);
  await page.waitForLoadState("networkidle");
  expect(await ringStyle(page)).toMatchObject({ opacity: 0 });
  // Slow the clock so many frames land mid-transition.
  await page.addStyleTag({
    content: ":root{--godui-duration-fast:600ms!important}",
  });
  await focusControl(page);
  const frames = await page.evaluate(async () => {
    const group = document.querySelector(
      '[data-slot="input-group"]',
    ) as HTMLElement;
    const out: Array<{ opacity: number; scale: number }> = [];
    for (let i = 0; i < 60; i++) {
      await new Promise(requestAnimationFrame);
      const ring = getComputedStyle(group, "::before");
      out.push({
        opacity: Number(ring.opacity),
        scale: Number.parseFloat(ring.scale.split(" ")[0]),
      });
    }
    return out;
  });
  const mid = frames.filter((f) => f.opacity > 0.05 && f.opacity < 0.95);
  // It fades: several frames between 0 and 1, not a snap.
  expect(mid.length).toBeGreaterThan(3);
  // It grows from 98%: mid-fade frames are still smaller than full size.
  expect(mid.some((f) => f.scale < 1 && f.scale >= 0.98)).toBe(true);
  // Opacity and scale only ever rise.
  for (let i = 1; i < frames.length; i++) {
    expect(frames[i].opacity).toBeGreaterThanOrEqual(frames[i - 1].opacity);
    expect(frames[i].scale).toBeGreaterThanOrEqual(frames[i - 1].scale);
  }
  expect(frames.at(-1)).toEqual({ opacity: 1, scale: 1 });
});

test("the ring sits where shadcn's box-shadow ring sits", async ({ page }) => {
  await page.goto(`/iframe.html?id=${STORY}&viewMode=story`);
  await page.waitForLoadState("networkidle");
  await focusControl(page);
  await page.waitForTimeout(400);
  const geometry = await page.evaluate(() => {
    const group = document.querySelector(
      '[data-slot="input-group"]',
    ) as HTMLElement;
    const own = getComputedStyle(group);
    const ring = getComputedStyle(group, "::before");
    return {
      groupRadius: own.borderTopLeftRadius,
      groupShadow: own.boxShadow,
      groupOverflow: own.overflow,
      ringRadius: ring.borderTopLeftRadius,
      ringInset: [ring.top, ring.right, ring.bottom, ring.left],
      ringWidth: Number.parseFloat(ring.width),
      ringHeight: Number.parseFloat(ring.height),
      groupWidth: group.offsetWidth,
      groupHeight: group.offsetHeight,
      ringShadow: ring.boxShadow,
      ringPointerEvents: ring.pointerEvents,
    };
  });
  // The ::before covers the group's border box (inset -1px over a 1px border)
  // with the same radius, so its 3px spread lands exactly on shadcn's ring.
  expect(geometry.ringInset).toEqual(["-1px", "-1px", "-1px", "-1px"]);
  expect(geometry.ringWidth).toBeCloseTo(geometry.groupWidth, 1);
  expect(geometry.ringHeight).toBeCloseTo(geometry.groupHeight, 1);
  expect(geometry.ringRadius).toBe(geometry.groupRadius);
  expect(geometry.ringShadow).toMatch(/0px 0px 0px 3px/);
  // The group itself no longer paints a ring, and doesn't clip the layer.
  expect(geometry.groupShadow).not.toMatch(/0px 0px 0px 3px/);
  expect(geometry.groupOverflow).toBe("visible");
  // Addon buttons under the layer stay clickable.
  expect(geometry.ringPointerEvents).toBe("none");
});

test("reduced motion: the ring appears without a transition", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/iframe.html?id=${STORY}&viewMode=story`);
  await page.waitForLoadState("networkidle");
  expect((await ringStyle(page)).transitionProperty).toBe("none");
  await focusControl(page);
  const ring = await page.evaluate(async () => {
    await new Promise(requestAnimationFrame);
    const group = document.querySelector(
      '[data-slot="input-group"]',
    ) as HTMLElement;
    return Number(getComputedStyle(group, "::before").opacity);
  });
  expect(ring).toBe(1);
});
