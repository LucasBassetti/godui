import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { cssObjectToString, scanCss, scanSource } from "@godui/motion-lint";

export interface CoreViolation {
  file: string;
  line: number;
  prop: string;
  raw: string;
}

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(path));
    else if (
      /\.tsx?$/.test(entry.name) &&
      !/\.(test|stories)\.tsx?$/.test(entry.name)
    ) {
      out.push(path);
    }
  }
  return out;
}

/**
 * Every strict GPU-only violation across core sources, the core stylesheet and
 * the `css` blocks of every core registry item. Core ships with zero.
 */
export function collectCoreViolations(opts: {
  srcDir: string;
  stylesPath: string;
  registryPath: string;
}): CoreViolation[] {
  const out: CoreViolation[] = [];
  for (const file of sourceFiles(opts.srcDir)) {
    for (const v of scanSource(readFileSync(file, "utf8"), { strict: true })) {
      out.push({
        file: relative(opts.srcDir, file),
        line: v.line,
        prop: v.prop,
        raw: v.raw,
      });
    }
  }
  for (const v of scanCss(readFileSync(opts.stylesPath, "utf8"), {
    strict: true,
  })) {
    out.push({ file: "styles.css", line: v.line, prop: v.prop, raw: v.raw });
  }
  const registry = JSON.parse(readFileSync(opts.registryPath, "utf8")) as {
    items: Array<{ name: string; css?: Record<string, unknown> }>;
  };
  for (const item of registry.items) {
    if (!item.css) continue;
    for (const v of scanCss(cssObjectToString(item.css), { strict: true })) {
      out.push({
        file: `registry.json#${item.name}`,
        line: v.line,
        prop: v.prop,
        raw: v.raw,
      });
    }
  }
  return out;
}
