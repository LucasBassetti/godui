import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildGpuReport } from "./gpu-report";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = dirname(HERE);
const REPORT = join(HERE, "gpu-report.json");
const styles = () => readFileSync(join(SRC, "..", "styles.css"), "utf8");

describe("buildGpuReport", () => {
  it("attributes keyframes to the component that uses their animate-* utility", () => {
    const report = buildGpuReport(SRC, styles());
    // magic-button uses animate-magic-rainbow, whose keyframes move background-position.
    expect(report["magic-button"].nonCompositor).toContain(
      "backgroundposition",
    );
  });

  it("lists a component with only compositor motion as clean", () => {
    const report = buildGpuReport(SRC, styles());
    expect(report.marquee).toEqual({ nonCompositor: [], gated: [] });
  });

  it("matches the committed gpu-report.json (run `pnpm --filter @godui/extras motion:report`)", () => {
    const fresh = buildGpuReport(SRC, styles());
    if (process.env.GODUI_WRITE_REPORT) {
      writeFileSync(REPORT, `${JSON.stringify(fresh, null, 2)}\n`);
    }
    // Compare parsed JSON so Biome's formatting of the file doesn't matter.
    expect(JSON.parse(readFileSync(REPORT, "utf8"))).toEqual(fresh);
  });
});
