import { readFileSync } from "node:fs";
import { join } from "node:path";

const pkg = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8"),
) as { peerDependencies: Record<string, string> };

describe("@godui/components peer range", () => {
  // Core relies on React 19: `ref` as a prop (no forwardRef) and callback-ref
  // cleanups (useMergedRef, the NavigationMenu viewport frame).
  it("requires React 19 (react and react-dom)", () => {
    expect(pkg.peerDependencies.react).toBe("^19");
    expect(pkg.peerDependencies["react-dom"]).toBe("^19");
  });
});
