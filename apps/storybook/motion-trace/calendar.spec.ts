import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const next = (p: Page) => p.getByRole("button", { name: /next month/i });
const previous = (p: Page) =>
  p.getByRole("button", { name: /previous month/i });
const day = (p: Page, iso: string) =>
  p.locator(`td[data-day="${iso}"]:not([data-outside]) button`).first();

for (const [story, minAnimations] of [
  ["single", 4],
  ["range-two-months", 8],
  ["dropdown-caption", 4],
] as const) {
  for (const [label, button] of [
    ["Next", next],
    ["Previous", previous],
  ] as const) {
    test(`${story}: ${label} changes the month on the compositor`, async ({
      page,
    }) => {
      const result = await traceInteraction(page, {
        storyId: `ui-calendar--${story}`,
        act: async (p) => {
          await button(p).click();
        },
        windowMs: 700,
      });
      // Old + new weeks and old + new captions, per month.
      expect(result.animationCount).toBeGreaterThanOrEqual(minAnimations);
      expectGpuOnly(result);
    });
  }
}

test("double-click Next: the second click is skipped mid-change, still GPU-only", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-calendar--single",
    act: async (p) => {
      await next(p).dblclick();
    },
    windowMs: 800,
  });
  expectGpuOnly(result);
});

type Frame = {
  t: number;
  old: number;
  now: number;
  navHit: boolean;
  height: number;
};

/**
 * Click `button` and sample every frame until rdp removes the old month:
 * the old and new weeks' opacity, the nav button hit-test, the height. Then
 * the new weeks' resting style and when the old month went.
 */
async function sampleMonthChange(page: Page, button: string) {
  return page.evaluate(async (selector) => {
    const root = document.querySelector<HTMLElement>('[data-slot="calendar"]');
    const nav = document.querySelector<HTMLElement>(selector);
    if (!root || !nav) throw new Error("story markup changed");
    const height = root.getBoundingClientRect().height;
    const opacity = (el: Element | null | undefined) =>
      el ? Number(getComputedStyle(el).opacity) : 0;
    const liveWeeks = () =>
      [...document.querySelectorAll("[data-animated-weeks]")].find(
        (el) => !el.closest('[aria-hidden="true"]'),
      );
    const oldWeeks = () =>
      document.querySelector(
        '[data-animated-month][aria-hidden="true"] [data-animated-weeks]',
      );
    const start = performance.now();
    const now = () => Number(document.timeline.currentTime);
    nav.click();
    const frames: Frame[] = [];
    let removedAt = Number.NaN;
    // When the new weeks' enter is scheduled to end (its start + delay +
    // duration, on the document timeline): read off the animation itself,
    // because rdp's cleanup strips the class (ending it) when it runs.
    let enterEndsAt = Number.NaN;
    while (performance.now() - start < 4000) {
      await new Promise(requestAnimationFrame);
      const t = performance.now() - start;
      const weeks = liveWeeks();
      const enter = weeks?.getAnimations()[0];
      if (Number.isNaN(enterEndsAt) && enter && enter.startTime !== null) {
        enterEndsAt =
          Number(enter.startTime) +
          Number(enter.effect?.getComputedTiming().endTime);
      }
      const old = oldWeeks();
      if (!old) {
        removedAt = now();
        break;
      }
      const r = nav.getBoundingClientRect();
      const hit = document.elementFromPoint(
        r.left + r.width / 2,
        r.top + r.height / 2,
      );
      frames.push({
        t,
        old: opacity(old),
        now: opacity(weeks),
        navHit: Boolean(hit && nav.contains(hit)),
        height: root.getBoundingClientRect().height - height,
      });
    }
    const weeks = liveWeeks();
    const rest = weeks
      ? {
          opacity: getComputedStyle(weeks).opacity,
          translate: getComputedStyle(weeks).translate,
          filter: getComputedStyle(weeks).filter,
          animations: weeks.getAnimations().length,
        }
      : null;
    return { frames, removedAt, enterEndsAt, rest };
  }, button);
}

// `custom-class-names` overrides classNames.weeks / month_caption; the
// dropdown caption hides its old caption instead of moving it.
for (const story of [
  "single",
  "range-two-months",
  "custom-class-names",
  "dropdown-caption",
] as const) {
  for (const speed of ["real speed", "slowed 4x"] as const) {
    test(`${story}, ${speed}: Next and Previous never flash, the new weeks land at rest before the old month goes, nav stays clickable`, async ({
      page,
    }) => {
      await page.goto(`/iframe.html?id=ui-calendar--${story}&viewMode=story`);
      await page.waitForLoadState("networkidle");
      if (speed === "slowed 4x") {
        await page.addStyleTag({
          content:
            ":root{--godui-duration-fast:600ms!important;--godui-duration-base:1040ms!important}[data-slot=calendar]{--godui-calendar-delay:80ms!important}",
        });
      }
      for (const button of [".rdp-button_next", ".rdp-button_previous"]) {
        const { frames, removedAt, enterEndsAt, rest } =
          await sampleMonthChange(page, button);
        expect(frames.length).toBeGreaterThan(speed === "real speed" ? 8 : 40);
        for (const f of frames) {
          // No flash: the two months together never fade below 60%; the old
          // one is still there while the new one waits out its delay.
          expect(f.old + f.now, `t=${f.t.toFixed(0)}ms`).toBeGreaterThan(0.6);
          // The nav button stays on top of both months, clickable.
          expect(f.navHit).toBe(true);
          // October and November both have five weeks: no height change.
          expect(f.height).toBe(0);
        }
        // The old month leaves only once the new weeks' enter has run its
        // course (within the frame it ends in): never cut off mid-enter.
        expect(enterEndsAt).not.toBeNaN();
        expect(removedAt).toBeGreaterThanOrEqual(enterEndsAt - 17);
        // ...and ends exactly at rest, with nothing left running.
        expect(rest).toEqual({
          opacity: "1",
          translate: "none",
          filter: "none",
          animations: 0,
        });
        await page.waitForTimeout(300);
      }
    });
  }
}

test("selecting a day pops its fill and shrinks the old one on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-calendar--single",
    act: async (p) => {
      await day(p, "2026-10-21").click();
    },
    windowMs: 600,
  });
  // The new fill's pop, the old fill's fade + shrink, the focus ring.
  expect(result.animationCount).toBeGreaterThanOrEqual(3);
  expectGpuOnly(result);
});

test("extending a range sweeps its track on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-calendar--range-two-months",
    act: async (p) => {
      await day(p, "2026-11-12").click();
    },
    windowMs: 700,
  });
  // Nov 3 → Nov 12: 18 newly covered halves, plus the pop and the ghost.
  expect(result.animationCount).toBeGreaterThanOrEqual(18);
  expectGpuOnly(result);
});

test("a new range sweeps across the month boundary on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-calendar--range-two-months",
    setup: async (p) => {
      // Collapse to one day, Oct 25.
      await day(p, "2026-10-25").click();
      await p.waitForTimeout(400);
      await day(p, "2026-10-25").click();
    },
    act: async (p) => {
      await day(p, "2026-11-06").click();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThanOrEqual(20);
  expectGpuOnly(result);
});

test("hovering a day fades its overlay on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-calendar--single",
    act: async (p) => {
      await day(p, "2026-10-21").hover();
    },
    windowMs: 400,
  });
  expect(result.animationCount).toBeGreaterThanOrEqual(1);
  expectGpuOnly(result);
});

test("tabbing into the grid fades the focus ring in on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-calendar--single",
    setup: async (p) => {
      await next(p).focus();
    },
    act: async (p) => {
      await p.keyboard.press("Tab");
    },
    windowMs: 400,
  });
  expect(result.animationCount).toBeGreaterThanOrEqual(1);
  expectGpuOnly(result);
});

test("the focus ring fades in on entering the grid and jumps between days on arrow keys", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-calendar--single&viewMode=story");
  await page.waitForLoadState("networkidle");
  await page.addStyleTag({
    content: ":root{--godui-duration-fast:600ms!important}",
  });
  await next(page).focus();
  const ring = (iso: string) =>
    page.evaluate(
      (sel) =>
        Number(
          getComputedStyle(document.querySelector(sel) as Element, "::before")
            .opacity,
        ),
      `td[data-day="${iso}"] button`,
    );
  await page.keyboard.press("Tab");
  // Entering: mid-fade a frame later.
  await page.evaluate(() => new Promise(requestAnimationFrame));
  expect(await ring("2026-10-14")).toBeLessThan(0.9);
  await page.waitForTimeout(700);
  expect(await ring("2026-10-14")).toBe(1);
  // Arrow key: the next day's ring is there on the first frame, the old
  // one gone.
  await page.keyboard.press("ArrowRight");
  await page.evaluate(() => new Promise(requestAnimationFrame));
  expect(await ring("2026-10-15")).toBe(1);
  expect(await ring("2026-10-14")).toBe(0);
});
