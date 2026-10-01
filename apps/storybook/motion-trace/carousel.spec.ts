import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

/** The Embla container (the element it moves) of the story's carousel. */
const TRACK = '[data-slot="carousel-content"] > div';

test("Next scrolls on the compositor (Embla's translate3d)", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-carousel--default",
    act: async (p) => {
      await p.getByRole("button", { name: "Next slide" }).click();
    },
    windowMs: 1000,
  });
  expectGpuOnly(result);
});

test("the vertical carousel scrolls on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-carousel--vertical",
    act: async (p) => {
      await p.getByRole("button", { name: "Next slide" }).click();
    },
    windowMs: 1000,
  });
  expectGpuOnly(result);
});

test("the track moves with a transform, not an offset", async ({ page }) => {
  await page.goto("/iframe.html?id=ui-carousel--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Next slide" }).click();
  // Sample mid-scroll and again once Embla has settled.
  await page.waitForTimeout(120);
  const mid = await page.evaluate((sel) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) throw new Error("story markup changed");
    const style = getComputedStyle(el);
    return { transform: style.transform, left: style.left, top: style.top };
  }, TRACK);
  expect(mid.transform).not.toBe("none");
  expect(mid.left === "auto" || mid.left === "0px").toBe(true);
  expect(mid.top === "auto" || mid.top === "0px").toBe(true);
});

/**
 * Click Next inside the page, then read the track's transform on the next
 * frame and again once Embla has settled.
 */
async function nextFrameVsSettled(page: Page) {
  await page.goto("/iframe.html?id=ui-carousel--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  const left = (selector: string, index: number) =>
    page.evaluate(
      ([sel, i]) =>
        document
          .querySelectorAll(sel as string)
          [i as number]?.getBoundingClientRect().left ?? Number.NaN,
      [selector, index] as const,
    );
  const firstBefore = await left('[data-slot="carousel-item"]', 0);
  const frames = await page.evaluate(async (sel) => {
    const track = document.querySelector<HTMLElement>(sel);
    const next = document.querySelector<HTMLElement>(
      '[data-slot="carousel-next"]',
    );
    if (!track || !next) throw new Error("story markup changed");
    const start = track.style.transform;
    next.click();
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));
    const first = track.style.transform;
    await new Promise((r) => setTimeout(r, 1500));
    return { start, first, settled: track.style.transform };
  }, TRACK);
  const secondAfter = await left('[data-slot="carousel-item"]', 1);
  return { ...frames, firstBefore, secondAfter };
}

test.describe("prefers-reduced-motion", () => {
  test("Next jumps: the track reaches its end value within one frame", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const r = await nextFrameVsSettled(page);
    expect(r.settled).not.toBe(r.start);
    // Two frames after the click the track is already where it ends up.
    expect(r.first).toBe(r.settled);
    // ...with the second slide where the first one started.
    expect(Math.abs(r.secondAfter - r.firstBefore)).toBeLessThan(2);
  });

  test("control: without the preference the track is still travelling two frames in", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const r = await nextFrameVsSettled(page);
    expect(r.first).not.toBe(r.settled);
  });
});
