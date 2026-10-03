import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("the fill glides to a new value on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-progress--stepped",
    // The story starts at 13; one click sets 66.
    act: async (p) => {
      await p.getByRole("button", { name: "Advance" }).click();
    },
    windowMs: 700,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("the indeterminate bar sweeps on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-progress--indeterminate",
    // The loop starts on load, before tracing; restart it so Chrome reports
    // the animation (and whether it composited) inside the traced window.
    act: async (p) => {
      await p.evaluate(() => {
        const bar = document.querySelector('[data-slot="progress-indicator"]');
        for (const animation of bar?.getAnimations() ?? []) {
          animation.cancel();
          animation.play();
        }
      });
    },
    // Two iterations of the 1.4s loop.
    windowMs: 2800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("resolving an indeterminate bar snaps to the value, never glides in from off-track", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=ui-progress--from-indeterminate&viewMode=story",
  );
  await page.waitForLoadState("networkidle");
  // Mid-sweep: the bar is partly across the track.
  await page.waitForTimeout(700);
  const frames = await page.evaluate(async () => {
    const track = document
      .querySelector('[data-slot="progress"]')
      ?.getBoundingClientRect();
    const bar = () =>
      document.querySelector<HTMLElement>('[data-slot="progress-indicator"]');
    const advance = [...document.querySelectorAll("button")].find(
      (b) => b.textContent === "Advance",
    );
    if (!track || !advance) throw new Error("story markup changed");
    advance.click();
    const out: Array<{ state?: string; right: number; animations: number }> =
      [];
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      const el = bar();
      const r = el?.getBoundingClientRect();
      out.push({
        state: el?.dataset.state,
        right: r
          ? Math.round(((r.right - track.left) / track.width) * 100)
          : -1,
        animations: el?.getAnimations().length ?? -1,
      });
    }
    return out;
  });
  // The fill's right edge is at 66% from the first frame, with no transition
  // started from the sweep's last position.
  for (const frame of frames) {
    expect(frame).toEqual({ state: "loading", right: 66, animations: 0 });
  }
});

test("resolving an indeterminate bar stays on the compositor", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    storyId: "ui-progress--from-indeterminate",
    act: async (p) => {
      await p.getByRole("button", { name: "Advance" }).click();
    },
    windowMs: 700,
  });
  expectGpuOnly(result);
});
