import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const toggle = async (page: Page) => {
  await page.getByRole("button", { name: "Product Information" }).click();
};

test("accordion opens on the compositor: the edge sweeps, rows glide", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-accordion--default",
    act: toggle,
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // The height snaps once (the click's commit); everything after is translate
  // and opacity on the compositor.
  expectGpuOnly(result);
});

test("accordion closes on the compositor: the panel leaves the flow at once", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-accordion--default",
    setup: toggle,
    act: toggle,
    windowMs: 900,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // Discrete, not per-frame: the click's commit (the panel goes absolute), and
  // the frame its hold keyframe ends and Radix hides it.
  expectGpuOnly(result, { maxLayoutFrames: 2 });
});

/** Per frame: the panel's clip box, its content and the next row, in px. */
async function sampleSweep(page: Page, frames: number) {
  return page.evaluate(async (count) => {
    const items = document.querySelectorAll('[data-slot="accordion-item"]');
    const panel = items[0].querySelector(
      ':scope > [data-slot="accordion-content"]',
    ) as HTMLElement;
    const next = items[1] as HTMLElement;
    const out: Array<{ edge: number; text: number; row: number }> = [];
    for (let i = 0; i < count; i++) {
      await new Promise(requestAnimationFrame);
      const content = panel.firstElementChild as HTMLElement | null;
      if (!content) break;
      out.push({
        edge: panel.getBoundingClientRect().bottom,
        text: content.getBoundingClientRect().top,
        row: next.getBoundingClientRect().top,
      });
    }
    return out;
  }, frames);
}

for (const direction of ["opening", "closing"] as const) {
  test(`${direction}: the text holds still and the next row rides the clip edge`, async ({
    page,
  }) => {
    await page.goto("/iframe.html?id=ui-accordion--default&viewMode=story");
    await page.waitForLoadState("networkidle");
    // Slow the clock so many frames land mid-sweep.
    await page.addStyleTag({
      content:
        ":root{--godui-duration-base:1200ms!important;--godui-duration-fast:1200ms!important}",
    });
    if (direction === "closing") {
      await toggle(page);
      await page.waitForTimeout(1500);
    }
    await toggle(page);
    const frames = await sampleSweep(page, 40);
    expect(frames.length).toBeGreaterThan(20);
    const [first] = frames;
    for (const f of frames) {
      // A height animation's look: the text never moves...
      expect(Math.abs(f.text - first.text)).toBeLessThan(0.5);
      // ...and the row below stays on the clip edge every frame.
      expect(Math.abs(f.row - f.edge)).toBeLessThan(0.5);
    }
    // And the edge really travelled (not a snap).
    const edges = frames.map((f) => f.edge);
    expect(Math.max(...edges) - Math.min(...edges)).toBeGreaterThan(20);
  });
}

test("in a stage that centers it, no row jumps when a panel opens or closes", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-accordion--centered&viewMode=story");
  await page.waitForLoadState("networkidle");
  /** Largest one-frame move of the first row (it sits above every panel). */
  const biggestStep = () =>
    page.evaluate(async () => {
      const row = document.querySelector('[data-slot="accordion-item"]');
      if (!row) throw new Error("no accordion row");
      let prev = row.getBoundingClientRect().top;
      let biggest = 0;
      row.querySelector("button")?.click();
      for (let i = 0; i < 30; i++) {
        await new Promise(requestAnimationFrame);
        const top = row.getBoundingClientRect().top;
        biggest = Math.max(biggest, Math.abs(top - prev));
        prev = top;
      }
      return biggest;
    });
  // The panel is ~60px, so the centering parent shifts the row ~30px. In one
  // step that's a jump; gliding on the 260ms spring, no frame moves it half.
  expect(await biggestStep()).toBeLessThan(15);
  await page.waitForTimeout(400);
  // Closing runs on the quicker clock; still no single-frame jump.
  expect(await biggestStep()).toBeLessThan(20);
});
