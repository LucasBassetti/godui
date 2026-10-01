import { expect, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("toggle press runs on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-toggle--default",
    act: async (p) => {
      const box = await p.getByRole("button").boundingBox();
      if (!box) throw new Error("no toggle");
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await p.mouse.down();
      await p.waitForTimeout(200);
      await p.mouse.up();
    },
    windowMs: 600,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("a standalone toggle keeps its on background", async ({ page }) => {
  await page.goto("/iframe.html?id=ui-toggle--default&viewMode=story");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button").click();
  await page.mouse.move(0, 0);
  const [on, accent] = await page.evaluate(() => {
    const toggle = document.querySelector('[data-slot="toggle"]');
    const probe = document.createElement("div");
    probe.className = "bg-accent";
    document.body.append(probe);
    const colors = [
      toggle ? getComputedStyle(toggle).backgroundColor : "",
      getComputedStyle(probe).backgroundColor,
    ];
    probe.remove();
    return colors;
  });
  expect(on).toBe(accent);
});
