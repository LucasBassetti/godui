import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const toggle = async (page: Page) => {
  await page.locator('[data-slot="sidebar-trigger"]').click();
};

const open = async (page: Page, story: string, slowMs?: number) => {
  await page.goto(`/iframe.html?id=ui-sidebar--${story}&viewMode=story`);
  await page.waitForLoadState("networkidle");
  await page.waitForSelector('[data-slot="sidebar-container"]');
  if (slowMs) {
    // Slow the clock so many frames land mid-move.
    await page.addStyleTag({
      content: `:root{--godui-duration-base:${slowMs}ms!important;--godui-duration-fast:${slowMs}ms!important}`,
    });
  }
};

for (const story of ["offcanvas", "icon"] as const) {
  for (const direction of ["collapses", "expands"] as const) {
    test(`${story} sidebar ${direction} on the compositor`, async ({
      page,
    }) => {
      const result = await traceInteraction(page, {
        storyId: `ui-sidebar--${story}`,
        // Collapsing starts from the story's resting state; the no-op setup
        // still lets the freshly loaded page settle before tracing.
        setup: direction === "expands" ? toggle : async () => {},
        act: toggle,
        windowMs: 700,
      });
      expect(result.animationCount).toBeGreaterThan(0);
      // The gap's and the container's widths snap on the click's own frame
      // (inside the settle window). After that only translate/scale/opacity
      // run, plus one discrete frame where the move ends: the glides finish
      // and `data-moving` clears (the wrapper's x clip and the content's
      // lift go). Expanding from icon mode, a sub-menu fades back in after
      // the rows make room and `data-moving` holds until that fade ends
      // (~300ms), one frame after the glides end (~260ms): two discrete
      // frames, neither repeating per frame.
      const subMenuFade = story === "icon" && direction === "expands";
      expectGpuOnly(result, { maxLayoutFrames: subMenuFade ? 2 : 1 });
    });
  }
}

/**
 * Per frame, while the sidebar moves: the panel's visible edge (the surface's,
 * or the floating card's right cap), the content beside it, the trigger, and
 * whether the page grew a horizontal scrollbar.
 */
async function sampleMove(
  page: Page,
  frames: number,
  how: "click" | "shortcut" = "click",
) {
  return page.evaluate(
    async ({ count, how }) => {
      const q = (s: string) => document.querySelector(s) as HTMLElement;
      const sidebar = q('[data-slot="sidebar"]');
      const right = sidebar.dataset.side === "right";
      const surface = q('[data-slot="sidebar-surface"]');
      // The floating card's far edge is its last slice.
      const edgeEl =
        surface.children.length > 0
          ? (surface.lastElementChild as HTMLElement)
          : surface;
      const content = right
        ? q('[data-slot="sidebar-inner"]')
        : q('[data-slot="sidebar-inset"]');
      const trigger = q('[data-slot="sidebar-trigger"]');
      const read = () => {
        const e = edgeEl.getBoundingClientRect();
        const c = content.getBoundingClientRect();
        const root = document.documentElement;
        return {
          edge: right ? e.left : e.right,
          content: c.left,
          trigger: trigger.getBoundingClientRect().left,
          overflow: root.scrollWidth - root.clientWidth,
        };
      };
      const out = [read()];
      if (how === "shortcut") {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { key: "b", ctrlKey: true }),
        );
      } else {
        trigger.click();
      }
      for (let i = 0; i < count; i++) {
        await new Promise(requestAnimationFrame);
        out.push(read());
      }
      return out;
    },
    { count: frames, how },
  );
}

type Frame = Awaited<ReturnType<typeof sampleMove>>[number];

/** The content holds the gap it had at rest to the panel's edge, every frame. */
function expectGlued(frames: Frame[], slack = 0.5) {
  const gaps = frames.map((f) => f.content - f.edge);
  const first = gaps[0];
  const last = gaps[gaps.length - 1];
  for (const gap of gaps) {
    // Floating cards change their gutter by 2px end to end (shadcn's +2px
    // border allowance); in between it moves monotonically, never jumps.
    expect(gap).toBeGreaterThanOrEqual(Math.min(first, last) - slack);
    expect(gap).toBeLessThanOrEqual(Math.max(first, last) + slack);
  }
  // And the edge really travelled (not a snap).
  const edges = frames.map((f) => f.edge);
  expect(Math.max(...edges) - Math.min(...edges)).toBeGreaterThan(150);
}

for (const story of ["offcanvas", "icon", "floating", "right"] as const) {
  for (const direction of ["collapsing", "expanding"] as const) {
    test(`${story}, ${direction}: the content stays glued to the panel's edge, no scrollbar`, async ({
      page,
    }) => {
      await open(page, story, 1200);
      if (direction === "expanding") {
        await toggle(page);
        await page.waitForTimeout(1500);
      }
      const frames = await sampleMove(page, 50);
      expect(frames.length).toBeGreaterThan(40);
      expectGlued(frames);
      for (const f of frames) expect(f.overflow).toBeLessThanOrEqual(0);
    });
  }
}

for (const story of ["offcanvas", "icon", "floating"] as const) {
  test(`${story}: reversed mid-way, panel and content carry on from where they're drawn`, async ({
    page,
  }) => {
    await open(page, story, 1200);
    const frames = await page.evaluate(async () => {
      const q = (s: string) => document.querySelector(s) as HTMLElement;
      const surface = q('[data-slot="sidebar-surface"]');
      const edgeEl =
        surface.children.length > 0
          ? (surface.lastElementChild as HTMLElement)
          : surface;
      const inset = q('[data-slot="sidebar-inset"]');
      const trigger = q('[data-slot="sidebar-trigger"]');
      const out: Array<{ edge: number; content: number }> = [];
      const read = () =>
        out.push({
          edge: edgeEl.getBoundingClientRect().right,
          content: inset.getBoundingClientRect().left,
        });
      read();
      trigger.click();
      for (let i = 0; i < 15; i++) {
        await new Promise(requestAnimationFrame);
        read();
      }
      trigger.click();
      for (let i = 0; i < 40; i++) {
        await new Promise(requestAnimationFrame);
        read();
      }
      return out;
    });
    const gaps = frames.map((f) => f.content - f.edge);
    // Glued through the reversal (floating: its 6–8px gutter)...
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThan(2.5);
    // ...and nothing jumps at the reversal: a 1.2s move covers 200+px, so no
    // single frame moves more than a few dozen.
    const steps = frames
      .slice(1)
      .map((f, i) => Math.abs(f.edge - frames[i].edge));
    expect(Math.max(...steps)).toBeLessThan(30);
  });
}

test("at real speed the trigger never jumps on the first frame", async ({
  page,
}) => {
  for (const story of ["offcanvas", "icon"] as const) {
    await open(page, story);
    for (const _ of [0, 1]) {
      const frames = await sampleMove(page, 30);
      const steps = frames
        .slice(1)
        .map((f, i) => Math.abs(f.trigger - frames[i].trigger));
      // 208–256px over a 260ms spring: the first frames move the most, but
      // never the whole distance at once.
      expect(steps[0]).toBeLessThan(80);
      expect(Math.max(...steps)).toBeLessThan(80);
      expectGlued(frames, 1);
      await page.waitForTimeout(500);
    }
  }
});

test("Ctrl+B toggles the sidebar with the same glued move", async ({
  page,
}) => {
  await open(page, "icon", 1200);
  const sidebar = page.locator('[data-slot="sidebar"]');
  await expect(sidebar).toHaveAttribute("data-state", "expanded");
  const frames = await sampleMove(page, 40, "shortcut");
  await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  expectGlued(frames);
});

test("icon mode: menu buttons show their tooltip once collapsed", async ({
  page,
}) => {
  await open(page, "icon");
  await toggle(page);
  await page.waitForTimeout(500);
  await page.locator('[data-sidebar="menu-button"]').nth(2).hover();
  await expect(page.getByRole("tooltip")).toContainText("Models");
});

test("icon mode: labels fade, rows glide up, nothing is cut while moving", async ({
  page,
}) => {
  await open(page, "icon", 1200);
  const frames = await page.evaluate(async () => {
    const label = document.querySelector(
      '[data-sidebar="group-label"]',
    ) as HTMLElement;
    const row = document.querySelectorAll('[data-sidebar="menu-button"]')[1];
    const out: Array<{ opacity: number; label: number; row: number }> = [];
    (
      document.querySelector('[data-slot="sidebar-trigger"]') as HTMLElement
    ).click();
    for (let i = 0; i < 40; i++) {
      await new Promise(requestAnimationFrame);
      out.push({
        opacity: Number(getComputedStyle(label).opacity),
        label: label.getBoundingClientRect().top,
        row: row.getBoundingClientRect().top,
      });
    }
    return out;
  });
  // The label fades over many frames instead of vanishing...
  expect(
    frames.filter((f) => f.opacity > 0.05 && f.opacity < 0.95).length,
  ).toBeGreaterThan(5);
  // ...and it and the rows below rise smoothly (no one-frame jump).
  const steps = frames.slice(1).map((f, i) => Math.abs(f.row - frames[i].row));
  expect(Math.max(...steps)).toBeLessThan(12);
  const rows = frames.map((f) => f.row);
  expect(Math.max(...rows) - Math.min(...rows)).toBeGreaterThan(40);
});

test("mobile: the sidebar is GodUI's Sheet, sliding in on the compositor", async ({
  page,
}) => {
  await page.setViewportSize({ width: 500, height: 800 });
  const result = await traceInteraction(page, {
    storyId: "ui-sidebar--offcanvas",
    act: toggle,
    windowMs: 700,
  });
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.locator('[data-slot="sidebar"][data-mobile="true"]'),
  ).toBeVisible();
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("reduced motion: the panel and the content take their places at once", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const story of ["offcanvas", "icon", "floating"] as const) {
    await open(page, story);
    const frames = await sampleMove(page, 3);
    const [, first, ...rest] = frames;
    // Already at rest on the first frame after the click, and it stays there.
    for (const f of rest) {
      expect(f.edge).toBe(first.edge);
      expect(f.content).toBe(first.content);
    }
    expect(Math.abs(first.edge - frames[0].edge)).toBeGreaterThan(150);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  }
});

test("at rest nothing is clipped: wide content still scrolls the page", async ({
  page,
}) => {
  await open(page, "offcanvas");
  const overflow = () =>
    page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
  await page.evaluate(() => {
    const wide = document.createElement("div");
    wide.style.cssText = "width: 3000px; height: 8px; flex: none";
    document.querySelector('[data-slot="sidebar-inset"]')?.append(wide);
  });
  expect(await overflow()).toBeGreaterThan(1000);
  await toggle(page);
  await page.waitForTimeout(600);
  expect(await overflow()).toBeGreaterThan(1000);
});

/** The surface's and the container's computed right border. */
async function borders(page: Page) {
  return page.evaluate(() => {
    const read = (slot: string) => {
      const s = getComputedStyle(
        document.querySelector(`[data-slot="${slot}"]`) as Element,
      );
      return {
        width: s.borderRightWidth,
        style: s.borderRightStyle,
        color: s.borderRightColor,
        image: s.borderImageSource,
      };
    };
    return {
      container: read("sidebar-container"),
      surface: read("sidebar-surface"),
    };
  });
}

/**
 * RGB of a 1px-tall strip of the screen, `from`..`to` (viewport x) at the
 * middle of the viewport's height, from a real screenshot.
 */
async function strip(page: Page, from: number, to: number) {
  const y = Math.round((page.viewportSize()?.height ?? 720) / 2);
  const png = (
    await page.screenshot({
      clip: { x: from, y, width: to - from, height: 1 },
      animations: "allow",
    })
  ).toString("base64");
  return page.evaluate(async (png) => {
    const img = new Image();
    img.src = `data:image/png;base64,${png}`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.drawImage(img, 0, 0);
    const out: number[][] = [];
    for (let x = 0; x < img.width; x++) {
      out.push([...ctx.getImageData(x, 0, 1, 1).data.slice(0, 3)]);
    }
    return out;
  }, png);
}

/** Hold every animation where it's drawn (so a screenshot sees that frame). */
const freeze = (page: Page, frozen: boolean) =>
  page.evaluate((frozen) => {
    for (const a of document.getAnimations()) frozen ? a.pause() : a.play();
  }, frozen);

const surfaceRight = (page: Page) =>
  page.evaluate(
    () =>
      (
        document.querySelector('[data-slot="sidebar-surface"]') as Element
      ).getBoundingClientRect().right,
  );

/**
 * Across the panel's edge (a composited layer snaps to whole pixels, so a
 * line may sit a pixel either side), every pixel is the panel's background,
 * the page's, or a blend of the two: no line in another color.
 */
async function expectNoLine(page: Page, label: string) {
  const edge = Math.round(await surfaceRight(page));
  const px = await strip(page, edge - 8, edge + 5);
  const [panel, page_] = [px[0], px[px.length - 1]];
  for (const [i, p] of px.entries()) {
    const off = p.some(
      (c, k) =>
        c < Math.min(panel[k], page_[k]) - 6 ||
        c > Math.max(panel[k], page_[k]) + 6,
    );
    expect(
      off,
      `${label}: x=${edge - 8 + i} rgb(${p}), panel rgb(${panel}), page rgb(${page_})`,
    ).toBe(false);
  }
}

test("className=\"border-r-0\" (shadcn's sidebar-10): the surface paints the container's border, as shadcn does", async ({
  page,
}) => {
  await open(page, "border-override");
  const { container, surface } = await borders(page);
  // shadcn's variant border-r out-specifies border-r-0: shadcn keeps the line.
  expect(container.width).toBe("1px");
  expect(surface).toMatchObject({
    width: container.width,
    style: container.style,
    color: container.color,
  });
  // The box keeps its border but never paints it (no stray line when it
  // snaps ahead of the sliding surface).
  expect(container.image).toContain("linear-gradient");
  expect(surface.image).toBe("none");
});

test("an override that wins (border-r-0!) removes the line at rest and while the edge slides", async ({
  page,
}) => {
  await open(page, "no-border", 3000);
  const { container, surface } = await borders(page);
  expect(container.width).toBe("0px");
  expect(surface.width).toBe("0px");
  await expectNoLine(page, "at rest");
  for (const direction of ["collapsing", "expanding"]) {
    await toggle(page);
    await page.waitForTimeout(800);
    await freeze(page, true);
    await expectNoLine(page, direction);
    await freeze(page, false);
    await page.waitForTimeout(3200);
  }
});

test("a call site's border color reaches the painted edge; the snapped box paints none", async ({
  page,
}) => {
  await open(page, "icon", 3000);
  await page.addStyleTag({
    content:
      '[data-slot="sidebar-container"]{border-right-color:rgb(255,0,0)!important}',
  });
  const { surface } = await borders(page);
  expect(surface.color).toBe("rgb(255, 0, 0)");
  // Red, or red blended over the panel (a 1px line at a fractional x).
  const red = (px: number[]) => px[0] - px[1] > 80 && px[0] - px[2] > 80;
  // Collapse, then expand: mid-way the box has snapped to full width while
  // the surface is still sliding out to it.
  await toggle(page);
  await page.waitForTimeout(3500);
  await toggle(page);
  await page.waitForTimeout(800);
  await freeze(page, true);
  const box = await page.evaluate(
    () =>
      (
        document.querySelector('[data-slot="sidebar-container"]') as Element
      ).getBoundingClientRect().right,
  );
  const edge = await surfaceRight(page);
  expect(box - edge).toBeGreaterThan(20);
  const [boxEdge] = await strip(page, Math.round(box) - 1, Math.round(box));
  expect(red(boxEdge), `box edge rgb(${boxEdge})`).toBe(false);
  // A composited layer snaps to whole pixels: allow a pixel or two either way.
  const atSurface = await strip(
    page,
    Math.round(edge) - 3,
    Math.round(edge) + 3,
  );
  expect(atSurface.some(red), `surface edge ${JSON.stringify(atSurface)}`).toBe(
    true,
  );
});

/**
 * The surface's edges relative to the container's border box (what shadcn
 * paints its border on), at rest and mid-slide: where the surface sits against
 * the box, for the same story with and without a call-site border.
 */
async function surfaceOffsets(page: Page, story: string) {
  const read = () =>
    page.evaluate(() => {
      const box = (slot: string) =>
        (
          document.querySelector(`[data-slot="${slot}"]`) as Element
        ).getBoundingClientRect();
      const c = box("sidebar-container");
      const s = box("sidebar-surface");
      return {
        top: s.top - c.top,
        bottom: s.bottom - c.bottom,
        left: s.left - c.left,
        right: s.right - c.right,
      };
    });
  await open(page, story, 3000);
  const frames: Record<string, Awaited<ReturnType<typeof read>>> = {
    rest: await read(),
  };
  for (const direction of ["collapsing", "expanding"]) {
    await toggle(page);
    await page.waitForTimeout(150);
    await page.evaluate(() => {
      for (const a of document.getAnimations()) {
        a.pause();
        a.currentTime = 1000;
      }
    });
    frames[direction] = await read();
    await freeze(page, false);
    await page.waitForTimeout(3500);
    frames[`${direction} (settled)`] = await read();
  }
  return frames;
}

for (const [plain, bordered, side] of [
  ["icon", "border-all", "left"],
  ["right", "border-all-right", "right"],
  ["offcanvas", "border-all-offcanvas", "left"],
  ["inset", "border-all-inset", "left"],
] as const) {
  test(`${bordered}: a call-site border paints on the box edge, as in shadcn (${side}), at rest and mid-slide`, async ({
    page,
  }) => {
    const expected = await surfaceOffsets(page, plain);
    const actual = await surfaceOffsets(page, bordered);
    for (const frame of Object.keys(expected)) {
      for (const edge of ["top", "bottom", "left", "right"] as const) {
        expect(
          Math.abs(actual[frame][edge] - expected[frame][edge]),
          `${frame}, ${edge}: ${actual[frame][edge]} vs ${expected[frame][edge]}`,
        ).toBeLessThanOrEqual(0.5);
      }
    }
  });
}
