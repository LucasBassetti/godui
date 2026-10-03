import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import * as React from "react";
import { useMergedRef } from "./use-merged-ref";

function Box({ forward }: { forward: React.Ref<HTMLDivElement> | undefined }) {
  const local = React.useRef<HTMLDivElement>(null);
  const setRef = useMergedRef(local, forward);
  return <div ref={setRef} data-testid="box" />;
}

describe("useMergedRef", () => {
  it("passes a callback ref's cleanup through: called on unmount, never ref(null)", () => {
    const cleanup = vi.fn();
    const seen: Array<HTMLDivElement | null> = [];
    const { unmount, getByTestId } = render(
      <Box
        forward={(node) => {
          seen.push(node);
          return cleanup;
        }}
      />,
    );
    expect(seen).toEqual([getByTestId("box")]);
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(seen).not.toContain(null);
  });

  it("a callback ref without a cleanup is called with null on unmount", () => {
    const seen: Array<HTMLDivElement | null> = [];
    const { unmount } = render(
      <Box
        forward={(node) => {
          seen.push(node);
        }}
      />,
    );
    unmount();
    expect(seen).toHaveLength(2);
    expect(seen[1]).toBeNull();
  });

  it("sets and clears an object ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { unmount, getByTestId } = render(<Box forward={ref} />);
    expect(ref.current).toBe(getByTestId("box"));
    unmount();
    expect(ref.current).toBeNull();
  });

  it("ships in godui-motion, which every core item importing a GodUI hook depends on", () => {
    const root = join(__dirname, "../../../..");
    const registry = JSON.parse(
      readFileSync(join(root, "registry.json"), "utf8"),
    ) as {
      items: Array<{
        name: string;
        registryDependencies?: string[];
        files?: Array<{ path: string }>;
      }>;
    };
    const motion = registry.items.find((i) => i.name === "godui-motion");
    const shipped = new Set(
      (motion?.files ?? []).map((f) => f.path.split("/").pop()),
    );
    expect(shipped).toContain("use-merged-ref.ts");
    for (const item of registry.items) {
      for (const file of item.files ?? []) {
        if (!file.path.startsWith("packages/components/src/ui/")) continue;
        const source = readFileSync(join(root, file.path), "utf8");
        for (const [, hook] of source.matchAll(/from "@\/hooks\/([\w-]+)"/g)) {
          if (hook === "use-mobile") continue; // shadcn's own registry item
          expect(shipped, `${item.name} imports ${hook}`).toContain(
            `${hook}.ts`,
          );
          expect(item.registryDependencies, item.name).toContain(
            "@godui/godui-motion",
          );
        }
      }
    }
  });
});
