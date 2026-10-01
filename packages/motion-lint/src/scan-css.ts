import { isCompositorProp, normalizeProp, type Violation } from "./scan-source";

const lineAt = (css: string, index: number): number =>
  css.slice(0, index).split("\n").length;

const KEYWORDS = new Set(["none", "initial", "inherit", "unset", ""]);

const violates = (prop: string, strict: boolean): boolean =>
  strict ? !isCompositorProp(prop) && !KEYWORDS.has(prop) : false;

/**
 * Scan CSS text for motion violations: every declaration inside `@keyframes`,
 * plus `transition` / `transition-property` lists anywhere. Static declarations
 * outside keyframes (e.g. `width: 10px`) are not animation and are ignored.
 */
export function scanCss(
  css: string,
  { strict = false }: { strict?: boolean } = {},
): Violation[] {
  const out: Violation[] = [];

  for (const m of css.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
    const start = m.index + m[0].length;
    let depth = 1;
    let end = css.length;
    for (let i = start; i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) {
        end = i;
        break;
      }
    }
    const body = css.slice(start, end);
    for (const d of body.matchAll(/([a-zA-Z-]+)\s*:\s*[^;{}]+;?/g)) {
      const prop = normalizeProp(d[1]);
      if (violates(prop, strict)) {
        out.push({
          line: lineAt(css, start + d.index),
          prop,
          kind: "gated",
          raw: d[0].trim(),
        });
      }
    }
  }

  for (const m of css.matchAll(
    /(?<![\w-])transition(?:-property)?\s*:\s*([^;{}]+)/g,
  )) {
    for (const seg of m[1].split(",")) {
      const prop = normalizeProp(seg.trim().split(/\s+/)[0] ?? "");
      if (prop === "all") {
        out.push({
          line: lineAt(css, m.index),
          prop,
          kind: "banned",
          raw: m[0].trim(),
        });
      } else if (violates(prop, strict)) {
        out.push({
          line: lineAt(css, m.index),
          prop,
          kind: "gated",
          raw: m[0].trim(),
        });
      }
    }
  }

  return out;
}

type CssNode = string | { [key: string]: CssNode };

/** Registry `css` JSON → CSS text (same shape the docs Manual tab prints). */
export function cssObjectToString(
  node: Record<string, unknown>,
  depth = 0,
): string {
  const pad = "  ".repeat(depth);
  return Object.entries(node as Record<string, CssNode>)
    .map(([key, value]) =>
      typeof value === "string"
        ? `${pad}${key}: ${value};`
        : `${pad}${key} {\n${cssObjectToString(value, depth + 1)}\n${pad}}`,
    )
    .join("\n");
}
