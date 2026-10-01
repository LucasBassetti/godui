import { expect } from "vitest";

/**
 * `tag[data-slot]` for every slotted element under `root`, in document order.
 * With the default `document.body` root, portaled content is included.
 */
export function slotTree(root: ParentNode = document.body): string[] {
  return [...root.querySelectorAll("[data-slot]")].map(
    (el) => `${el.tagName.toLowerCase()}[${el.getAttribute("data-slot")}]`,
  );
}

/**
 * GodUI's tree must equal shadcn's once the GodUI-only slots the component
 * documents (`extraSlots`) are removed.
 */
export function expectSlotParity(
  godui: string[],
  shadcn: string[],
  extraSlots: string[] = [],
): void {
  const filtered = godui.filter(
    (entry) => !extraSlots.some((slot) => entry.endsWith(`[${slot}]`)),
  );
  expect(filtered).toEqual(shadcn);
}
