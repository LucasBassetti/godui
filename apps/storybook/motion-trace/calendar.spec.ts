import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const next = (p: Page) => p.getByRole("button", { name: /next month/i });
const previous = (p: Page) =>
  p.getByRole("button", { name: /previous month/i });
const day = (p: Page, iso: string) =>
  p.locator(`td[data-day="${iso}"]:not([data-outside]) button`).first();

// Per month: old + new weeks and old + new captions (4), but a dropdown
// caption's new half doesn't animate (3: the weeks and the old caption's hide).
for (const [story, minAnimations] of [
  ["single", 4],
  ["range-two-months", 8],
  ["dropdown-caption", 3],
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

/**
 * A fill layer exists only while it animates: the pop's layer and the
 * ghost's each unmount on their own animationend (≈260ms and ≈150ms), a
 * discrete DOM change apiece in different frames, plus the frame the
 * animations finish in. Nothing lays out while they run.
 */
const FILL_SETTLES = { maxLayoutFrames: 3 };

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
  expectGpuOnly(result, FILL_SETTLES);
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
  expectGpuOnly(result, FILL_SETTLES);
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
  expectGpuOnly(result, FILL_SETTLES);
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

/** RGB of a theme colour token, as the page paints it. */
async function tokenRgb(page: Page, token: string) {
  return page.evaluate((t) => {
    const probe = document.createElement("i");
    probe.style.color = `var(${t})`;
    document.querySelector("[data-slot=calendar]")?.append(probe);
    const css = getComputedStyle(probe).color;
    probe.remove();
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
  }, token);
}

/** Pixels at fractional points of `locator`'s box, from a real screenshot. */
async function samplePixels(
  page: Page,
  locator: ReturnType<Page["locator"]>,
  points: Array<[number, number]>,
) {
  const png = (await locator.screenshot({ animations: "allow" })).toString(
    "base64",
  );
  return page.evaluate(
    async ({ png, points }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${png}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas");
      ctx.drawImage(img, 0, 0);
      return points.map(([x, y]) => [
        ...ctx
          .getImageData(
            Math.round(x * (img.width - 1)),
            Math.round(y * (img.height - 1)),
            1,
            1,
          )
          .data.slice(0, 3),
      ]);
    },
    { png, points },
  );
}

function expectColor(got: number[] | undefined, want: number[], label: string) {
  const far = want.some((c, i) => Math.abs(c - (got?.[i] ?? -999)) > 10);
  expect(far, `${label}: got rgb(${got}) want rgb(${want})`).toBe(false);
}

// A range end: its pill is full primary — the inner half too, where the
// accent track runs on toward the range — and the accent shows only in the
// pill's corners on that side (shadcn's look).
const INNER = { start: [0.85, 0.5], end: [0.15, 0.5] } as const;
const CORNER = { start: [0.99, 0.02], end: [0.01, 0.02] } as const;
async function expectRangeEnd(
  page: Page,
  iso: string,
  side: "start" | "end",
  label: string,
) {
  const [primary, accent] = [
    await tokenRgb(page, "--primary"),
    await tokenRgb(page, "--accent"),
  ];
  const [inner, corner] = await samplePixels(page, day(page, iso), [
    [...INNER[side]],
    [...CORNER[side]],
  ]);
  expectColor(inner, primary, `${label} ${iso} inner half`);
  expectColor(corner, accent, `${label} ${iso} corner`);
}

for (const theme of ["light", "dark"] as const) {
  test(`${theme}: range ends are full primary pills over the track, at rest and at the pop's handover`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=ui-calendar--range-two-months&viewMode=story&globals=theme:${theme}`,
    );
    await page.waitForLoadState("networkidle");
    await page.mouse.move(0, 0);
    // At rest (first paint): Oct 12 – Nov 3.
    await expectRangeEnd(page, "2026-10-12", "start", "rest");
    await expectRangeEnd(page, "2026-11-03", "end", "rest");
    // A new end, Nov 12: freeze the pop 1ms before it ends, still on the
    // layer (with its copy) above the number...
    await page.evaluate(async () => {
      document
        .querySelector<HTMLElement>(
          'td[data-day="2026-11-12"]:not([data-outside]) button',
        )
        ?.click();
      for (let i = 0; i < 5; i++) await Promise.resolve();
      const w = window as unknown as { __a: Animation[] };
      w.__a = document.getAnimations();
      const pop = document
        .querySelector('td[data-day="2026-11-12"] [data-calendar-layer=fill]')
        ?.getAnimations()[0];
      // Everything else (the sweep, the old end's exit) to its end; the
      // pop to 1ms before its own.
      for (const a of w.__a) {
        a.pause();
        a.currentTime = a === pop ? 259 : 1000;
      }
    });
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
    expect(await day(page, "2026-11-12").getAttribute("data-fill")).toBe(
      "moving",
    );
    await expectRangeEnd(page, "2026-11-12", "end", "handover");
    // ...then let it end: at rest under the number, the same pixels.
    await page.evaluate(() => {
      for (const a of (window as unknown as { __a: Animation[] }).__a) a.play();
    });
    await page.waitForTimeout(500);
    expect(await day(page, "2026-11-12").getAttribute("data-fill")).toBe(
      "settled",
    );
    expect(await day(page, "2026-11-12").textContent()).toBe("12");
    await expectRangeEnd(page, "2026-11-12", "end", "settled");
    await expectRangeEnd(page, "2026-10-12", "start", "settled");
  });
}

test("a picked day's fill layer comes to rest under the number when its pop ends", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-calendar--single&viewMode=story");
  await page.waitForLoadState("networkidle");
  const picked = day(page, "2026-10-21");
  await picked.click();
  // Mid-pop: the layer carries a copy of the number.
  expect(await picked.getAttribute("data-fill")).toBe("moving");
  expect(await picked.textContent()).toBe("2121");
  await page.waitForTimeout(500);
  // At rest: the copy is gone (the number once) and the pill is primary.
  expect(await picked.getAttribute("data-fill")).toBe("settled");
  expect(await picked.textContent()).toBe("21");
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  const primary = await tokenRgb(page, "--primary");
  for (const [i, px] of (
    await samplePixels(page, picked, [
      [0.15, 0.5],
      [0.85, 0.5],
    ])
  ).entries()) {
    expectColor(px, primary, `settled pill ${i}`);
  }
});

test("RTL: a forward sweep grows from the right, a backward one from the left", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-calendar--rtl&viewMode=story");
  await page.waitForLoadState("networkidle");
  const origin = (iso: string, half: "start" | "end") =>
    day(page, iso)
      .locator(`[data-calendar-layer=track-${half}]`)
      .evaluate((el) => {
        const [x] = getComputedStyle(el).transformOrigin.split(" ");
        return {
          x: Number.parseFloat(x ?? ""),
          width: (el as HTMLElement).offsetWidth,
        };
      });
  // Oct 7 – 16 → Oct 20: sweeps forward (leftward in RTL).
  await day(page, "2026-10-20").click();
  const forward = await origin("2026-10-20", "start");
  expect(forward.x).toBeCloseTo(forward.width, 0);
  await page.waitForTimeout(400);
  // → Oct 3 – 20: sweeps backward (rightward in RTL).
  await day(page, "2026-10-03").click();
  const backward = await origin("2026-10-03", "end");
  expect(backward.x).toBeCloseTo(0, 0);
});

// ── Range preview ────────────────────────────────────────────────────────────
// `range-preview`: Oct 8 picked (a one-day range), two months.

const PREVIEW = "ui-calendar--range-preview";

/** The center of a day's button. */
async function dayCenter(page: Page, iso: string) {
  const box = await day(page, iso).boundingBox();
  if (!box) throw new Error(`no day ${iso}`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** Move the mouse onto `iso`'s center in `steps` moves (one per frame). */
async function pointAt(page: Page, iso: string, steps = 1) {
  const { x, y } = await dayCenter(page, iso);
  await page.mouse.move(x, y, { steps });
}

test("the first hover pops the ghost end and sweeps the preview's track on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: PREVIEW,
    setup: async (p) => {
      await p.mouse.move(2, 2);
    },
    act: async (p) => {
      await pointAt(p, "2026-10-14");
    },
    windowMs: 500,
  });
  // Oct 8 → 14: 13 track halves sweep, the ghost pops.
  expect(result.animationCount).toBeGreaterThanOrEqual(14);
  expectGpuOnly(result);
});

test("moving along a row extends the preview and glides the ghost on the compositor, with no layout per day", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: PREVIEW,
    setup: async (p) => {
      await p.mouse.move(2, 2);
      await pointAt(p, "2026-10-12");
    },
    act: async (p) => {
      // Mouse speed: a day every ~3 frames, across the row and back.
      for (const iso of [
        "2026-10-13",
        "2026-10-14",
        "2026-10-15",
        "2026-10-16",
        "2026-10-17",
        "2026-10-16",
        "2026-10-15",
      ]) {
        await pointAt(p, iso, 3);
      }
    },
    windowMs: 400,
  });
  // Each step sweeps (or fades) two halves and glides the ghost: 21. The
  // trace undercounts them (Chrome reuses a finished animation's trace id),
  // so this only proves the window saw animations; it is not a gate. The
  // ghost sampler below checks that each step moves it.
  expect(result.animationCount).toBeGreaterThanOrEqual(5);
  // Moving the preview changes attributes on layers every day already
  // carries: no DOM insertion, so no layout at all after the first frame.
  expectGpuOnly(result);
});

test("clicking commits the preview on the compositor: the tint fades in, the end pops", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: PREVIEW,
    setup: async (p) => {
      await p.mouse.move(2, 2);
      await pointAt(p, "2026-10-14");
    },
    act: async (p) => {
      await p.mouse.down();
      await p.mouse.up();
    },
    windowMs: 600,
  });
  expect(result.animationCount).toBeGreaterThanOrEqual(3);
  expectGpuOnly(result, FILL_SETTLES);
});

/**
 * Every frame for `ms` after `act`: each drawn (on) track half's computed
 * scale and whether it runs a sweep.
 */
async function sampleTrack(page: Page, ms: number) {
  return page.evaluate(async (ms) => {
    const frames: Array<{ scale: string; sweeping: boolean }[]> = [];
    const start = performance.now();
    while (performance.now() - start < ms) {
      await new Promise(requestAnimationFrame);
      frames.push(
        [
          ...document.querySelectorAll<HTMLElement>(
            "[data-calendar-layer^=track][data-state=on]",
          ),
        ].map((el) => ({
          scale: getComputedStyle(el).scale,
          sweeping: el
            .getAnimations()
            .some(
              (a) =>
                (a as CSSAnimation).animationName ===
                  "godui-calendar-track-in" && a.playState === "running",
            ),
        })),
      );
    }
    return frames;
  }, ms);
}

test("committing doesn't re-sweep: every drawn half stays at full width while the end pops", async ({
  page,
}) => {
  await page.goto(`/iframe.html?id=${PREVIEW}&viewMode=story`);
  await page.waitForLoadState("networkidle");
  await page.mouse.move(2, 2);
  await pointAt(page, "2026-10-21");
  await page.waitForTimeout(500);
  const drawn = await page
    .locator("[data-calendar-layer^=track][data-state=on]")
    .count();
  expect(drawn).toBe(27); // Oct 8 → 21, with the cap
  await page.mouse.down();
  await page.mouse.up();
  const frames = await sampleTrack(page, 300);
  expect(frames.length).toBeGreaterThan(10);
  for (const [i, frame] of frames.entries()) {
    expect(frame.length, `frame ${i}`).toBe(26); // the cap gave way
    for (const half of frame) {
      expect(half.sweeping, `frame ${i}`).toBe(false);
      expect(["1", "none"], `frame ${i}`).toContain(half.scale);
    }
  }
});

/** The ghost end on screen: its visible box's center x (null if none). */
async function sampleGhost(page: Page, ms: number, act: () => Promise<void>) {
  await page.evaluate((ms) => {
    const w = window as unknown as { __ghost: Array<number | null> };
    w.__ghost = [];
    const start = performance.now();
    const tick = () => {
      const on = [
        ...document.querySelectorAll<HTMLElement>(
          "[data-calendar-layer=ghost][data-state=on]",
        ),
      ].filter(
        (el) => !el.closest('[aria-hidden="true"][data-animated-month]'),
      );
      const box = on[0]?.getBoundingClientRect();
      w.__ghost.push(box ? box.x + box.width / 2 : null);
      if (performance.now() - start < ms) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, ms);
  await act();
  await page.waitForTimeout(ms + 50);
  return page.evaluate(
    () => (window as unknown as { __ghost: Array<number | null> }).__ghost,
  );
}

for (const dir of ["ltr", "rtl"] as const) {
  test(`${dir}: at mouse speed the ghost moves only toward the pointer, along the row, never back`, async ({
    page,
  }) => {
    if (dir === "ltr") {
      await page.goto(`/iframe.html?id=${PREVIEW}&viewMode=story`);
    } else {
      // The RTL story's range is Oct 7 – 16: clicking its end makes it a
      // one-day range there.
      await page.goto("/iframe.html?id=ui-calendar--rtl&viewMode=story");
    }
    await page.waitForLoadState("networkidle");
    await page.mouse.move(2, 2);
    if (dir === "rtl") {
      await day(page, "2026-10-16").click();
      await page.mouse.move(2, 2);
      await page.waitForTimeout(400);
    }
    const [first, ...rest] =
      dir === "ltr"
        ? [
            "2026-10-11",
            "2026-10-12",
            "2026-10-13",
            "2026-10-14",
            "2026-10-15",
            "2026-10-16",
            "2026-10-17",
          ]
        : [
            "2026-10-18",
            "2026-10-19",
            "2026-10-20",
            "2026-10-21",
            "2026-10-22",
            "2026-10-23",
            "2026-10-24",
          ];
    await pointAt(page, first as string);
    await page.waitForTimeout(400);
    const xs = await sampleGhost(page, 450, async () => {
      for (const iso of rest) await pointAt(page, iso, 2);
    });
    const seen = xs.filter((x): x is number => x !== null);
    expect(seen.length).toBeGreaterThan(15);
    // Later days are to the right in LTR, to the left in RTL.
    const sign = dir === "ltr" ? 1 : -1;
    for (let i = 1; i < seen.length; i++) {
      expect(
        sign * ((seen[i] as number) - (seen[i - 1] as number)),
        `frame ${i}: ${seen.slice(Math.max(0, i - 3), i + 2).map((x) => x.toFixed(1))}`,
      ).toBeGreaterThanOrEqual(-0.5);
    }
    // It ends on the last day hovered.
    const last = await dayCenter(page, rest.at(-1) as string);
    expect(seen.at(-1)).toBeCloseTo(last.x, 0);
  });
}

test("a slow pointer crossing the gap between two rows keeps the preview; leaving the calendar folds it", async ({
  page,
}) => {
  await page.goto(`/iframe.html?id=${PREVIEW}&viewMode=story`);
  await page.waitForLoadState("networkidle");
  await page.mouse.move(2, 2);
  await pointAt(page, "2026-10-14");
  await page.waitForTimeout(400);
  // 14 → 21, straight down at ~60px/s: several frames over the row gap.
  const xs = await sampleGhost(page, 900, async () => {
    await pointAt(page, "2026-10-21", 50);
  });
  expect(xs.length).toBeGreaterThan(30);
  expect(xs.filter((x) => x === null)).toEqual([]);
  // Off the calendar: gone after the grace and the fade.
  await page.mouse.move(2, 2, { steps: 4 });
  await page.waitForTimeout(400);
  await expect(
    page.locator("[data-calendar-layer=ghost][data-state=on]"),
  ).toHaveCount(0);
  await expect(
    page.locator(
      "[data-calendar-layer^=track][data-tint=preview][data-state=on]",
    ),
  ).toHaveCount(0);
});

/** sRGB (0–255) to OKLab. */
function oklab([r, g, b]: number[]) {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const [R, G, B] = [lin(r as number), lin(g as number), lin(b as number)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const deltaE = (a: number[], b: number[]) => {
  const [x, y] = [oklab(a), oklab(b)];
  return Math.hypot(...x.map((v, i) => v - (y[i] as number)));
};

/**
 * A middle day's track, as painted: its center (the fill) and its top and
 * bottom edge rows (where a preview draws its hairlines).
 */
async function trackPixels(page: Page, iso: string) {
  const [center, ...edges] = await samplePixels(page, day(page, iso), [
    [0.3, 0.85],
    [0.5, 0],
    [0.5, 0.03],
    [0.5, 0.97],
    [0.5, 1],
  ]);
  return { center: center as number[], edges: edges as number[][] };
}

for (const theme of ["light", "dark"] as const) {
  test(`${theme}: a preview's track reads as tentative (outlined), a committed one as filled`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=${PREVIEW}&viewMode=story&globals=theme:${theme}`,
    );
    await page.waitForLoadState("networkidle");
    await page.mouse.move(2, 2);
    const accent = await tokenRgb(page, "--accent");
    await pointAt(page, "2026-10-14");
    await page.waitForTimeout(500);
    const preview = await trackPixels(page, "2026-10-12");
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(500);
    const committed = await trackPixels(page, "2026-10-12");
    // Committed: shadcn's accent.
    expectColor(committed.center, accent, "committed center");
    // Preview: its hairline edges differ perceptibly from the committed
    // track's (the fill alone is ΔL ≈ 0.015 in light: not enough).
    const edge = Math.max(
      ...preview.edges.map((px, i) =>
        deltaE(px, committed.edges[i] as number[]),
      ),
    );
    expect(
      edge,
      `OKLab ΔE at the edge: ${edge.toFixed(3)}`,
    ).toBeGreaterThanOrEqual(0.04);
  });
}
