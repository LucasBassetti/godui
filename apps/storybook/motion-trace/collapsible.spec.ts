import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const toggle = async (page: Page) => {
  await page.getByRole("button", { name: "Toggle" }).click();
};

test("collapsible opens on the compositor: the edge sweeps, the content after it glides", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-collapsible--default",
    act: toggle,
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // The height snaps once (the click's commit); everything after is translate
  // and opacity on the compositor.
  expectGpuOnly(result);
});

test("collapsible closes on the compositor: the panel leaves the flow at once", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-collapsible--default",
    setup: toggle,
    act: toggle,
    windowMs: 900,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // Discrete, not per-frame: the click's commit (the panel goes absolute), and
  // the frame its hold keyframe ends and Radix hides it.
  expectGpuOnly(result, { maxLayoutFrames: 2 });
});

for (const story of ["nested", "plain-text"] as const) {
  test(`${story}: opens and closes on the compositor`, async ({ page }) => {
    const name = story === "nested" ? "Outer" : "Can I use this in my project?";
    const click = (p: Page) => p.getByRole("button", { name }).click();
    const open = await traceInteraction(page, {
      storyId: `ui-collapsible--${story}`,
      act: click,
      windowMs: 800,
    });
    expect(open.animationCount).toBeGreaterThan(0);
    expectGpuOnly(open);
    const close = await traceInteraction(page, {
      storyId: `ui-collapsible--${story}`,
      setup: click,
      act: click,
      windowMs: 900,
    });
    expectGpuOnly(close, { maxLayoutFrames: 2 });
  });
}

/**
 * Clicks the trigger, then per frame: the panel's clip edge, its first
 * child's top (in the root) and the top of the content after the
 * Collapsible, in px. `rest` is the first child's top where it stays put:
 * before a close, after an open.
 */
async function sampleSweep(page: Page, opening: boolean, frames: number) {
  return page.evaluate(
    async ({ count, opening }) => {
      const root = document.querySelector(
        '[data-slot="collapsible"]',
      ) as HTMLElement;
      const panel = root.querySelector(
        '[data-slot="collapsible-content"]',
      ) as HTMLElement;
      const next = root.nextElementSibling as HTMLElement;
      // Relative to the root: in a stage that centers it, the whole block
      // glides to its new spot, and the content must ride along with it.
      const childTop = () =>
        ((
          panel.firstElementChild as HTMLElement | null
        )?.getBoundingClientRect().top ?? Number.NaN) -
        root.getBoundingClientRect().top;
      const before = childTop();
      (root.querySelector("button") as HTMLElement).click();
      const out: Array<{ edge: number; text: number; row: number }> = [];
      for (let i = 0; i < count; i++) {
        await new Promise(requestAnimationFrame);
        if (!panel.firstElementChild || panel.hidden) break;
        out.push({
          edge: panel.getBoundingClientRect().bottom,
          text: childTop(),
          row: next.getBoundingClientRect().top,
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { frames: out, rest: opening ? childTop() : before };
    },
    { count: frames, opening },
  );
}

for (const story of ["default", "centered"] as const) {
  for (const direction of ["opening", "closing"] as const) {
    test(`${story}, ${direction}: the panel's children hold still and the content after it rides the clip edge`, async ({
      page,
    }) => {
      await page.goto(
        `/iframe.html?id=ui-collapsible--${story}&viewMode=story`,
      );
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
      const { frames, rest } = await sampleSweep(
        page,
        direction === "opening",
        40,
      );
      expect(frames.length).toBeGreaterThan(20);
      const [first] = frames;
      for (const f of frames) {
        // A height animation's look: the content never moves from where it
        // rests (before a close, after an open)...
        expect(Math.abs(f.text - rest)).toBeLessThan(0.5);
        // ...and what follows keeps its distance to the clip edge every frame.
        expect(
          Math.abs(f.row - f.edge - (first.row - first.edge)),
        ).toBeLessThan(0.5);
      }
      // And the edge really travelled (not a snap).
      const edges = frames.map((f) => f.edge);
      expect(Math.max(...edges) - Math.min(...edges)).toBeGreaterThan(20);
    });
  }
}

test("in a stage that centers it, the trigger never jumps when the panel opens or closes", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-collapsible--centered&viewMode=story");
  await page.waitForLoadState("networkidle");
  /** Largest one-frame move of the trigger (it sits above the panel). */
  const biggestStep = () =>
    page.evaluate(async () => {
      const trigger = document.querySelector(
        '[data-slot="collapsible-trigger"]',
      ) as HTMLElement | null;
      if (!trigger) throw new Error("no collapsible trigger");
      let prev = trigger.getBoundingClientRect().top;
      let biggest = 0;
      trigger.click();
      for (let i = 0; i < 30; i++) {
        await new Promise(requestAnimationFrame);
        const top = trigger.getBoundingClientRect().top;
        biggest = Math.max(biggest, Math.abs(top - prev));
        prev = top;
      }
      return biggest;
    });
  // The panel takes ~90px, so the stage shifts the trigger ~45px. In one step
  // that's a jump; gliding on the 260ms spring, no frame moves it half.
  expect(await biggestStep()).toBeLessThan(20);
  await page.waitForTimeout(400);
  // Closing runs on the quicker clock; still no single-frame jump.
  expect(await biggestStep()).toBeLessThan(25);
});

test("sibling collapsibles never move the header you clicked", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-collapsible--siblings&viewMode=story");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Section A" }).click();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "Section B" }).click();
  const moving = await page.evaluate(() =>
    [...document.querySelectorAll('[data-slot="collapsible"]')].map(
      (el) => el.getAnimations().length,
    ),
  );
  // A and B themselves stay put; only C (after B) slides.
  expect(moving.slice(0, 2)).toEqual([0, 0]);
  expect(moving[2]).toBeGreaterThan(0);
});
