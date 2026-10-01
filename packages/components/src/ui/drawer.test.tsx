import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isCompositorProp } from "@godui/motion-lint";
import { fireEvent, render, screen } from "@testing-library/react";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Shadcn from "../../test/shadcn/drawer";
import { Button } from "./button";
import * as Godui from "./drawer";

const PKG = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

function Usage({
  ui,
  open,
  onOpenChange,
}: {
  ui: typeof Shadcn;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } = ui;
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const slot = (name: string) =>
  document.querySelector(`[data-slot="${name}"]`) as HTMLElement;

describe("Drawer", () => {
  it("matches shadcn's data-slot tree and exports", () => {
    const { unmount } = render(<Usage ui={Shadcn} open />);
    const expected = slotTree();
    unmount();
    render(<Usage ui={Godui} open />);
    expectSlotParity(slotTree(), expected);
    expect(Object.keys(Godui)).toEqual(
      expect.arrayContaining(Object.keys(Shadcn)),
    );
  });

  it("closes from DrawerClose", () => {
    const onOpenChange = vi.fn();
    render(<Usage ui={Godui} open onOpenChange={onOpenChange} />);
    // A bare click: pointerdown would start vaul's drag code, which needs
    // layout APIs jsdom lacks.
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("leaves the overlay to vaul and staggers the content in", () => {
    render(<Usage ui={Godui} open />);
    expect(slot("drawer-overlay").className).not.toMatch(
      /animate-in|animate-out|fade-in|fade-out/,
    );
    const header = slot("drawer-header").className;
    const footer = slot("drawer-footer").className;
    expect(header).toContain(
      "group-data-[state=open]/drawer-content:animate-godui-slide-in-from-bottom",
    );
    expect(header).toContain(
      "group-data-[state=open]/drawer-content:[animation-delay:60ms]",
    );
    expect(footer).toContain(
      "group-data-[state=open]/drawer-content:[animation-delay:120ms]",
    );
  });

  it("vaul's stylesheet only animates transform and opacity", () => {
    const css = readFileSync(join(PKG, "node_modules/vaul/style.css"), "utf8");
    const animated = new Set<string>();
    for (const m of css.matchAll(/(?:^|;|\{)\s*transition:\s*([^;}]+)/g)) {
      // Drop easing arguments (cubic-bezier(.32, .72, 0, 1)) before splitting.
      for (const part of m[1].replace(/\([^)]*\)/g, "").split(",")) {
        animated.add(part.trim().split(/\s+/)[0]);
      }
    }
    for (const block of css.matchAll(/@keyframes[^{]+\{([\s\S]*?)\n\}/g)) {
      for (const decl of block[1].matchAll(/([a-z-]+)\s*:/g)) {
        animated.add(decl[1]);
      }
    }
    expect(animated.size).toBeGreaterThan(0);
    for (const prop of animated) {
      expect(isCompositorProp(prop), prop).toBe(true);
    }
  });
});
