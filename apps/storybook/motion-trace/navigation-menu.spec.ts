import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const open = async (p: Page) => {
  await p.getByRole("button", { name: "Home" }).click();
};

for (const story of ["default", "without-viewport"]) {
  test(`navigation menu opens on the compositor (${story})`, async ({
    page,
  }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-navigation-menu--${story}`,
      act: open,
      windowMs: 700,
    });
    expect(result.animationCount).toBeGreaterThan(0);
    expectGpuOnly(result);
  });

  test(`hopping to the next trigger slides both contents on the compositor (${story})`, async ({
    page,
  }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-navigation-menu--${story}`,
      setup: open,
      act: async (p) => {
        await p.getByRole("button", { name: "Components" }).hover();
      },
      windowMs: 800,
    });
    // The old content's exit and the new content's enter (plus the chevrons).
    expect(result.animationCount).toBeGreaterThan(1);
    // Two discrete frames: the old content is removed when its exit ends, and
    // the new content's (longer) enter finishes. The viewport's size snap lands
    // with the mutation itself. Neither repeats per frame.
    expectGpuOnly(result, { maxLayoutFrames: 2 });
  });

  test(`navigation menu closes on the compositor (${story})`, async ({
    page,
  }) => {
    const result = await traceInteraction(page, {
      storyId: `ui-navigation-menu--${story}`,
      setup: open,
      act: async (p) => {
        await p.keyboard.press("Escape");
      },
      windowMs: 600,
    });
    expect(result.animationCount).toBeGreaterThan(0);
    expectGpuOnly(result);
  });
}

test("the exiting content stays visible while it slides out", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-navigation-menu--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  await open(page);
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Components" }).hover();
  await page.waitForTimeout(60);
  const leaving = page.locator(
    '[data-slot="navigation-menu-content"][data-motion="to-start"]',
  );
  await expect(leaving).toHaveCount(1);
  const animations = await leaving.evaluate((el) =>
    el.getAnimations().map((a) => (a as CSSAnimation).animationName),
  );
  expect(animations).toEqual(["godui-slide-out-to-left"]);
  // Gone once its exit has finished.
  await expect(leaving).toHaveCount(0, { timeout: 1000 });
});

test("the indicator slides on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-navigation-menu--with-indicator",
    setup: open,
    act: async (p) => {
      await p.getByRole("button", { name: "Components" }).hover();
    },
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  // Same two discrete frames as any hop (old content removed, new enter ends);
  // the indicator itself only transitions transform.
  expectGpuOnly(result, { maxLayoutFrames: 2 });
  // And it really moved: under Components, not at the list's left edge.
  const x = await page
    .locator('[data-slot="navigation-menu-indicator"]')
    .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  expect(x).toBeGreaterThan(0);
});

test("the indicator glides with a running transform transition", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=ui-navigation-menu--with-indicator&viewMode=story",
  );
  await page.waitForLoadState("networkidle");
  await open(page);
  await page.waitForTimeout(500);
  const indicator = page.locator('[data-slot="navigation-menu-indicator"]');
  const xOf = () =>
    indicator.evaluate(
      (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
    );
  const start = await xOf();
  // Sample every frame from before the hover until a running transform
  // transition has moved the indicator off its start (bounded at ~1s), so the
  // check doesn't depend on when Radix reacts to the hover. A fixed 60ms
  // sample was flaky: sometimes it landed before the glide began.
  const sampling = indicator.evaluate(async (el, from) => {
    const read = () => ({
      x: new DOMMatrix(getComputedStyle(el).transform).m41,
      target: new DOMMatrix(el.style.transform).m41,
      transitions: el
        .getAnimations()
        .filter((a) => a.playState === "running")
        .map((a) => (a as CSSTransition).transitionProperty)
        .filter(Boolean),
    });
    for (let frame = 0; frame < 60; frame++) {
      await new Promise(requestAnimationFrame);
      const now = read();
      if (now.transitions.includes("transform") && now.x > from + 0.5) {
        return { ...now, frame };
      }
    }
    return { ...read(), frame: -1 };
  }, start);
  await page.getByRole("button", { name: "Components" }).hover();
  const mid = await sampling;
  expect(mid.frame, "a transform transition moved it within ~1s").not.toBe(-1);
  expect(mid.transitions).toContain("transform");
  // Mid-flight: past the start, short of where Radix put it.
  expect(mid.x).toBeGreaterThan(start);
  expect(mid.x).toBeLessThan(mid.target);
  await page.waitForTimeout(600);
  expect(await xOf()).toBeCloseTo(mid.target, 0);
});

test("the viewport opens under its own trigger, in place, then glides to the next", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=ui-navigation-menu--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  const lefts = () =>
    page.evaluate(async () => {
      const viewport = () =>
        document.querySelector('[data-slot="navigation-menu-viewport"]');
      const out: number[] = [];
      for (let i = 0; i < 40; i++) {
        await new Promise(requestAnimationFrame);
        const wrapper = viewport()?.parentElement;
        if (wrapper)
          out.push(
            new DOMMatrix(
              getComputedStyle(wrapper).transform === "none"
                ? undefined
                : getComputedStyle(wrapper).transform,
            ).m41 +
              Number.parseFloat(
                getComputedStyle(wrapper).translate.split(" ")[0] || "0",
              ),
          );
      }
      return out;
    });
  const trigger = page.getByRole("button", { name: "With Icon" });
  await trigger.click();
  const open = await lefts();
  // First open: one position from the first frame (no slide in from the left).
  expect(new Set(open.map(Math.round)).size).toBe(1);
  // …and the small panel overlaps its trigger instead of the menu's left edge.
  const t = await trigger.boundingBox();
  const v = await page
    .locator('[data-slot="navigation-menu-viewport"]')
    .boundingBox();
  if (!t || !v) throw new Error("missing boxes");
  expect(v.x).toBeLessThan(t.x + t.width);
  expect(v.x + v.width).toBeGreaterThan(t.x);
  expect(v.x).toBeGreaterThan(t.x - v.width);
  // Hopping to Home (pointer moves over it, as a user does) glides: several
  // distinct positions, not a jump. A click would toggle it closed again.
  await page.getByRole("button", { name: "Home" }).hover();
  const hop = await lefts();
  expect(new Set(hop.map(Math.round)).size).toBeGreaterThan(5);
});
