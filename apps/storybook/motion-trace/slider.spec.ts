import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const open = async (page: Page, story: string) => {
  await page.goto(`/iframe.html?id=ui-slider--${story}&viewMode=story`);
  await page.waitForLoadState("networkidle");
};
const boxOf = async (page: Page, slot: string, index = 0) => {
  const box = await page
    .locator(`[data-slot="${slot}"]`)
    .nth(index)
    .boundingBox();
  if (!box) throw new Error(`no ${slot}`);
  return box;
};
/** Press at a fraction of the track (Radix maps the root, same box here). */
const trackPoint = async (page: Page, at: number) => {
  const track = await boxOf(page, "slider-track");
  return { x: track.x + track.width * at, y: track.y + track.height / 2 };
};
/** Slow the clock so many frames land mid-glide. */
const slow = (page: Page) =>
  page.addStyleTag({
    content:
      ":root{--godui-duration-base:1200ms!important;--godui-duration-fast:1200ms!important;--godui-duration-slow:1200ms!important}",
  });

type Frame = { thumbs: number[]; start: number; end: number };
/** Per frame: thumb centers and the range's two edges (px, on x). */
function sample(page: Page, frames: number): Promise<Frame[]> {
  return page.evaluate(async (count) => {
    const thumbs = [
      ...document.querySelectorAll('[data-slot="slider-thumb"]'),
    ] as HTMLElement[];
    const range = document.querySelector(
      '[data-slot="slider-range"]',
    ) as HTMLElement;
    const out: Frame[] = [];
    for (let i = 0; i < count; i++) {
      await new Promise(requestAnimationFrame);
      const r = range.getBoundingClientRect();
      out.push({
        thumbs: thumbs.map((t) => {
          const b = t.getBoundingClientRect();
          return b.left + b.width / 2;
        }),
        start: r.left,
        end: r.right,
      });
    }
    return out;
  }, frames);
}

/**
 * At rest Radix ends the range at P% of the track while the thumb's center is
 * kept inside the track (`P% + (8 - P/50·8)px`), so the two differ by up to
 * half a thumb, hidden under it. Mid-glide that offset must blend linearly
 * with the thumb's own progress — i.e. the edge and the thumb share one clock.
 * Returns the worst miss (px) between where the edge is and where it should be.
 */
function worstMiss(frames: Frame[], thumb: number, edge: "start" | "end") {
  const first = frames[0];
  const last = frames[frames.length - 1];
  const t0 = first.thumbs[thumb];
  const t1 = last.thumbs[thumb];
  let worst = 0;
  for (const f of frames) {
    const p = (f.thumbs[thumb] - t0) / (t1 - t0);
    const expected = first[edge] + p * (last[edge] - first[edge]);
    worst = Math.max(worst, Math.abs(f[edge] - expected));
  }
  return worst;
}

test("a click on the track glides thumb and range on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-slider--default",
    act: async (p) => {
      const at = await trackPoint(p, 0.9);
      await p.mouse.click(at.x, at.y);
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // Radix writes the thumb's `left` once, in the click's commit; everything
  // after is translate/scale on the compositor.
  expectGpuOnly(result);
});

test("click glide: the range's end rides the thumb every frame", async ({
  page,
}) => {
  await open(page, "default");
  await slow(page);
  const at = await trackPoint(page, 0.9);
  const frames = sample(page, 90);
  await page.mouse.click(at.x, at.y);
  const f = await frames;
  const moving = f.filter(
    (x, i) => i > 0 && x.thumbs[0] !== f[i - 1].thumbs[0],
  );
  expect(moving.length).toBeGreaterThan(30);
  // The thumb really travelled (a glide, not a snap), the range start held.
  expect(f[f.length - 1].thumbs[0] - f[0].thumbs[0]).toBeGreaterThan(100);
  expect(Math.max(...f.map((x) => Math.abs(x.start - f[0].start)))).toBe(0);
  expect(worstMiss(f, 0, "end")).toBeLessThanOrEqual(0.5);
});

test("a programmatic value glides both thumbs and both range edges on one clock", async ({
  page,
}) => {
  await open(page, "controlled");
  await slow(page);
  const frames = sample(page, 90);
  await page.getByRole("button", { name: "High" }).click();
  const f = await frames;
  expect(f[f.length - 1].thumbs[0] - f[0].thumbs[0]).toBeGreaterThan(40);
  expect(worstMiss(f, 0, "start")).toBeLessThanOrEqual(0.5);
  expect(worstMiss(f, 1, "end")).toBeLessThanOrEqual(0.5);
});

test("an arrow key glides on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-slider--default",
    setup: async (p) => {
      await p.getByRole("slider").focus();
    },
    act: async (p) => {
      await p.keyboard.press("PageUp");
    },
    windowMs: 500,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("held arrow keys retarget each glide; only Radix's per-key commit lays out", async ({
  page,
}) => {
  const presses = 6;
  const result = await traceInteraction(page, {
    storyId: "ui-slider--default",
    setup: async (p) => {
      await p.getByRole("slider").focus();
    },
    act: async (p) => {
      // Key repeat (~30Hz): each glide starts from where the last is drawn.
      for (let i = 0; i < presses; i++) {
        await p.keyboard.press("ArrowRight");
        await p.waitForTimeout(33);
      }
    },
    windowMs: 500,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // Discrete, not per-frame: every press is one value commit, where Radix
  // writes the thumb's `left` (the first is the interaction's own). The
  // glides between are compositor-only, so the count is presses - 1, not the
  // ~30 frames of the 150ms glides.
  expectGpuOnly(result, { maxLayoutFrames: presses - 1 });
});

test("End glides with the range's end in step", async ({ page }) => {
  await open(page, "default");
  await slow(page);
  await page.getByRole("slider").focus();
  const frames = sample(page, 90);
  await page.keyboard.press("End");
  const f = await frames;
  expect(f[f.length - 1].thumbs[0] - f[0].thumbs[0]).toBeGreaterThan(100);
  expect(worstMiss(f, 0, "end")).toBeLessThanOrEqual(0.5);
});

test("pressing lifts the thumb and thickens the track on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-slider--default",
    act: async (p) => {
      const box = await boxOf(p, "slider-thumb");
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await p.mouse.down();
      await p.waitForTimeout(300);
      await p.mouse.up();
    },
    windowMs: 600,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);

  // Mid-press the thumb is 115% and the track 150% thick; both come back.
  await open(page, "default");
  const thumb = await boxOf(page, "slider-thumb");
  const track = await boxOf(page, "slider-track");
  await page.mouse.move(track.x + 20, track.y + track.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(500);
  const held = {
    thumb: (await boxOf(page, "slider-thumb")).width,
    track: (await boxOf(page, "slider-track")).height,
  };
  await page.mouse.up();
  await page.waitForTimeout(600);
  expect(held.thumb).toBeCloseTo(thumb.width * 1.15, 0);
  expect(held.track).toBeCloseTo(track.height * 1.5, 0);
  expect((await boxOf(page, "slider-thumb")).width).toBeCloseTo(thumb.width, 1);
  expect((await boxOf(page, "slider-track")).height).toBeCloseTo(
    track.height,
    1,
  );
});

test("a fast drag (35px per event) on a fine slider stays 1:1 every frame", async ({
  page,
}) => {
  await open(page, "default");
  const track = await boxOf(page, "slider-track");
  const thumb = await boxOf(page, "slider-thumb");
  const y = thumb.y + thumb.height / 2;
  const start = thumb.x + thumb.width / 2;
  await page.mouse.move(start, y);
  await page.mouse.down();
  for (const dx of [35, 70, 105, 140, 105, 35, -35, -105, -140]) {
    const x = start + dx;
    await page.mouse.move(x, y);
    // Two frames after each move: the drawn thumb is on its spot, the range
    // ends where Radix puts it, and the value is the pointer's.
    const seen = await page.evaluate(async () => {
      const out: Array<{
        drawn: number;
        spot: number;
        end: number;
        value: number;
      }> = [];
      const t = document.querySelector('[data-slot="slider-thumb"]');
      const range = document.querySelector('[data-slot="slider-range"]');
      if (!t?.parentElement || !range) throw new Error("no thumb");
      for (let i = 0; i < 2; i++) {
        await new Promise(requestAnimationFrame);
        const d = t.getBoundingClientRect();
        const s = t.parentElement.getBoundingClientRect();
        out.push({
          drawn: d.left + d.width / 2,
          spot: s.left + s.width / 2,
          end: range.getBoundingClientRect().right,
          value: Number(t.getAttribute("aria-valuenow")),
        });
      }
      return out;
    });
    for (const f of seen) {
      expect(Math.abs(f.drawn - f.spot)).toBeLessThanOrEqual(0.5);
      const end = track.x + (f.value / 100) * track.width;
      expect(Math.abs(f.end - end)).toBeLessThanOrEqual(0.5);
      const pointer = ((x - track.x) / track.width) * 100;
      expect(Math.abs(f.value - pointer)).toBeLessThanOrEqual(0.5);
    }
  }
  // No glide ran on the thumb at any point (only CSS transitions, e.g. the
  // lift, are allowed).
  const glides = await page.evaluate(
    () =>
      document
        .querySelector('[data-slot="slider-thumb"]')
        ?.getAnimations()
        .filter((a) => !(a instanceof CSSTransition)).length ?? 0,
  );
  expect(glides).toBe(0);
  await page.mouse.up();
});

test("dragging follows the pointer in the same frame (no glide lag)", async ({
  page,
}) => {
  await open(page, "default");
  const track = await boxOf(page, "slider-track");
  const thumb = await boxOf(page, "slider-thumb");
  const y = thumb.y + thumb.height / 2;
  await page.mouse.move(thumb.x + thumb.width / 2, y);
  await page.mouse.down();
  for (let i = 1; i <= 24; i++) {
    const x = thumb.x + thumb.width / 2 + i * 5;
    await page.mouse.move(x, y);
    // The first frame after the move: the drawn thumb is exactly where Radix
    // laid it out for the new value, which is where the pointer is.
    const seen = await page.evaluate(async () => {
      await new Promise(requestAnimationFrame);
      const t = document.querySelector('[data-slot="slider-thumb"]');
      if (!t?.parentElement) throw new Error("no thumb");
      const drawn = t.getBoundingClientRect();
      const spot = t.parentElement.getBoundingClientRect();
      return {
        drawn: drawn.left + drawn.width / 2,
        spot: spot.left + spot.width / 2,
        value: Number(t.getAttribute("aria-valuenow")),
      };
    });
    expect(Math.abs(seen.drawn - seen.spot)).toBeLessThanOrEqual(0.5);
    // Radix's spot for the value: P% of the track, kept inside by half a thumb.
    const half = thumb.width / 2;
    const expected =
      track.x +
      (seen.value / 100) * track.width +
      half -
      (seen.value / 50) * half;
    expect(Math.abs(seen.drawn - expected)).toBeLessThanOrEqual(0.5);
    // ...for the value under the pointer right now (Radix rounds to a step).
    const pointer = ((x - track.x) / track.width) * 100;
    expect(Math.abs(seen.value - pointer)).toBeLessThanOrEqual(0.5);
  }
  await page.mouse.up();
});

// `steps` (step 25) glides from step to step on the way to the end, so its
// spring-back also proves the ride's `transform` transition composites on a
// thumb whose `translate` glides were cancelled (Chrome refuses a `translate`
// transition there).
for (const story of ["default", "steps"]) {
  test(`overdrag stretches the track and springs back on the compositor (${story})`, async ({
    page,
  }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-slider--${story}`,
      // Grab the thumb and drag it to the end before tracing: the drag itself
      // is Radix's `left`, 1:1. Past the end only our transforms change.
      setup: async (p) => {
        const thumb = await boxOf(p, "slider-thumb");
        const track = await boxOf(p, "slider-track");
        const y = thumb.y + thumb.height / 2;
        await p.mouse.move(thumb.x + thumb.width / 2, y);
        await p.mouse.down();
        await p.mouse.move(track.x + track.width, y, { steps: 8 });
      },
      act: async (p) => {
        const track = await boxOf(p, "slider-track");
        const y = track.y + track.height / 2;
        for (let i = 1; i <= 12; i++) {
          await p.mouse.move(track.x + track.width + i * 8, y);
          await p.waitForTimeout(16);
        }
        await p.mouse.up();
      },
      windowMs: 700,
    });
    expect(result.animationCount).toBeGreaterThan(0);
    expectGpuOnly(result);
  });
}

test("overdrag: the band gives up to 24px, the thumb rides its end, release springs home", async ({
  page,
}) => {
  await open(page, "default");
  const thumb = await boxOf(page, "slider-thumb");
  const track = await boxOf(page, "slider-track");
  const y = thumb.y + thumb.height / 2;
  await page.mouse.move(thumb.x + thumb.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(track.x + track.width + 300, y, { steps: 20 });
  await page.waitForTimeout(50);
  const stretched = await boxOf(page, "slider-track");
  const riding = await boxOf(page, "slider-thumb");
  // Anchored at the far end, stretched toward the pointer, never past 24px.
  expect(stretched.x).toBeCloseTo(track.x, 1);
  const give = stretched.x + stretched.width - (track.x + track.width);
  expect(give).toBeGreaterThan(18);
  expect(give).toBeLessThanOrEqual(24);
  // Thinner while stretched.
  expect(stretched.height).toBeLessThan(track.height * 1.5);
  // The thumb rides its point of the stretched band exactly: half a thumb in
  // from the end at rest, stretched with the band (the 115% lift included).
  const at = track.width - thumb.width / 2;
  const onBand = stretched.x + (at * stretched.width) / track.width;
  expect(riding.width).toBeCloseTo(thumb.width * 1.15, 0);
  expect(Math.abs(riding.x + riding.width / 2 - onBand)).toBeLessThanOrEqual(
    0.5,
  );
  await page.mouse.up();
  // It springs home (bouncy, so it passes rest before settling).
  const frames = await page.evaluate(async () => {
    const t = document.querySelector('[data-slot="slider-track"]');
    if (!t) throw new Error("no track");
    const out: number[] = [];
    for (let i = 0; i < 40; i++) {
      await new Promise(requestAnimationFrame);
      out.push(t.getBoundingClientRect().right);
    }
    return out;
  });
  const rest = track.x + track.width;
  expect(frames[0] - rest).toBeGreaterThan(10);
  expect(Math.abs(frames[frames.length - 1] - rest)).toBeLessThan(0.5);
  expect(Math.min(...frames)).toBeLessThan(rest);
});

test("a new press during the spring-back lets the band finish springing (no snap)", async ({
  page,
}) => {
  await open(page, "default");
  const thumb = await boxOf(page, "slider-thumb");
  const track = await boxOf(page, "slider-track");
  const y = thumb.y + thumb.height / 2;
  await page.mouse.move(thumb.x + thumb.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(track.x + track.width + 300, y, { steps: 20 });
  await page.mouse.up();
  // Per frame: the band's end, and whether the new drag has started.
  const frames = page.evaluate(async () => {
    const root = document.querySelector('[data-slot="slider"]');
    const t = document.querySelector('[data-slot="slider-track"]');
    if (!root || !t) throw new Error("no slider");
    const out: Array<{ right: number; dragging: boolean }> = [];
    for (let i = 0; i < 30; i++) {
      await new Promise(requestAnimationFrame);
      out.push({
        right: t.getBoundingClientRect().right,
        dragging: root.hasAttribute("data-dragging"),
      });
    }
    return out;
  });
  // Grab the thumb again mid spring-back and drag it inward.
  const end = track.x + track.width - thumb.width / 2;
  await page.mouse.move(end, y);
  await page.mouse.down();
  await page.mouse.move(end - 30, y, { steps: 3 });
  const f = await frames;
  await page.mouse.up();
  const rest = track.x + track.width;
  const during = f.filter((x) => x.dragging);
  expect(during.length).toBeGreaterThan(10);
  // The bouncy spring keeps going under the new drag: it still dips past
  // rest (a snap would sit at rest from the first dragging frame) and
  // settles there.
  expect(Math.min(...during.map((x) => x.right - rest))).toBeLessThan(-1);
  expect(Math.abs(f[f.length - 1].right - rest)).toBeLessThan(0.5);
});
