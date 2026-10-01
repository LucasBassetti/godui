import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const next = (p: Page) => p.getByRole("button", { name: /next month/i });

test("Next slides the month on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-calendar--single",
    act: async (p) => {
      await next(p).click();
    },
    windowMs: 800,
  });
  // New weeks + old weeks + both captions.
  expect(result.animationCount).toBeGreaterThanOrEqual(4);
  expectGpuOnly(result);
});

test("two months slide together on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-calendar--range-two-months",
    act: async (p) => {
      await next(p).click();
    },
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThanOrEqual(8);
  expectGpuOnly(result);
});

test("double-click Next: the second click is skipped mid-slide, still GPU-only", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-calendar--single",
    act: async (p) => {
      await next(p).dblclick();
    },
    windowMs: 900,
  });
  expectGpuOnly(result);
});

// `custom-class-names` overrides classNames.weeks / month_caption: the timing
// must survive that.
for (const story of ["single", "custom-class-names"] as const) {
  test(`${story}: double-click Next, the old month leaves only after its exit, never mid-slide`, async ({
    page,
  }) => {
    await page.goto(`/iframe.html?id=ui-calendar--${story}&viewMode=story`);
    await page.waitForLoadState("networkidle");
    const timeline = await page.evaluate(async () => {
      const button = document.querySelector<HTMLElement>(".rdp-button_next");
      if (!button) throw new Error("story markup changed");
      const start = performance.now();
      const old = () =>
        document.querySelector('[data-animated-month][aria-hidden="true"]');
      button.click();
      await new Promise((r) => requestAnimationFrame(r));
      button.click();
      let removedAt = Number.NaN;
      while (performance.now() - start < 1500) {
        await new Promise((r) => requestAnimationFrame(r));
        if (!old()) {
          removedAt = performance.now() - start;
          break;
        }
      }
      return { removedAt };
    });
    // --godui-duration-base (260ms): the caption exit lasts as long as the
    // weeks slide, so the clone outlives the whole slide.
    expect(timeline.removedAt).toBeGreaterThanOrEqual(250);
    expect(timeline.removedAt).toBeLessThan(600);
  });
}

test("selecting a day pops it on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-calendar--single",
    act: async (p) => {
      await p.locator('td[data-day="2026-10-21"] button').click();
    },
    windowMs: 600,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

for (const story of [
  "single",
  "range-two-months",
  "custom-class-names",
] as const) {
  test(`${story}: Next and Previous slide the months as one strip, height and nav fixed`, async ({
    page,
  }) => {
    await page.goto(`/iframe.html?id=ui-calendar--${story}&viewMode=story`);
    await page.waitForLoadState("networkidle");
    // Slow the clock so many frames land mid-slide.
    await page.addStyleTag({
      content: ":root{--godui-duration-base:1200ms!important}",
    });
    for (const button of [".rdp-button_next", ".rdp-button_previous"]) {
      const frames = await page.evaluate(async (selector) => {
        const root = document.querySelector<HTMLElement>(
          '[data-slot="calendar"]',
        );
        const nav = document.querySelector<HTMLElement>(selector);
        if (!root || !nav) throw new Error("story markup changed");
        const height = root.getBoundingClientRect().height;
        nav.click();
        const out: Array<{ gap: number; height: number; navHit: boolean }> = [];
        for (let i = 0; i < 60; i++) {
          await new Promise(requestAnimationFrame);
          const old = document.querySelector<HTMLElement>(
            '[data-animated-month][aria-hidden="true"] [data-animated-weeks]',
          );
          if (!old) break;
          const month = old.closest<HTMLElement>(
            '[data-animated-month]:not([aria-hidden="true"])',
          );
          const live = [
            ...(month?.querySelectorAll<HTMLElement>("[data-animated-weeks]") ??
              []),
          ].find((el) => !el.closest('[aria-hidden="true"]'));
          if (!live) throw new Error("no live weeks");
          const a = old.getBoundingClientRect();
          const b = live.getBoundingClientRect();
          // Forward: the new month's left edge rides the old one's right
          // edge; backward, the other way round.
          const gap = b.left >= a.left ? b.left - a.right : a.left - b.right;
          const r = nav.getBoundingClientRect();
          const hit = document.elementFromPoint(
            r.left + r.width / 2,
            r.top + r.height / 2,
          );
          out.push({
            gap,
            height: root.getBoundingClientRect().height - height,
            navHit: Boolean(hit && nav.contains(hit)),
          });
        }
        return out;
      }, button);
      expect(frames.length).toBeGreaterThan(20);
      for (const f of frames) {
        // One strip: no gap opens between the months, and they never overlap.
        expect(Math.abs(f.gap)).toBeLessThan(1.5);
        // Same-length months: nothing changes the calendar's height.
        expect(f.height).toBe(0);
        // The nav button stays on top of both months, clickable.
        expect(f.navHit).toBe(true);
      }
      await page.waitForTimeout(1400);
    }
  });
}
