import type { Page } from "@playwright/test";

type Target = { selector: string; text: string };

/**
 * Clicks `click` and reports, one frame later, whether the indicator
 * (`indicator`, inside the `checked` item) is gone and whether it ran any
 * animation on the way. An indicator that loses its checked state must be
 * removed at once — never re-pop before it disappears.
 */
export function deselect(
  page: Page,
  options: { checked: Target; indicator: string; click: Target },
) {
  return page.evaluate(async ({ checked, indicator, click }) => {
    const find = ({ selector, text }: { selector: string; text: string }) =>
      [...document.querySelectorAll<HTMLElement>(selector)].find(
        (el) => el.textContent?.trim().startsWith(text) ?? false,
      );
    const item = find(checked);
    const node = item?.querySelector<HTMLElement>(indicator);
    const target = find(click);
    if (!item || !node || !target) throw new Error("story markup changed");
    const started: string[] = [];
    node.addEventListener("animationstart", (event) =>
      started.push(event.animationName),
    );
    target.click();
    await new Promise(requestAnimationFrame);
    const running = node.isConnected
      ? node.getAnimations().map((a) => (a as CSSAnimation).animationName)
      : [];
    return {
      connectedAfterOneFrame: node.isConnected,
      animations: [...started, ...running],
    };
  }, options);
}
