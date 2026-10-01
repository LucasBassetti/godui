import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { classifyProp, scanCss, scanSource } from "@godui/motion-lint";
import type { GpuReport } from "./gpu-report-types";

/** keyframes name -> CSS text of that @keyframes block. */
function keyframesBlocks(css: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of css.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
    let depth = 0;
    for (let i = m.index + m[0].length - 1; i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) {
        out.set(m[1], css.slice(m.index, i + 1));
        break;
      }
    }
  }
  return out;
}

/** `--animate-<utility>: <keyframes> …` tokens -> keyframes name. */
function animateTokens(css: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of css.matchAll(/--animate-([\w-]+):\s*([\w-]+)/g)) {
    out.set(m[1], m[2]);
  }
  return out;
}

const NOT_COMPONENTS = new Set(["lib", "motion", "assets"]);
const uniqSorted = (xs: string[]) => [...new Set(xs)].sort();

/**
 * Strict GPU-only scan of every Extras component: its source files plus the
 * keyframes behind any `animate-*` utility it uses. Report-only — Extras are
 * not gated; the docs badge reads this.
 */
export function buildGpuReport(srcDir: string, stylesCss: string): GpuReport {
  const blocks = keyframesBlocks(stylesCss);
  const tokens = animateTokens(stylesCss);
  const report: GpuReport = {};
  const dirs = readdirSync(srcDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !NOT_COMPONENTS.has(d.name))
    .map((d) => d.name)
    .sort();
  for (const dir of dirs) {
    const props: string[] = [];
    for (const file of readdirSync(join(srcDir, dir))) {
      if (!/\.tsx?$/.test(file) || /\.(test|stories)\.tsx?$/.test(file)) {
        continue;
      }
      const source = readFileSync(join(srcDir, dir, file), "utf8");
      props.push(...scanSource(source, { strict: true }).map((v) => v.prop));
      for (const m of source.matchAll(/\banimate-([\w-]+)/g)) {
        const keyframes = tokens.get(m[1]);
        const block = keyframes ? blocks.get(keyframes) : undefined;
        if (block) {
          props.push(...scanCss(block, { strict: true }).map((v) => v.prop));
        }
      }
    }
    const nonCompositor = uniqSorted(props);
    report[dir] = {
      nonCompositor,
      gated: nonCompositor.filter(
        (p) => p === "all" || classifyProp(p) === "gated",
      ),
    };
  }
  return report;
}
