import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { collectCoreViolations } from "./collect";

const SRC = dirname(dirname(fileURLToPath(import.meta.url)));
const PKG = dirname(SRC);
const ROOT = join(PKG, "..", "..");

/**
 * Core GPU-only gate: components may animate only transform / opacity / filter.
 * There is no allowlist — fix the animation instead.
 */
describe("core GPU-only gate", () => {
  it("core sources, styles and registry animate only transform/opacity/filter", () => {
    const found = collectCoreViolations({
      srcDir: SRC,
      stylesPath: join(PKG, "styles.css"),
      registryPath: join(ROOT, "registry.json"),
    });
    expect(
      found.map((v) => `${v.file}:${v.line} ${v.prop} (${v.raw})`),
    ).toEqual([]);
  });

  it("has no motion allowlist anywhere", () => {
    for (const path of [join(SRC, "motion", "motion-allowlist.ts")]) {
      expect(existsSync(path), path).toBe(false);
    }
  });
});
