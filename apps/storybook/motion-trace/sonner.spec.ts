import { expect, type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

const show = async (page: Page) => {
  await page.getByRole("button", { name: "Show toast" }).click();
};

test("a toast enters on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-sonner--default",
    act: show,
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});

test("the stack expands on hover without animating height", async ({
  page,
}) => {
  const result = await traceInteraction(page, {
    // Tall toasts behind a short one: expanding changes their heights, which
    // sonner transitions unless GodUI's override is in place.
    storyId: "ui-sonner--stack",
    setup: async (p) => {
      for (const name of ["Tall toast", "Tall toast", "Short toast"]) {
        await p.getByRole("button", { name }).click();
        await p.waitForTimeout(150);
      }
      // Park the pointer away from the toaster.
      await p.mouse.move(5, 5);
    },
    act: async (p) => {
      const box = await p.locator("[data-sonner-toast]").first().boundingBox();
      if (!box) throw new Error("no toast");
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
        steps: 4,
      });
    },
    windowMs: 800,
  });
  expect(result.animationCount).toBeGreaterThan(0);
  expectGpuOnly(result);
});
